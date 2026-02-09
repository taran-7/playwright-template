# Playwright Python Template

Production-oriented starter for UI, API and E2E testing with:

- `pytest`
- `playwright` (sync API)
- Page Object Model
- API controller layer
- strict lint/type/format checks

## Project layout

```text
python_playwright/
├── api/                    # API clients/controllers
├── app/                    # Page objects and components
├── constants/              # Endpoints, headers, users
├── tests/
│   ├── api_tests/
│   ├── e2e_tests/
│   ├── ui_tests/
│   └── unit_tests/
├── conftest.py             # Shared fixtures and integration gates
├── config.py               # Env-aware settings (ENV or test_env)
├── pytest.ini              # Pytest configuration and markers
├── Makefile                # Common developer commands
└── requirements.txt
```

## Quick start

1. Create and activate virtual env:

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies and browser:

```bash
pip install -r python_playwright/requirements.txt
python3 -m playwright install --with-deps chromium
```

3. Create environment file:

```bash
cp .env.example .env.test
```

4. Run tests:

```bash
# Safe default: runs non-integration tests
python3 -m pytest -c python_playwright/pytest.ini python_playwright/tests

# Live tests (UI/API/E2E against configured environment)
ENV=test python3 -m pytest -c python_playwright/pytest.ini --run-integration python_playwright/tests
```

## Markers and execution model

- `integration`: live tests requiring real `BASE_URL` + credentials
- by default integration tests are skipped
- enable with `--run-integration`

Main markers:

- `api`
- `ui`
- `e2e`
- `smoke`
- `regression`
- `critical`

Examples:

```bash
python3 -m pytest -c python_playwright/pytest.ini -m "api and smoke" --run-integration
python3 -m pytest -c python_playwright/pytest.ini -m ui --run-integration --headed
```

## Environment configuration

Settings are loaded from `.env.<env>` where `<env>` is:

- `ENV` (preferred), or
- `test_env` (legacy fallback), default `test`

Required variables for integration tests:

- `BASE_URL`
- `MANAGER_USERNAME`
- `MANAGER_PASSWORD`

## Quality gates

Configured via `pyproject.toml`:

- `ruff` (lint + import sorting)
- `black` (format)
- `mypy` (type checks)

Commands:

```bash
python3 -m ruff check python_playwright
python3 -m black --check python_playwright
python3 -m mypy python_playwright
```

## Makefile shortcuts

Run from `python_playwright/`:

```bash
make install
make install-browsers
make test
make test-integration
make test-ui
make lint
make format
make type-check
```

## CI

GitHub Actions:

- `.github/workflows/python-ci.yml`: lint, format-check, mypy, tests (without integration)
- `.github/workflows/integration-tests.yml`: manual integration run
