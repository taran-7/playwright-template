/**
 * ============================================================================
 * REQUEST HOLDER (BASE CLASS FOR API CONTROLLERS)
 * ============================================================================
 *
 * Abstract base class that all API controllers should extend.
 * Provides common HTTP request utilities.
 *
 * Usage:
 *   export class MyController extends RequestHolder {
 *     async getItems(headers: HTTPHeaders) {
 *       return await this.send("get", "/api/items", headers);
 *     }
 *
 *     async createItem(headers: HTTPHeaders, data: object) {
 *       return await this.send("post", "/api/items", headers, JSON.stringify(data));
 *     }
 *   }
 * ============================================================================
 */

import { APIRequestContext, APIResponse } from "@playwright/test";
import { Serializable } from "playwright-core/types/structs";
import ENV from "env";
import { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

export abstract class RequestHolder {
  /**
   * Playwright API request context.
   * Used for making HTTP requests.
   */
  constructor(protected request: APIRequestContext) {}

  /**
   * Send HTTP request to internal API (uses BASE_URL).
   *
   * @param method - HTTP method: "get", "post", "put", "delete"
   * @param path - API endpoint path (e.g., "/api/users")
   * @param headers - Request headers (defaults to auth headers)
   * @param payload - Request body (for POST/PUT)
   * @param formData - If true, send as form data instead of JSON
   * @returns API response
   *
   * @example
   * // GET request
   * const response = await this.send("get", "/api/users", headers);
   *
   * // POST request with JSON body
   * const response = await this.send("post", "/api/users", headers, JSON.stringify({ name: "John" }));
   *
   * // POST request with form data
   * const response = await this.send("post", "/api/login", headers, formPayload, true);
   */
  protected async send(
    method: string,
    path: string,
    headers: HTTPHeaders,
    payload?: string | Buffer | Serializable,
    formData: boolean = false,
  ): Promise<APIResponse> {
    let response: Promise<APIResponse>;
    const url = ENV.BASE_URL + path;

    switch (method) {
      case "get":
        response = this.request.get(url, { headers });
        break;
      case "post":
        if (formData) {
          response = this.request.post(url, {
            headers: headers,
            form: payload,
          });
        } else {
          response = this.request.post(url, {
            headers: headers,
            data: payload,
          });
        }
        break;
      case "put":
        response = this.request.put(url, {
          headers: headers,
          data: payload,
        });
        break;
      case "delete":
        response = this.request.delete(url, { headers });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return await response;
  }

  /**
   * Send HTTP request to external API (full URL required).
   * Use this for third-party services.
   *
   * @param method - HTTP method: "get", "post", "put", "delete"
   * @param url - Full URL (e.g., "https://api.external.com/endpoint")
   * @param headers - Request headers
   * @param payload - Request body
   * @param formData - If true, send as form data
   * @returns API response
   */
  protected async sendToExternalAPI(
    method: string,
    url: string,
    headers: HTTPHeaders = {},
    payload?: string | Buffer | Serializable,
    formData: boolean = false,
  ): Promise<APIResponse> {
    let response: Promise<APIResponse>;

    switch (method) {
      case "get":
        response = this.request.get(url, { headers });
        break;
      case "post":
        response = formData
          ? this.request.post(url, { headers, form: payload })
          : this.request.post(url, { headers, data: payload });
        break;
      case "put":
        response = this.request.put(url, { headers, data: payload });
        break;
      case "delete":
        response = this.request.delete(url, { headers });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return await response;
  }
}
