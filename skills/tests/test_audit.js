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

    await t.test('✅ PASS: Should exit 0 for a verbatim, un-filled deliverable template (schema hints must not false-trigger)', () => {
        setupTempPlan();

        // A deliverable copied straight from a team/*.md persona, before the agent
        // fills it in. These pipe-delimited hints must NOT be read as failures.
        const templateMarkdown = `
# Stan Standards Review (unfilled template)

\`\`\`json
{
  "standards_audit": {
    "tech_stack_match": "PASS | FAIL",
    "tech_stack_display_match": "✅ PASS | ❌ FAIL",
    "verdict": "PASS Ready | FAIL Rework",
    "display_verdict": "✅ PASS Ready | ❌ FAIL Rework"
  }
}
\`\`\`
`;
        fs.writeFileSync(path.join(TEMP_PLAN_DIR, 'stan-template.md'), templateMarkdown, 'utf8');

        try {
            const output = execSync(`node "${AUDITOR_SCRIPT}"`, { encoding: 'utf8' });
            assert.match(output, /CI\/CD Gate Passed/);
        } catch (error) {
            assert.fail(`Expected exit 0 for template hints, but process failed: ${error.message}`);
        } finally {
            teardownTempPlan();
        }
    });

    await t.test('✅ PASS: Should exit 0 when free-text notes merely mention the word "fail"', () => {
        setupTempPlan();

        // A passing deliverable whose notes/violations reference "fail" as prose.
        const passingWithProse = `
# Dipper Skeptic Review

\`\`\`json
{
  "skeptic_review": {
    "injection_risk": "PASS",
    "verdict": "PASS",
    "notes": "Added a guard so the request cannot fail silently on empty input.",
    "edge_cases_identified": ["Empty dataset should not fail the batch job"]
  }
}
\`\`\`
`;
        fs.writeFileSync(path.join(TEMP_PLAN_DIR, 'dipper-prose.md'), passingWithProse, 'utf8');

        try {
            const output = execSync(`node "${AUDITOR_SCRIPT}"`, { encoding: 'utf8' });
            assert.match(output, /CI\/CD Gate Passed/);
        } catch (error) {
            assert.fail(`Expected exit 0 for prose mentioning 'fail', but process failed: ${error.message}`);
        } finally {
            teardownTempPlan();
        }
    });

    await t.test('❌ FAIL: Should exit 1 for a filled failing display verdict with an emoji (❌ BREAKING_SCHEMA)', () => {
        setupTempPlan();

        const failingMigration = `
# Blendin Migration Review

\`\`\`json
{
  "migration_review": {
    "schema_in_scope": "YES",
    "verdict": "BREAKING_SCHEMA",
    "display_verdict": "❌ BREAKING_SCHEMA"
  }
}
\`\`\`
`;
        fs.writeFileSync(path.join(TEMP_PLAN_DIR, 'blendin-review.md'), failingMigration, 'utf8');

        try {
            execSync(`node "${AUDITOR_SCRIPT}"`, { stdio: 'pipe' });
            assert.fail('Expected process to exit with code 1, but it exited with 0.');
        } catch (error) {
            assert.strictEqual(error.status, 1, 'Expected process exit code to be 1');
            const stderr = error.stderr.toString();
            assert.match(stderr, /migration_review\.verdict/);
        } finally {
            teardownTempPlan();
        }
    });
});
