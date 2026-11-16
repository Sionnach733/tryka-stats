import { test, expect } from "@playwright/test";

test("search for an athlete, open a result and come back", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("searchbox");
  await input.fill("Breen");

  await expect(page).toHaveURL(/\?q=Breen/);
  const firstResult = page.locator('a[href^="/results/"]').first();
  await expect(firstResult).toBeVisible();
  await expect(firstResult).toHaveAttribute("href", /\?q=Breen/);

  await firstResult.click();
  await expect(page).toHaveURL(/\/results\/\d+\?q=Breen/);

  await page.getByRole("link", { name: /Back to search/ }).click();
  await expect(page).toHaveURL(/\/\?q=Breen/);
  await expect(page.getByRole("searchbox")).toHaveValue("Breen");
  await expect(page.locator('a[href^="/results/"]').first()).toBeVisible();
});

test("search is diacritic-insensitive", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Ciaran");
  await expect(page.getByText(/Ciarán/).first()).toBeVisible();
});
