# XE Challenge – Full Stack (Vite + Express + PostgreSQL)

Monorepo structure:

xe-challenge/
apps/
web/ # React (Vite)
api/ # Node (Express)
packages/
shared/ # shared DTOs / Zod schemas
docker-compose.yml
README.md



## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- DB: PostgreSQL (Docker)
- Validation: Zod (shared contracts)
- HTTP: fetch/axios on frontend, axios on backend (for upstream areas autocomplete)

---

## Prerequisites

### Required
- **Node.js 18+** (recommended: latest LTS)
- **Docker Desktop** (Windows/Mac) or **Docker Engine + Docker Compose** (Linux)
- **Git**

### Optional (nice to have)
- `psql` client (to inspect database locally)
- VS Code

---

## Getting the project (clone)

### Linux / macOS
```bash
git clone https://github.com/<YOUR_USERNAME>/xe-challenge.git
cd xe-challenge
```

### Windows (PowerShell)
```bash
git clone https://github.com/<YOUR_USERNAME>/xe-challenge.git
cd xe-challenge
```

## Install dependencies 

From the repository root:

```bash
npm install
```

## Backend env :
apps/api/.env

## Run the database (PostgreSQL in Docker)
From the repository root:

```bash
docker compose up -d
```

## Check containers:

```bash
docker ps
```

## Run DB migrations

### From the repository root:

```bash
cd apps/api
npm run db:migrate
```

## Run backend (Express API)
- Open a terminal:

cd apps/api
```bash
npm run dev
```

### Health check:
curl http://localhost:4000/health


## Run frontend 

### Open a second terminal:

cd apps/web

```bash
npm run dev
```


### Open:

Frontend: http://localhost:5173

### How to test the app manually (smoke test)

Open http://localhost:5173

In Area field type at least 3 characters → should load suggestions/

Select a suggestion (stores placeId)/

Fill the form and submit → backend persists the ad in Postgres/

(Optional) If a details page exists, it loads the ad by id./


## Verify DB insert manually 

## Enter psql inside the docker container:

```bash
docker exec -it xe_pg psql -U xe -d xe_challenge
```

## List rows:
```bash
SELECT id, title, type, area_place_id, area_label, price, created_at FROM ads ORDER BY id DESC;
```
