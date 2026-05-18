# Docker deployment
This guide documents the containerized build and run flow for `next-starter`.

## Prerequisites
- Docker running locally
- Environment configured in `.env`
- Infrastructure services running (PostgreSQL via `docker compose up -d`)

## Build the app (standalone output)
The `Dockerfile` expects a prebuilt Next.js standalone output.

```bash
bun install
bun run build
```

## Build the image
From the project root:

```bash
docker build -t next-starter .
```

## Run the container
```bash
docker run --name next-starter \
  --env-file .env \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://docker:docker@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

Notes:
- The image runs the Next.js standalone server (`.next/standalone`).
- Use `host.docker.internal` when connecting to services running on the host.

## Docker volumes
Stateful services are managed by `docker-compose.yml` and can persist data with:
- `./.docker/postgres` for PostgreSQL (optional)

## Useful commands
```bash
docker logs next-starter
docker stop next-starter
docker rm next-starter
```
