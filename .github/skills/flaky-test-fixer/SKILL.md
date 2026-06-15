---
name: flaky-test-fixer
description: >
  Diagnose and fix flaky Playwright tests in the Flowersdrop project — tests that pass locally
  but fail intermittently in CI. Use when asked to "fix flaky test", "test fails intermittently",
  "race condition in test", "test passes locally but fails in CI", "fix timing issue",
  "waitForTimeout problem", or when a test fails only on retry attempts 2+.
---

# Flaky Test Fixer

## When to use this skill

- A test passes locally but fails in CI (especially on retry attempt 2+)
- A test fails with timing-related errors
- A test works in Chrome but fails in Firefox or Safari
- A test involves external services (SCORM Cloud, Gmail API, email verification)
- A test interacts with animations, modals, or third-party iframes

## Flakiness diagnosis checklist

### 1. Cookie-based auth timing

The Flowersdrop project uses `at`/`rt` cookies for authentication, set via API before navigation.

**Symptoms:** `401 Unauthorized`, redirect to login page, "No credentials found for userKey"

**Checks:**

- [ ] `mkdir -p .auth` step runs before auth cookie setup in CI pipeline
- [ ] `app.authAsUser("user_key")` is called before `app.navigateToBasePath()`
- [ ] Auth state JSON file exists in `.auth/{user_key}.json`
- [ ] Cookies are applied before any page navigation (not after)

**Fix pattern:**

```typescript
// ✅ Correct order
await app.authAsUser("user_3768");
await app.navigateToBasePath(app.presentationsPage.presentationsUrl);

// ❌ Wrong — navigating before auth
await app.navigateToBasePath(app.presentationsPage.presentationsUrl);
await app.authAsUser("user_3768");
```

---

### 2. Race conditions between UI render and assertion

**Symptoms:** `TimeoutError: locator.waitFor`, element not found immediately after navigation

**Checks:**

- [ ] Using `waitForTimeout()` instead of proper auto-waiting
- [ ] Asserting on element before page has fully rendered
- [ ] Animation or modal transition not finished before interaction
- [ ] Missing `waitForURL()` after navigation-triggering actions

**Fix patterns:**

```typescript
// ❌ Fragile — fixed timeout
await page.waitForTimeout(2000);
await expect(app.detailsPage.titleField).toBeVisible();

// ✅ Correct — auto-waiting assertion
await expect(app.detailsPage.titleField).toBeVisible();

// ✅ Correct — wait for URL after click
await app.presentationsPage.clickOnFirstPresentation();
await page.waitForURL("**/presentations/**");
await expect(app.detailsPage.titleField).toBeVisible();
```

> **Exception:** `waitForTimeout()` is acceptable for animations, third-party iframes, or flaky external services when no reliable alternative exists.

---

### 3. CI environment timing (slow runners)

The Flowersdrop CI uses `ubuntu-24.04-4core-16gb` runners with 2 workers.

**Symptoms:** Test passes locally (fast machine) but fails in CI (slower)

**Checks:**

- [ ] `playwright.config.ts` timeout is 40s — is the operation expected to complete in time?
- [ ] `expect` timeout is 7s — is 7s enough for the assertion under CI load?
- [ ] `waitForTimeout()` values that work locally may be too short in CI (2 workers sharing resources)

**Fix:** Prefer event-driven waits over time-based waits:

```typescript
// ✅ Wait for network response instead of fixed timeout
await Promise.all([
  page.waitForResponse((resp) => resp.url().includes("/api/presentations")),
  app.presentationsPage.clickRefresh(),
]);
```

---

### 4. External service dependencies

**Symptoms:** Intermittent failures in tests involving SCORM Cloud, Gmail API, email verification

**Checks:**

- [ ] SCORM Cloud API: add retry logic or increase timeout for SCORM-related interactions
- [ ] Gmail API (email verification): ensure the email arrives before asserting — use polling
- [ ] External services may have rate limits or temporary unavailability

**Fix:** Add explicit waits for external service responses, or mock the external dependency with route interception:

```typescript
// Mock external service to remove flakiness
await page.route("**/scorm-cloud/**", (route) =>
  route.fulfill({ status: 200, body: JSON.stringify(mockScormResponse) }),
);
```

---

### 5. Browser-specific rendering differences

**Symptoms:** Passes in Chrome, fails in Firefox or Safari

**Checks:**

- [ ] CSS animations behave differently between browsers
- [ ] Safari: stricter cookie handling, different viewport rendering
- [ ] Firefox: different media stream API support
- [ ] `test.describe.serial` used when it shouldn't be — tests sharing state across browsers

**Fix:** Add browser-specific handling where needed, or skip a browser for known incompatible scenarios:

```typescript
test("Feature @tc001 @ui @feature @regression", async ({
  app,
  browserName,
}) => {
  test.skip(browserName === "webkit", "Safari does not support this media API");
  // ...
});
```

---

### 6. `UserTermsNotApprovedException` not handled

**Symptoms:** Redirect to terms page, test fails because expected page is not reached

**Checks:**

- [ ] The auto-approve flow in `api.ts` handles `UserTermsNotApprovedException`
- [ ] User account has not had terms reset on the test environment

---

## Verification after fix

Run the test in headed mode to visually verify timing:

```bash
test_env=test npx playwright test tests/ui-tests/{path}/{file}.test.ts --project=chrome --headed --repeat-each=3
```

Run on all browsers to confirm cross-browser stability:

```bash
test_env=test npx playwright test tests/ui-tests/{path}/{file}.test.ts --project=chrome --project=firefox --project=webkit
```

## Prevention guidelines

- Prefer auto-waiting over `waitForTimeout()` wherever possible
- Use `waitForURL()`, `waitForResponse()`, `waitForSelector()` for event-driven synchronization
- Keep tests independent — no shared state between tests
- Mock external services in CI to eliminate external flakiness
- Tag potentially flaky scenarios with a comment explaining the risk
