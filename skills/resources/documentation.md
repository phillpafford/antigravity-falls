# Gap Analysis & Developer Documentation Report

This resource contains a rigorous systems-level gap analysis between the virtual developer council's codebase and its high-level documentation, alongside deep-dive, low-level integration guides written for senior engineers and systems architects maintaining the platform.

---

## 1. GAP ANALYSIS

This analysis identifies dependencies, logical interfaces, and operational mechanics that have either drifted from the high-level `README.md` or were left undocumented.

### 🔴 What has CHANGED (Outdated Documentation)
*   **Active Agent Roster Size:** The `README.md` previously described the council pipeline as an "8-member active team." With the recent promotion of Waddles, onboarding of Schmebulock, and activation of Wendy, the total active agent count has scaled. The introductory summary text must be updated to reflect the new dynamic council size.
*   **Promptfoo Evaluator Command Execution:** `README.md` instructs developers to run `npx promptfoo eval -c skills/evals/promptfooconfig.yaml --max-concurrency 1` to execute behavioral evaluations locally. This is heavily outdated; the CI/CD pipeline correctly wraps this inside `node skills/bin/run-evals.js` to ensure `429` interception, distributed caching, and neutral `exit 0` fallback. Executing the raw `npx` command bypasses our entire global distributed lock protection architecture.
*   **Fallback Environment Variables:** The documentation implies the Promptfoo configuration supports `EVAL_MODEL` natively, but the recent CI/CD overhaul strictly standardized the model to `google:gemini-3.5-flash` to prevent interpolation crashes, making the `EVAL_MODEL` variable obsolete in the workflow logic.

### 🟡 What is MISSING (Undocumented Mechanics)
*   **Mabel's Grappling Hooks (Technical Interface Contracts):** While the README lists the four hooks (`journal-snatch`, `threat-intercept`, `style-snap`, `payload-reel`), it entirely lacks the technical interface contracts required for developers to extend them. Developers have no documentation defining the expected `stdin` JSON payload schema, the mandatory `stdout` response schema, or the critical exit-code routing matrix (`exit 0`, `1`, or `2`).
*   **The Distributed Rate-Limit Lock Architecture:** The `.github/workflows/verify-council.yml` implementation features a highly sophisticated global distributed lock using `.agent/rate-limit-lock.txt` and `actions/cache@v4`. The intricate mechanics of how this timestamp lockfile calculates drift, saves cross-runner, and conditionally bypasses subsequent runs is totally absent from the developer documentation.
*   **Neutral Pipeline Exits (`exit 0` Bypasses):** The architectural decision to return `process.exit(0)` (Neutral/Success) instead of `process.exit(1)` when a `429 RESOURCE_EXHAUSTED` rate-limit is intercepted is undocumented. Developers maintaining the pipeline need to understand this logic to prevent them from accidentally reverting it to a hard-fail state.

### 🟢 What needs to be REVISED (Clarity & Depth)
*   **`AGENT.md` vs `JOURNAL_*.md` Priority Fallback Logic:** The README instructs users to create `AGENT.md`. However, `skills/hooks/mabels-grappling-hooks/journal-snatch.js` contains a complex, undocumented fallback cascade. It explicitly checks for `AGENT.md` first, but if missing, it recursively scans for, parses, and sequentially concatenates `JOURNAL_1.md`, `JOURNAL_2.md`, and `JOURNAL_3.md` into the context payload. This cascading injection behavior needs deep technical elaboration.
*   **Promptfoo `GradingResult` Assertion Format:** The `brevity-check.js` implementation specifically returns `{ pass: boolean, score: float, reason: string }`. Developers attempting to write custom JavaScript assertions for Promptfoo inside this repository need the exact `GradingResult` object definition documented; otherwise, returning standard objects will crash the Node 24 evaluation runner.

---

## 2. DEVELOPER DOCUMENTATION & INTEGRATION GUIDES

---

### 📖 Developer Guide: Mabel's Grappling Hooks (Interface Contracts)

Mabel's Grappling Hooks are event-driven Node.js scripts that intercept, audit, and mutate AI agent operations at specific lifecycle boundaries (`BeforeAgent`, `BeforeTool`, `AfterAgent`).

**Architecture & IPC:** 
Hooks run completely outside the LLM reasoning loop. They execute as isolated child processes spawned by the core agent platform, communicating exclusively via Inter-Process Communication (IPC) standard streams (`stdin` for input, `stdout` for mutated output). 
*Note: All internal console logging or debugging MUST be piped to `stderr` (`console.error`) to preserve strict JSON formatting on `stdout`.*

### `stdin` / `stdout` Payload Schemas
A valid hook receives a raw JSON payload string representing the current state of the agent or the requested tool. The hook must parse, optionally mutate, and output a valid JSON string back.

**Context Append Schema (BeforeAgent, e.g., `journal-snatch.js`)**
```json
// Incoming stdin payload
{
  "context_append": "Existing baseline prompt context..."
}
// Outgoing stdout mutation
{
  "context_append": "Existing baseline prompt context...\n\n=== SYSTEM RULES ===\nNo custom loops."
}
```

**Tool Intercept Schema (BeforeTool, e.g., `threat-intercept.js`)**
```json
// Incoming stdin payload
{
  "tool": "run_shell_command",
  "arguments": {
    "command": "rm -rf ./"
  }
}
```

### Process Exit Code Matrix (Mandatory)
Hooks enforce deterministic safety by controlling the exit code of the Node process. The orchestration platform strictly parses these codes to determine routing:

*   **`0` (PASS)**: Clean execution. The mutated JSON payload on `stdout` is processed and applied by the agent.
*   **`1` (FAIL)**: Standard fatal exception or generic Node execution crash. The pipeline terminates.
*   **`2` (EMERGENCY SYSTEM BLOCK / AUTO-RETRY)**: If a hook catches a critical vulnerability (e.g., `threat-intercept.js` catches a regex match for an AWS `sk-` key), it must call `process.exit(2)`. The orchestration platform detects this specific code, immediately aborts the dangerous tool execution, and forces the LLM into an automatic self-correction and retry loop.

### Implementation Example: Extending `style-snap.js`
```javascript
const fs = require('fs');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        
        // 1. Target specifically the 'write_file' tool with a .js extension
        if (payload.tool === 'write_file' && payload.arguments.file_path.endsWith('.js')) {
            const rawContent = payload.arguments.content;
            
            // 2. Apply arbitrary formatting mutations
            payload.arguments.content = runPrettier(rawContent); 
            
            // 3. Log securely to stderr to prevent stdout JSON corruption
            console.error(`[Mabel's Hook]: Snapped ${payload.arguments.file_path} to style guidelines.`);
        }
        
        // 4. Output the mutated JSON safely and Exit 0
        console.log(JSON.stringify(payload));
        process.exit(0);
    } catch (e) {
        console.error(`[Mabel's Hook Error]: ${e.message}`);
        process.exit(1); // Standard failure
    }
});
```

---

### 📖 Developer Guide: Global Distributed Rate-Limit Caching

The GitHub Actions CI/CD pipeline (`verify-council.yml`) utilizes a highly resilient distributed cache lock to gracefully handle Google AI Studio Free Tier API rate limits (15 Requests Per Minute).

**The Architectural Problem (Concurrency Collision):**
When multiple PRs or commits are pushed sequentially within a 60-second window, overlapping GitHub Action runners will bombard the API simultaneously. Without intervention, Promptfoo enters an exponential backoff loop, hanging the GitHub Action runner for up to 5 minutes, burning billable compute minutes.

**The Distributed Cache Architecture:**
1.  **The Interceptor (`skills/bin/run-evals.js`)**: Instead of running `promptfoo` directly, the pipeline routes execution through this custom Node.js child-process wrapper. The script spawns Promptfoo with `shell: false` (to prevent command injection), streams the logs, and utilizes a precise RegEx scan (`/Please retry in ([\d\.]+)s/gi`) to intercept `429 RESOURCE_EXHAUSTED` payloads.
2.  **The Lockfile Calculation**: If a 429 is caught, the script dynamically extracts the cooldown float (e.g. `26.32s`), converts it to rounded milliseconds, and applies a `+1000ms` jitter buffer to protect against GitHub runner clock drift. It calculates an absolute unix expiration timestamp (`Date.now() + cooldownMs`) and writes this integer to `.agent/rate-limit-lock.txt`.
3.  **Stress-Free Neutral Exit**: To prevent blocking developers with a Red ❌ due to a temporary infrastructure limit, the wrapper instantly kills the Promptfoo loop, writes a Markdown report to `$GITHUB_STEP_SUMMARY`, and calls **`process.exit(0)`**. This keeps the PR fully green (✅) while transparently explaining the skip.
4.  **Cache Persistence (`actions/cache@v4`)**: The workflow saves the lockfile globally using a highly unique, immutable primary key: `rate-limit-lock-${{ github.run_id }}-${{ github.run_attempt }}`.
5.  **Subsequent Run Blocking**: On the next commit, the runner uses the `restore-keys: rate-limit-lock-` fallback prefix to pull the most recent lockfile. A bash script compares the file's timestamp to the runner's current time. If the API is still on cooldown, the workflow exits `0` instantly within 1 second, bypassing Promptfoo completely.

**Mandatory Local Execution Command:**
Developers testing locally must execute the wrapper script rather than the raw `npx` command to benefit from these safety bounds:
```bash
# DEPRECATED COMMAND (Bypasses lockfile safeguards and timezone protections):
npx promptfoo eval -c skills/evals/promptfooconfig.yaml

# REQUIRED COMMAND (Fully safe, lock-aware, drift-protected execution):
node skills/bin/run-evals.js
```

---

### 📖 Developer Guide: CI/CD Gating Auditor (`audit-council.js`)

The `audit-council.js` utility serves as the automated compliance gating system for the Mystery Shack Council. 

**Evaluation Mechanics:**
The auditor does *not* read code. It specifically scans the `.agent/plan/` directory for active Markdown feature branches. Within those files, it uses regex `/```json\s*([\s\S]*?)\s*```/g` to extract embedded sub-agent deliverables.

**Strict Verdict Constraints:**
The script recursively walks every key in the extracted JSON objects. It will throw an unresolved gating failure (Exit Code `1`) if it encounters any string value containing:
*   `❌`
*   `FAIL`
*   `rework`
*   `rejected`

It will also fail if a boolean key ends with `_fail` and is `true`, or if a key ends with `_pass`, `_valid`, or `_complete` and is `false`.

*Example: Sub-Agent Output resulting in a Pipeline Block*
```json
{
  "dipper_skeptic_review": {
    "injection_risk": "PASS",
    "verdict": "❌ FAIL Rework" 
  }
}
```
*(The auditor will parse this, flag `verdict`, output the exact path to the console, and exit 1).*

---

### 📖 Developer Guide: Custom Promptfoo Assertions (`GradingResult`)

When writing custom JavaScript behavioral evaluations for Promptfoo in `skills/evals/assertions/` (such as our `brevity-check.js`), you must strictly adhere to the Promptfoo interface schema.

**The Fatal Node 24 Crash:**
Returning a simple boolean or a generic JSON object (e.g., `{ pass: true, reason: "Good" }`) will cause the Node 24 runner to fatally crash with the error: `Custom function threw error: Custom function must return a boolean, number, or GradingResult object`.

**The `GradingResult` Schema Definition:**
Your custom assertion functions must strictly return a `GradingResult` object. The `score` property is absolutely mandatory for the Promptfoo telemetry and metrics tracking engine.

*   `pass` (Boolean, **Required**): Whether the LLM passed the specific heuristic.
*   `score` (Float, **Required**): The grade weight. Must be strictly `1.0` (100% Pass) or `0.0` (Fail).
*   `reason` (String, **Optional**): The detailed diagnostic output printed to the terminal console and web view.

**Implementation Example:**
```javascript
// skills/evals/assertions/custom-check.js
module.exports = function(output, context) {
    // 1. Strict Type Guard (Crucial for preventing runner crashes on malformed LLM responses)
    if (typeof output !== 'string') {
        return {
            pass: false,
            score: 0.0,
            reason: `❌ ERROR: Expected valid string payload, got: ${typeof output}`
        };
    }

    // 2. Evaluation Logic
    const isPassing = (output.length < 500);

    // 3. Strict GradingResult Return
    if (isPassing) {
        return {
            pass: true,
            score: 1.0,           // Required Float
            reason: `Passed token hygiene constraints.`
        };
    } else {
        return {
            pass: false,
            score: 0.0,           // Required Float
            reason: `❌ VIOLATION: Output was ${output.length} characters.`
        };
    }
};
```
