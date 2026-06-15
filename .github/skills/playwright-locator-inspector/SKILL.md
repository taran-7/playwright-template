---
name: playwright-locator-inspector
description: >
  Inspect live Flowersdrop application pages using Playwright MCP browser tools to discover
  data-testid attributes and generate Page Object locators. Use when asked to "inspect locators",
  "find data-testid", "generate page object from live app", "what locators exist on this page",
  or when locators are unknown for a feature and need to be discovered from the running application.
---

# Playwright Locator Inspector

## When to use this skill

- Before creating a new page object — navigate to the target page and discover all available `data-testid` attributes, roles, and accessible names.
- When the user provides a URL or page name without specifying exact locators.
- When locators in existing page objects may be stale and need verification against the live app.
- When unsure about page structure — take a snapshot to see the full accessibility tree.

## Prerequisites

- The Playwright MCP server (`@playwright/mcp`) must be configured in `.github/copilot/mcp.json`.
- The MCP server must be started with `--caps=testing` to enable `browser_generate_locator` and verification tools.
- Browser viewport is `1420x720` (matches `playwright.config.ts`).

## Auth state

If the target page requires authentication, load auth cookies before navigating:

- Auth state files are stored in `.auth/{user_key}.json`
- Available user keys are defined in `constants/users/testUsers.ts`
- Use `app.authAsUser("user_key")` pattern — the MCP browser does not handle auth automatically; you must navigate after auth cookies are set or use a pre-authenticated session.

## Steps

1. **Navigate** to the target page using `browser_navigate`:

   ```
   browser_navigate(url: "https://test.flowersdrop.com/presentations")
   ```

2. **Take a snapshot** to see the full accessibility tree:

   ```
   browser_snapshot()
   ```

   Returns element refs, roles, names, and `data-testid` values.

3. **Generate locators** for specific elements using refs from the snapshot:

   ```
   browser_generate_locator(ref: "<element-ref-from-snapshot>")
   ```

   Returns a Playwright locator expression (e.g., `page.getByTestId("submit-button")`).

4. **Verify elements** are visible and have expected values:

   ```
   browser_verify_element_visible(ref: "<ref>")
   browser_verify_text_visible(text: "Expected text")
   browser_verify_value(ref: "<ref>", value: "expected")
   ```

5. **Interact to reveal dynamic elements** (modals, dropdowns, tooltips):

   ```
   browser_click(ref: "<ref>")
   browser_type(ref: "<ref>", text: "input text")
   browser_hover(ref: "<ref>")
   ```

   Re-take a snapshot after interactions to discover newly rendered elements.

6. **Close the browser** when done:
   ```
   browser_close()
   ```

## Locator priority (strictly in this order)

When mapping discovered elements to locators, follow this priority:

1. `getByTestId("submit-button")` — **primary strategy**, look for `data-testid` attributes first
2. `getByRole("button", { name: "Submit" })` — when `data-testid` is unavailable
3. CSS selectors — fallback only
4. `getByLabel("Email address")` — for form fields
5. `getByPlaceholder("Enter email")` — when no label exists
6. `getByText("Welcome back")` — last resort

> Always prefer locators discovered from the live page over guessing or assuming attribute values.

## Output format

Generate a TypeScript Page Object class extending `PageHolder`:

```typescript
import { PageHolder } from "@app/pageHolder";
import { Locator, Page } from "@playwright/test";

export default class NewFeaturePage extends PageHolder {
  readonly pageUrl: string = "/new-feature";

  // Static locators
  readonly titleField: Locator = this.page.getByTestId("title-field");
  readonly saveButton: Locator = this.page.getByTestId("save-button");

  // Dynamic locators
  readonly cardByIndex = (index: number): Locator =>
    this.page.getByTestId("card").nth(index);

  async fillTitle(title: string): Promise<void> {
    await this.titleField.fill(title);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }
}
```

After creating the page object, **register it** in `app/app.ts` as a `public readonly` property.

## Important rules

- Use the MCP browser for **inspection and locator discovery only** — do NOT run actual Playwright tests through it.
- Always prefer `getByTestId()` — it is the primary locator strategy in this project (`testIdAttribute: "data-testid"` in `playwright.config.ts`).
- The MCP server is configured with `--caps=testing` which enables `browser_generate_locator`.
- After writing a page object, use `browser_generate_locator` to confirm locators match actual elements.
