const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname);
const DATA_FILE = path.join(ROOT, 'assets', 'data', 'seed-products.json');
const SITE_FILE = path.join(ROOT, 'assets', 'data', 'site.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(ROOT));

app.get('/api/products', async (req, res) => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const body = req.body;
    if (!Array.isArray(body)) return res.status(400).json({ error: 'Expected array' });
    await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
    res.json({ ok: true, items: body.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Site info (contact, reviews, location, hours, etc.)
app.get('/api/site', async (req, res) => {
  try {
    // if site file missing, create a default
    try { await fs.access(SITE_FILE); } catch (_) {
      const defaultSite = { contact: { phone: '+8801XXXXXXXXX', whatsapp: '8801XXXXXXXXX', email: 'yourmail@gmail.com', address: 'Dhaka, Bangladesh', hours: 'Mon–Sat 9:00–18:00' }, reviews: [] };
      await fs.writeFile(SITE_FILE, JSON.stringify(defaultSite, null, 2), 'utf8');
    }
    const raw = await fs.readFile(SITE_FILE, 'utf8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/site', async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Expected object' });
    await fs.writeFile(SITE_FILE, JSON.stringify(body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
  console.log(`Static server + API running on http://localhost:${PORT}`);
});
