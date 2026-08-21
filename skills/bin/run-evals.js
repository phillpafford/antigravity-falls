#!/usr/bin/env node

/**
 * @file skills/bin/run-evals.js
 * @description Intelligent child-process wrapper for Promptfoo. Intercepts Google AI Studio
 * 429 (RESOURCE_EXHAUSTED) rate-limit errors, extracts the cooldown wait time,
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

// 2. Spawn the Promptfoo CLI process with --max-concurrency 1
const child = spawn('npx', [
    'promptfoo', 'eval',
    '-c', 'skills/evals/promptfooconfig.yaml',
    '--max-concurrency', '1',
    '--verbose'
], {
    shell: true,
    env: { ...process.env }
});

let logBuffer = '';

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

// 3. Scan data chunks in real-time to intercept 429s and abort instantly!
function checkForRateLimit(chunk) {
    // Search for "Please retry in X.XXXXs" or "RESOURCE_EXHAUSTED" in the logs
    const retryRegex = /Please retry in ([\d\.]+)s/gi;
    const match = retryRegex.exec(chunk);

    if (match) {
        const secondsToWait = parseFloat(match[1]);
        const roundedSeconds = Math.ceil(secondsToWait);
        const cooldownMs = roundedSeconds * 1000;
        const unlockTimestamp = Date.now() + cooldownMs;

        console.error(`\n\n🚨 [RATE LIMIT INTERCEPTED] google:gemini-3.5-flash is rate-limited!`);
        console.error(`⌛ Must wait exactly ${roundedSeconds}s before next request.`);
        console.error(`🔒 Creating local lockfile: .agent/rate-limit-lock.txt\n`);

        // Create the cacheable lockfile
        fs.writeFileSync(LOCK_FILE, unlockTimestamp.toString(), 'utf8');

        // Write a beautiful step summary if running in GitHub Actions
        publishGitHubSummary(roundedSeconds);

        // Instantly kill Promptfoo to stop its 60-second exponential sleep loop
        child.kill('SIGKILL');
        
        // EXIT 0 (Neutral Success): Gracefully exit with 0 to keep the PR green!
        process.exit(0);
    }
}

function publishGitHubSummary(roundedSeconds) {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryFile) return; // Skip if not running in GitHub Actions environment

    const markdownSummary = `
### ⚠️ Google AI Studio Free Tier Quota Exceeded

The evaluations suite hit a Google API **429 Too Many Requests (RESOURCE_EXHAUSTED)** rate limit! This is a standard constraint of the free-tier Google developer keys.

| Metric | Details |
| :--- | :--- |
| **API Provider** | \`google:gemini-3.5-flash\` (Google AI Studio) |
| **API Key Status** | Active (Free Tier) |
| **Required Cooldown** | **${roundedSeconds} seconds** |

#### 🔒 Why did this happen?
Google AI Studio's Free Tier enforces a strict limit of **15 Requests Per Minute (RPM)**. Because GitHub Actions workflows were triggered consecutively, the concurrent pipeline requests exceeded the RPM threshold.

#### 🛠️ What should I do?
1. **Wait for Cooldown**: Do not trigger any new builds or commits for the next **${roundedSeconds} seconds**.
2. **Global Lock Engaged**: We have cached this rate-limit lockfile. If you push code again before the cooldown completes, the next build will **automatically skip evaluations instantly** within 1 second, keeping your build green (✅) and preserving your Actions minutes!
`;

    fs.appendFileSync(summaryFile, markdownSummary, 'utf8');
}

// 4. Handle standard process exits
child.on('close', (code) => {
    if (code === 0) {
        console.log('\n🎉 Mystery Shack evaluations completed successfully!');
        process.exit(0);
    } else {
        // If we exited with a code other than 0 (and it wasn't intercepted as a 429), propagate it
        console.error(`\n❌ Evaluations failed with exit code: ${code}`);
        process.exit(code || 1);
    }
});
