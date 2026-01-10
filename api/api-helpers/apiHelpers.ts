/**
 * API HELPERS
 *
 * This class can be used for shared API helper methods that don't fit
 * into a specific controller.
 *
 * Example use cases:
 * - Common retry logic
 * - Polling utilities
 * - Data transformation helpers
 *
 * Currently empty - extend as needed for your project.
 *
 * TODO: Add shared API helper methods here
 */

import { APIRequestContext } from "@playwright/test";
import { RequestHolder } from "@api/requestHolders";

export class ApiHelpers extends RequestHolder {
  constructor(request: APIRequestContext) {
    super(request);
  }

  // Example: Generic polling method
  // async pollUntil<T>(
  //   requestFn: () => Promise<T>,
  //   condition: (result: T) => boolean,
  //   maxAttempts: number = 10,
  //   intervalMs: number = 1000
  // ): Promise<T> {
  //   for (let i = 0; i < maxAttempts; i++) {
  //     const result = await requestFn();
  //     if (condition(result)) {
  //       return result;
  //     }
  //     await new Promise(resolve => setTimeout(resolve, intervalMs));
  //   }
  //   throw new Error('Polling timeout');
  // }
}
