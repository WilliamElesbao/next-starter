# Docker deployment
This guide documents the containerized build and run flow for `next-starter`.

## Prerequisites
- Docker running locally
- Environment configured in `.env`
- Infrastructure services running (PostgreSQL via `docker compose up -d`)

## Build the app (standalone output)
The `Dockerfile` expects a prebuilt Next.js standalone output.

```bash
# Install dependencies
bun install

# Build Next.js standalone output
bun run build
```

This creates:
- `.next/standalone/` - Minimal Node.js server
- `.next/static/` - Static assets
- `public/` - Public assets

## Build the Docker image
From the project root:

```bash
docker build -t next-starter .
```

The Dockerfile:
- Uses `oven/bun:1.3.3` as base image
- Creates a non-root user (`bunjs:bunjs`)
- Copies the standalone build, static assets, and public files
- Exposes port 3000
- Runs the standalone server with Bun

## Run the container

### Basic run command
```bash
docker run --name next-starter \
  --env-file .env \
  -p 3000:3000 \
  next-starter
```

### Run with environment variable overrides

**Important:** When running in Docker, change `DATABASE_URL` from `localhost` to `host.docker.internal` to connect to services on the host machine.

```bash
docker run --name next-starter \
  --env-file .env \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

### Environment variable notes

- `--env-file .env` loads all variables from `.env`
- `-e VAR=value` overrides specific variables
- Use `host.docker.internal` instead of `localhost` for host services
- Required overrides when using Docker:
  - `DATABASE_URL`: Change `localhost` to `host.docker.internal`

## Docker Compose for local infrastructure

The project includes `docker-compose.yml` with three services:

```yaml
services:
  database:           # PostgreSQL (port 5432)
  prisma-studio:      # Prisma Studio UI (port 5555)
  stripe-webhook:     # Stripe CLI webhook forwarder
```

Start infrastructure:
```bash
docker compose up -d
```

Stop infrastructure:
```bash
docker compose down
```

### Docker volumes

Data persistence is handled via Docker volumes. By default, volumes are commented out for a clean development experience.

To enable persistence, uncomment in `docker-compose.yml`:
```yaml
volumes:
  - ./.docker/postgres:/var/lib/postgresql/data
```

To reset data:
```bash
docker compose down
rm -rf ./.docker/postgres
docker compose up -d
```

## Complete production deployment flow

```bash
# 1. Install dependencies
bun install

# 2. Build Next.js standalone output
bun run build

# 3. Build Docker image
docker build -t next-starter .

# 4. Run container with production environment
docker run --name next-starter \
  --env-file .env.production \
  -e DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/dbname \
  -p 3000:3000 \
  -d \
  next-starter
```

## Useful commands

```bash
# View container logs
docker logs next-starter

# Follow logs in real-time
docker logs -f next-starter

# Stop container
docker stop next-starter

# Remove container
docker rm next-starter

# Remove image
docker rmi next-starter

# Restart container
docker restart next-starter

# Execute command in running container
docker exec -it next-starter sh

# Inspect container
docker inspect next-starter
```

## Troubleshooting

### Cannot connect to database

**Problem:** Container cannot reach PostgreSQL on host

**Solution:** Use `host.docker.internal` instead of `localhost` in `DATABASE_URL`

```bash
# ❌ Wrong
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/next-starter

# ✅ Correct
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter
```

### Port already in use

**Problem:** Port 3000 is already bound

**Solution:** Stop the conflicting service or use a different port

```bash
# Use different port
docker run --name next-starter \
  --env-file .env \
  -p 3001:3000 \
  next-starter
```

### Environment variables not loaded

**Problem:** Application cannot read environment variables

**Solution:** Verify `.env` file exists and use `--env-file` flag

```bash
# Check .env file exists
ls -la .env

# Ensure --env-file is specified
docker run --name next-starter --env-file .env -p 3000:3000 next-starter
```

### Build fails

**Problem:** Docker build fails during image creation

**Solution:** Ensure standalone build exists before building image

```bash
# Verify standalone build exists
ls -la .next/standalone
ls -la .next/static

# If missing, run build first
bun run build

# Then build Docker image
docker build -t next-starter .
```

## References

- **Next.js Standalone Output**: https://nextjs.org/docs/app/api-reference/next-config-js/output
- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Bun Docker Image**: https://hub.docker.com/r/oven/bun
