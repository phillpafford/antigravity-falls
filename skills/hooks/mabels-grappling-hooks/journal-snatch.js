const fs = require('fs');
const path = require('path');

// Redirection logs to stderr to keep stdout pure JSON
function log(msg) {
    console.error(`[Mabel's Grappling Hook - Journal Snatch]: ${msg}`);
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        let payload = {};
        if (input.trim()) {
            payload = JSON.parse(input);
        }

        const projectDir = process.env.AGENT_PROJECT_DIR || process.env.PROJECT_DIR || process.cwd();
        const agentFile = path.join(projectDir, 'AGENT.md');
        let injectedContext = '';

        if (fs.existsSync(agentFile)) {
            log(`Found local AGENT.md. Snatching rules...`);
            const rules = fs.readFileSync(agentFile, 'utf8');
            injectedContext = `\n\n=== SYSTEM RULES (Injected by Mabel's Grappling Hook) ===\n${rules}\n`;
        } else {
            // Check for individual journals
            const j1 = path.join(projectDir, 'JOURNAL_1.md');
            const j2 = path.join(projectDir, 'JOURNAL_2.md');
            const j3 = path.join(projectDir, 'JOURNAL_3.md');
            
            let filesFound = [];
            if (fs.existsSync(j1)) { filesFound.push(j1); }
            if (fs.existsSync(j2)) { filesFound.push(j2); }
            if (fs.existsSync(j3)) { filesFound.push(j3); }

            if (filesFound.length > 0) {
                log(`Found ${filesFound.length} Journal files. Snatching...`);
                injectedContext = `\n\n=== SYSTEM RULES (Injected by Mabel's Grappling Hook) ===\n`;
                filesFound.forEach(f => {
                    injectedContext += `\n--- File: ${path.basename(f)} ---\n` + fs.readFileSync(f, 'utf8') + '\n';
                });
            }
        }

        if (injectedContext) {
            // Standard hook return: injects prompt/instruction metadata
            if (!payload.context_append) {
                payload.context_append = '';
            }
            payload.context_append += injectedContext;
            log(`Successfully reeled in the Journals and injected them into the Orchestrator's starting context.`);
        } else {
            log(`No AGENT.md or Journal files located. Continuing with default rules.`);
        }

        // Print final JSON cleanly to stdout
        console.log(JSON.stringify(payload));
        process.exit(0);

    } catch (error) {
        console.error(`[Mabel's Grappling Hook - ERROR]: ${error.message}`);
        // Return original input as fallback on parsing exceptions
        console.log(input || '{}');
        process.exit(0);
    }
});
