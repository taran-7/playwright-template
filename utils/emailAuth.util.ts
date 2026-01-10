/**
 * GMAIL API AUTHENTICATION UTILITY
 *
 * This utility provides OAuth2 authentication for Gmail API access.
 * Use this when your tests need to:
 * - Verify email confirmations
 * - Read verification codes from emails
 * - Test email notification workflows
 *
 * SETUP REQUIREMENTS:
 * 1. Create a Google Cloud project
 * 2. Enable Gmail API
 * 3. Create OAuth 2.0 credentials (Desktop application)
 * 4. Download credentials.json to utils/ folder
 * 5. Run any test that uses this - it will open browser for initial auth
 * 6. token.json will be created automatically after auth
 *
 * IMPORTANT:
 * - Never commit credentials.json or token.json to git
 * - Both files are in .gitignore
 *
 * TODO: Add your email reading logic in a separate utility
 */

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { authenticate } from "@google-cloud/local-auth";
import * as fs from "fs/promises";
import * as path from "path";
import * as process from "process";

/**
 * Gmail API scopes needed for reading emails
 * - gmail.modify: Read and modify emails (mark as read, etc.)
 * - gmail.readonly: Read-only access (use this if you don't need to modify)
 */
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
];

// Path to token (auto-generated after first auth)
const TOKEN_PATH = path.join(process.cwd(), "utils/token.json");

// Path to credentials (download from Google Cloud Console)
const CREDENTIALS_PATH = path.join(process.cwd(), "utils/credentials.json");

/**
 * GmailAuthenticator - Handles OAuth2 authentication for Gmail API
 *
 * Usage example:
 * ```typescript
 * const auth = await gmailAuthenticator.authorize();
 * const gmail = google.gmail({ version: 'v1', auth });
 *
 * const messages = await gmail.users.messages.list({
 *   userId: 'me',
 *   q: 'subject:Verification Code',
 *   maxResults: 1
 * });
 * ```
 */
export class GmailAuthenticator {
  /**
   * Load saved credentials from token.json if it exists
   */
  private async loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content.toString());
      return google.auth.fromJSON(credentials) as unknown as OAuth2Client;
    } catch {
      return null;
    }
  }

  /**
   * Save OAuth2 credentials to token.json for future use
   */
  private async saveCredentials(client: OAuth2Client): Promise<void> {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Get authorized OAuth2 client for Gmail API
   *
   * First call will open browser for authentication.
   * Subsequent calls will use saved token.
   *
   * @returns Authorized OAuth2Client
   */
  public async authorize(): Promise<OAuth2Client> {
    // Try to load existing token
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }

    // No token - need to authenticate via browser
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    // Save credentials for next time
    if (client.credentials) {
      await this.saveCredentials(client);
    }

    return client;
  }
}

/**
 * Pre-instantiated authenticator for convenience
 * Use: await gmailAuthenticator.authorize()
 */
export const gmailAuthenticator: GmailAuthenticator = new GmailAuthenticator();
