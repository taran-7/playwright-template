# Playwright Test Framework Template Guide

This guide provides detailed instructions for using this Playwright testing framework template.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Фікстури (Fixtures) — Детальний опис](#фікстури-fixtures--детальний-опис)
4. [Adding a New Page Object](#adding-a-new-page-object)
5. [Adding a New API Controller](#adding-a-new-api-controller)
6. [Adding a Component](#adding-a-component)
7. [Test Types](#test-types)
8. [Tags and Filtering](#tags-and-filtering)
9. [Environment Configuration](#environment-configuration)
10. [NPM Scripts Reference](#npm-scripts-reference)
11. [Best Practices](#best-practices)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.test

# Edit with your values
nano .env.test
```

### 3. Run Tests

```bash
# Run all tests on test environment
npm run test:chrome

# Run with UI mode for debugging
npm run test:ui-mode

# Run specific test by ID
npm run run:by-id  # Edit the ID in package.json first
```

---

## Project Architecture

```
├── customFixture.ts          # Custom Playwright fixtures (app, api)
├── env.ts                    # Environment variable mapping
├── global-setup.ts           # Loads .env files before tests
├── playwright.config.ts      # Playwright configuration
│
├── api/                      # API Layer
│   ├── api.ts                # API facade (aggregates all controllers)
│   ├── requestHolders.ts     # Base class for HTTP operations
│   ├── api-helpers/          # Helper utilities
│   │   ├── apiHelpers.ts
│   │   └── extraHTTPHeaders.ts
│   └── api-controllers/      # API controllers by domain
│       ├── authorization.controller.ts
│       └── presentation.controller.ts
│
├── app/                      # UI Layer
│   ├── app.ts                # Application facade (aggregates pages)
│   ├── pageHolder.ts         # Base class for page objects
│   ├── generalHelpers.ts     # Common helper methods
│   ├── components/           # Reusable UI components
│   │   ├── headerComponent.ts
│   │   └── notificationComponent.ts
│   └── pages/                # Page objects
│       ├── loginPage.ts
│       └── explorePage.ts
│
├── constants/                # Constants and configuration
│   ├── apiEndpoints.ts       # API endpoint paths
│   ├── authCookies.ts        # Cookie configuration
│   ├── accountOptions.ts     # Feature settings
│   └── users/
│       └── testUsers.ts      # Test user definitions
│
├── models/                   # TypeScript interfaces
│   ├── user.d.ts
│   └── presentation.d.ts
│
├── test-data/                # Test data files
│   ├── fileNameData.ts
│   └── mocks/                # Mock response data
│
├── tests/                    # Test files
│   ├── ui-tests/             # UI tests (browser)
│   ├── api-tests/            # API tests (no browser)
│   └── e2e-tests/            # End-to-end tests (UI + API)
│
└── utils/                    # Utility scripts
    ├── emailAuth.util.ts     # Email verification utilities
    ├── file-utils.ts
    └── fs.util.ts
```

### Key Concepts

| Concept          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| **Fixtures**     | `app` (UI) and `api` (backend) are injected into every test  |
| **Page Objects** | Classes representing pages, contain locators and actions     |
| **Components**   | Reusable UI elements (header, modals, notifications)         |
| **Controllers**  | API operations grouped by domain                             |
| **Tags**         | Test metadata for filtering (@smoke, @regression, @critical) |

---

## Фікстури (Fixtures) — Детальний опис

### Що таке фікстури?

**Фікстури** в Playwright — це механізм **dependency injection** (впровадження залежностей), який дозволяє автоматично створювати, передавати в тести та очищувати об'єкти/ресурси.

У цьому проекті визначено дві основні фікстури у файлі `customFixture.ts`:

| Фікстура | Призначення |
|----------|-------------|
| `api` | Прямі HTTP-запити без браузера (швидко!) |
| `app` | Взаємодія з UI через Page Objects |

---

### 📦 Фікстура `api`

**Визначення:** `customFixture.ts`

```typescript
api: async ({ playwright }, use) => {
  const requestContext = await playwright.request.newContext({
    baseURL: process.env.BASE_URL,
  });

  const api = new API(requestContext);
  await use(api);
  await requestContext.dispose();  // Очистка після тесту
}
```

#### Життєвий цикл:

| Крок | Опис |
|------|------|
| 1 | Створює `APIRequestContext` для HTTP-запитів |
| 2 | Інстанціює клас `API` з усіма контролерами |
| 3 | Передає в тест через параметр `api` |
| 4 | Після тесту — закриває контекст |

#### Клас `API` (`api/api.ts`) включає:
- **`authorizationController`** — авторизаційні операції
- **`presentationController`** — CRUD для презентацій
- **`getUserTokens(userKey)`** — отримання токенів для користувача

#### Приклад використання:

```typescript
test("API test", async ({ api }) => {
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);
  const response = await api.presentationController.getAll(headers);
});
```

---

### 🖥️ Фікстура `app`

**Визначення:** `customFixture.ts`

```typescript
app: async ({ browser, api }, use, testInfo) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const app = new Application(page, api);  // api інжектиться сюди!

  await use(app);

  // Очистка
  await page.close();
  await context.close();
}
```

#### Життєвий цикл:

| Крок | Опис |
|------|------|
| 1 | Створює новий браузерний контекст і сторінку |
| 2 | Інстанціює `Application` з `page` та `api` |
| 3 | Передає в тест через параметр `app` |
| 4 | Після тесту — закриває сторінку та контекст |
| 5 | Перевіряє на memory leaks (відкриті контексти) |

#### Клас `Application` (`app/app.ts`) включає:

**Page Objects:**
- `loginPage` — сторінка логіну
- `explorePage` — головна сторінка

**Helpers:**
- `generalHelpers` — загальні допоміжні методи

**Методи автентифікації:**
- `authAsUser(userKey)` — швидка автентифікація через cookies (без UI!)
- `clearAuth()` — очистка cookies

#### Приклад використання:

```typescript
test("UI test", async ({ app }) => {
  await app.authAsUser("manager");  // Швидкий логін через cookies
  await app.navigateToBasePath(app.explorePage.exploreUrl);
  await expect(app.explorePage.searchField).toBeVisible();
});
```

---

### 🌟 Переваги фікстур

#### 1. Розділення відповідальності

Кожна фікстура має чітке призначення:
- `api` — для бекенд-операцій
- `app` — для UI-взаємодій

#### 2. Швидка автентифікація

```typescript
// Замість повільного UI логіну (3-5 секунд):
await app.loginPage.login(email, password);

// Використовуй швидкий cookie injection (~100ms):
await app.authAsUser("manager");
```

#### 3. Dependency Injection

- `api` інжектиться в `app` автоматично
- Це дозволяє `app.authAsUser()` викликати `api.getUserTokens()` під капотом

#### 4. Автоматичне очищення

Після кожного тесту:
- Закриваються сторінки та контексти
- Звільняються API-ресурси
- Виявляються memory leaks

#### 5. Патерн Page Object Model

```typescript
// Замість прямого доступу до елементів:
await page.locator("#email").fill(email);

// Використовуй Page Objects:
await app.loginPage.emailField.fill(email);
```

---

### 🔄 Типові сценарії використання

#### Сценарій 1: Чистий UI тест

```typescript
test("Login via UI", async ({ app }) => {
  await app.navigateToBasePath(app.loginPage.loginUrl);
  await app.loginPage.login(email, password);
});
```

#### Сценарій 2: UI тест зі швидкою автентифікацією

```typescript
test("Dashboard test", async ({ app }) => {
  await app.authAsUser("manager");  // Cookie injection
  await app.navigateToBasePath(app.explorePage.exploreUrl);
  await expect(app.explorePage.searchField).toBeVisible();
});
```

#### Сценарій 3: API тест

```typescript
test("API test", async ({ api }) => {
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);
  // Виклик API контролера...
});
```

#### Сценарій 4: Гібридний тест (API setup + UI verification)

```typescript
test("Full flow", async ({ api, app }) => {
  // 1. Створюємо дані через API (швидко)
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);
  // await api.contentController.create(...)

  // 2. Автентифікуємось
  await app.authAsUser("manager");

  // 3. Перевіряємо в UI
  await app.navigateToBasePath("/dashboard");
  await expect(app.page.getByText("Created Content")).toBeVisible();
});
```

---

## Adding a New Page Object

### Step 1: Create the Page File

Create `app/pages/myNewPage.ts`:

```typescript
import { PageHolder } from "@app/pageHolder";
import { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "@app/components/headerComponent";

export default class MyNewPage extends PageHolder {
  // Page URL
  readonly pageUrl: string = "/my-new-page";

  // Locators
  readonly pageTitle: Locator = this.page.locator("h1");
  readonly submitButton: Locator = this.page.getByTestId("submit-btn");
  readonly inputField: Locator = this.page.locator("input[name='field']");

  // Dynamic locator (function)
  readonly itemByIndex = (index: number): Locator =>
    this.page.locator('[data-testid="item"]').nth(index);

  // Components
  public headerComponent: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.headerComponent = new HeaderComponent(page);
  }

  // Actions
  async fillAndSubmit(value: string) {
    await this.inputField.fill(value);
    await this.submitButton.click();
  }
}
```

### Step 2: Register in Application

Edit `app/app.ts`:

```typescript
// Add import
import MyNewPage from "@app/pages/myNewPage";

export class Application extends PageHolder {
  // ... existing pages ...

  // Add new page
  public readonly myNewPage: MyNewPage = new MyNewPage(this.page);
}
```

### Step 3: Use in Tests

```typescript
import { test, expect } from "@customFixture";

test("My new page test @1234 @ui", async ({ app }) => {
  await app.navigateToBasePath(app.myNewPage.pageUrl);
  await app.myNewPage.fillAndSubmit("test value");
  await expect(app.myNewPage.pageTitle).toContainText("Success");
});
```

---

## Adding a New API Controller

### Step 1: Create the Controller File

Create `api/api-controllers/items.controller.ts`:

```typescript
import { RequestHolder } from "@api/requestHolders";
import { APIResponse } from "@playwright/test";
import { EndpointsEnum } from "@constants/apiEndpoints";
import { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

export class ItemsController extends RequestHolder {
  /**
   * Get all items.
   */
  async getAllItems(headers: HTTPHeaders): Promise<APIResponse> {
    return await this.send("get", EndpointsEnum.Items, headers);
  }

  /**
   * Create new item.
   */
  async createItem(headers: HTTPHeaders, data: object): Promise<APIResponse> {
    return await this.send(
      "post",
      EndpointsEnum.Items,
      headers,
      JSON.stringify(data),
    );
  }

  /**
   * Delete item by ID.
   */
  async deleteItem(headers: HTTPHeaders, id: string): Promise<APIResponse> {
    return await this.send("delete", `${EndpointsEnum.Items}/${id}`, headers);
  }
}
```

### Step 2: Add Endpoint

Edit `constants/apiEndpoints.ts`:

```typescript
export enum EndpointsEnum {
  // ... existing endpoints ...
  Items = "/api/gateway/items",
}
```

### Step 3: Register in API

Edit `api/api.ts`:

```typescript
// Add import
import { ItemsController } from "@api/api-controllers/items.controller";

export class API extends RequestHolder {
  // ... existing controllers ...

  public readonly itemsController: ItemsController;

  constructor(requestContext: APIRequestContext) {
    super(requestContext);
    // ... existing initializations ...
    this.itemsController = new ItemsController(requestContext);
  }
}
```

### Step 4: Use in Tests

```typescript
import { test, expect } from "@customFixture";
import { extraHTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

test("API test for items @2001 @api", async ({ api }) => {
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);

  const response = await api.itemsController.getAllItems(headers);
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty("items");
});
```

---

## Adding a Component

### Step 1: Create the Component File

Create `app/components/modalComponent.ts`:

```typescript
import { Locator, Page } from "@playwright/test";

export class ModalComponent {
  private page: Page;

  readonly modalContainer: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly modalTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalContainer = this.page.getByTestId("modal");
    this.closeButton = this.page.getByTestId("modal-close");
    this.confirmButton = this.page.getByTestId("modal-confirm");
    this.cancelButton = this.page.getByTestId("modal-cancel");
    this.modalTitle = this.page.getByTestId("modal-title");
  }

  async isOpen(): Promise<boolean> {
    return await this.modalContainer.isVisible();
  }

  async close() {
    await this.closeButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
```

### Step 2: Use in Page Object

```typescript
import { ModalComponent } from "@app/components/modalComponent";

export default class SomePage extends PageHolder {
  public modalComponent: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.modalComponent = new ModalComponent(page);
  }
}
```

---

## Test Types

### UI Tests (`tests/ui-tests/`)

Browser-based tests that interact with the UI.

```typescript
test("UI test example @1234 @ui @smoke", async ({ app }) => {
  await app.navigateToBasePath("/login");
  await app.loginPage.login("user@test.com", "password");
  await expect(app.explorePage.searchField).toBeVisible();
});
```

**When to use:**

- Testing user interactions
- Visual verification
- Multi-step user flows
- Form submissions

### API Tests (`tests/api-tests/`)

Direct API tests without browser overhead.

```typescript
test("API test example @2001 @api", async ({ api }) => {
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);

  const response = await api.itemsController.getAllItems(headers);
  expect(response.status()).toBe(200);
});
```

**When to use:**

- Backend validation
- Data verification
- Faster execution
- Performance testing

### E2E Tests (`tests/e2e-tests/`)

Combine UI and API for complete workflows.

```typescript
test("E2E test example @3001 @e2e", async ({ app, api }) => {
  // Setup via API
  const { token } = await api.getUserTokens("manager");
  const headers = extraHTTPHeaders(token);
  const resourceId = await api.resourceController.create(headers);

  // Authenticate UI
  await app.authAsUser("manager");

  // Interact via UI
  await app.navigateToBasePath(`/resource/${resourceId}`);
  await expect(app.resourcePage.title).toBeVisible();

  // Cleanup via API
  await api.resourceController.delete(headers, resourceId);
});
```

**When to use:**

- Critical business flows
- Integration verification
- Full user journeys
- Complex scenarios

---

## Tags and Filtering

### Available Tags

| Tag             | Purpose               | Example               |
| --------------- | --------------------- | --------------------- |
| `@XXXX`         | Test case ID          | `@1234`               |
| `@ui`           | UI test               | `@ui`                 |
| `@api`          | API test              | `@api`                |
| `@e2e`          | End-to-end test       | `@e2e`                |
| `@smoke`        | Quick sanity check    | `@smoke`              |
| `@regression`   | Full regression suite | `@regression`         |
| `@critical`     | Business-critical     | `@critical`           |
| `@feature_name` | Feature-specific      | `@login`, `@checkout` |

### Running by Tags

```bash
# Single tag
npx playwright test -g @smoke

# Multiple tags (OR)
npx playwright test --grep '@smoke|@critical'

# Combined tags (AND)
npx playwright test -g '@ui.*@critical|@critical.*@ui'

# Exclude tag
npx playwright test --grep-invert @flaky
```

---

## Environment Configuration

### Environment Files

| File           | Purpose                          |
| -------------- | -------------------------------- |
| `.env.example` | Template (commit to git)         |
| `.env.test`    | Test environment (do NOT commit) |
| `.env.beta`    | Beta/staging environment         |
| `.env.prod`    | Production environment           |

### Adding New Environment Variable

1. Add to `env.ts`:

```typescript
public static MY_NEW_VAR: string = process.env.MY_NEW_VAR;
```

2. Add to `.env.example`:

```bash
MY_NEW_VAR=example-value
```

3. Add actual value to `.env.test`, `.env.beta`, `.env.prod`

### Switching Environments

```bash
# Test environment
cross-env test_env=test npx playwright test

# Beta environment
cross-env test_env=beta npx playwright test

# Production environment
cross-env test_env=prod npx playwright test
```

---

## NPM Scripts Reference

### Development

| Script                     | Description                           |
| -------------------------- | ------------------------------------- |
| `npm run run:by-id`        | Run single test by ID                 |
| `npm run run:by-id-headed` | Same but with visible browser         |
| `npm run test:ui-mode`     | Open Playwright UI for debugging      |
| `npm run codegen`          | Record tests using Playwright Codegen |

### Test Suites

| Script                    | Description             |
| ------------------------- | ----------------------- |
| `npm run smoke:test`      | Quick sanity tests      |
| `npm run critical:test`   | Business-critical tests |
| `npm run regression:test` | Full regression suite   |
| `npm run api:test`        | API tests only          |
| `npm run e2e:test`        | End-to-end tests        |
| `npm run ui:test`         | UI tests only           |

### By Browser

| Script                 | Description  |
| ---------------------- | ------------ |
| `npm run test:chrome`  | Chrome only  |
| `npm run test:firefox` | Firefox only |
| `npm run test:safari`  | Safari only  |

### Utilities

| Script                     | Description               |
| -------------------------- | ------------------------- |
| `npm run report:local`     | Open HTML report          |
| `npm run format`           | Format code with Prettier |
| `npm run lint:fix`         | Fix ESLint issues         |
| `npm run last-failed:test` | Retry failed tests        |

---

## Best Practices

### Locators

```typescript
// ✅ Good - data-testid
this.page.getByTestId("submit-button");

// ✅ Good - semantic locators
this.page.getByRole("button", { name: "Submit" });
this.page.getByLabel("Email");
this.page.getByText("Welcome");

// ⚠️ Avoid - CSS classes (brittle)
this.page.locator(".btn-primary");

// ⚠️ Avoid - complex selectors
this.page.locator("div > div > button:first-child");
```

### Waits

```typescript
// ✅ Good - auto-waiting
await expect(locator).toBeVisible();
await locator.click();

// ⚠️ Avoid - hardcoded waits
await page.waitForTimeout(5000);

// ✅ Good - explicit waits when needed
await locator.waitFor({ state: "visible", timeout: 10000 });
```

### Assertions

```typescript
// ✅ Good - specific assertions
await expect(locator).toHaveText("Expected text");
await expect(locator).toBeVisible();
await expect(response.status()).toBe(200);

// ✅ Good - soft assertions (collect all failures)
await expect.soft(locator1).toBeVisible();
await expect.soft(locator2).toHaveText("Text");
```

### Test Data

```typescript
// ✅ Good - API for setup/teardown
test.beforeEach(async ({ api }) => {
  testData = await api.controller.create(headers);
});

test.afterEach(async ({ api }) => {
  await api.controller.delete(headers, testData.id);
});

// ✅ Good - faker for dynamic data
import { faker } from "@faker-js/faker";
const email = faker.internet.email();
const name = faker.person.fullName();
```

### Authentication

```typescript
// ✅ Good - API-based auth (fast)
await app.authAsUser("manager");

// ⚠️ Slower - UI login (use only when testing login itself)
await app.loginPage.login(email, password);
```

---

## Need Help?

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
