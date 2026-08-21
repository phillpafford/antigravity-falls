// brevity-check.js
// Custom Promptfoo Javascript assertion to enforce the strict 3-line token hygiene rule.

module.exports = function(output, context) {
    // 1. Strict Type Guard: Ensure output is a valid string before parsing
    if (typeof output !== 'string') {
        return {
            pass: false,
            score: 0.0,
            reason: `❌ BREVITY ERROR: Expected LLM output to be a valid string, got: ${typeof output}`
        };
    }

    // 2. Remove markdown code blocks (which contain the strict JSON deliverables or code diffs)
    const textWithoutCodeBlocks = output.replace(/```[\s\S]*?```/g, '').trim();

    // 2. Split into individual lines
    const lines = textWithoutCodeBlocks.split(/\r?\n/);

    // 3. Filter out empty lines, standard line separators (---), or whitespace-only lines
    const cleanLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && trimmed !== '---' && trimmed !== '***';
    });

    const maxAllowedLines = 3;

    if (cleanLines.length <= maxAllowedLines) {
        return {
            pass: true,
            score: 1.0,
            reason: `Passed token hygiene! Output contains only ${cleanLines.length} lines of text (excluding code blocks).`
        };
    } else {
        return {
            pass: false,
            score: 0.0,
            reason: `❌ BREVITY VIOLATION: Output has ${cleanLines.length} conversational lines (Max allowed is ${maxAllowedLines} lines).` +
                    `\nOffending lines:\n${cleanLines.map((l, i) => `${i + 1}: ${l}`).join('\n')}`
        };
    }
};
