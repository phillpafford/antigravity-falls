const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = process.cwd();
const TEMP_PLAN_DIR = path.join(PROJECT_DIR, '.agent', 'plan');
const AUDITOR_SCRIPT = path.join(PROJECT_DIR, 'skills', 'bin', 'audit-council.js');

function setupTempPlan() {
    fs.mkdirSync(TEMP_PLAN_DIR, { recursive: true });
}

function teardownTempPlan() {
    if (fs.existsSync(TEMP_PLAN_DIR)) {
        fs.rmSync(path.join(PROJECT_DIR, '.agent'), { recursive: true, force: true });
    }
}

test('🛡️  Audit Council CLI - Unified Test Suite', async (t) => {

    await t.test('✅ PASS: Should exit 0 when all JSON deliverables contain PASS verdicts', () => {
        setupTempPlan();
        
        const passingMarkdown = `
# Dipper Skeptic Review
This is standard review markdown.

\`\`\`json
{
  "skeptic_review": {
    "injection_risk": "PASS",
    "scope_risk": "PASS",
    "verdict": "PASS"
  }
}
\`\`\`
`;
        fs.writeFileSync(path.join(TEMP_PLAN_DIR, 'dipper-review.md'), passingMarkdown, 'utf8');

        try {
            const output = execSync(`node "${AUDITOR_SCRIPT}"`, { encoding: 'utf8' });
            assert.match(output, /CI\/CD Gate Passed/);
        } catch (error) {
            assert.fail(`Expected exit code 0, but process failed: ${error.message}`);
        } finally {
            teardownTempPlan();
        }
    });

    await t.test('❌ FAIL: Should exit 1 and report violations when any JSON deliverable contains a FAIL verdict', () => {
        setupTempPlan();
        
        const failingMarkdown = `
# Stan Standards Review
This is failing standards markdown.

\`\`\`json
{
  "standards_audit": {
    "tech_stack_match": "PASS",
    "violations_found": ["Detected unvetted package 'axios'"],
    "verdict": "FAIL Rework"
  }
}
\`\`\`
`;
        fs.writeFileSync(path.join(TEMP_PLAN_DIR, 'stan-review.md'), failingMarkdown, 'utf8');

        try {
            execSync(`node "${AUDITOR_SCRIPT}"`, { stdio: 'pipe' });
            assert.fail('Expected process to exit with code 1, but it exited with 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stderr = error.stderr.toString();
            const stdout = error.stdout.toString();
            assert.match(stdout, /Gating Gate Failed/);
            // Changed from stdout to stderr because error logs are printed to console.error
            assert.match(stderr, /Field \[standards_audit\.verdict\] contains a failing value: "FAIL Rework"/);
        } finally {
            teardownTempPlan();
        }
    });
});
