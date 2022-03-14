import { test, expect } from "@playwright/test";
import fs from "fs/promises";
import { server } from "./server";

const PAGE_URL = "http://localhost:3000/tests/e2e/public/index.html";
const VIDEO_FORMATS = ["webm", "gif"];
const IMAGE_FORMATS = ["png", "jpg", "webp"];
const CAPTURE_TIME = 200;

test.beforeAll(() => {
  return new Promise<void>((resolve) => {
    const port = process.env.PORT || 3000;
    server.listen(port, resolve);
  });
});

test.afterAll(() => {
  return new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test("display the ui", async ({ page }) => {
  await page.goto(PAGE_URL);
  const container = page.locator(".p5c-container");
  await expect(container).toBeVisible();
  await expect(container).toHaveClass(/idle/);
});

VIDEO_FORMATS.forEach((format) => {
  test(`download ${format} video`, async ({ page }) => {
    await page.goto(PAGE_URL);

    // Select format
    await page.locator(".p5c-format").selectOption(format);

    // Start capturing
    const label = page.locator(".p5c-label");
    await label.evaluate((elem: HTMLLabelElement) => elem.click());

    await page.waitForTimeout(CAPTURE_TIME);

    // Stop capturing & download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      label.evaluate((elem: HTMLLabelElement) => elem.click()),
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
  test(`download zipped ${format} files`, async ({ page }) => {
    await page.goto(PAGE_URL);

    // Select format
    await page.locator(".p5c-format").selectOption(format);

    // Start capturing
    const label = page.locator(".p5c-label");
    await label.evaluate((elem: HTMLLabelElement) => elem.click());

    await page.waitForTimeout(CAPTURE_TIME);

    // Stop capturing & download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      label.evaluate((elem: HTMLLabelElement) => elem.click()),
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
