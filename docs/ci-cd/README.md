# CI/CD documentation
This directory documents the current CI implementation for Ignite Starter.

## Current CI architecture
The pipeline is split across three systems:
- **Drone CI (`.drone.yml`)**: primary CI pipeline (quality + build validation)
- **GitHub Actions (`.github/workflows/*.yml`)**: SonarCloud scan and PR lint annotations
- **SonarCloud (`sonar-project.properties`)**: static analysis metrics

## What runs today
### Drone CI stages
1. Install dependencies
2. Type checking (`bun tsc`)
3. Biome CI lint
4. i18n audit (`locale-check`, `locale-unused`)
5. Build (`bun run build`)

### GitHub Actions
- `sonar.yml`: SonarCloud analysis
- `pr-review.yml`: Biome annotations for pull requests

## Important notes
- CI is implemented and enforced.
- CD is **not** implemented yet.
- Sonar coverage metric is intentionally disabled in `sonar-project.properties` (`sonar.coverage.exclusions=**/*`).
- Unit tests are available via `bun run test`, but the Drone test step is currently commented out.

## Documentation map
- [Pipeline architecture](./pipeline-architecture.md)
- [Configuration files](./configuration-files.md)
- [Drone setup](./drone-setup.md)
- [GitHub configuration](./github-configuration.md)
- [SonarCloud setup](./sonarcloud-setup.md)
