# AI Prompt Review & Engineering Standards

Evaluating an AI prompt effectively requires treating the prompt like source code—checking for logical structure, explicit constraints, and failure modes under bad input. This guide defines the core auditing pillars and meta-prompting best practices used by the council.

---

## 1. Core Evaluation Criteria

All system prompts or prompt-handling architectures entering the codebase must be audited against these four foundational pillars:

| Pillar | What to Audit | High-Performing Prompt Marker |
| :--- | :--- | :--- |
| **Role & Context** | Personas, target audience, and domain depth | Defines an explicit, authoritative expert persona rather than a generic assistant. |
| **Constraints** | Boundary conditions and forbidden outputs | Uses explicit "Do NOT" rules to prevent verbose meta-text, conversational preambles, or scope creep. |
| **Output Controls** | Format restrictions and structural schemas | Mandates precise return formats (JSON, Markdown tables, direct prose). |
| **Edge Cases** | Behavior when handling missing or invalid data | Includes explicit fallback instructions and graceful degradation patterns when inputs are incomplete. |

---

## 2. AI Prompt Reviewer (Meta-Prompt Template)

Use the following meta-prompt inside your development workflows or testing suites to programmatically audit draft prompts for instruction clarity, steerability, and edge-case handling before deployment.

```text
Role: You are a Principal AI Architect auditing system prompts for production deployment.

Task: Review the provided `[PROMPT TO REVIEW]` for instruction clarity, steerability, and edge-case handling.

Audit Output Requirements:
1. Quality Score (1–10): Provide a score with a concise, one-sentence rationale.
2. Structural Strengths: Bullet 2 core strengths of the draft prompt.
3. Critical Vulnerabilities: Highlight ambiguous phrasing, missing negative constraints, or parsing risks.
4. Optimized Prompt: Rewrite the prompt using explicit structural tags (<instructions>, <constraints>), bulleted steps, and strict formatting rules.

[PROMPT TO REVIEW]:
*[Insert draft prompt text here]*
```

---

## 3. Best Practices for Reviewing Prompts

*   **Audit the Negative Space**: Check whether the prompt states what *not* to do. Unbounded prompts default to conversational fluff, repetitive preambles, or unasked-for summaries. Enforce clear negative boundaries.
*   **Enforce Structural Delimiters**: Ensure complex inputs use XML-style tags (`<instructions>`, `<constraints>`) or clear section breaks so the model distinctly separates instructions from user data, preventing prompt injection attacks.
*   **Test with Bad Inputs**: Deliberately feed the prompt truncated data, contradictory details, or off-topic inputs to verify it degrades gracefully instead of hallucinating.
*   **Remove Vague Qualifiers**: Scrub ambiguous adjectives like "in-depth" or "comprehensive." Replace them with concrete constraints (e.g., *"Provide exactly 3 bullet points, each under 20 words"*).
