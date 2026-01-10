/**
 * ============================================================================
 * PRESENTATION CONTROLLER (API CONTROLLER EXAMPLE - CRUD)
 * ============================================================================
 *
 * API controller for presentation/content CRUD operations.
 * Demonstrates common patterns for resource management.
 *
 * Key concepts:
 * - Create, Read, Update, Delete operations
 * - Helper methods for test setup
 * - Error handling with meaningful messages
 *
 * Usage:
 *   const id = await api.presentationController.makePresentationId(headers);
 *   await api.presentationController.deletePresentation(headers, id);
 * ============================================================================
 */

import { RequestHolder } from "@api/requestHolders";
import { APIResponse, expect } from "@playwright/test";
import { EndpointsEnum } from "@constants/apiEndpoints";
import { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";
import { faker } from "@faker-js/faker";

export class PresentationController extends RequestHolder {
  // ===========================================================================
  // CREATE OPERATIONS
  // ===========================================================================

  /**
   * Create a new presentation and return its ID.
   * Useful for test setup.
   *
   * @param headers - Auth headers
   * @returns Presentation ID or null if creation failed
   *
   * @example
   * const presentationId = await api.presentationController.makePresentationId(headers);
   */
  async makePresentationId(headers: HTTPHeaders): Promise<string | null> {
    const presentationId: string = faker.string.uuid();

    try {
      const response: APIResponse = await this.send(
        "post",
        EndpointsEnum.PresentationApi,
        headers,
        JSON.stringify({ presentationId }),
      );

      return response.status() === 200 ? presentationId : null;
    } catch (error) {
      console.error("Error creating presentation:", error);
      return null;
    }
  }

  // ===========================================================================
  // READ OPERATIONS
  // ===========================================================================

  /**
   * Get presentation details by ID.
   *
   * @param headers - Auth headers
   * @param presentationId - Presentation ID
   * @returns API response with presentation data
   */
  async getPresentation(
    headers: HTTPHeaders,
    presentationId: string,
  ): Promise<APIResponse> {
    return await this.send(
      "get",
      `${EndpointsEnum.PresentationsId}?presentationId=${presentationId}`,
      headers,
    );
  }

  /**
   * Get all presentations for current user.
   *
   * @param headers - Auth headers
   * @returns API response with presentations list
   */
  async getAllPresentations(headers: HTTPHeaders): Promise<APIResponse> {
    return await this.send("get", EndpointsEnum.PresentationApi, headers);
  }

  /**
   * Get comments for a presentation.
   *
   * @param headers - Auth headers
   * @param presentationId - Presentation ID
   * @param options - Pagination options
   * @returns Comments data
   */
  async getCommentsInfo(
    headers: HTTPHeaders,
    presentationId: string,
    options: { page?: number; size?: number } = { page: 0, size: 10 },
  ) {
    const response = await this.send(
      "get",
      `${EndpointsEnum.Comments}/?objectId=${presentationId}&page=${options.page}&size=${options.size}`,
      headers,
    );

    if (response.status() !== 200) {
      throw new Error(`Failed to get comments. Status: ${response.status()}`);
    }

    return response.json();
  }

  // ===========================================================================
  // UPDATE OPERATIONS
  // ===========================================================================

  /**
   * Save/update presentation.
   *
   * @param headers - Auth headers
   * @param presentationId - Presentation ID
   * @param data - Updated data
   * @returns API response
   */
  async savePresentation(
    headers: HTTPHeaders,
    presentationId: string,
    data: object,
  ): Promise<APIResponse> {
    return await this.send(
      "put",
      EndpointsEnum.PresentationsSave,
      headers,
      JSON.stringify({ presentationId, ...data }),
    );
  }

  /**
   * Confirm/publish presentation.
   *
   * @param headers - Auth headers
   * @param presentationId - Presentation ID
   * @returns API response
   */
  async confirmPresentation(
    headers: HTTPHeaders,
    presentationId: string,
  ): Promise<APIResponse> {
    return await this.send(
      "post",
      EndpointsEnum.PresentationsConfirm,
      headers,
      JSON.stringify({ presentationId }),
    );
  }

  // ===========================================================================
  // DELETE OPERATIONS
  // ===========================================================================

  /**
   * Delete a presentation.
   * Use in afterEach hooks for cleanup.
   *
   * @param headers - Auth headers
   * @param presentationId - Presentation ID to delete
   * @returns API response
   *
   * @example
   * // In afterEach:
   * await api.presentationController.deletePresentation(headers, testPresentationId);
   */
  async deletePresentation(
    headers: HTTPHeaders,
    presentationId: string,
  ): Promise<APIResponse> {
    const response = await this.send(
      "delete",
      `${EndpointsEnum.PresentationsDelete}${presentationId}`,
      headers,
    );

    if (response.status() !== 200 && response.status() !== 204) {
      console.warn(
        `Warning: Delete presentation returned status ${response.status()}`,
      );
    }

    return response;
  }

  // ===========================================================================
  // ACCESS CONTROL
  // ===========================================================================

  /**
   * Get access control groups.
   *
   * @param headers - Auth headers (required)
   * @returns Groups data
   */
  async getAccessControlGroups(headers: HTTPHeaders) {
    const response: APIResponse = await this.send(
      "get",
      EndpointsEnum.Groups,
      headers,
    );
    expect(response.status()).toBe(200);
    return await response.json();
  }

  /**
   * Set direct access to presentation.
   *
   * @param headers - Auth headers (required)
   * @param presentationId - Presentation ID
   * @returns API response
   */
  async setDirectAccessToPresentation(
    headers: HTTPHeaders,
    presentationId: string,
  ) {
    const groups = await this.getAccessControlGroups(headers);
    const groupId: string = groups.groups[0].groupId;

    const response: APIResponse = await this.send(
      "put",
      EndpointsEnum.PresentationsApi,
      headers,
      JSON.stringify({
        presentationId,
        groupId,
      }),
    );
    expect(response.status()).toBe(200);

    return response;
  }

  // ===========================================================================
  // COPY OPERATIONS
  // ===========================================================================

  /**
   * Copy a presentation.
   *
   * @param headers - Auth headers
   * @param presentationId - Source presentation ID
   * @returns API response with new presentation data
   */
  async copyPresentation(
    headers: HTTPHeaders,
    presentationId: string,
  ): Promise<APIResponse> {
    return await this.send(
      "post",
      EndpointsEnum.PresentationCopy,
      headers,
      JSON.stringify({ presentationId }),
    );
  }

  // ===========================================================================
  // ADD MORE PRESENTATION METHODS HERE
  // ===========================================================================
  // Examples:
  //   - archivePresentation()
  //   - restorePresentation()
  //   - sharePresentation()
  //   - addCollaborator()
  // ===========================================================================
}
