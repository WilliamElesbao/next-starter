# CI/CD Documentation

This directory documents the current CI implementation for Next Starter.

## Current CI Architecture

The pipeline is split across three systems:

- **Drone CI (`.drone.yml`)**: primary CI pipeline (quality + build validation)
- **GitHub Actions (`.github/workflows/*.yml`)**: SonarCloud scan and PR lint annotations
- **SonarCloud (`sonar-project.properties`)**: static analysis metrics

## What Runs Today

### Drone CI Stages

1. Install dependencies (`bun install`)
2. Prisma generate (`bun run db:generate`)
3. Type checking (`bun tsc`)
4. Biome CI lint (`bun biome ci .`)
5. i18n audit (`bun locale-check`, `bun locale-unused`)
6. Tests (`npx jest`)
7. Build (`node --run build`)

### GitHub Actions

- `sonar.yml`: SonarCloud analysis
- `pr-review.yml`: Biome annotations for pull requests

## Important Notes

- CI is implemented and enforced
- CD is **not** implemented yet
- Sonar coverage metric is intentionally disabled in `sonar-project.properties` (`sonar.coverage.exclusions=**/*`)
- Unit tests are now enabled and run in the Drone CI pipeline

## Documentation Map

- [Pipeline architecture](./pipeline-architecture.md)
- [Configuration files](./configuration-files.md)
- [Drone setup](./drone-setup.md)
- [SonarCloud setup](./sonarcloud-setup.md)
