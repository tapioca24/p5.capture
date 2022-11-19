import { expect } from "@playwright/test";
import { test } from "./fixture";
import fs from "fs/promises";

const PAGE_PATH = "/tests/e2e/public/before-download.html";
const CAPTURE_TIME = 200;

test("Custom processing is called before downloading", async ({
  page,
  port,
}) => {
  await page.goto(`http://localhost:${port}${PAGE_PATH}`);

  const consoleMessages: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "log") {
      consoleMessages.push(msg.text());
    }
  });

  // Start capturing
  await page.locator(".p5c-btn").click();

  await page.waitForTimeout(CAPTURE_TIME);

  // Stop capturing & download
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.waitForEvent("console"),
    page.locator(".p5c-btn").click(),
  ]);

  expect(consoleMessages.includes("my custom processing")).toBe(true);

  const filename = await download.suggestedFilename();
  const pattern = new RegExp(`^\\d{8}-\\d{6}\\.webm$`);
  expect(filename).toMatch(pattern);

  const path = await download.path();
  expect(path).toBeTruthy();
  const stats = await fs.stat(path!);
  const fileSizeInBytes = stats.size;
  expect(fileSizeInBytes).toBeGreaterThan(100);
});
