const dotenv = require('dotenv');
const path = require('path');

// Load .env from parent folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not set. Set it in your .env.');
}

async function generateText(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let genText = '';

    // Streaming call — append each chunk to genText
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      genText += chunk.text();
    }

    return genText;
  } catch (err) {
    console.error('Error calling Gemini SDK:', err);
    throw err;
  }
}

module.exports = { generateText };
