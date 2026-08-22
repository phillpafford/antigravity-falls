const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(msg) {
    console.error(`[Mabel's Grappling Hook - Style Snap]: ${msg}`);
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

        if (toolName === 'write_file' && args.content && args.file_path) {
            const ext = path.extname(args.file_path);
            
            // Only format standard web files
            if (['.js', '.ts', '.json', '.css', '.html'].includes(ext)) {
                log(`Sustaining style check on: ${args.file_path}`);
                
                try {
                    // Check if local prettier binary is available in the workspace
                    const projectDir = process.env.AGENT_PROJECT_DIR || process.env.PROJECT_DIR || process.cwd();
                    const prettierBin = path.join(projectDir, 'node_modules', '.bin', 'prettier');
                    
                    if (fs.existsSync(prettierBin)) {
                        log(`Running Prettier on the code payload buffer...`);
                        
                        // Run Prettier dynamically via stdin on the buffer
                        const formatted = execSync(`node "${prettierBin}" --stdin-filepath "${args.file_path}"`, {
                            input: args.content,
                            encoding: 'utf8',
                            stdio: ['pipe', 'pipe', 'ignore'] // suppress stderr logs
                        });

                        if (formatted && formatted !== args.content) {
                            args.content = formatted;
                            log(`✨ Grappling Hook SNAP! Automatically formatted and aligned ${args.file_path} before saving.`);
                        }
                    } else {
                        log(`Prettier binary not found in node_modules. Skipping auto-formatting.`);
                    }
                } catch (cmdErr) {
                    log(`Prettier execution bypassed: ${cmdErr.message}`);
                }
            }
        }

        console.log(JSON.stringify(payload));
        process.exit(0);

    } catch (error) {
        console.error(`[Mabel's Grappling Hook - ERROR]: ${error.message}`);
        // Return a safe empty JSON fallback to prevent cascading parser crashes
        console.log('{}');
        process.exit(1);
    }
});
