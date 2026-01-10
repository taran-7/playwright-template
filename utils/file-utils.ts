/**
 * FILE UTILITIES FOR TEST DATA GENERATION
 *
 * This file contains utilities for generating fake media files for testing.
 * Useful when you need to test file uploads without real media files.
 *
 * Example use cases:
 * - Testing file upload functionality
 * - Testing file size validation
 * - Testing file type validation
 *
 * TODO: Add more file generation utilities as needed
 */

import fs from "fs";
import fsp from "fs/promises";
import crypto from "crypto";
import path from "path";

/**
 * Generate a fake video file with valid MP4 header
 *
 * Creates a file with proper MP4 magic bytes so it's recognized as video.
 * The content is mostly empty but the file will pass basic format checks.
 *
 * @param filePath - Full path where to create the file
 * @param sizeInBytes - Target size of the file
 *
 * Example:
 * ```typescript
 * await generateFakeVideoFile('/tmp/test-video.mp4', 5 * 1024 * 1024); // 5MB
 * ```
 */
export const generateFakeVideoFile = async (
  filePath: string,
  sizeInBytes: number,
): Promise<void> => {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });

  const fh = await fsp.open(filePath, "w");
  try {
    // Valid MP4 header (ftyp box) so file is recognized as video
    const mp4Header = Buffer.from([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
      0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    ]);

    await fh.write(mp4Header, 0, mp4Header.length, 0);
    await fh.truncate(sizeInBytes);
  } finally {
    await fh.close();
  }
};

/**
 * Generate a fake media file with random content
 *
 * Creates a file with random bytes and a randomly selected extension.
 * Useful for testing file type validation.
 *
 * @param baseDir - Directory where to create the file
 * @param allowedExtensions - Array of extensions to choose from (e.g., ['.mp4', '.mov'])
 * @param sizeInBytes - Target size (default: 1MB)
 * @returns Promise with filePath and extension
 *
 * Example:
 * ```typescript
 * const { filePath, extension } = await generateFakeMediaFile(
 *   './test-data',
 *   ['.mp4', '.mov', '.avi'],
 *   2 * 1024 * 1024 // 2MB
 * );
 * ```
 */
export const generateFakeMediaFile = (
  baseDir: string,
  allowedExtensions: string[],
  sizeInBytes: number = 1 * 1024 * 1024,
): Promise<{ filePath: string; extension: string }> => {
  return new Promise((resolve, reject) => {
    if (!allowedExtensions || allowedExtensions.length === 0) {
      return reject(new Error("Allowed extensions array is empty."));
    }

    const randomExt =
      allowedExtensions[Math.floor(Math.random() * allowedExtensions.length)];
    const fileName = `fake-upload-${Date.now()}${randomExt}`;
    const filePath = path.join(baseDir, fileName);

    const writeStream = fs.createWriteStream(filePath);
    const chunkSize = 1024 * 128; // 128KB chunks
    let totalBytesWritten = 0;

    const writeNext = () => {
      if (totalBytesWritten < sizeInBytes) {
        const chunk = crypto.randomBytes(
          Math.min(chunkSize, sizeInBytes - totalBytesWritten),
        );
        writeStream.write(chunk, () => {
          totalBytesWritten += chunk.length;
          writeNext();
        });
      } else {
        writeStream.end();
        resolve({ filePath, extension: randomExt });
      }
    };

    writeNext();
    writeStream.on("error", reject);
  });
};
