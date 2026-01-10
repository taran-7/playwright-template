/**
 * PRESENTATION TYPE DEFINITIONS
 *
 * This file contains TypeScript interfaces for presentation/content-related data.
 * These are example types - replace them with your own domain models.
 *
 * TODO: Replace with your own domain model interfaces
 *
 * Example domains you might have:
 * - Products, Orders, Users for e-commerce
 * - Articles, Comments, Categories for CMS
 * - Courses, Lessons, Enrollments for LMS
 */

import { HTTPHeaders } from "@api/api-helpers/extraHTTPHeaders";

/**
 * Example: Media file metadata
 * TODO: Replace with your domain model
 */
interface IConvertedFile {
  quality: string;
  width: number;
  height: number;
  ready: boolean;
}

/**
 * Example: Main entity interface
 * This is an example of a complex domain object.
 *
 * TODO: Replace with your main entity (Product, Article, etc.)
 *
 * Tips for defining interfaces:
 * - Use specific types instead of 'any'
 * - Use union types for enums (e.g., status: "ACTIVE" | "DELETED")
 * - Make optional fields explicit with '?'
 * - Use Date or string for dates (string recommended for JSON)
 */
interface IPresentation {
  presentationId: string;
  userName: string;
  userId: string;
  tenantId: string;
  feedbackFormId: string | null;
  title: string;
  speakerName: string;
  language: string | null;
  description: string;
  creationDate: string;
  changeDate: string;
  revision: number;
  legacyId: string | null;
  version: string;
  deleteDate: string | null;
  archiveDate: string | null;
  slidesCount: number;
  duration: number;
  durationInMilliseconds: number;
  state: {
    modelVersion: number;
    media: {
      id: string;
      type: string;
    };
    slides: string[];
    annotations: string[];
    chapters: string[];
    quizzes: string[];
    librarySkippedSlides: string[];
    layouts: string[];
    playerControls: string[];
    shapes: string[];
    timeline: string[];
  };
  draft: boolean;
  views: number;
  acg: string[];
  thumbnails: [
    {
      fileId: string;
      slideIndex: number | null;
      thumbnailType: string;
    },
  ];
  emotions: string[];
  showEmotions: boolean;
  labels: string[];
  customThumbnail: string[];
  userTariffExpired: boolean;
  addedToPortalAt: string;
  confirmationDate: string;
  bookmarked: boolean;
  hasActiveEditing: boolean;
  newerRevisionExists: boolean;
}

/**
 * Helper interface for test setup functions
 * Returns methods to get auth headers and entity ID
 *
 * Pattern: Use this kind of interface when setup functions
 * need to return both data and helper methods
 */
interface ISetupPresentationResult {
  getHeaders: () => HTTPHeaders;
  getPresentationId: () => string;
}
