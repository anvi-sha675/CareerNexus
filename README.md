# CareerNexus — Full Stack

This archive contains both halves of CareerNexus:

```
careernexus-backend/     Node.js + Express + MongoDB API
careernexus-frontend/    React + Vite + Tailwind CSS frontend
```

Each has its own detailed `README.md` — this file just gets both running together as quickly as possible.

## Quick start

**1. Backend**

```bash
cd careernexus-backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI (Atlas or local), JWT_SECRET, JWT_REFRESH_SECRET
npm run seed
npm run dev
```

Runs on `http://localhost:5000`. See `careernexus-backend/README.md` for full setup, seeded login credentials, API reference, and architecture notes.

**2. Frontend**

```bash
cd careernexus-frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Its `.env` already points at `http://localhost:5000/api/v1`, so once the backend is running and seeded, log in with any of the accounts listed in the backend README (all use password `Password123!`).

If you skip the backend entirely, the frontend still works standalone in demo/mock mode — see `careernexus-frontend/README.md`.