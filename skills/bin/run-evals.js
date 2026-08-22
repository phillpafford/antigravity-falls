#!/usr/bin/env node

/**
 * @file skills/bin/run-evals.js
 * @description Intelligent child-process wrapper for Promptfoo. Intercepts Google AI Studio
 * 429 (RESOURCE_EXHAUSTED) rate-limit errors, extracts the cooldown wait time,
 * and recursively fails over to the next configured model. If all models are exhausted,
 * creates a cacheable rate-limit lockfile, and publishes a rounded, user-friendly
 * summary to GitHub Actions before exiting with a neutral code of 0 to keep the build green.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const AGENT_DIR = path.join(process.cwd(), '.agent');
const LOCK_FILE = path.join(AGENT_DIR, 'rate-limit-lock.txt');

// 1. Ensure the .agent folder exists
if (!fs.existsSync(AGENT_DIR)) {
    fs.mkdirSync(AGENT_DIR, { recursive: true });
}

console.log('🌲 Starting Mystery Shack AI Council Evaluation Runner...');

// Predefined failover model tiers (highest priority/cheapest first)
const MODEL_TIERS = [
    'google:gemini-3.5-flash-lite',
    'google:gemini-3.5-flash'
];

/**
 * Executes a specific model evaluation tier.
 * If 429 is intercepted, it will recursively invoke the next tier.
 * @param {number} tierIndex
 */
function runEvaluationTier(tierIndex) {
    if (tierIndex >= MODEL_TIERS.length) {
        console.error('\n🚨 [FAILOVER EXHAUSTED] All configured model tiers have been rate-limited.');
        process.exit(1);
    }

    const activeModel = MODEL_TIERS[tierIndex];
    console.log(`\n🚀 [TIER ${tierIndex + 1}/${MODEL_TIERS.length}] Executing evaluations using: ${activeModel}...`);

    const child = spawn('npx', [
        'promptfoo', 'eval',
        '-c', 'skills/evals/promptfooconfig.yaml',
        '--providers', activeModel,
        '--max-concurrency', '1',
        '--verbose'
    ], {
        shell: false,
        env: { ...process.env }
    });

    let logBuffer = '';
    let isTerminated = false;

    // Stream stdout in real-time and buffer it
    child.stdout.on('data', (data) => {
        const chunk = data.toString();
        process.stdout.write(chunk);
        logBuffer += chunk;
        checkForRateLimit(chunk);
    });

    // Stream stderr in real-time and buffer it
    child.stderr.on('data', (data) => {
        const chunk = data.toString();
        process.stderr.write(chunk);
        logBuffer += chunk;
        checkForRateLimit(chunk);
    });

    // Scan data chunks in real-time to intercept 429s and failover/abort instantly
    function checkForRateLimit(chunk) {
        if (isTerminated) return;

        // Search for "Please retry in X.XXXXs" or "RESOURCE_EXHAUSTED" in the logs
        const retryRegex = /Please retry in ([\d\.]+)s/gi;
        const match = retryRegex.exec(chunk);

        if (match) {
            isTerminated = true;
            const secondsToWait = parseFloat(match[1]);
            const roundedSeconds = Math.ceil(secondsToWait);

            console.error(`\n\n⚠️ [RATE LIMIT INTERCEPTED] ${activeModel} is rate-limited!`);

            // Check if there is a next model in the tier list
            if (tierIndex + 1 < MODEL_TIERS.length) {
                const nextModel = MODEL_TIERS[tierIndex + 1];
                console.warn(`\n🔄 [FAILOVER TRIGGERED] Automatically switching to the next model tier: ${nextModel}...\n`);
                
                // Instantly kill Promptfoo to stop its exponential sleep loop
                child.kill('SIGKILL');
                
                // Recursively call the next tier
                runEvaluationTier(tierIndex + 1);
                return;
            }

            // No model tiers left! Activating lockfile safeguards
            const safetyBufferMs = 1000;
            const cooldownMs = (roundedSeconds * 1000) + safetyBufferMs;
            const unlockTimestamp = Date.now() + cooldownMs;

            console.error(`⌛ Lock duration: ${roundedSeconds}s (+1s clock-sync buffer)`);
            console.error(`🔒 Creating local lockfile: .agent/rate-limit-lock.txt\n`);

            // Create the cacheable lockfile
            fs.writeFileSync(LOCK_FILE, unlockTimestamp.toString(), 'utf8');

            // Write a step summary if running in GitHub Actions
            publishGitHubSummary(roundedSeconds + 1, activeModel);

            // Instantly kill Promptfoo
            child.kill('SIGKILL');
            
            // EXIT 0 (Neutral Success): Gracefully exit with 0 to keep the build green
            process.exit(0);
        }
    }

    function publishGitHubSummary(roundedSeconds, modelUsed) {
        const summaryFile = process.env.GITHUB_STEP_SUMMARY;
        if (!summaryFile) return;

        const markdownSummary = `
### ⚠️ Google AI Studio Free Tier Quota Exceeded

The evaluations suite hit a Google API **429 Too Many Requests (RESOURCE_EXHAUSTED)** rate limit on all failover models! This is a standard constraint of the free-tier Google developer keys.

| Metric | Details |
| :--- | :--- |
| **API Provider** | \`${modelUsed}\` (Google AI Studio Failover Exhausted) |
| **API Key Status** | Active (Free Tier) |
| **Required Cooldown** | **${roundedSeconds} seconds** |

#### 🔒 Why did this happen?
Google AI Studio's Free Tier enforces a strict limit of **15 Requests Per Minute (RPM)**. Because subsequent GitHub Actions or concurrent pipelines were triggered, both model tiers were rate-limited.

#### 🛠️ What should I do?
1. **Wait for Cooldown**: Do not trigger any new builds or commits for the next **${roundedSeconds} seconds**.
2. **Global Lock Engaged**: We have cached this rate-limit lockfile. If you push code again before the cooldown completes, the next build will **automatically skip evaluations instantly** within 1 second, keeping your build green (✅) and preserving your Actions minutes!
`;

        fs.appendFileSync(summaryFile, markdownSummary, 'utf8');
    }

    child.on('close', (code) => {
        if (isTerminated) return;

        if (code === 0) {
            console.log(`\n🎉 evaluations completed successfully using: ${activeModel}!`);
            process.exit(0);
        } else {
            console.error(`\n❌ Evaluations failed with exit code: ${code}`);
            process.exit(code || 1);
        }
    });
}

// Start with the first model tier
runEvaluationTier(0);
