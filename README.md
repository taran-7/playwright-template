# 🎭 Playwright Test Framework Template

A production-ready Playwright testing framework with Page Object Model, API testing, and E2E patterns.

## ✨ Features

- **Page Object Model** — Clean separation of test logic and UI interactions
- **API Controllers** — Organized backend testing with typed HTTP clients
- **Custom Fixtures** — `app` (UI) and `api` (backend) injected into every test
- **Three Test Types** — UI, API, and E2E tests with examples
- **Multi-Environment** — Test, Beta, Production configurations
- **Multi-Browser** — Chrome, Firefox, Safari support
- **CI/CD Ready** — GitHub Actions annotations, JUnit reports

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.test

# Edit with your test credentials
nano .env.test
```

### 3. Run Tests

```bash
# Run all UI tests on Chrome
npm run test:chrome

# Run with visual UI (debugging)
npm run test:ui-mode

# Run smoke tests
npm run smoke:test

# Run API tests only
npm run api:test
```

## 📁 Project Structure

```
├── customFixture.ts          # Custom fixtures (app, api)
├── playwright.config.ts      # Playwright configuration
├── api/                      # API controllers
├── app/                      # Page objects & components
├── constants/                # Configuration constants
├── models/                   # TypeScript interfaces
├── tests/
│   ├── ui-tests/             # Browser tests
│   ├── api-tests/            # API tests
│   └── e2e-tests/            # End-to-end tests
└── utils/                    # Utilities
```

## 🧪 Test Types

| Type | Location | When to Use |
|------|----------|-------------|
| **UI** | `tests/ui-tests/` | User interactions, visual testing |
| **API** | `tests/api-tests/` | Backend validation, fast execution |
| **E2E** | `tests/e2e-tests/` | Full workflows, integration |

## 🏷️ Test Tags

```typescript
test("Example @1234 @ui @smoke @critical", async ({ app }) => {
  // @1234     - Test case ID
  // @ui       - UI test type
  // @smoke    - Quick sanity check
  // @critical - Business-critical
});
```

Run by tag:
```bash
npm run smoke:test      # @smoke tests
npm run critical:test   # @critical tests
npm run regression:test # @regression tests
```

## 📖 Documentation

See **[TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)** for detailed instructions on:
- Adding new page objects
- Adding API controllers
- Creating components
- Environment configuration
- Best practices

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm run test:chrome` | Run on Chrome |
| `npm run test:ui-mode` | Debug with UI |
| `npm run codegen` | Record new tests |
| `npm run report:local` | Open HTML report |
| `npm run format` | Format code |
| `npm run lint:fix` | Fix lint issues |

## 📋 Requirements

- Node.js 18+
- npm 9+

## 📄 License

ISC
