import { readFile } from "fs/promises";
import { promisify } from "util";
import { expect } from "@playwright/test";
import { unzip as unzipCb } from "fflate";
import { test } from "./fixture";
import { IMAGE_FORMATS } from "./helper";

const PAGE_PATH = "/tests/e2e/public/image-filename.html";
const CAPTURE_TIME = 200;
const unzip = promisify(unzipCb);

IMAGE_FORMATS.forEach((format) => {
  test(`zip file contains ${format} images with custom filename`, async ({
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

    const zipped = await readFile(path!);
    const unzipped = await unzip(zipped);
    const filenames = Object.keys(unzipped)
      .map((path) => path.split("/").pop())
      .filter(Boolean);

    const pattern = new RegExp(`^sketch-\\d{10}\\.${format}$`);
    filenames.forEach((filename) => {
      expect(filename).toMatch(pattern);
    });
  });
});
