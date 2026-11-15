import { test, expect } from "@playwright/test";

test("result detail tabs switch and sync to the URL", async ({ page }) => {
  await page.goto("/results/15079");
  await expect(page.getByRole("button", { name: "Workout Result" })).toBeVisible();

  await page.getByRole("button", { name: "Splits" }).click();
  await expect(page).toHaveURL(/tab=splits/);

  await page.getByRole("button", { name: "Stations" }).click();
  await expect(page).toHaveURL(/tab=stations/);
  await expect(page.locator("svg").first()).toBeVisible();

  await page.getByRole("button", { name: "Runs" }).click();
  await expect(page).toHaveURL(/tab=runs/);

  await page.getByRole("button", { name: "Workout Result" }).click();
  await expect(page).not.toHaveURL(/tab=/);
});

test("unknown result id returns 404", async ({ page }) => {
  const res = await page.goto("/results/999999999");
  expect(res?.status()).toBe(404);
});
