import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginPlaywright from "eslint-plugin-playwright";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },

  {
    ignores: [
      "test-results/**",
      "playwright-report/**",
      "state-storage-files/**",
      "README.md",
      "test-data/**",
    ],
  },

  { languageOptions: { globals: globals.browser } },

  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      promise: eslintPluginPromise,
      playwright: eslintPluginPlaywright,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "playwright/no-page-pause": "warn",
      "playwright/no-useless-not": "error",

      "@typescript-eslint/ban-ts-comment": ["error", { "ts-nocheck": false }],
      "@typescript-eslint/no-unused-expressions": "off",

      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      eqeqeq: "error",
      "max-len": [
        "off",
        {
          code: 80,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "no-console": "off",
      "no-debugger": "error",
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "no-tabs": ["error", { allowIndentationTabs: true }],
      "object-curly-spacing": ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["off", "always"],

      "no-alert": "error",
      "no-void": "error",
    },
  },
];
