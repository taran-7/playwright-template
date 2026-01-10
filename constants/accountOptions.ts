/**
 * ============================================================================
 * ACCOUNT OPTIONS / CONFIGURATION CONSTANTS
 * ============================================================================
 *
 * This file contains configuration constants for various features.
 * Use these for consistent test data and configurations.
 *
 * Usage:
 *   import { PUBLISHING_OPTIONS_BASE } from "@constants/accountOptions";
 * ============================================================================
 */

/**
 * Base publishing options for content/presentations.
 * Modify based on your application's publishing settings.
 */
export const PUBLISHING_OPTIONS_BASE = {
  playerSize: { width: 960, height: 360 },
  autoplay: true,
  mode: "EMBED_BUTTON",
  playerInIframe: false,
  keepAspectRatio: true,
};

/**
 * Default settings for various features.
 * Add your application-specific settings here.
 */
export const DEFAULT_SETTINGS = {
  language: "en",
  timezone: "UTC",
  pageSize: 20,
};

// ===========================================================================
// ADD MORE CONFIGURATION CONSTANTS HERE
// ===========================================================================
// Examples:
//   - NOTIFICATION_TYPES
//   - USER_ROLES
//   - FEATURE_FLAGS
// ===========================================================================
