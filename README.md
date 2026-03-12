# 🎂 Birthday Scrapbook — Full Setup & Deployment Guide

A romantic, scroll-driven birthday scrapbook website with a React frontend (based on your Figma template) and a persistent memory album backend.

---

## 📁 Project Structure

```
birthday-scrapbook/
├── server.js              ← Express backend (API + file serving)
├── package.json           ← Root scripts
├── .env                   ← YOUR personalisation (copy from .env.example)
├── .env.example           ← Template
├── .gitignore
├── railway.toml           ← Ready for Railway deployment
├── Procfile               ← Ready for Render/Heroku
├── README.md
│
├── frontend/              ← React app (your Figma template, fully built out)
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx              ← Root component
│   │   │   ├── config.ts            ← Site config + API fetch
│   │   │   ├── hooks/
│   │   │   │   ├── useScroll.ts     ← Scroll progress engine
│   │   │   │   └── useTypewriter.ts ← Typewriter effect
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.tsx         ← Hero with floating polaroids
│   │   │   │   ├── BookSection.tsx         ← Real 3D book flip
│   │   │   │   ├── MemoryWallSection.tsx   ← Upload + gallery (connects to backend)
│   │   │   │   ├── LetterSection.tsx       ← Typewriter love letter
│   │   │   │   ├── CakeCandleSection.tsx   ← Scroll-driven "1" and "9" candles
│   │   │   │   └── FinalSection.tsx        ← Final message
│   │   │   └── components/
│   │   │       ├── PolaroidCard.tsx
│   │   │       ├── FloatingPolaroid.tsx
│   │   │       ├── HeartParticle.tsx
│   │   │       ├── CTAButton.tsx
│   │   │       └── TapeDecoration.tsx
│   │   └── styles/
│   ├── index.html
│   ├── vite.config.ts     ← Proxies /api and /uploads to backend
│   └── package.json
│
├── uploads/               ← Auto-created — stores memory photos
└── memories.db            ← Auto-created — SQLite database
```

---

## ⚡ QUICK START (3 commands)

### Step 1 — Install Node.js
Download from **https://nodejs.org** → LTS version.

### Step 2 — Setup

```bash
cd birthday-scrapbook

# Install backend dependencies
npm install

# Install frontend dependencies + build it
npm run build

# Copy and fill in your config
cp .env.example .env
```

Open `.env` and personalise:
```env
RECIPIENT=Sofia
AGE=19
SENDER=Marco
ADMIN_KEY=your-secret-key
PORT=3000
```

### Step 3 — Run

```bash
npm start
```

Visit **http://localhost:3000** ✨

---

## 🔧 DEVELOPMENT MODE (Live reload)

Run backend and frontend simultaneously in two terminals:

**Terminal 1 (backend):**
```bash
npm start
```

**Terminal 2 (frontend with hot reload):**
```bash
cd frontend
npm run dev
```

Then visit **http://localhost:5173** — Vite proxies `/api` calls to your backend on port 3000.

---

## 🌐 DEPLOYING TO THE INTERNET

### Option A — Railway (Easiest, recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Birthday scrapbook"
# Create repo on github.com, then:
git remote add origin https://github.com/YOU/birthday-scrapbook.git
git push -u origin main
```

2. **Deploy:**
   - Go to **https://railway.app** → Sign in with GitHub
   - New Project → Deploy from GitHub repo → select your repo
   - Railway detects Node.js automatically

3. **Add environment variables** in Railway dashboard → Variables:
```
RECIPIENT   = Sofia
AGE         = 19
SENDER      = Marco
ADMIN_KEY   = your-secret-key
PORT        = 3000
NODE_ENV    = production
```

4. **Set build command** in Railway → Settings → Build:
   ```
   npm run build && npm install
   ```

5. **Generate domain** → Settings → Domains → Generate Domain

6. Share the URL 🎉

> **Photos persisting:** Add a Railway Volume mounted at `/app/uploads` so photos survive redeploys.

---

### Option B — Render (Free, sleeps when idle)

1. Push to GitHub (same as above)
2. **https://render.com** → New → Web Service → connect repo
3. Settings:
   - **Build Command:** `npm run build && npm install`
   - **Start Command:** `npm start`
4. Add environment variables
5. Deploy

> Free tier sleeps after 15 min inactivity. First load = ~30s wake time.

---

### Option C — VPS (DigitalOcean/Hetzner, ~$5/month)

```bash
# On your server:
git clone https://github.com/YOU/birthday-scrapbook.git
cd birthday-scrapbook
cp .env.example .env && nano .env
npm run build
npm install

# Install PM2
sudo npm i -g pm2
pm2 start server.js --name scrapbook
pm2 save && pm2 startup
```

Nginx config (optional, for custom domain + HTTPS):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    client_max_body_size 20M;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 🛠️ EDITING IN KIRO IDE

### Open the project
1. Install Kiro from **https://kiro.dev**
2. `File → Open Folder` → select `birthday-scrapbook/`
3. Press `Ctrl+L` to open the AI panel

### Key files to edit

| What you want to change | File |
|------------------------|------|
| Names, age, colors     | `.env` |
| Hero text, subtitle    | `frontend/src/app/sections/HeroSection.tsx` |
| Album page content     | `frontend/src/app/sections/BookSection.tsx` → `buildPages()` |
| Love letter text       | `frontend/src/app/config.ts` → `LETTER` constant |
| Color palette          | `frontend/src/styles/theme.css` → `:root { --blush-pink, --soft-rose... }` |
| Fonts                  | `frontend/index.html` → Google Fonts link |
| Candle animation       | `frontend/src/app/sections/CakeCandleSection.tsx` |
| Memory wall            | `frontend/src/app/sections/MemoryWallSection.tsx` |

### Kiro AI prompts that work well
- *"Change the color palette to deep burgundy and champagne gold"*
- *"Add a new album page called 'Places We've Been' with a grid of 4 photos"*
- *"Make the hero title larger on mobile"*
- *"Add a confetti burst when the cake candles light up"*

### After any frontend change, rebuild:
```bash
npm run build
```

Or in dev mode, Vite auto-reloads at `localhost:5173`.

---

## 🔑 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/config` | Site config from `.env` |
| `GET` | `/api/memories` | All memories, newest first |
| `POST` | `/api/memories` | Add a memory (multipart/form-data) |
| `DELETE` | `/api/memories/:id` | Delete (requires `x-admin-key` header) |

**Delete a memory on the site:** Shift+click any memory card → enter your admin key.

---

## 🗄️ Backing Up Memories

Your memories live in two places:
```bash
cp memories.db  memories-backup.db       # database
cp -r uploads/  uploads-backup/          # photos
```

That's it — restore by copying them back.

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module` | Run `npm install` then `cd frontend && npm install` |
| White page at localhost:3000 | Run `npm run build` first, or use dev mode |
| Photos not showing after deploy | Add a Railway Volume at `/app/uploads` |
| Port already in use | Change `PORT=3001` in `.env` |
