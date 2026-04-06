# Gate Scale

A full-stack application with Docker, Node.js backend, and frontend.

## Docker Setup

### Development

Start all services in development mode with hot-reload:
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Production

Start services for production:
```bash
docker compose up -d
```

Scale API instances (production):
```bash
docker compose up --scale api=2
```

### Stop Services

Stop all running containers:
```bash
docker compose down
```

Stop and remove all data (dev):
```bash
docker compose -f docker-compose.dev.yml down
```

## Database Management (Drizzle ORM)

### Generate Database Migrations

After modifying schema files in `backend/src/db/schemas/`, generate migrations:
```bash
# From project root, inside the backend container
docker compose -f docker-compose.dev.yml exec api npm run db:generate
```

Or if running locally:
```bash
cd backend
npm run db:generate
```

### Push Schema to Database

Automatically run during Docker startup, but can also run manually:
```bash
docker compose -f docker-compose.dev.yml exec api npm run db:push
```

Or locally:
```bash
cd backend
npm run db:push
```

### Run Migrations

If you have pre-generated migration files:
```bash
docker compose -f docker-compose.dev.yml exec api npm run db:migrate
```

Or locally:
```bash
cd backend
npm run db:migrate
```

## Database Connection

- **Database**: PostgreSQL 15
- **Host**: `postgres` (Docker) or `localhost` (Local)
- **Port**: 5432
- **User**: postgres
- **Password**: password
- **Database**: gatescale
- **Connection String**: `postgres://postgres:password@postgres:5432/gatescale`

## Services

- **API**: Node.js backend (port 5000)
- **Frontend**: Vite React app (port 5173)
- **PostgreSQL**: Database (port 5432)
- **Redis**: Cache (port 6379)
- **Nginx**: Reverse proxy (port 80, production only)

## Project Structure

```
backend/          - Node.js API server
  src/
    db/
      schema.ts   - Main schema file
      schemas/    - Individual table definitions
      types.ts    - TypeScript types from schema
frontend/         - Frontend application
nginx/            - Nginx configuration for production
```

## Environment Variables

Environment variables are configured in docker-compose files. Update `.env` files as needed for local development.
