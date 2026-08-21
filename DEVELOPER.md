# Mystery Shack Developer Guide 🌲⚙️

Welcome to the **Mystery Shack Developer and Contributor Guide**! This document contains technical setups, instructions, and schemas for running behavioral evaluations, testing automation hooks, and auditing our CI/CD governance structures.

---

## 🎭 Behavioral AI Evaluations (Promptfoo Harness)

To mathematically verify that your underlying Large Language Models (LLMs) correctly interpret, trigger, and adhere to Ford's complex council mandates, the repository includes a complete **Promptfoo Evaluation Harness** located in `skills/evals/`.

This tier evaluates raw LLM response outputs against strict behavioral assertions:
- **Routing Accuracy (True Positive)**: Verifies that task requests correctly trigger planning phases and output the strict `orchestration` JSON deliverables.
- **Routing Accuracy (True Negative)**: Verifies that read-only inquiries (like `What files are in this folder?`) cleanly trigger the *Inquiry Exemption*, bypassing plans and JSON deliverables entirely.
- **Brevity Rule Compliance**: Uses a custom Javascript assertion (`brevity-check.js`) to parse output text, strip code blocks, and assert that conversational explanations are strictly `≤ 3` lines of text.
- **Vulnerability Overrides**: Verifies that a simulated critical SQL Injection alert from Bill Cipher correctly forces Ford to fail the security gate.

### ⚙️ How to Run Evals
To run the behavioral eval harness locally on your machine:
1. Export your developer API key:
```bash
export GOOGLE_API_KEY="your-google-api-key-here"
```
2. Execute the evaluation CLI with concurrency throttling (add `--verbose` for deep troubleshooting):
```bash
npx promptfoo eval -c skills/evals/promptfooconfig.yaml --max-concurrency 1 --verbose
```

> ⚠️ **Rate Limit Guard**: We strictly enforce `--max-concurrency 1` inside both the CLI commands and the automated GitHub Actions workflow. Google's Free Tier has tight Request Per Minute (RPM) limits (15 RPM). Leaving Promptfoo to run concurrently will trigger rapid `429 Too Many Requests` API errors.

> 🚫 **The "Billing Trap" Warning**: Ensure your Google AI Studio developer project **does not have a credit card linked to it**. The moment a billing account is connected, Google automatically strips away the free-tier quota and will charge you per token for every single evaluation run.
3. To view a gorgeous web-based dashboard of model compliance comparison metrics:
```bash
npx promptfoo view
```

---

## 🔒 Continuous Integration & Repository Governance (CI/CD & CODEOWNERS)

To guarantee that no changes accidentally break Mabel's Grappling Hooks, Ford's loop safety rules, or the Gating Auditor, the repository incorporates automated CI/CD pipelines and strict code ownership:

### 🚀 Automated GitHub Actions Workflow
A native GitHub Actions workflow is registered at `.github/workflows/verify-council.yml`. On every push and pull request to the `main` branch, the workflow:
1.  **Runs Deterministic Unit Tests**: Executes `npm test` to verify Mabel's hooks, regex scans, and the Gating Auditor CLI are functionally clean (completes in under 400ms).
2.  **Runs Behavioral AI Evals (Promptfoo)**: Sequentially executes `npx promptfoo eval` (after unit tests pass to preserve token quotas) to mathematically ensure the LLM continues to respect the 3-line brevity mandate and strict JSON delivery formats.

### 👑 Repository Governance (CODEOWNERS)
To prevent unauthorized or accidental modifications to core AI agent constraints, the repository enforces strict, file-level branch protection via `.github/CODEOWNERS`. 

Any pull request attempting to modify the core orchestrator guidelines (`skills/team/ford.md`, `skills/SKILL.md`), our security validator (`skills/team/bill.md`), or our real-time automation hooks (`skills/hooks/`) physically blocks merging until the repository owner (`@phillpafford`) reviews and approves the changes.
