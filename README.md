# Gate Scale (FinQL)

A full-stack API gateway and analytics platform. Users manage API keys, run financial queries through a playground, and monitor usage metrics. Admins get a platform-wide dashboard with metrics across all users.

## Stack

- **Backend**: Node.js + Express + TypeScript, Drizzle ORM, PostgreSQL 15, Redis 7
- **Frontend**: React + Vite + TypeScript, Material UI, Recharts
- **Infra**: Docker Compose, Nginx (production reverse proxy)

---

## Getting Started

### Development

Start all services with hot-reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```

| Service    | URL                   |
| ---------- | --------------------- |
| API        | http://localhost:9000 |
| Frontend   | http://localhost:5173 |
| PostgreSQL | localhost:5432        |
| Redis      | localhost:6379        |

### Production

```bash
docker compose up -d
```

Scale API instances:

```bash
docker compose up --scale api=2
```

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

The seed runs **automatically** on every container startup (after `db:push`), so no manual step is needed in Docker. It is idempotent — if the admin user already exists it exits silently.

To run manually:

```bash
# Inside the running api container
docker compose -f docker-compose.dev.yml exec api npm run db:seed

# Or locally (requires backend/.env to be configured)
cd backend && npm run db:seed
```

Default credentials (override via environment variables):

| Variable         | Default           |
| ---------------- | ----------------- |
| `ADMIN_EMAIL`    | `admin@finql.dev` |
| `ADMIN_PASSWORD` | `Admin@123!`      |
| `ADMIN_NAME`     | `Admin`           |

> **Change the default password** before deploying to any shared environment.

### Connection Details

| Setting  | Value                                                  |
| -------- | ------------------------------------------------------ |
| Host     | `postgres` (Docker) / `localhost` (local)              |
| Port     | `5432`                                                 |
| User     | `postgres`                                             |
| Password | `password`                                             |
| Database | `gatescale`                                            |
| URL      | `postgres://postgres:password@postgres:5432/gatescale` |

---

## Environment Variables

### Backend

| Variable         | Description                    | Example                                                |
| ---------------- | ------------------------------ | ------------------------------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection string   | `postgres://postgres:password@postgres:5432/gatescale` |
| `REDIS_URL`      | Redis connection string        | `redis://redis:6379`                                   |
| `JWT_SECRET`     | Secret for signing JWTs        | `supersecret`                                          |
| `CLIENT_URL`     | Allowed CORS origin (dev only) | `http://localhost:5173`                                |
| `ADMIN_EMAIL`    | Seed: admin user email         | `admin@finql.dev`                                      |
| `ADMIN_PASSWORD` | Seed: admin user password      | `Admin@123!`                                           |
| `ADMIN_NAME`     | Seed: admin user display name  | `Admin`                                                |

### Frontend

| Variable       | Description          | Example                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:9000` |

---

## Project Structure

```
backend/
  src/
    controllers/      - Request handlers
    db/
      schemas/        - Drizzle table definitions (users, api_keys, api_request_logs)
      schema.ts       - Re-exports all schemas
      types.ts        - Inferred TypeScript types
    middleware/       - Auth, rate limiting, request tracking
    repository/       - Database query logic
    routes/           - Express routers
    utils/            - JWT, password hashing, API key helpers
    seed.ts           - Default admin user seed script
    server.ts         - Express app entry point
  drizzle/            - Generated migration files

frontend/
  src/
    components/       - UI components (ApiKeysTable, Metrics, AdminMetrics, UsageChart, …)
    hooks/            - Data-fetching hooks
    pages/            - Route-level pages (DashboardPage, LoginPage, …)
    services/         - API client functions
    types.ts          - Shared TypeScript interfaces

nginx/                - Nginx config and Dockerfile (production)
docker-compose.yml    - Production compose file
docker-compose.dev.yml - Development compose file with hot-reload
```

---

## User Roles

| Role    | Dashboard Access                                     |
| ------- | ---------------------------------------------------- |
| `user`  | API Keys, Playground, Metrics (own keys only)        |
| `admin` | All of the above + Admin tab (platform-wide metrics) |

Admin users are created via the seed script or by directly setting `role = 'admin'` in the database. The admin tab is only rendered in the UI when the logged-in user has the `admin` role.
