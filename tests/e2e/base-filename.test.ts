import { expect } from "@playwright/test";
import { test } from "./fixture";
import fs from "fs/promises";
import { IMAGE_FORMATS, VIDEO_FORMATS } from "./helper";

const PAGE_PATH = "/tests/e2e/public/base-filename.html";
const CAPTURE_TIME = 200;

VIDEO_FORMATS.forEach((format) => {
  test(`download ${format} video with custom filename`, async ({
    page,
    port,
  }) => {
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
    expect(filename).toBe(`custom-filename.${format}`);

    const path = await download.path();
    expect(path).toBeTruthy();
    const stats = await fs.stat(path!);
    const fileSizeInBytes = stats.size;
    expect(fileSizeInBytes).toBeGreaterThan(100);
  });
});

IMAGE_FORMATS.forEach((format) => {
  test(`download zip file for ${format} with custom filename`, async ({
    page,
    port,
  }) => {
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
    expect(filename).toMatch("custom-filename.zip");

    const path = await download.path();
    expect(path).toBeTruthy();
    const stats = await fs.stat(path!);
    const fileSizeInBytes = stats.size;
    expect(fileSizeInBytes).toBeGreaterThan(100);
  });
});
