import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error('❌ GROQ_API_KEY is not set in .env.local');
}

const groq = new Groq({
    apiKey: apiKey || '',
});

/**
 * Extract JSON from text that might contain markdown or other formatting
 */
function extractJSON(text: string): any {
    // Remove markdown code blocks
    let cleaned = text.trim();

    // Remove ```json and ``` markers
    cleaned = cleaned.replace(/```json\s*/g, '');
    cleaned = cleaned.replace(/```\s*/g, '');

    // Remove any text before first { or [
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');

    let startIndex = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
        startIndex = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
        startIndex = firstBrace;
    } else if (firstBracket !== -1) {
        startIndex = firstBracket;
    }

    if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
    }

    // Remove any text after last } or ]
    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');

    let endIndex = -1;
    if (lastBrace !== -1 && lastBracket !== -1) {
        endIndex = Math.max(lastBrace, lastBracket);
    } else if (lastBrace !== -1) {
        endIndex = lastBrace;
    } else if (lastBracket !== -1) {
        endIndex = lastBracket;
    }

    if (endIndex !== -1) {
        cleaned = cleaned.substring(0, endIndex + 1);
    }

    // Try to parse
    return JSON.parse(cleaned);
}

export async function callAI(prompt: string, maxTokens: number = 8192): Promise<any> {
    if (!apiKey) {
        throw new Error('Groq API key is not configured. Please add GROQ_API_KEY to your .env.local file.');
    }

    try {
        console.log('Calling Groq API...');

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that ONLY returns valid JSON. 

CRITICAL RULES:
1. Return ONLY the JSON object or array - nothing else
2. NO markdown formatting (no \`\`\`json)
3. NO explanatory text before or after the JSON
4. NO comments in the JSON
5. Make sure all strings use double quotes (")
6. Make sure all numbers are actual numbers, not strings

Example of correct response:
{"name": "John", "age": 30}

Example of WRONG response:
Here's the JSON:
\`\`\`json
{"name": "John", "age": 30}
\`\`\`

Just return the JSON itself!`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5, // Lower temperature for more consistent JSON
            max_tokens: maxTokens,
        });

        console.log('✅ Groq response received');

        let text = completion.choices[0].message.content || '{}';
        console.log('Raw response preview:', text.substring(0, 200));

        // Extract and parse JSON
        const result = extractJSON(text);
        console.log('✅ Successfully parsed JSON');

        return result;

    } catch (error: any) {
        console.error('Groq API Error:', error);

        // Log the actual response if JSON parsing failed
        if (error instanceof SyntaxError) {
            console.error('JSON Parse Error. This usually means the AI did not return valid JSON.');
            console.error('Please check the prompts are clear about returning JSON only.');
            throw new Error('AI returned invalid JSON format. Please try again.');
        }

        if (error.message?.includes('API key') || error.message?.includes('Unauthorized')) {
            throw new Error('Invalid Groq API key. Please check your key at https://console.groq.com/');
        }

        if (error.message?.includes('rate limit')) {
            throw new Error('Rate limit reached. Please wait a moment and try again.');
        }

        throw new Error(`AI processing failed: ${error.message}`);
    }
}

export function validateAPIKey(): boolean {
    return !!apiKey && apiKey.length > 20;
}