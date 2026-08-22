const fs = require('fs');
const path = require('path');

function log(msg) {
    console.error(`[Mabel's Grappling Hook - Payload Reel]: ${msg}`);
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        let payload = {};
        if (input.trim()) {
            payload = JSON.parse(input);
        }

        // Extract the final agent text block (if present)
        const responseText = payload.response || '';

        log(`Scanning final response payload for JSON blocks...`);

        // Regex to match markdown JSON code blocks: ```json <content> ```
        const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
        let match;
        let blocksFound = 0;

        while ((match = jsonBlockRegex.exec(responseText)) !== null) {
            blocksFound++;
            const rawJson = match[1].trim();

            try {
                // Parse the JSON blocks strictly (Candy Chiu AST check!)
                JSON.parse(rawJson);
                log(`✅ Deliverable block #${blocksFound} parsed and validated strictly.`);
            } catch (parseError) {
                log(`❌ SYNTAX ERROR DETECTED: Malformed JSON deliverables output!`);
                
                // Write detailed errors to stderr to feed directly into the self-correction engine
                console.error(`\n========================================`);
                console.error(`CRITICAL SYNTAX EXCEPTION IN DELIVERABLE #${blocksFound}`);
                console.error(`Error Details: ${parseError.message}`);
                console.error(`Offending JSON string:\n${rawJson}`);
                console.error(`========================================`);
                console.error(`\nAction required: Please correct the JSON syntax, escape all inner quotes, remove trailing commas, and output valid JSON.`);
                
                process.exit(2); // Exit 2 triggers the automatic LLM retry turn
            }
        }

        if (blocksFound > 0) {
            log(`✅ All ${blocksFound} deliverable payloads validated successfully. Reeling in!`);
        } else {
            log(`No JSON deliverable blocks detected in this response turn. Releasing hook.`);
        }

        console.log(JSON.stringify(payload));
        process.exit(0);

    } catch (error) {
        console.error(`[Mabel's Grappling Hook - ERROR]: ${error.message}`);
        // Return a safe empty JSON fallback to prevent cascading parser crashes
        console.log('{}');
        process.exit(1);
    }
});
