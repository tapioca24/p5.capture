import { expect } from "@playwright/test";
import { test } from "./fixture";
import fs from "fs/promises";

const PAGE_PATH = "/tests/e2e/public/index.html";
const VIDEO_FORMATS = ["webm", "gif", "mp4"];
const IMAGE_FORMATS = ["png", "jpg", "webp"];
const CAPTURE_TIME = 200;

test("display the ui", async ({ page, port }) => {
  await page.goto(`http://localhost:${port}${PAGE_PATH}`);
  const container = page.locator(".p5c-container");
  await expect(container).toBeVisible();
  await expect(container).toHaveClass(/idle/);
});

VIDEO_FORMATS.forEach((format) => {
  test(`download ${format} video`, async ({ page, port }) => {
    await page.goto(`http://localhost:${port}${PAGE_PATH}`);

    // Select format
    await page.locator(".p5c-format").selectOption(format);

    // Start capturing
    await page.locator(".p5c-btn").click();

    await page.waitForTimeout(CAPTURE_TIME);

    // Stop capturing & download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator(".p5c-btn").click(),
    ]);

    const filename = await download.suggestedFilename();
    const pattern = new RegExp(`^\\d{8}-\\d{6}\\.${format}$`);
    expect(filename).toMatch(pattern);

    const path = await download.path();
    expect(path).toBeTruthy();
    const stats = await fs.stat(path!);
    const fileSizeInBytes = stats.size;
    expect(fileSizeInBytes).toBeGreaterThan(100);
  });
});

IMAGE_FORMATS.forEach((format) => {
  test(`download zipped ${format} files`, async ({ page, port }) => {
    await page.goto(`http://localhost:${port}${PAGE_PATH}`);

    // Select format
    await page.locator(".p5c-format").selectOption(format);

    // Start capturing
    await page.locator(".p5c-btn").click();

    await page.waitForTimeout(CAPTURE_TIME);

    // Stop capturing & download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator(".p5c-btn").click(),
    ]);

    const filename = await download.suggestedFilename();
    const pattern = new RegExp(`^\\d{8}-\\d{6}\\.zip$`);
    expect(filename).toMatch(pattern);

    const path = await download.path();
    expect(path).toBeTruthy();
    const stats = await fs.stat(path!);
    const fileSizeInBytes = stats.size;
    expect(fileSizeInBytes).toBeGreaterThan(100);
  });
});
