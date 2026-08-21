#!/usr/bin/env node

/**
 * @file skills/bin/audit-council.js
 * @description Automated CI/CD Compliance Auditor for the Mystery Shack AI Agent Council.
 * Scans `.agent/plan/` for active markdown plan and review files, extracts embedded JSON
 * deliverables, and programmatically asserts that all statuses and verdicts are passing (contains no "FAIL").
 */

const fs = require('fs');
const path = require('path');

const PLAN_DIR = path.join(process.cwd(), '.agent', 'plan');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function logInfo(msg) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`);
}

function logSuccess(msg) {
  console.log(`${colors.green}[PASS]${colors.reset} ${msg}`);
}

function logWarning(msg) {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`);
}

function logError(msg) {
  console.error(`${colors.red}[FAIL]${colors.reset} ${colors.bold}${msg}${colors.reset}`);
}

function extractJsonBlocks(markdownText) {
  const jsonBlocks = [];
  const regex = /```json\s*([\s\S]*?)\s*```/g;
  let match;
  while ((match = regex.exec(markdownText)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      jsonBlocks.push(parsed);
    } catch (e) {
      // Ignore invalid JSON blocks
    }
  }
  return jsonBlocks;
}

function auditObject(obj, pathKeys = []) {
  const failures = [];
  
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    
    const value = obj[key];
    const currentPath = [...pathKeys, key].join('.');
    
    if (typeof value === 'object' && value !== null) {
      failures.push(...auditObject(value, [...pathKeys, key]));
    } else if (typeof value === 'string') {
      const trimmedLower = value.trim().toLowerCase();
      // Check for FAIL, Blocked, or Rework indicators
      if (value.includes('❌') || value.includes('FAIL') || trimmedLower === 'rework' || trimmedLower === 'rejected') {
        failures.push({ path: currentPath, value });
      }
    } else if (typeof value === 'boolean') {
      if (key.endsWith('_fail') && value === true) {
        failures.push({ path: currentPath, value });
      }
      if ((key.endsWith('_pass') || key.endsWith('_valid') || key.endsWith('_complete')) && value === false) {
        failures.push({ path: currentPath, value });
      }
    }
  }
  
  return failures;
}

function runCouncilAudit() {
  console.log(`${colors.cyan}${colors.bold}====================================================`);
  console.log(`🌲  Mystery Shack AI Council: Automated Gating Auditor`);
  console.log(`====================================================${colors.reset}\n`);

  if (!fs.existsSync(PLAN_DIR)) {
    logWarning(`No plan directory located at: ${PLAN_DIR}`);
    logInfo("Skipping audit (no active feature branches or plans staged).");
    process.exit(0);
  }

  const files = fs.readdirSync(PLAN_DIR);
  const markdownFiles = files.filter(f => f.endsWith('.md') && !f.endsWith('-report.md'));

  if (markdownFiles.length === 0) {
    logWarning(`No active Markdown plans or reviews found under: ${PLAN_DIR}`);
    logInfo("Skipping audit.");
    process.exit(0);
  }

  logInfo(`Scanning ${markdownFiles.length} markdown plan/review file(s) for audit artifacts...`);
  
  let totalJsonBlocksFound = 0;
  let totalFailuresCount = 0;

  for (const file of markdownFiles) {
    const filePath = path.join(PLAN_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonBlocks = extractJsonBlocks(content);

    if (jsonBlocks.length === 0) {
      continue;
    }

    console.log(`\n📄 Auditing: ${colors.cyan}${file}${colors.reset}`);
    totalJsonBlocksFound += jsonBlocks.length;

    for (const block of jsonBlocks) {
      const failures = auditObject(block);
      if (failures.length > 0) {
        totalFailuresCount += failures.length;
        failures.forEach(f => {
          logError(`  ❌ Field [${f.path}] contains a failing value: "${f.value}"`);
        });
      } else {
        const rootKey = Object.keys(block)[0] || 'review';
        logSuccess(`  🟢 Verified compliance for artifact: "${rootKey}"`);
      }
    }
  }

  console.log(`\n${colors.cyan}${colors.bold}----------------------------------------------------`);
  console.log(`Audit Summary:`);
  console.log(`  - Total Deliverable Artifacts Audited: ${totalJsonBlocksFound}`);
  console.log(`  - Total Unresolved Gating Failures: ${totalFailuresCount}`);
  console.log(`----------------------------------------------------${colors.reset}`);

  if (totalFailuresCount > 0) {
    console.log(`\n${colors.red}${colors.bold}🚨 Gating Gate Failed: One or more Council Audits are in a "FAIL" or "Rework" state.`);
    console.log(`Please address the failures listed above and obtain PASS verdicts before merging.${colors.reset}\n`);
    process.exit(1);
  }

  console.log(`\n${colors.green}${colors.bold}🎉 CI/CD Gate Passed: All AI Council reviews and security audits are 100% compliant!${colors.reset}\n`);
  process.exit(0);
}

runCouncilAudit();
