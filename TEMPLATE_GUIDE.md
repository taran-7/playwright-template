# Python Playwright Framework Guide

This guide provides detailed instructions for using the migrated Python Playwright framework.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Fixtures (Dependency Injection)](#fixtures-dependency-injection)
4. [Adding a New Page Object](#adding-a-new-page-object)
5. [Adding a New API Controller](#adding-a-new-api-controller)
6. [Adding a Component](#adding-a-component)
7. [Test Types](#test-types)
8. [Markers (Tags)](#markers-tags)
9. [Environment Configuration](#environment-configuration)
10. [Common Commands](#common-commands)
11. [Best Practices](#best-practices)

---

## Quick Start

### 1. Install Dependencies

```bash
pip install -r python_playwright/requirements.txt
playwright install
```

### 2. Configure Environment

```bash
# Copy example if available, or create new
nano .env.test
# Content:
# BASE_URL=https://example.com
# MANAGER_USERNAME=admin
```

### 3. Run Tests

```bash
# Run all tests
pytest python_playwright/tests

# Run with UI mode for debugging
pytest --headed python_playwright/tests

# Run specific test by name keyword
pytest -k "login" python_playwright/tests
```

---

## Project Architecture

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
├── constants/             # Enums and Constants
└── tests/                 # Test Suites
```

### Key Concepts

| Concept          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| **Fixtures**     | `app` (UI) and `api` (backend) injected via `conftest.py`    |
| **Page Objects** | Classes representing pages, contain locators and actions     |
| **Components**   | Reusable UI elements (header, modals, notifications)         |
| **Controllers**  | API operations grouped by domain                             |
| **Markers**      | Test metadata for filtering (@api, @ui, @smoke)              |

---

## Fixtures (Dependency Injection)

### what are Fixtures?

In `pytest`, fixtures are functions that setups data or state for tests. We use them for **Dependency Injection**.

Defined in `conftest.py`:

| Fixture | Purpose |
|----------|-------------|
| `api` | Direct HTTP requests (fast backend operations) |
| `app` | UI interactions via Page Objects |
| `api_context` | Session-scoped API context for performance |

### 📦 `api` Fixture

**Definition:** `conftest.py`

```python
@pytest.fixture(scope="session")
def api(api_context):
    return ApiManager(api_context)
```

**Usage:**

```python
def test_api_example(api):
    tokens = api.get_user_tokens("manager")
    headers = Headers.extra_headers(tokens["token"])
    response = api.presentation_controller.get_all_presentations(headers)
    assert response.ok
```

### 🖥️ `app` Fixture

**Definition:** `conftest.py`

```python
@pytest.fixture(scope="function")
def app(page, api):
    app_instance = Application(page, api)
    yield app_instance
    # Cleanup handled by pytest-playwright
```

**Usage:**

```python
def test_ui_example(app):
    app.auth_as_user("manager")  # Fast cookie injection
    app.navigate_to_base_path(app.explore_page.explore_url)
    expect(app.explore_page.search_field).to_be_visible()
```

---

## Adding a New Page Object

### Step 1: Create the Page File

Create `app/pages/my_new_page.py`:

```python
from playwright.sync_api import Page, Locator
from python_playwright.app.base_page import BasePage

class MyNewPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.page_url = "/my-new-page"
        
        # Locators
        self.submit_button = self.page.get_by_test_id("submit-btn")
        self.input_field = self.page.locator("input[name='field']")

    def fill_and_submit(self, value: str):
        self.input_field.fill(value)
        self.submit_button.click()
```

### Step 2: Register in Application

Edit `app/application.py`:

```python
from python_playwright.app.pages.my_new_page import MyNewPage

class Application(BasePage):
    def __init__(self, page: Page, api: ApiManager):
        super().__init__(page)
        # ... existing pages ...
        self.my_new_page = MyNewPage(page)
```

### Step 3: Use in Tests

```python
def test_my_new_page(app):
    app.navigate_to_base_path(app.my_new_page.page_url)
    app.my_new_page.fill_and_submit("test value")
```

---

## Adding a New API Controller

### Step 1: Create the Controller File

Create `api/controllers/items_controller.py`:

```python
from python_playwright.api.base_api_client import BaseApiClient
from python_playwright.constants.api_endpoints import Endpoints

class ItemsController(BaseApiClient):
    
    def get_all_items(self, headers: dict):
        return self.send("get", Endpoints.ITEMS, headers)

    def create_item(self, headers: dict, data: dict):
        return self.send("post", Endpoints.ITEMS, headers, data=data)
```

### Step 2: Add Endpoint

Edit `constants/api_endpoints.py`:

```python
class Endpoints(str, Enum):
    # ... existing ...
    ITEMS = "/api/gateway/items"
```

### Step 3: Register in API

Edit `api/api_manager.py`:

```python
from python_playwright.api.controllers.items_controller import ItemsController

class ApiManager(BaseApiClient):
    def __init__(self, request_context):
        super().__init__(request_context)
        # ...
        self.items_controller = ItemsController(request_context)
```

---

## Test Types

### UI Tests (`tests/ui_tests/`)

Browser-based tests.

```python
@pytest.mark.ui
def test_login(app):
    app.navigate_to_base_path("/login")
    app.login_page.login("user", "pass")
```

### API Tests (`tests/api_tests/`)

Direct API tests.

```python
@pytest.mark.api
def test_get_items(api, auth_headers):
    response = api.items_controller.get_all_items(auth_headers)
    assert response.ok
```

### E2E Tests (`tests/e2e_tests/`)

Combined workflow.

```python
@pytest.mark.e2e
def test_full_flow(app, api):
    # Setup via API
    api.items_controller.create_item(...)
    
    # Verify via UI
    app.auth_as_user("manager")
    app.navigate_to_base_path("/items")
    expect(app.page.get_by_text("Item")).to_be_visible()
```

---

## Markers (Tags)

Markers are defined in `pytest.ini`.

| Marker | Purpose |
| ------ | ------- |
| `@pytest.mark.api` | API tests |
| `@pytest.mark.ui` | UI tests |
| `@pytest.mark.e2e` | End-to-end tests |
| `@pytest.mark.smoke` | Smoke tests |
| `@pytest.mark.critical` | Critical path |

**Run by marker:**

```bash
pytest -m smoke
pytest -m "ui and critical"
```

---

## Environment Configuration

Managed via `config.py` and `.env` files.

1. Create `.env.test`:
```bash
BASE_URL=https://test.example.com
```

2. Run with specific env:
```bash
ENV=test pytest
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `pytest` | Run all tests |
| `pytest --headed` | Run with visible browser |
| `pytest --slowmo 100` | Slow down execution |
| `pytest --html=report.html` | Generate HTML report |
| `pytest -x` | Stop on first failure |
| `pytest --lf` | Run last failed tests |

---

## Best Practices

### Locators

```python
# ✅ Good - resilient locators
page.get_by_test_id("submit-button")
page.get_by_role("button", name="Submit")

# ⚠️ Avoid - CSS classes
page.locator(".btn-primary")
```

### Assertions

```python
# ✅ Good - web assertions (auto-waiting)
expect(locator).to_have_text("Value")
expect(locator).to_be_visible()

# ✅ Good - soft assertions (if implemented via plugin) or standard asserts
assert response.status == 200
```

### Data Generation

Use `Faker` (already installed):

```python
from faker import Faker
fake = Faker()
email = fake.email()
```
