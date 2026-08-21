const fs = require('fs');
const path = require('path');

function log(msg) {
    console.error(`[Mabel's Grappling Hook - Threat Intercept]: ${msg}`);
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        let payload = {};
        if (input.trim()) {
            payload = JSON.parse(input);
        }

        const toolName = payload.tool || '';
        const args = payload.arguments || {};
        const argString = JSON.stringify(args);

        log(`Intercepting tool call: [${toolName}]`);

        // 1. Check for hardcoded API keys / Secrets
        const secretRegex = /(sk-[a-zA-Z0-9]{44}|AIzaSy[a-zA-Z0-9_-]{33}|amzn\.mws\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|dsa_[a-zA-Z0-9]{32,44})/gi;
        if (secretRegex.test(argString)) {
            log(`❌ CRITICAL SECURITY ALERT: Leaked raw API Key / Secret detected in tool payload!`);
            console.error(`\nViolation Details: Detected active token/secret pattern.`);
            process.exit(2); // Exit 2 immediately halts and aborts the turn safely
        }

        // 2. Check for dangerous shell escape injections in run_shell_command
        if (toolName === 'run_shell_command') {
            const command = args.command || '';
            const dangerousPattern = /\b(rm\s+-rf\s+(\/|\*|\.\/|\.\.\/)|mv\s+.*?\s+\/dev\/null|chmod\s+-R\s+777|chown\s+-R\s+root)\b/gi;
            
            if (dangerousPattern.test(command)) {
                log(`❌ CRITICAL SECURITY ALERT: Dangerous system-command execution blocked!`);
                console.error(`\nViolation Details: Detected dangerous filesystem modification command.`);
                process.exit(2);
            }
        }

        // 3. Check for unauthorized path traversals
        const pathTraversalPattern = /\.\.\/\.\.\/\.\.\//gi;
        if (pathTraversalPattern.test(argString)) {
            log(`❌ SECURITY ALERT: Unscoped file path traversal blocked!`);
            console.error(`\nViolation Details: Tool is attempting to escape the project directory boundary.`);
            process.exit(2);
        }

        // 4. Default Allow
        log(`✅ Tool call [${toolName}] verified clean. Releasing Grappling Hook.`);
        console.log(JSON.stringify(payload));
        process.exit(0);

    } catch (error) {
        console.error(`[Mabel's Grappling Hook - ERROR]: ${error.message}`);
        console.log(input || '{}');
        process.exit(0);
    }
});
