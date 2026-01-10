/**
 * FILE SYSTEM UTILITIES
 *
 * This file contains utilities for working with files:
 * - FileHandler class for file verification and manipulation
 * - getDataFromJSON for reading auth tokens from JSON files
 *
 * TODO: Add your own file utilities as needed
 */

import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";

/**
 * FileHandler - Utility class for file operations in tests
 *
 * Use this class when you need to:
 * - Verify downloaded files
 * - Check file existence and content
 * - Clean up test files
 *
 * Example usage:
 * ```typescript
 * const fileHandler = new FileHandler();
 * fileHandler.verifyFileFormat('document.pdf', '.pdf');
 * fileHandler.verifyFileHasContent('/downloads/document.pdf');
 * fileHandler.deleteFile('/downloads/document.pdf');
 * ```
 */
export class FileHandler {
  /**
   * Verify that a file has the expected extension
   */
  public verifyFileFormat(fileName: string, expectedExtension: string): void {
    const fileExtension = path.extname(fileName);
    expect(fileExtension).toBe(expectedExtension);
  }

  /**
   * Check if a file exists at the given path
   */
  public verifyFileExists(filePath: fs.PathLike): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Verify that a file is not empty (has content)
   */
  public verifyFileHasContent(filePath: fs.PathLike): void {
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(0);
  }

  /**
   * Delete a file if it exists
   */
  public deleteFile(filePath: fs.PathLike): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * Auth data structure returned from JSON files
 * TODO: Modify this interface to match your auth storage format
 */
interface AuthData {
  token: string | undefined;
  refreshToken: string | undefined;
}

/**
 * Read authentication data from a JSON file
 *
 * This function reads auth tokens stored in .auth directory.
 * Used by tests that need pre-authenticated sessions.
 *
 * @param userName - The username/role to get auth data for
 * @returns AuthData object with token and refreshToken
 *
 * File structure expected:
 * ```json
 * {
 *   "data": {
 *     "auth": {
 *       "token": "...",
 *       "refreshToken": "..."
 *     }
 *   }
 * }
 * ```
 *
 * TODO: Adjust the file path and data structure to match your app
 */
export function getDataFromJSON(userName: string): AuthData {
  const fileName: string = userName
    ? `${userName}-auth.json`
    : "default-auth.json";
  const filePath: string = path.join(".auth", fileName);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const authData = data.data.auth;

    return {
      token: authData?.token,
      refreshToken: authData?.refreshToken,
    };
  } catch (err) {
    if (process.env.DEBUG?.toLowerCase() === "true") {
      console.error(
        `${err.name} - ${err.message}. \x1b[32mMaking it now... 😊\x1b[0m`,
      );
    }
    return {
      token: undefined,
      refreshToken: undefined,
    };
  }
}

/**
 * Remove a file from the file system
 * Logs a warning if file doesn't exist
 */
export const removeFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    console.warn(`File at path ${filePath} does not exist.`);
  }
};

/**
 * Pre-instantiated FileHandler for convenience
 * Import and use directly: fileHandler.verifyFileExists(path)
 */
export const fileHandler: FileHandler = new FileHandler();
