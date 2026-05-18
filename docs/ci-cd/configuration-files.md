# Configuration Files Reference

## Overview

This document provides a reference for all CI/CD configuration files, their
purpose, and minimal functional configurations.

## File Structure

```
.
├── .drone.yml                           # Drone CI pipeline
├── sonar-project.properties             # SonarCloud configuration
├── .github/
│   ├── workflows/
│   │   ├── sonar.yml                    # SonarCloud analysis workflow
│   │   └── pr-review.yml                # Biome linting workflow
│   ├── PULL_REQUEST_TEMPLATE.md         # PR template
│   └── copilot-instructions.md          # GitHub Copilot context
```

## .drone.yml

**Purpose:** Main CI pipeline for type checking, linting, testing, and build
validation

**Location:** Repository root

```yaml
kind: pipeline
type: docker
name: CI

platform:
  arch: arm64

clone:
  depth: 100

trigger:
  branch:
    - main
  event:
    - push
    - pull_request
    - tag

steps:
  - name: install
    image: oven/bun:1.3.3
    commands:
      - bun install --ignore-scripts

  - name: lint
    image: oven/bun:1.3.3
    commands:
      - bun biome ci .
    depends_on:
      - typecheck

  - name: i18n-audit
    image: oven/bun:1.3.3
    commands:
      - bun locale-check
      - bun locale-unused
    depends_on:
      - install

  - name: typecheck
    image: oven/bun:1.3.3
    commands:
      - bun tsc
    depends_on:
      - install

  # - name: tests
  #   image: oven/bun:1.3.3
  #   commands:
  #     - bun run test
  #   depends_on:
  #     - install
  #     - typecheck
  #     - lint

  - name: build
    image: node:22-alpine
    commands:
      - bun run build
    depends_on:
      - install
      - lint
      - i18n-audit
      - typecheck
      - tests
```

**Key Features:**

- Sequential execution: install → typecheck → lint → i18n-audit → build
- Uses Bun 1.3.3 Docker image for most steps
- Uses Node.js 22 Alpine for web build
- Shallow clone (depth: 100) for faster checkout
- ARM64 platform support
- i18n validation to ensure translation keys are used correctly

## sonar-project.properties

**Purpose:** SonarCloud project configuration

**Location:** Repository root

```properties
sonar.projectKey=your-org_your-repo
sonar.organization=your-org

# Sources
sonar.sources=./src

# Exclusions
sonar.exclusions=\
  **/node_modules/**,\
  **/.next/**,\
  **/dist/**,\
  **/build/**,\
  **/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx

# Temporary: ignore coverage metric until coverage pipeline is re-enabled
sonar.coverage.exclusions=**/*
```

**Configuration Notes:**

- Replace `your-org_your-repo` with your SonarCloud project key
- Replace `your-org` with your SonarCloud organization key
- Sources are set to `./src` to scan app code (email templates live in `emails/`)
- Test files are excluded from analysis
- Coverage is temporarily disabled (uncomment when ready to enable)

## .github/workflows/sonar.yml

**Purpose:** GitHub Actions workflow for SonarCloud analysis

**Location:** `.github/workflows/sonar.yml`

```yaml
name: SonarCloud

on:
  push:
  pull_request:

jobs:
  sonarqube:
    name: SonarQube
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Install dependencies
        run: bun install

      - name: SonarCloud Scan
        uses: SonarSource/sonarqube-scan-action@v5.0.0
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**Key Features:**

- Triggers on all pushes and pull requests
- Full git history for accurate analysis (fetch-depth: 0)
- Uses official SonarCloud GitHub Action
- Only requires SONAR_TOKEN secret

## .github/workflows/pr-review.yml

**Purpose:** Inline code quality feedback on pull requests

**Location:** `.github/workflows/pr-review.yml`

```yaml
name: Biome

on:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - run: bun install

      - run: bun biome check --reporter=github .
        continue-on-error: true
```

**Key Features:**

- Only runs on pull requests
- Uses GitHub reporter for inline annotations
- Continues on error to always provide feedback
- Minimal configuration for fast execution

## .github/PULL_REQUEST_TEMPLATE.md

**Purpose:** Standardized pull request template

**Location:** `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
# Reference

[Add any relevant link (issue, ticket, doc, etc)]

## Changes

- **Added:**
  - ...
- **Updated:**
  - ...
- **Fixed:**
  - ...

## Considerations

[Any considerations about the code changes (remove section if not used)]

## Screenshots

[Any screenshots of changes (remove if not applied)]
```

## .github/copilot-instructions.md

**Purpose:** Project context for GitHub Copilot

**Location:** `.github/copilot-instructions.md`

This file provides GitHub Copilot with project-specific context including:

- Technology stack
- Code conventions
- Architecture patterns
- Common commands
- Best practices

See [copilot-instructions.md](../../.github/copilot-instructions.md) for the
full content.

## Maintenance

### Updating Configuration

When updating configuration files:

1. Test changes in a feature branch first
2. Verify all checks pass before merging
3. Update documentation if behavior changes
4. Communicate changes to the team

### Version Pinning

- Bun version: `1.3.3` (update in all workflow files)
- GitHub Actions: Use major version tags (e.g., `@v4`)
- Docker images: Use specific versions for reproducibility
