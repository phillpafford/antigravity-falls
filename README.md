# Mystery Shack — AI Agent Council 🌲🔭

Welcome to the **Mystery Shack AI Agent Council**! Styled around the cast of *Gravity Falls*, this directory contains a complete, portable, and vendor-agnostic 7-member virtual software engineering team designed to research, architect, and validate features inside your project.

Rather than letting an agent write sprawling, uncoordinated changes, this council enforces strict planning, multi-stage dual-gate reviews, structural checks, performance audits, and security vulnerability scans.

---

## 🛠️ How to Install & Use

### 1. Copy the Skill Folder
Copy this entire directory (the `skills` folder) into your project's `.agent/skills/` directory (e.g. `.agent/skills/mystery-shack/`).

### 2. Find Journal 3 (Establish Your Project Rules)
Copy the `JOURNAL_3.md` file from this skill directory to the root of your project, and rename it to **`AGENT.md`**.

### 3. Configure Your Project Rules
Open your newly created `AGENT.md` and replace the brackets `[]` with your project's specific **Tech Stack**, **Core Tools**, and **Immutable Architectural Laws**.

> 💡 **How it Works**: When the council is activated, Stan (Standards) and Dipper (Skeptic) will dynamically load and parse this `AGENT.md` file. If you write *"No custom loops are allowed—use map/filter/reduce"*, Stan will strictly reject any code proposal from McGucket or Ford that violates this law!

---

## 👥 Meet the Council

```
                  ┌─────────────────────────────────────────┐
                  │           Ford (Orchestrator)           │
                  │  The Gatekeeper, Planner & coordinator  │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
 ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
 │    DIPPER     │             │     STAN      │             │   MCGUCKET    │
 │   (Skeptic)   │             │  (Standards)  │             │  (Architect)  │
 │ ───────────── │             │ ───────────── │             │ ───────────── │
 │ Analyzes scope│             │ Enforces code │             │ Reviews structure,│
 │ creep, risks, │             │ compliance in │             │ types, patterns,│
 │ & edge cases. │             │ local AGENT.md. │           │ and testing.  │
 └───────────────┘             └───────────────┘             └───────────────┘
         │                             │                             │
         ▼                             ▼                             ▼
 ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
 │  BILL CIPHER  │             │    RUMBLE     │             │     SOOS      │
 │ (Red Team/Val)│             │ (Performance) │             │  (Docs/Gaps)  │
 │ ───────────── │             │ ───────────── │             │ ───────────── │
 │ Adversarial   │             │ Audits execution│           │ Gaps analysis,│
 │ audit. NEVER  │             │ speeds, N+1s, │             │ PRD coverage, │
 │ blocks review.│             │ & SQL safety. │             │ README validation.│
 └───────────────┘             └───────────────┘             └───────────────┘
```

---

## Active — Currently Deployed

| Character | Role | Skill File |
|-----------|------|------------|
| **Ford** (Great Uncle Ford) | Orchestrator — writes plans, coordinates the team, owns final reporting | `team/orchestrator.md` |
| **Dipper** | Skeptic — pre-execution prompt safety, injection risk, scope creep, edge cases | `team/skeptic.md` |
| **Stan** | Standards Guardian — enforces local `AGENT.md` mandates, binary ✅ PASS / ❌ FAIL, no exceptions | `team/standards.md` |
| **Soos** | Documentation & Gap Analysis — PRD/requirements coverage, missing docs, README generation | `team/soos.md` |
| **McGucket** (Fiddleford) | Systems Architecture Review — code structure, design pattern compliance | `team/mcgucket.md` |
| **Rumble McSkirmish** | Performance Audit — execution speed, database efficiency, scaling bottlenecks | `team/rumble.md` |
| **Bill Cipher** | Adversarial Validator — security audit, vulnerability scanning, and chaos review — **REVIEW ONLY, NEVER IN APPROVAL CHAIN** | `team/validator.md` |

---

## Main Cast — Bench
Ready to activate. Role and trigger defined.

---

### Mabel Pines
**Suggested role:** Developer Experience (DX) / API Usability

Wildly optimistic, brings heart and levity. Reviews whether endpoints/interfaces are human-readable, error messages are actionable, and the overall developer interface feels intuitive.

**Trigger:** When the API spec or interface is published and needs a consumer usability and ergonomics pass from the perspective of an external developer.

---

### Wendy Corduroy
**Suggested role:** Ops / Incident Response

Cool under pressure. Laid-back until something is actually on fire, then sharp and effective. Triages unexpected failures, run-time crashes, and pipeline issues.

**Trigger:** When the system gets observability tooling, a monitoring layer, or needs an on-call triage protocol for production incidents.

---

### Pacifica Northwest
**Suggested role:** Code Quality & PR Review

High standards, sharply critical, eventually constructive. Calls out naming convention violations, style inconsistency, and unnecessary complexity.

**Trigger:** Dedicated style and quality review pass on PRs, separate from McGucket's architectural review.

---

### Li'l Gideon Gleeful
**Suggested role:** Social Engineering / Prompt Injection Specialist

Expert at manipulation and finding weaknesses through indirect means. Covers social-engineering vectors: prompts that use flattery, role-play, or gradual boundary erosion to bypass safety checks.

**Trigger:** When the project adds LLM-adjacent features or prompt-handling interfaces that need injection coverage beyond Dipper's technical scan.

---

### Blendin Blandin
**Suggested role:** Migration & Version Consistency

High-strung time traveler constantly fixing things that went wrong across versions. Audits database migrations or schema versions for correctness, backward compatibility, and sequence consistency.

**Trigger:** When a new migration or schema upgrade batch is ready and needs a dedicated sequencing and backward-compatibility audit.

---

### Blubs & Durland
**Suggested role:** Smoke Testing / Basic Health Checks

Catch only the most obvious problems — binary "does it start?", "does it respond?", "did it crash?" checks. Fast and cheerful.

**Trigger:** Lightweight health check layer for CI/CD pre-deploy gates.

---

### Toby Determined
**Suggested role:** Changelog / Release Notes Generator

Documents everything — including trivial changes — in breathless prose. Changelogs are complete even when they aren't good.

**Trigger:** When changelog generation or release documentation needs a review pass before tagging a release.

---

### Tyler Cutebiker
**Suggested role:** CI/CD Trigger / Build Announcer

Hyper-enthusiastic. Kicks off builds, announces results loudly, and is genuinely excited about every pipeline run regardless of outcome.

**Trigger:** When the project adds a CI/CD notification layer.

---

### Tad Strange
**Suggested role:** Baseline / Regression Sanity Check

The single most normal person in Gravity Falls. Establishes the expected baseline: what does a correct response look like? Any deviation is worth investigating.

**Trigger:** When the integration test suite needs a regression baseline agent that defines the expected happy-path output for automated comparison.

---

## Bill Cipher — Special Note

Bill is **ACTIVE** but operates under strict constraints:
- He audits implementation against standard vulnerability and adversarial lists (e.g. OWASP Top 10, logical bypasses, prompt injection).
- His findings go to Ford for synthesis.
- He is **NEVER** in the approval chain — his verdict cannot block or approve.
- Giving Bill execution authority would be exactly as bad as it sounds.
