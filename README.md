# Gate Scale (FinQL)

A full-stack API gateway for running financial queries, managing API keys, and tracking usage. Admins also get platform-wide metrics.

Live app: [https://gatescale.onrender.com/](https://gatescale.onrender.com/)

## Stack

- **Backend**: Node.js + Express + TypeScript, Drizzle ORM, PostgreSQL 15, Redis 7
- **Frontend**: React + Vite + TypeScript, Material UI, Recharts
- **Infra**: Docker Compose, Nginx (production reverse proxy)

## Deployment Modes

This repo supports two deployment styles:

- **Local development** with Docker Compose and hot reload
- **Self-hosted production-style** deployment with Nginx, multiple backend replicas, self-hosted Redis, and full infra control

The public app at [https://gatescale.onrender.com/](https://gatescale.onrender.com/) is deployed differently for cost reasons:

- **Frontend + backend**: Render
- **Redis**: Upstack
- **PostgreSQL**: Supabase

### Self-Hosted Production Infra

```mermaid
flowchart LR
    U[User / Browser]

    subgraph GS[Gate Scale Production Stack]
        N[Nginx]
        F[Frontend Static Assets]
        A1[Backend API Replica 1]
        A2[Backend API Replica 2]
        R[(Redis)]
        P[(PostgreSQL)]
    end

    U --> N
    N --> F
    N --> A1
    N --> A2
    A1 --> R
    A2 --> R
    A1 --> P
    A2 --> P
```



---

## FinQL

FinQL is a lightweight, line-based DSL for financial computation. Scripts run sequentially and are stateless per request.

### Quick Example

```finql
SET income = 6000
SET expenses = 4500
SET rate = 0.05
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
SCORE stability USING surplus, income
FORECAST growth USING surplus, rate FOR 3 YEARS
ASSERT surplus > 0
OUTPUT surplus, savingsRate, health, stability, growth
```

```json
{
    "results": {
        "surplus": 1500,
        "savingsRate": 0.25,
        "health": "Strong",
        "stability": 25,
        "growth": 1736.44
    },
    "executionTimeMs": 14
}
```

### Commands


| Command     | Syntax                                            | Description                                                       |
| ----------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `SET`       | `SET name = literal`                              | Assign a number, boolean, or quoted string                        |
| `CALCULATE` | `CALCULATE name = expression`                     | Evaluate a math expression (see below)                            |
| `ANALYZE`   | `ANALYZE name USING a, b`                         | Rule-based label: **Strong / Stable / At Risk** from savings rate |
| `FORECAST`  | `FORECAST name USING principal, rate FOR n YEARS` | Compound growth: `principal × (1 + rate)^n`, rounded to 2 dp      |
| `SCORE`     | `SCORE name USING a, b`                           | Score 0–100: `(a / b) × 100`, clamped                             |
| `ASSERT`    | `ASSERT expr op expr`                             | Halt with error if condition is false                             |
| `OUTPUT`    | `OUTPUT a, b, …`                                  | Return variables and end execution (must be last, exactly once)   |


### Expressions

`CALCULATE` and `ASSERT` use [mathjs](https://mathjs.org) for evaluation.

**Operators:** `+` `-` `*` `/` `^` `( )`

**Functions:** `sqrt` · `abs` · `round(x, n)` · `floor` · `ceil` · `log` · `log10` · `log2` · `exp` · `pow` · `min` · `max` · `mod` · `sign`

**Constants:** `pi` · `e`

### API

```
POST /api/run
x-api-key: YOUR_API_KEY
Content-Type: application/json

{ "query": "SET income = 6000\nOUTPUT income" }
```

**Success (200)**

```json
{ "results": { "income": 6000 }, "executionTimeMs": 5 }
```

**Errors (400)** — all include `error` and `line` fields:

- Parse error: unknown command or bad syntax
- Undefined variable
- Division by zero
- Assertion failed: `surplus > 0`

---

## Getting Started

You can run Gate Scale either in hot-reload development mode or in a production-style local stack.

### Development

Start all services with hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```


| Service    | URL                                            |
| ---------- | ---------------------------------------------- |
| API        | [http://localhost:9000](http://localhost:9000) |
| Frontend   | [http://localhost:5173](http://localhost:5173) |
| PostgreSQL | localhost:6000                                 |
| Redis      | localhost:6379                                 |


### Production-Style Local Stack

```bash
docker compose up --build -d --scale api=2
```

This mode mirrors a more production-like setup:

- Nginx serves the built frontend and proxies `/api/*` requests to the backend upstream
- Two backend containers run behind Nginx upstreams
- PostgreSQL and Redis are self-hosted inside the Compose stack
- You keep full control over the infrastructure and networking


| Service       | URL / Access                                   |
| ------------- | ---------------------------------------------- |
| App via Nginx | [http://localhost](http://localhost)           |
| API via Nginx | [http://localhost/api/](http://localhost/api/) |
| PostgreSQL    | localhost:6000                                 |
| Redis         | internal Compose only                          |


### Stop Services

```bash
# Development
docker compose -f docker-compose.dev.yml down

# Production
docker compose down
```

---

## Database

### Run Migrations

```bash
# Inside the running api container
docker compose -f docker-compose.dev.yml exec api npm run db:migrate

# Or locally
cd backend && npm run db:migrate
```

### Generate Migrations

After modifying schema files in `backend/src/db/schemas/`:

```bash
docker compose -f docker-compose.dev.yml exec api npm run db:generate

# Or locally
cd backend && npm run db:generate
```

### Seed Default Admin User

The seed runs automatically on container startup. It is idempotent, so existing admin users are left unchanged.

To run it manually:

```bash
# Inside the running api container
docker compose -f docker-compose.dev.yml exec api npm run db:seed

# Or locally
cd backend && npm run db:seed
```

Default credentials:


| Variable         | Default           |
| ---------------- | ----------------- |
| `ADMIN_EMAIL`    | `admin@finql.dev` |
| `ADMIN_PASSWORD` | `Admin@123!`      |
| `ADMIN_NAME`     | `Admin`           |


> **Change the default password** before deploying to any shared environment.

---

## Environment Variables

All environment variables are defined in the root `.env` file.

```bash
cp .env.example .env
```

> **Never commit `.env` to version control.**

### Root `.env` (shared by both compose files)


| Variable              | Description                        | Example                                                |
| --------------------- | ---------------------------------- | ------------------------------------------------------ |
| `NODE_ENV`            | Runtime environment                | `production`                                           |
| `DATABASE_URL`        | PostgreSQL connection string       | `postgres://postgres:password@postgres:5432/gatescale` |
| `REDIS_URL`           | Redis connection string            | `redis://redis:6379`                                   |
| `JWT_SECRET`          | Secret for signing JWTs            | `supersecret`                                          |
| `API_KEY_HMAC_SECRET` | HMAC secret for API key hashing    | `change-me-in-production`                              |
| `CLIENT_URL`          | Allowed CORS origin in development | `http://localhost:5173`                                |
| `POSTGRES_USER`       | PostgreSQL username                | `postgres`                                             |
| `POSTGRES_PASSWORD`   | PostgreSQL password                | `password`                                             |
| `POSTGRES_DB`         | PostgreSQL database name           | `gatescale`                                            |
| `VITE_API_URL`        | Frontend API base URL              | `http://localhost:9000`                                |
| `ADMIN_EMAIL`         | Seed: admin user email             | `admin@finql.dev`                                      |
| `ADMIN_PASSWORD`      | Seed: admin user password          | `Admin@123!`                                           |
| `ADMIN_NAME`          | Seed: admin user display name      | `Admin`                                                |


---

## User Roles


| Role    | Dashboard Access                              |
| ------- | --------------------------------------------- |
| `user`  | API Keys, Playground, Metrics (own keys only) |
| `admin` | All user features plus platform-wide metrics  |


Admin users are created by the seed script or by setting `role = 'admin'` in the database.