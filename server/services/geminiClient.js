const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleGenAI } = require('@google/genai');

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY not set');
}

/* =========================
   1. Chat
========================= */
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function chat(prompt) {
    const result = await chatModel.generateContentStream(prompt);
    let text = '';
    for await (const chunk of result.stream) {
        text += chunk.text();
    }
    return text;
}

/* =========================
   2. URL Summary
========================= */
const interactionsClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function summarizeURL(url, messages = []) {
    const prompt = `
Website: ${url}

Conversation so far:
${messages.join('\n')}

Answer the latest question clearly and concisely.
`;

    const interaction = await interactionsClient.interactions.create({
        model: 'gemini-2.5-flash',
        input: prompt,
        tools: [{ type: 'url_context' }]
    });

    const textOutput = interaction.outputs.find(o => o.type === 'text');
    return textOutput?.text || 'No summary generated.';
}

/* =========================
   3. PDF Summary
========================= */
async function summarizePDF(filePath, messages = []) {
    const base64Pdf = fs.readFileSync(filePath, { encoding: 'base64' });

    const inputMessages = [
        {
            type: 'text',
            text: `Conversation so far:\n${messages.join('\n')}\nAnswer the latest question about this PDF in 5 concise bullet points. Do not use markdown.`
        },
        {
            type: 'document',
            data: base64Pdf,
            mime_type: 'application/pdf'
        }
    ];

    const result = await interactionsClient.interactions.create({
        model: 'gemini-2.5-flash',
        input: inputMessages
    });

    const textOutput = result.outputs.find(o => o.type === 'text');
    return textOutput?.text || 'No summary generated.';
}

module.exports = {
    chat,
    summarizeURL,
    summarizePDF
};
