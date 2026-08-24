# Dipper's Guide to the Unexplained (Developer Guide) 🌲🔎📓

Welcome to **Dipper's Guide to the Unexplained**! This document serves as our comprehensive developer and contributor manual, containing detailed technical setups, instruction schemas for running Promptfoo evaluations, testing automation hooks, and auditing our CI/CD governance pipelines.

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
2. Execute the evaluation CLI (fully safe, lock-aware, drift-protected execution):
```bash
node skills/bin/run-evals.js
```

> ⚠️ **Rate Limit Guard**: We strictly enforce `--max-concurrency 1` inside both the CLI commands and the automated GitHub Actions workflow. Google's Free Tier has tight Request Per Minute (RPM) limits (15 RPM). Leaving Promptfoo to run concurrently will trigger rapid `429 Too Many Requests` API errors.

> 🚫 **The "Billing Trap" Warning**: Ensure your Google AI Studio developer project **does not have a credit card linked to it**. The moment a billing account is connected, Google automatically strips away the free-tier quota and will charge you per token for every single evaluation run.
3. To view a gorgeous web-based dashboard of model compliance comparison metrics:
```bash
npx promptfoo view
```

> 🧭 **Which command do I run?** Always use `node skills/bin/run-evals.js` to *run* evals — it wraps Promptfoo, injects the model providers via `--providers`, and intercepts `429` rate-limits with a neutral exit. The raw `npx promptfoo eval -c skills/evals/promptfooconfig.yaml` command is **advanced only**: `promptfooconfig.yaml` intentionally ships **without a `providers:` block**, so a bare `npx promptfoo eval` runs with no model and produces no results unless you pass `--providers` yourself. `npx promptfoo view` (read-only dashboard) is always safe to run directly.

---

## 🪝 Mabel's Grappling Hooks — Interface Contracts

The hooks (`skills/hooks/mabels-grappling-hooks/*.js`) are event-driven Node scripts that run **outside** the LLM loop as child processes of the agent platform. They communicate over standard streams: a JSON payload arrives on `stdin`, the (optionally mutated) JSON is written to `stdout`, and the process exit code routes the result. All logging MUST go to `stderr` (`console.error`) so `stdout` stays valid JSON.

### `stdin` / `stdout` Payload Schema
The canonical keys the hooks read and write (this is the single source of truth — the wiring lives in `skills/hooks/settings.example.json`):

| Key | Lifecycle | Meaning |
|-----|-----------|---------|
| `context_append` | `BeforeAgent` | Prompt context string. `journal-snatch.js` appends the local `AGENT.md` / `JOURNAL_*.md` contents here. |
| `tool` | `BeforeTool` | Name of the tool about to run (e.g. `write_file`, `run_shell_command`, `replace`). |
| `arguments` | `BeforeTool` | The tool's argument object (e.g. `{ "command": "..." }` or `{ "file_path": "...", "content": "..." }`). `style-snap.js` mutates `arguments.content`; `threat-intercept.js` inspects `arguments`. |
| `response` | `AfterAgent` | The agent's response payload. `payload-reel.js` enforces strict JSON here. |

```json
// BeforeTool payload consumed by threat-intercept.js / style-snap.js
{ "tool": "run_shell_command", "arguments": { "command": "rm -rf ./" } }
```

### Process Exit Code Matrix (Mandatory)
The platform routes strictly on the hook's exit code:

- **`0` (PASS)** — clean; the mutated `stdout` JSON is applied.
- **`1` (FAIL)** — fatal exception / generic crash; the pipeline terminates. Hooks emit a safe `{}` on malformed input and exit `1`.
- **`2` (EMERGENCY BLOCK / AUTO-RETRY)** — a critical finding (e.g. `threat-intercept.js` matches a leaked `sk-` key). The platform aborts the tool call and forces an LLM self-correction retry.

---

## 📊 Custom Promptfoo Assertions (`GradingResult`)

Custom JS assertions in `skills/evals/` (e.g. `brevity-check.js`) must return a Promptfoo **`GradingResult`**, not a bare boolean or ad-hoc object — Node 24 will otherwise crash the runner with *"Custom function must return a boolean, number, or GradingResult object"*.

- `pass` (boolean, **required**) — whether the heuristic passed.
- `score` (float, **required**) — `1.0` (pass) or `0.0` (fail); required by Promptfoo's metrics engine.
- `reason` (string, optional) — diagnostic printed to console and the web view.

```javascript
module.exports = function (output, context) {
  if (typeof output !== 'string') {
    return { pass: false, score: 0.0, reason: `Expected string, got ${typeof output}` };
  }
  const ok = output.length < 500;
  return { pass: ok, score: ok ? 1.0 : 0.0, reason: ok ? 'ok' : `Too long: ${output.length} chars` };
};
```

---

## 🔒 Continuous Integration & Repository Governance (CI/CD & CODEOWNERS)

To guarantee that no changes accidentally break Mabel's Grappling Hooks, Ford's loop safety rules, or the Gating Auditor, the repository incorporates automated CI/CD pipelines and strict code ownership:

### 🚀 Automated GitHub Actions Workflow
A native GitHub Actions workflow is registered at `.github/workflows/verify-council.yml`. On every push and pull request to the `main` branch, the workflow:
1.  **Runs Deterministic Unit Tests**: Executes `npm test` to verify Mabel's hooks, regex scans, and the Gating Auditor CLI are functionally clean (completes in under 400ms).
2.  **Runs Behavioral AI Evals (Promptfoo)**: Sequentially executes `node skills/bin/run-evals.js` (after unit tests pass to preserve token quotas) to mathematically ensure the LLM continues to respect the 3-line brevity mandate and strict JSON delivery formats.

### 👑 Repository Governance (CODEOWNERS)
To prevent unauthorized or accidental modifications to core AI agent constraints, the repository enforces strict, file-level branch protection via `.github/CODEOWNERS`. 

Any pull request attempting to modify the core orchestrator guidelines (`skills/team/ford.md`, `skills/SKILL.md`), the blocking-gate personas (`skills/team/stan.md`, `dipper.md`, `mcgucket.md`, `wendy.md`, `blendin.md`), our security validator (`skills/team/bill.md`), the telemetry persona (`skills/team/schmebulock.md`), or our real-time automation hooks (`skills/hooks/`) physically blocks merging until the repository owner (`@phillpafford`) reviews and approves the changes.
