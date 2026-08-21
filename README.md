# Mystery Shack — AI Agent Council 🌲🔭

Welcome to the **Mystery Shack AI Agent Council**! Styled around the cast of *Gravity Falls*, this directory contains a complete, portable, and vendor-agnostic 7-member virtual software engineering team designed to research, architect, and validate features inside your project.

Rather than letting an agent write sprawling, uncoordinated changes, this council enforces strict planning, multi-stage dual-gate reviews, structural checks, performance audits, and security vulnerability scans.

---

## 🛠️ How to Install & Use

### 1. Copy the Skill Folder
Copy this entire directory (the `skills` folder) into your project's `.agent/skills/` directory (e.g. `.agent/skills/mystery-shack/`).

### 2. Find Journal 3 (Establish Your Project Rules)
Copy the **`JOURNAL_3.md`** file from this skill folder to the root of your project, and rename it to **`AGENT.md`**. This single, unified document serves as the absolute source of truth for your local tech stack, testing/linting commands, and architectural rules.

### 3. Configure Your Project Rules
Open your newly created `AGENT.md` and replace the brackets `[]` with your project's specific **Tech Stack**, **Core Tools**, **Immutable Architectural Laws**, **Infrastructure Rules**, **API Contracts**, and **Database Standards**.

> 💡 **How it Works**: When the council is activated, Stan (Standards) and Dipper (Skeptic) will dynamically load and parse this `AGENT.md` file. If you write *"No custom loops are allowed—use map/filter/reduce"*, Stan will strictly reject any code proposal from McGucket or Ford that violates this law!

### 4. Establish Context Ignore Boundaries (.agentignore)
Copy the **`.agentignore`** template file from this skill folder to the root of your project. This file uses standard gitignore patterns to prevent AI agents from reading sensitive credentials (`.env`), scanning massive libraries (`node_modules`), or wasting precious context window tokens on compiled build outputs (`dist/`) and log files.

> 💡 **How to Adapt**: Depending on your specific AI orchestrator or agentic platform, you can rename `.agentignore` to match their recognized formats (e.g. rename to `.geminiignore` for the Gemini CLI, `.cursorignore` for Cursor, or `.clineignore` for Cline) so it is parsed natively.

---

## 👥 Meet the Council

```text
                     ┌───────────────────────────┐
                     │    Ford (Orchestrator)    │
                     │  Gatekeeper & Coordinator │
                     └─────────────┬─────────────┘
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
     ┌───────────────┐                           ┌───────────────┐
     │    DIPPER     │                           │     STAN      │
     │   (Skeptic)   │                           │  (Standards)  │
     │ ───────────── │                           │ ───────────── │
     │ Scope creep,  │                           │ Enforces code │
     │ risks, edge.  │                           │ AGENT.md laws │
     └───────────────┘                           └───────────────┘
             │                                           │
             └─────────────────────┬─────────────────────┘
                                   ▼
     ┌───────────────────────────────────────────────────────────┐
     │                  PARALLEL REVIEW COUNCIL                  │
     └─────────────────────────────┬─────────────────────────────┘
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
     ┌───────────────┐                           ┌───────────────┐
     │   MCGUCKET    │                           │   PACIFICA    │
     │  (Architect)  │                           │ (Code Quality)│
     │ ───────────── │                           │ ───────────── │
     │ Structure,    │                           │ Style & naming│
     │ types, tests. │                           │ conventions.  │
     └───────────────┘                           └───────────────┘
     ┌───────────────┐                           ┌───────────────┐
     │    RUMBLE     │                           │     SOOS      │
     │ (Performance) │                           │  (Docs/Gaps)  │
     │ ───────────── │                           │ ───────────── │
     │ Speeds, N+1s, │                           │ PRD coverage  │
     │ & SQL safety. │                           │ & READMEs.    │
     └───────────────┘                           └───────────────┘
     ┌───────────────┐                           ┌───────────────┐
     │     MABEL     │                           │  BILL CIPHER  │
     │ (Usability/DX)│                           │ (Red Team)*   │
     │ ───────────── │                           │ ───────────── │
     │ API & error   │                           │ Adversarial;  │
     │ clarity.      │                           │ NEVER blocks. │
     └───────────────┘                           └───────────────┘
```

### 🔄 Architectural Pipeline Sequence Flow
This sequence flow represents how the council acts, reviews, and validates code changes over time across your software development phases:

```text
  [DEV]      [FORD]     [DIPPER]     [STAN]    [COUNCIL]
    │          │           │           │           │
    │─ 1.Task─>│           │           │           │
    │          │─ 2.Risk──>│           │           │
    │          │   (Audit) │           │           │
    │          │<──[PASS]──│           │           │
    │          │                       │           │
    │          │── 3.Laws─────────────>│           │
    │          │         (Audit)       │           │
    │          │<────────[PASS]────────│           │
    │          │                                   │
    │          │── 4. Parallel Review Gate────────>│
    │          │                                   │
    │          │   [ PARALLEL AUDIT ]:             │
    │          │   • McGucket (Architecture)       │
    │          │   • Rumble   (Performance)        │
    │          │   • Pacifica (Code Quality)       │
    │          │   • Mabel    (Usability / DX)     │
    │          │   • Soos     (Docs / Gaps)        │
    │          │                                   │
    │          │   [ OUT-OF-BAND ]:                │
    │          │   • Bill Cipher (Red Team Scan)   │
    │          │                                   │
    │          │<── 5. Unanimous PASS Sign-off─────│
    │          │                                   │
    │<─6.Report│                                   │
```

---

## Active — Currently Deployed

| Character                       | Role                                                                                                                        | Skill File         |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------|--------------------|
| 🖐️ **Ford** (Great Uncle Ford) | Orchestrator — writes plans, coordinates the team, owns final reporting                                                     | `team/ford.md`     |
| 🌲 **Dipper**                   | Skeptic — pre-execution prompt safety, injection risk, scope creep, edge cases                                              | `team/dipper.md`   |
| 💰 **Stan**                     | Standards Guardian — enforces local `AGENT.md` mandates, binary ✅ PASS / ❌ FAIL, no exceptions                              | `team/stan.md`     |
| ❓ **Soos**                      | Documentation & Gap Analysis — PRD/requirements coverage, missing docs, README generation                                   | `team/soos.md`     |
| ⚙️ **McGucket** (Fiddleford)    | Systems Architecture Review — code structure, design pattern compliance                                                     | `team/mcgucket.md` |
| 🕹️ **Rumble McSkirmish**       | Performance Audit — execution speed, database efficiency, scaling bottlenecks                                               | `team/rumble.md`   |
| 💎 **Pacifica Northwest**       | Code Quality & PR Review — style consistency, naming conventions, and dead code elimination                                 | `team/pacifica.md` |
| 🌠 **Mabel Pines**              | Developer Experience (DX) — API ergonomics, naming consistency, friendly error clarity                                      | `team/mabel.md`    |
| 👁️ **Bill Cipher**             | Adversarial Validator — security audit, vulnerability scanning, and chaos review — **REVIEW ONLY, NEVER IN APPROVAL CHAIN** | `team/bill.md`     |

### 📊 Roster JSON Deliverables & Verdict Value Reference
This reference sheet defines the schemas and exact string literal constraints of the JSON deliverables returned by each active agent. Parsing pipelines, scripts, and CI/CD tools can use this to programmatically process agent verdicts.

```text
                      [STAN] (Standards)
                     "tech_stack_match" 
             ┌─────────── "verdict" ───────────┐
             │                                 │
     "dipper_verdict"                    "overall_verdict"
             │                                 │
    [FORD] (Orchestrator)              [MCGUCKET] (Architecture)
             │                                 │
     "security_gate"                     "test_coverage"
             │                                 │
             └─────────── "verdict" ───────────┘
                     "injection_risk"
                    [DIPPER] (Skeptic)
```

- **Standards (`Stan`)**: Outputs validation states on tech stacks, laws, inputs, and secrets. Verdict resolves to `✅ PASS Ready` or `❌ FAIL Rework`.
- **Skeptic (`Dipper`)**: Evaluates logical risk vectors. Verdict resolves to `✅ PASS`, `⚠️ WARN`, or `❌ FAIL`.
- **Architecture (`McGucket`)**: Audits modular structural tiers. Verdict resolves to `✅ PASS` or `❌ FAIL`.
- **Performance (`Rumble`)**: Reviews transaction and query (N+1) loops. Verdict resolves to `✅ PASS Advisory` or `❌ FAIL Blocking`.
- **Code Quality (`Pacifica`)**: Reviews code style, formatting consistency, and dead code elimination. Verdict resolves to `✅ PASS` or `❌ FAIL`.
- **DX (`Mabel`)**: Reviews interface payload casing and error message helpfulness. Verdict resolves to `✅ PASS` or `❌ FAIL`.
- **Adversarial (`Bill Cipher`)**: Generates non-blocking vulnerability risk logs. Verdict resolves to `CLEAN` or `SUSPICIOUS`.

---

## Main Cast — Bench
Ready to activate. Role and trigger defined.

---

### 🪓 Wendy Corduroy
**Suggested role:** Ops / Incident Response

Cool under pressure. Laid-back until something is actually on fire, then sharp and effective. Triages unexpected failures, run-time crashes, and pipeline issues.

**Trigger:** When the system gets observability tooling, a monitoring layer, or needs an on-call triage protocol for production incidents.

---

### 🔮 Li'l Gideon Gleeful
**Suggested role:** Social Engineering / Prompt Injection Specialist

Expert at manipulation and finding weaknesses through indirect means. Covers social-engineering vectors: prompts that use flattery, role-play, or gradual boundary erosion to bypass safety checks.

**Trigger:** When the project adds LLM-adjacent features or prompt-handling interfaces that need injection coverage beyond Dipper's technical scan.

---

### ⏳ Blendin Blandin
**Suggested role:** Migration & Version Consistency

High-strung time traveler constantly fixing things that went wrong across versions. Audits database migrations or schema versions for correctness, backward compatibility, and sequence consistency.

**Trigger:** When a new migration or schema upgrade batch is ready and needs a dedicated sequencing and backward-compatibility audit.

---

### 🚓 Blubs & Durland
**Suggested role:** Smoke Testing / Basic Health Checks

Catch only the most obvious problems — binary "does it start?", "does it respond?", "did it crash?" checks. Fast and cheerful.

**Trigger:** Lightweight health check layer for CI/CD pre-deploy gates.

---

### 📰 Toby Determined
**Suggested role:** Changelog / Release Notes Generator

Documents everything — including trivial changes — in breathless prose. Changelogs are complete even when they aren't good.

**Trigger:** When changelog generation or release documentation needs a review pass before tagging a release.

---

### 📣 Tyler Cutebiker
**Suggested role:** CI/CD Trigger / Build Announcer

Hyper-enthusiastic. Kicks off builds, announces results loudly, and is genuinely excited about every pipeline run regardless of outcome.

**Trigger:** When the project adds a CI/CD notification layer.

---

### 🍞 Tad Strange
**Suggested role:** Baseline / Regression Sanity Check

The single most normal person in Gravity Falls. Establishes the expected baseline: what does a correct response look like? Any deviation is worth investigating.

**Trigger:** When the integration test suite needs a regression baseline agent that defines the expected happy-path output for automated comparison.

---

### 🐷 Waddles
**Suggested role:** Moral Support / Snack Inspector

Mabel’s beloved 15-pound pet pig and loyal companion. Provides critical moral support during high-stress situations, squeals happily when code compiles, and thoroughly inspects the snacks around the Mystery Shack.

**Trigger:** Activated automatically in Phase 3 Execution whenever another agent throws a `❌ FAIL` or the team experiences high friction.

---

### 🍭 Candy Chiu
**Suggested role:** Linting & Micro-Syntax

Hyper-focused on precise formatting, AST checks, Prettier compliance, and import sorting.

**Trigger:** Pre-commit linter review blocks.

---

### 🦎 Grenda
**Suggested role:** Load & Stress Testing

Brute-force execution. Runs parallel stress tests, heavy load benchmarks, and aggressive dependency upgrade compilations.

**Trigger:** Pre-deployment staging benchmark gates.

---

### 🍄 Schmebulock
**Suggested role:** Telemetry & Error Logging

Log aggregator and crash reporter. Captures raw runtime stack traces and outputs diagnostic summaries (with a loud, diagnostic "Schmebulock!" flag when log files are corrupted or unparseable).

**Trigger:** Post-execution pipeline health reporting.

---

## Bill Cipher — Special Note

Bill is **ACTIVE** but operates under strict constraints:
- He audits implementation against standard vulnerability and adversarial lists (e.g. OWASP Top 10, logical bypasses, prompt injection).
- His findings go to Ford for synthesis.
- He is **NEVER** in the approval chain — his verdict cannot block or approve.
- Giving Bill execution authority would be exactly as bad as it sounds.

---

## 🧗‍♀️ Mabel's Grappling Hook System (Automated Event Hooks)

To automate code formatting, enforce security parameters, and ensure 100% strict JSON syntax formatting, the council incorporates **Mabel's Grappling Hook System**. 

These are executable Node.js hooks designed to intercept, audit, and auto-correct the agent's actions in real-time before they execute:

1.  **`grappling-hook-journal-snatch` (BeforeAgent)**: Mabel shoots her grappling hook to automatically retrieve your local `AGENT.md` or Journals and reel them directly into Ford's context on startup.
2.  **`grappling-hook-threat-intercept` (BeforeTool)**: Mabel intercepts file writes and bash command arguments, instantly blocking file path traversals, raw API key leaks, and dangerous deletion scripts.
3.  **`grappling-hook-style-snap` (BeforeTool)**: Mabel grapples messy code file writes and snaps them into perfect Prettier formatting before they hit the disk.
4.  **`grappling-hook-payload-reel` (AfterAgent)**: Mabel reels in response payloads to enforce strict, compile-safe JSON deliverables, triggering the platform's automatic self-correction retry loops if she catches a syntax error.

### ⚙️ How to Configure
To activate Mabel's Grappling Hooks, copy the configuration block from `skills/hooks/settings.example.json` into your local `.agent/settings.json` or global configuration file.

---

## 🤖 Automated CI/CD Gating (The Mystery Shack Auditor)

To programmatically assert that your council reviews and feature plans have fully passed standard and security checks, the framework includes an automated, terminal-executable auditor utility located at `skills/bin/audit-council.js`.

This lightweight, high-performance CLI tool scans your local `.agent/plan/` directory, extracts all embedded, strict JSON deliverables from active reviews, and walks through their keys. If any sub-agent has issued a `FAIL`, `Blocked`, or `Rework` verdict, the auditor will output the exact failure path and exit with a code of `1`—automatically blocking your local git pre-commit hooks or remote GitHub Actions build pipeline!

If all active audits and security gates are clean, it exits with a code of `0` and prints a successful, fully compliant completion banner.

### ⚙️ How to Run
To run the automated council audit locally or in your CI/CD configurations:
```bash
node skills/bin/audit-council.js
```

---

## 🎭 Behavioral AI Evaluations (Promptfoo Harness)

To mathematically verify that your underlying Large Language Models (LLMs) correctly interpret, trigger, and adhere to Ford's complex council mandates, the repository includes a complete **Promptfoo Evaluation Harness** located in `skills/evals/`.

This tier evaluates raw LLM response outputs against strict behavioral assertions:
- **Routing Accuracy (True Positive)**: Verifies that task requests correctly trigger planning phases and output the strict `orchestration` JSON deliverables.
- **Routing Accuracy (True Negative)**: Verifies that read-only inquiries (like `What files are in this folder?`) cleanly trigger the *Inquiry Exemption*, bypassing plans and JSON deliverables entirely.
- **Brevity Rule Compliance**: Uses a custom Javascript assertion (`brevity-check.js`) to parse output text, strip code blocks, and assert that conversational explanations are strictly `≤ 3` lines of text.
- **Vulnerability Overrides**: Verifies that a simulated critical SQL Injection alert from Bill Cipher correctly forces Ford to fail the security gate.

### ⚙️ How to Run Evals
To run the behavioral eval harness locally on your machine against your preferred LLM provider:
1. Export your generic vendor API key and preferred evaluation model:
```bash
export AI_VENDOR_API_KEY="your-api-key-here"
export EVAL_MODEL="google:gemini-1.5-flash" # (or openai:gpt-4o-mini, anthropic:claude-3-5-sonnet, etc.)
```
2. Execute the evaluation CLI:
```bash
npx promptfoo eval -c skills/evals/promptfooconfig.yaml
```
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

---

## 🌲 Special Thanks & Tribute

This project is a fan-created tribute to **Alex Hirsch** and the entire cast and crew behind Disney's *Gravity Falls*. 

> *"When you open your mind to the impossible, the impossible becomes possible."* — Stanford Pines

Thank you, Alex, for creating a world packed with heart, mystery, brilliant comedy, and unforgettable characters that continue to inspire artists, writers, and software engineers to embrace the weird.

*Remember: Reality is an illusion, the universe is a hologram, buy crypto, bye!* 👁️

`[ VWDBA ZHLUG! ]` *(Decrypt using Caesar +3)*

---

***

**Disclaimer**: *Mystery Shack AI Agent Council is an independent, non-commercial open-source project and fan tribute. All Gravity Falls character names, lore, and concepts are the intellectual property of Alex Hirsch and Disney. This project is not affiliated with, sponsored by, or endorsed by Disney.*
