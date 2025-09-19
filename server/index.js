require('dotenv').config();
const express = require('express');
const path = require('path');
const { generateText } = require('./geminiClient');


const PORT = process.env.PORT || 8080;
const app = express();


app.use(express.json());
// serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));


// health check
app.get('/_alive', (req, res) => res.json({ ok: true }));


// POST /api/chat
// body: { message: string }
app.post('/api/chat', async (req, res) => {
const { message } = req.body || {};
if (!message || typeof message !== 'string') {
return res.status(400).json({ error: 'message must be a non-empty string' });
}


try {
const reply = await generateText(message);
res.json({ reply });
} catch (err) {
console.error('Error calling model:', err);
res.status(500).json({ error: 'Model request failed', detail: err.message });
}
});


// fallback to index.html for SPA
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
});