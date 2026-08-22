const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = process.cwd();
const HOOK_DIR = path.join(PROJECT_DIR, 'skills', 'hooks', 'mabels-grappling-hooks');

test('🧗‍♀️ Mabel\'s Grappling Hooks - Operational Test Suite', async (t) => {

    await t.test('1. [journal-snatch.js] - Should snatch local AGENT.md and append context', () => {
        const scriptPath = path.join(HOOK_DIR, 'journal-snatch.js');
        const dummyAgentFile = path.join(PROJECT_DIR, 'AGENT.md');
        
        // Setup dummy AGENT.md
        fs.writeFileSync(dummyAgentFile, '# Custom Rules\n- Enforce camelCase.', 'utf8');

        try {
            const inputPayload = JSON.stringify({ context_append: '' });
            // Execute Node script passing the JSON on stdin
            const output = execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                encoding: 'utf8',
                env: { ...process.env, AGENT_PROJECT_DIR: PROJECT_DIR }
            });

            const parsed = JSON.parse(output.trim());
            assert.ok(parsed.context_append, 'Expected context_append to be non-empty');
            assert.match(parsed.context_append, /Enforce camelCase/);

        } finally {
            // Teardown
            if (fs.existsSync(dummyAgentFile)) {
                fs.unlinkSync(dummyAgentFile);
            }
        }
    });

    await t.test('2. [threat-intercept.js] - Should release clean commands with exit 0', () => {
        const scriptPath = path.join(HOOK_DIR, 'threat-intercept.js');
        const inputPayload = JSON.stringify({
            tool: 'write_file',
            arguments: { file_path: 'src/user.js', content: 'console.log("hello world");' }
        });

        try {
            const output = execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                encoding: 'utf8'
            });
            const parsed = JSON.parse(output.trim());
            assert.strictEqual(parsed.tool, 'write_file');
        } catch (error) {
            assert.fail(`Expected clean tool call to exit 0, but it failed: ${error.message}`);
        }
    });

    await t.test('3. [threat-intercept.js] - Should block dangerous shell injections with exit 2', () => {
        const scriptPath = path.join(HOOK_DIR, 'threat-intercept.js');
        const inputPayload = JSON.stringify({
            tool: 'run_shell_command',
            arguments: { command: 'rm -rf /' }
        });

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected threat script to block and exit 2, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 2, 'Expected process exit code to be 2 (Emergency Block)');
        }
    });

    await t.test('4. [threat-intercept.js] - Should block leaked API keys with exit 2', () => {
        const scriptPath = path.join(HOOK_DIR, 'threat-intercept.js');
        const inputPayload = JSON.stringify({
            tool: 'write_file',
            arguments: { file_path: 'src/config.js', content: 'const API_KEY = "sk-proj-12345678901234567890123456789012345678901234";' }
        });

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected threat script to block and exit 2, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 2, 'Expected process exit code to be 2 (Emergency Block)');
        }
    });

    await t.test('5. [payload-reel.js] - Should fail-block malformed agent JSON output with exit 2', () => {
        const scriptPath = path.join(HOOK_DIR, 'payload-reel.js');
        const inputPayload = JSON.stringify({
            response: 'Here is your deliverable:\n\n```json\n{\n  "verdict": "PASS",\n  "violations": ["Stray comma trailing",],\n}\n```'
        });

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected payload reel to fail on malformed JSON and exit 2, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 2, 'Expected process exit code to be 2 (Auto-Retry Trigger)');
        }
    });

    await t.test('6. [threat-intercept.js] - Should block leaked GitHub Personal Access Tokens (ghp_) with exit 2', () => {
        const scriptPath = path.join(HOOK_DIR, 'threat-intercept.js');
        const inputPayload = JSON.stringify({
            tool: 'write_file',
            arguments: { file_path: 'src/config.js', content: 'const TOKEN = "ghp_1234567890abcdefghijklmnopqrstuvwxYZ";' }
        });

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected threat script to block and exit 2, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 2, 'Expected process exit code to be 2 (Emergency Block)');
        }
    });

    await t.test('7. [journal-snatch.js] - Should exit with code 1 and output safe "{}" on malformed JSON input', () => {
        const scriptPath = path.join(HOOK_DIR, 'journal-snatch.js');
        const inputPayload = '{"context_append": "partial json...'; // malformed

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected journal-snatch to fail and exit 1 on malformed JSON, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stdout = error.stdout.toString().trim();
            assert.strictEqual(stdout, '{}', 'Expected output to be a clean empty JSON object "{}"');
        }
    });

    await t.test('8. [style-snap.js] - Should run successfully and bypass formatting gracefully if prettier is not present', () => {
        const scriptPath = path.join(HOOK_DIR, 'style-snap.js');
        const inputPayload = JSON.stringify({
            tool: 'write_file',
            arguments: { file_path: 'src/config.js', content: 'const temp = "value";' }
        });

        try {
            const output = execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                encoding: 'utf8'
            });
            const parsed = JSON.parse(output.trim());
            assert.strictEqual(parsed.tool, 'write_file');
            assert.strictEqual(parsed.arguments.content, 'const temp = "value";');
        } catch (error) {
            assert.fail(`Expected clean tool call to exit 0 and bypass, but it failed: ${error.message}`);
        }
    });

    await t.test('9. [threat-intercept.js] - Should exit with code 1 and output safe "{}" on malformed JSON input', () => {
        const scriptPath = path.join(HOOK_DIR, 'threat-intercept.js');
        const inputPayload = '{"tool": "partial json...'; // malformed

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected threat-intercept to fail and exit 1 on malformed JSON, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stdout = error.stdout.toString().trim();
            assert.strictEqual(stdout, '{}', 'Expected output to be a clean empty JSON object "{}"');
        }
    });

    await t.test('10. [style-snap.js] - Should exit with code 1 and output safe "{}" on malformed JSON input', () => {
        const scriptPath = path.join(HOOK_DIR, 'style-snap.js');
        const inputPayload = '{"tool": "partial json...'; // malformed

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected style-snap to fail and exit 1 on malformed JSON, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stdout = error.stdout.toString().trim();
            assert.strictEqual(stdout, '{}', 'Expected output to be a clean empty JSON object "{}"');
        }
    });

    await t.test('11. [payload-reel.js] - Should exit with code 1 and output safe "{}" on malformed JSON input', () => {
        const scriptPath = path.join(HOOK_DIR, 'payload-reel.js');
        const inputPayload = '{"response": "partial json...'; // malformed

        try {
            execSync(`node "${scriptPath}"`, {
                input: inputPayload,
                stdio: 'pipe'
            });
            assert.fail('Expected payload-reel to fail and exit 1 on malformed JSON, but it exited 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stdout = error.stdout.toString().trim();
            assert.strictEqual(stdout, '{}', 'Expected output to be a clean empty JSON object "{}"');
        }
    });
});
