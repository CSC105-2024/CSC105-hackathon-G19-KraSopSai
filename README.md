# CSC105-hackathon-G19-KraSopSai

A web app for venting frustration: register a Victim (HP, reason), throw hits at them in the boxing ring, watch their HP drop, hold a funeral, or forgive them.

## Tech stack

**Frontend** — React 19, Vite 6, Tailwind v4, react-router v7, react-hook-form, zod, axios.

**Backend** — Hono, Prisma 6 (MySQL), JWT auth (HS256), bcrypt password hashing.

## Prerequisites

- Node.js 20+
- pnpm 10+ (`npm install -g pnpm`)
- MySQL 8 (native install, Docker, or cloud provider)

## Setup

### 1. Clone

```powershell
git clone https://github.com/CSC105-2024/CSC105-hackathon-G19-KraSopSai.git
cd CSC105-hackathon-G19-KraSopSai
```

### 2. Provision MySQL

Pick one:

**Docker (recommended):**
```powershell
docker run -d --name krasopsai-mysql -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD=rootpass `
  -e MYSQL_DATABASE=krasopsai `
  mysql:8
docker exec -it krasopsai-mysql mysql -uroot -prootpass `
  -e "CREATE DATABASE krasopsai_shadow;"
```

**Native install:** install MySQL 8, then in MySQL Workbench or `mysql` CLI:
```sql
CREATE DATABASE krasopsai;
CREATE DATABASE krasopsai_shadow;
```

**Cloud:** PlanetScale / Railway / Aiven free tier. Note: PlanetScale doesn't allow shadow DB — use `pnpm prisma db push` instead of `migrate deploy`.

### 3. Configure environment variables

```powershell
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill `backend/.env`:
- `DATABASE_URL` — `mysql://USER:PASS@localhost:3306/krasopsai` (URL-encode special chars in password)
- `SHADOW_DATABASE_URL` — same, with `krasopsai_shadow`
- `JWT_SECRET` — generate with:
  ```powershell
  -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})
  ```

`frontend/.env` ships sensible defaults — usually no edits needed.

### 4. Backend

```powershell
cd backend
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm dev
```

Backend listens on `http://localhost:3000`.

### 5. Frontend (in a new terminal)

```powershell
cd frontend
pnpm install
pnpm dev
```

Frontend listens on `http://localhost:5173`.

## Smoke test

1. Open `http://localhost:5173`.
2. Register a user → expect redirect to home.
3. Log out → log back in.
4. Add a Victim (name + reason + starting HP).
5. Open BoxingRing → click to hit → HP decreases.
6. When HP reaches 0 → funeral popup.
7. Forgive flow removes a Victim.

## Project structure

```
.
├── backend/
│   ├── prisma/             # schema + migrations
│   ├── src/
│   │   ├── controllers/    # request handlers
│   │   ├── middlewares/    # auth (JWT)
│   │   ├── models/         # Prisma queries
│   │   ├── routes/         # Hono route definitions
│   │   ├── types/          # shared TS types
│   │   ├── utils/          # helpers
│   │   └── index.ts        # server entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/            # axios service wrappers
    │   ├── components/     # reusable UI
    │   ├── pages/          # routed pages
    │   ├── utils/          # axios instance, auth guard
    │   └── main.jsx        # Vite entrypoint
    └── package.json
```

## Troubleshooting

- **`pnpm` not found** → `npm install -g pnpm`
- **Prisma `P1001` (cannot reach DB)** → MySQL service not running. Start it (Services.msc → `MySQL80`), or `docker start krasopsai-mysql`.
- **Prisma `P1000` (auth failed)** → wrong password in `DATABASE_URL`, or special characters not URL-encoded (`@` → `%40`, `:` → `%3A`, etc.).
- **`bcrypt` native build fails on Windows** → install Visual Studio Build Tools, or replace `bcrypt` with `bcryptjs` (pure-JS fallback).
- **CORS error in browser** → frontend dev URL not in `backend/src/index.ts` CORS allowlist (currently `localhost:3000` and `localhost:5173`).
