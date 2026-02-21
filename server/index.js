require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');

const { chat, summarizeURL, summarizePDF } = require('./services/geminiClient');

const PORT = process.env.PORT || 8080;
const app = express();
const upload = multer({ dest: '/tmp' });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/_alive', (req, res) => res.json({ ok: true }));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message required' });

    try {
        const reply = await chat(message);
        res.json({ reply });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'Model request failed' });
    }
});

// URL summary endpoint
app.post('/api/summarize-url', async (req, res) => {
    const { url, messages = [] } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        const summary = await summarizeURL(url, messages);
        res.json({ summary });
    } catch (err) {
        console.error('URL summary error:', err);
        res.status(500).json({ error: 'Failed to summarize URL' });
    }
});

// PDF summary endpoint
app.post('/api/summarize-pdf', upload.single('pdf'), async (req, res) => {
    const messages = JSON.parse(req.body.messages || '[]');

    if (!req.file) return res.status(400).json({ error: 'PDF required' });

    try {
        const summary = await summarizePDF(req.file.path, messages);
        res.json({ summary });
    } catch (err) {
        console.error('PDF summary error:', err);
        res.status(500).json({ error: 'Failed to analyze PDF' });
    }
});

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});