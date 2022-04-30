import { Download, expect } from "@playwright/test";
import { test } from "./fixture";
import fs from "fs/promises";

const PAGE_PATH = "/tests/e2e/public/auto-save-duration.html";
const IMAGE_FORMATS = ["png", "jpg", "webp"];

IMAGE_FORMATS.forEach((format) => {
  test(`download segmented zipped ${format} files`, async ({ page, port }) => {
    await page.goto(`http://localhost:${port}${PAGE_PATH}`);

    // Select format
    await page.locator(".p5c-format").selectOption(format);

    // Start capturing
    await page.locator(".p5c-btn").click();

    const downloads: Download[] = [];

    // Wait for download first zip
    downloads.push(await page.waitForEvent("download"));

    // Wait for download second zip
    downloads.push(await page.waitForEvent("download"));

    for (const download of downloads) {
      const filename = download.suggestedFilename();
      const pattern = new RegExp(`^\\d{8}-\\d{6}\\.zip$`);
      expect(filename).toMatch(pattern);

      const path = await download.path();
      expect(path).toBeTruthy();
      const stats = await fs.stat(path!);
      const fileSizeInBytes = stats.size;
      expect(fileSizeInBytes).toBeGreaterThan(100);
    }
  });
});
