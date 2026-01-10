/**
 * TEST FILE NAMES
 *
 * This file contains constants for test file names used in upload tests.
 * Store actual test files in the appropriate subdirectory:
 * - audio-data/ for audio files
 * - video-data/ for video files
 * - documents-data/ for document files
 * - screenshots/ for image files
 *
 * TODO: Replace with your own test file names
 *
 * Example usage:
 * ```typescript
 * import { fileNames } from '@test-data/fileNameData';
 *
 * const videoPath = path.join('test-data/video-data', fileNames.sampleVideo);
 * await page.setInputFiles('input[type="file"]', videoPath);
 * ```
 */

export const fileNames = {
  // Video files - place in test-data/video-data/
  sampleVideo: "sample_video.mp4",
  largeVideo: "large_video.mp4",

  // Audio files - place in test-data/audio-data/
  sampleAudio: "sample_audio.mp3",

  // Document files - place in test-data/documents-data/
  samplePdf: "sample_document.pdf",
  sampleDoc: "sample_document.docx",

  // Image files - place in test-data/screenshots/
  sampleImage: "sample_image.png",

  // TODO: Add your test files here
};