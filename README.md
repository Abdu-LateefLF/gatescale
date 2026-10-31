# Gate Scale (FinQL)

A full-stack application for running financial queries, managing API keys, and tracking usage. Admins also get platform-wide metrics.

Live app: [https://gatescale.onrender.com/](https://gatescale.onrender.com/)

## Stack

- **Backend**: Node.js + Express + TypeScript, Drizzle ORM, PostgreSQL 15, Redis 7
- **Frontend**: React + Vite + TypeScript, Material UI, Recharts
- **Infra**: Docker Compose, Nginx (reverse proxy)

## Deployment

Self-hosted deployment with Nginx, multiple backend replicas, Redis, and full infra control

### Flowchart

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

## DSL

FinQL is a lightweight, line-based DSL for mathematical computation. Scripts run sequentially and are stateless per request.

### Quick Example

```sql
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

### Testing

Run backend tests

```bash
cd backend
npm run test
```

### Running the application

```bash
docker compose up --build -d --scale api=2
```

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

### Seed Default Admin User

The seed runs automatically on container startup. It is idempotent.

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

## User Roles

| Role    | Dashboard Access                              |
| ------- | --------------------------------------------- |
| `user`  | API Keys, Playground, Metrics (own keys only) |
| `admin` | All user features plus platform-wide metrics  |

Admin users are created by the seed script or by setting `role = 'admin'` in the database.
