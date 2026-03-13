require('dotenv').config();
const express  = require('express');
const multer   = require('multer');
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const DEV  = process.env.NODE_ENV !== 'production';

const UPLOADS_DIR  = process.env.NODE_ENV === 'production' 
  ? '/app/uploads' 
  : path.join(__dirname, 'uploads');
const FRONTEND_DIR = path.join(__dirname, 'frontend', 'dist');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── CORS MIDDLEWARE ──────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── DATABASE ──────────────────────────────────────
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/app/uploads/memories.db'
  : path.join(__dirname, 'memories.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS album_slots (
    slot_key   TEXT     PRIMARY KEY,
    photo_name TEXT,
    caption    TEXT     DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS diary_pages (
    page_id    TEXT     PRIMARY KEY,
    body       TEXT     DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS letter_content (
    id        INTEGER PRIMARY KEY CHECK (id = 1),
    name      TEXT    DEFAULT '',
    body      TEXT    DEFAULT '',
    last_edit TEXT    DEFAULT ''
  );
  INSERT OR IGNORE INTO letter_content (id,name,body,last_edit) VALUES (1,'','','');
`);

const Q = {
  albumAll:    db.prepare('SELECT * FROM album_slots ORDER BY slot_key'),
  albumOne:    db.prepare('SELECT * FROM album_slots WHERE slot_key = ?'),
  albumUpsert: db.prepare(`INSERT INTO album_slots (slot_key,photo_name,caption,updated_at)
    VALUES(?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(slot_key) DO UPDATE SET photo_name=excluded.photo_name,caption=excluded.caption,updated_at=CURRENT_TIMESTAMP`),
  albumCaption:db.prepare(`UPDATE album_slots SET caption=?,updated_at=CURRENT_TIMESTAMP WHERE slot_key=?`),
  albumDel:    db.prepare('DELETE FROM album_slots WHERE slot_key = ?'),
  diaryGet:    db.prepare('SELECT body FROM diary_pages WHERE page_id = ?'),
  diarySet:    db.prepare(`INSERT INTO diary_pages(page_id,body,updated_at) VALUES(?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(page_id) DO UPDATE SET body=excluded.body,updated_at=CURRENT_TIMESTAMP`),
  letterGet:   db.prepare('SELECT * FROM letter_content WHERE id=1'),
  letterSet:   db.prepare('UPDATE letter_content SET name=?,body=?,last_edit=? WHERE id=1'),
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_,__,cb) => cb(null, UPLOADS_DIR),
    filename:    (_,file,cb) => {
      const uid = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      cb(null, uid + (path.extname(file.originalname).toLowerCase() || '.jpg'));
    },
  }),
  limits: { fileSize: 20*1024*1024 },
  fileFilter: (_,file,cb) => cb(null, /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)),
});

app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
if (!DEV && fs.existsSync(FRONTEND_DIR)) app.use(express.static(FRONTEND_DIR));

// CONFIG
app.get('/api/config', (_,res) => res.json({
  recipient:   process.env.RECIPIENT    || 'My Love',
  age:         parseInt(process.env.AGE)|| 19,
  sender:      process.env.SENDER       || '',
  accentColor: process.env.ACCENT_COLOR || '#e89ab3',
  musicUrl:    process.env.MUSIC_URL    || null,
}));

// ALBUM SLOTS
app.get('/api/album', (_,res) => res.json(Q.albumAll.all()));

app.post('/api/album/:key', upload.single('photo'), (req,res) => {
  const { key } = req.params;
  const caption = (req.body.caption||'').trim().slice(0,120);
  const photoName = req.file?.filename ?? null;
  // remove old photo
  const old = Q.albumOne.get(key);
  if (old?.photo_name && photoName) {
    const fp = path.join(UPLOADS_DIR, old.photo_name);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  Q.albumUpsert.run(key, photoName ?? old?.photo_name ?? null, caption || old?.caption || '');
  res.json({ ok:true, photoName: photoName ?? old?.photo_name });
});

app.put('/api/album/:key/caption', (req,res) => {
  const slot = Q.albumOne.get(req.params.key);
  if (!slot) return res.status(404).json({ error:'Not found' });
  Q.albumCaption.run((req.body.caption||'').trim().slice(0,120), req.params.key);
  res.json({ ok:true });
});

app.delete('/api/album/:key', (req,res) => {
  const slot = Q.albumOne.get(req.params.key);
  if (slot?.photo_name) {
    const fp = path.join(UPLOADS_DIR, slot.photo_name);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  Q.albumDel.run(req.params.key);
  res.json({ ok:true });
});

// DIARY
app.get('/api/diary/:pid',  (req,res) => res.json({ body: Q.diaryGet.get(req.params.pid)?.body || '' }));
app.post('/api/diary/:pid', (req,res) => { Q.diarySet.run(req.params.pid,(req.body.body||'').slice(0,4000)); res.json({ok:true}); });

// LETTER — once-per-day edit lock
app.get('/api/letter', (_,res) => {
  const row   = Q.letterGet.get();
  const today = new Date().toISOString().slice(0,10);
  const canEdit = row.last_edit !== today;
  let nextEditISO = null;
  if (!canEdit) {
    const t = new Date(); t.setDate(t.getDate()+1); t.setHours(0,0,0,0);
    nextEditISO = t.toISOString();
  }
  res.json({ name:row.name, body:row.body, canEdit, nextEditISO });
});

app.post('/api/letter', (req,res) => {
  const today = new Date().toISOString().slice(0,10);
  const row   = Q.letterGet.get();
  if (row.last_edit === today) {
    const t = new Date(); t.setDate(t.getDate()+1); t.setHours(0,0,0,0);
    return res.status(403).json({ error:'Already edited today', nextEditISO:t.toISOString() });
  }
  Q.letterSet.run((req.body.name||'').trim().slice(0,100),(req.body.body||'').trim().slice(0,5000),today);
  res.json({ ok:true });
});

// SPA fallback
app.get('*',(_,res) => {
  const spa = path.join(FRONTEND_DIR,'index.html');
  if (fs.existsSync(spa)) return res.sendFile(spa);
  res.status(404).send(DEV?'cd frontend && npm run dev':'npm run build');
});

app.listen(PORT, ()=>console.log(`\n🎂  Scrapbook → http://localhost:${PORT}\n`));
