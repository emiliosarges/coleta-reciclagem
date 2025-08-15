// server.js
// Back-end simples em Express para servir a API e os arquivos estáticos.
// Dados persistem em data/points.json (arquivo JSON).

const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'points.json');

// Materiais suportados (use isto no front para popular o filtro)
const SUPPORTED_MATERIALS = [
  "Lixo eletrônico",
  "Óleo de cozinha",
  "Vidro",
  "Plástico",
  "Papel",
  "Metal",
  "Orgânico",
  "Baterias/Pilhas",
  "Roupas/Calçados"
];

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org", "https://tile.openstreetmap.org"],
      "script-src": ["'self'", "https://unpkg.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      "connect-src": ["'self'"]
    }
  }
}));
app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Garantir arquivo de dados
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ points: [] }, null, 2), 'utf-8');

// Util: ler/escrever dados
function readDB() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Rotas API
app.get('/api/health', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.get('/api/materials', (req, res) => {
  res.json({ materials: SUPPORTED_MATERIALS });
});

app.get('/api/points', (req, res) => {
  const db = readDB();
  res.json({ points: db.points });
});

// Cadastro de novo ponto
app.post('/api/points', (req, res) => {
  try {
    const { name, address, lat, lng, materials, hours, contact, notes } = req.body || {};

    // Validações simples
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Nome inválido (2-100 caracteres).' });
    }
    if (typeof address !== 'string' || address.trim().length < 5 || address.trim().length > 200) {
      return res.status(400).json({ error: 'Endereço inválido (5-200 caracteres).' });
    }
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return res.status(400).json({ error: 'Coordenadas inválidas.' });
    }
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ error: 'Informe ao menos um material aceito.' });
    }
    // Filtra materiais não suportados, mas permite cadastrar mesmo assim (flexível)
    const cleanMaterials = materials
      .map(m => String(m).trim())
      .filter(m => m.length > 0);

    const safe = (s, max = 300) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

    const point = {
      id: uuidv4(),
      name: safe(name, 100),
      address: safe(address, 200),
      lat: latNum,
      lng: lngNum,
      materials: cleanMaterials,
      hours: safe(hours, 120),
      contact: safe(contact, 120),
      notes: safe(notes, 300),
      createdAt: new Date().toISOString()
    };

    const db = readDB();
    db.points.push(point);
    writeDB(db);

    res.status(201).json({ point });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar ponto.' });
  }
});

// Servir app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
