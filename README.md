# 🐍 Playwright Python Test Framework

A production-ready Playwright testing framework migrated to Python, featuring Page Object Model, API Controllers, and E2E patterns using `pytest`.

## ✨ Features

- **Page Object Model** — Clean separation of test logic and UI interactions (`app/pages`)
- **API Controllers** — Organized backend testing with typed HTTP clients (`api/controllers`)
- **Pytest Fixtures** — `app` (UI) and `api` (backend) injected into every test via `conftest.py`
- **Synchronous API** — Uses `playwright.sync_api` for stable and straightforward test execution
- **Multi-Environment** — Environment configuration via `.env` files and Pydantic
- **Reporting** — HTML reports via `pytest-html`

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8+
- pip

### 2. Setup Virtual Environment

```bash
# MacOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r python_playwright/requirements.txt
playwright install
```

### 4. Configure Environment

Create environment files as needed (e.g., `.env.test`). The `config.py` uses `pydantic-settings` to load these.

```bash
# Example .env.test
BASE_URL=https://example.com
MANAGER_USERNAME=admin
MANAGER_PASSWORD=secret
```

### 5. Run Tests

```bash
# Run all tests
pytest python_playwright/tests

# Run API tests only
pytest -m api python_playwright/tests

# Run UI tests only
pytest -m ui python_playwright/tests

# Run E2E tests
pytest -m e2e python_playwright/tests
```

## 📁 Project Structure

```text
python_playwright/
├── config.py              # Environment configuration (Pydantic)
├── conftest.py            # Global Fixtures (api, app, auth)
├── pytest.ini             # Pytest configuration & markers
├── requirements.txt       # Project dependencies
├── api/                   # API Layer
│   ├── api_manager.py     # API Aggregator
│   ├── base_api_client.py # Base Request Client
│   └── controllers/       # Domain controllers (Auth, Presentation)
├── app/                   # UI Layer
│   ├── application.py     # App Aggregator
│   ├── base_page.py       # Base Page Object
│   ├── components/        # Shared components (Header, Notification)
│   └── pages/             # Page Objects (Login, Explore)
└── tests/                 # Test Suites
    ├── api_tests/
    ├── ui_tests/
    └── e2e_tests/
```

## 🏷️ Test Markers

Tests are marked in `pytest.ini` for easy filtering:

- `@api`: API tests
- `@ui`: UI tests
- `@e2e`: End-to-end tests
- `@smoke`: Critical path verification
- `@regression`: Full regression suite

Run specific marker:
```bash
pytest -m "api and smoke" python_playwright/tests
```

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `pytest` | Run all tests |
| `pytest --headed` | Run UI tests in headed mode (visible browser) |
| `pytest --slowmo 1000` | Run with 1s delay between actions |
| `pytest --html=report.html` | Generate HTML report |
