import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/hall-of-fame",
  "/races",
  "/races/dublin-series-2-race-1",
  "/stations",
  "/stations/ski-erg",
  "/calculator",
  "/contact",
];

for (const path of PAGES) {
  test(`${path} renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("main, body").first()).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
