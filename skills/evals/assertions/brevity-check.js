// brevity-check.js
// Custom Promptfoo Javascript assertion to enforce the strict 3-line token hygiene rule.

module.exports = function(output, context) {
    // 1. Remove markdown code blocks (which contain the strict JSON deliverables or code diffs)
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
            reason: `Passed token hygiene! Output contains only ${cleanLines.length} lines of text (excluding code blocks).`
        };
    } else {
        return {
            pass: false,
            reason: `❌ BREVITY VIOLATION: Output has ${cleanLines.length} conversational lines (Max allowed is ${maxAllowedLines} lines).` +
                    `\nOffending lines:\n${cleanLines.map((l, i) => `${i + 1}: ${l}`).join('\n')}`
        };
    }
};
