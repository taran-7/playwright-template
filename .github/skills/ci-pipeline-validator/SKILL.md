---
name: ci-pipeline-validator
description: >
  Validate and debug GitHub Actions CI/CD pipeline configuration for the Flowersdrop Playwright
  test project. Use when asked to "check workflow", "validate github actions", "ci yml is wrong",
  "pipeline is broken", "jobs are failing in CI", "missing step in workflow", "wrong secrets",
  or when analyzing a .github/workflows/*.yml file for correctness.
---

# CI Pipeline Validator

## When to use this skill

- Analyzing a `.github/workflows/*.yml` file for structural errors
- CI jobs are failing for non-test-logic reasons (infra, config, secrets)
- A new workflow needs to be created or an existing one needs updating
- Verifying that all required steps and secrets are present

## Available workflows

| Workflow                       | Trigger                       | Tags          | Browsers                          |
| ------------------------------ | ----------------------------- | ------------- | --------------------------------- |
| `critical-flows.yml`           | Manual (test/beta/prod)       | `@critical`   | Chrome → Firefox → Safari → API   |
| `smoke-prod.yml`               | Push to master, daily, manual | `@smoke`      | Chrome, Firefox, Safari           |
| `test-regression.yml`          | Mondays, manual               | `@regression` | Chrome → Firefox → API (test env) |
| `beta-regression.yml`          | Mondays, manual               | `@regression` | Chrome → Firefox → API (beta env) |
| `parameterized-regression.yml` | Manual                        | Custom tags   | Configurable                      |
| `lint.yml`                     | All PRs                       | —             | Prettier + ESLint                 |

## Pipeline structure validation

### Job sequencing

- [ ] Jobs run sequentially: **Chrome → Firefox → Safari → API** (each job uses `needs: [previous-job]`)
- [ ] Each job has `if: always()` — runs regardless of whether the previous job passed or failed
- [ ] Environment is passed via `inputs.environment` (allowed values: `test`, `beta`, `prod`)
- [ ] `BASE_URL` is resolved from GitHub vars:
  - `prod` → `vars.PROD_BASE_URL`
  - `beta` → `vars.BETA_BASE_URL`
  - `test` → `vars.TEST_BASE_URL`

### Container image

- [ ] Container image: `mcr.microsoft.com/playwright:v{VERSION}-noble`
- [ ] **Critical:** Container image version must match the Playwright version in `package.json` (check `@playwright/test` version)
- [ ] Example: if `package.json` has `"@playwright/test": "^1.60.0"`, container must be `v1.60.0-noble`

### Required steps (in exact order)

1. [ ] `actions/checkout@v4`
2. [ ] Load `.env.{environment}` into `$GITHUB_ENV`
3. [ ] `actions/setup-node@v4` with `node-version: 20` (project requires Node 20)
4. [ ] `mkdir -p .auth` — **required** for cookie-based authentication storage
5. [ ] `npm ci && npx playwright install` (add `npx playwright install chrome` for Chrome job specifically)
6. [ ] Install `jq` — required for parsing `test-output.json` results
7. [ ] Set `GITHUB_RUN_URL` environment variable
8. [ ] Run tests:
   ```bash
   test_env={env} npx playwright test -g @{tag} --project={project} --workers=3 --retries=1
   ```
9. [ ] Push results to TestMo:
   ```bash
   browser={Browser} test_env={env} npm run testmo:{type}
   ```
10. [ ] `actions/upload-artifact@v4` for `playwright-report/` and `results/*.xml`
11. [ ] Parse `test-output.json` for stats (passed, failed, skipped, flaky, duration)
12. [ ] Notify MS Teams with test results summary

### Required secrets & variables

**Secrets (must be set in GitHub repo → Settings → Secrets):**

- [ ] `USER_*` and `USER_*_PASSWORD` — for every test user referenced in `constants/users/testUsers.ts`
- [ ] `TESTMO_TOKEN` — for TestMo reporting
- [ ] `AUTOTESTS_REPORTS_WEBHOOK_URL` — for MS Teams notifications

**Variables (GitHub repo → Settings → Variables):**

- [ ] `PROD_BASE_URL`
- [ ] `BETA_BASE_URL`
- [ ] `TEST_BASE_URL`

**Container-specific env vars:**

- [ ] `HOME: /root` — must be set for test and TestMo steps (required inside the Playwright container)

### Playwright config alignment

- [ ] `retries: process.env.CI ? 2 : 0` — retries configured in `playwright.config.ts`
- [ ] `workers: process.env.CI ? 2 : undefined` — worker limit in CI
- [ ] Test timeout: 40s, expect timeout: 7s — ensure your test steps complete within these limits

## Common issues to check

| Symptom                   | Likely Cause                             | Fix                                                          |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `browserType.launch: ...` | Container image version mismatch         | Update container to match `package.json` Playwright version  |
| `No tests found`          | Tag grep filter not matching test titles | Verify `@tag` format in test titles matches `-g @tag` filter |
| `Cannot find module`      | `npm ci` failed or node version mismatch | Ensure `node-version: 20`, check `npm ci` output             |
| `401 Unauthorized`        | Missing or expired user secret           | Re-set `USER_*` secrets in GitHub                            |
| `TESTMO_TOKEN` error      | TestMo token expired                     | Rotate token and update secret                               |
| Auth directory missing    | `mkdir -p .auth` step missing            | Add step before `npm ci`                                     |
| Tests run but no artifact | Wrong artifact path                      | Check `playwright-report/` path in upload step               |
| All jobs run in parallel  | Missing `needs:`                         | Add `needs: [chrome-job]` etc. for sequential execution      |

## Workflow template structure

```yaml
name: Critical Flows
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [test, beta, prod]

jobs:
  chrome:
    runs-on: ubuntu-24.04-4core-16gb
    container:
      image: mcr.microsoft.com/playwright:v1.60.0-noble # ← match package.json
    env:
      HOME: /root
    steps:
      - uses: actions/checkout@v4
      - name: Load env
        run: cat .env.${{ inputs.environment }} >> $GITHUB_ENV
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: mkdir -p .auth
      - run: npm ci && npx playwright install && npx playwright install chrome
      - run: apt-get install -y jq
      - name: Run tests
        run: test_env=${{ inputs.environment }} npx playwright test -g @critical --project=chrome --workers=3 --retries=1
        env:
          BASE_URL: ${{ vars.TEST_BASE_URL }}
          # ... user secrets

  firefox:
    needs: [chrome]
    if: always()
    # ... similar structure
```

## Validation output format

```
## ✅ / ❌ Pipeline Validation Report

### Structure
- [✅/❌] Job sequencing: Chrome → Firefox → Safari → API
- [✅/❌] if: always() on all non-first jobs
- [✅/❌] Container image matches package.json Playwright version

### Required Steps
- [✅/❌] Step N: <step name>

### Secrets & Variables
- [✅/❌] TESTMO_TOKEN configured
- [✅/❌] USER_* secrets configured

### Issues Found
1. ❌ <Issue> — <Fix>
```
