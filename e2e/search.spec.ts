import { test, expect } from "@playwright/test";

test("search groups by athlete, opens profile, result and comes back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Emer Breen");

  await expect(page).toHaveURL(/\?q=Emer\+Breen|\?q=Emer%20Breen/);
  const athlete = page.getByRole("link", { name: "Emer Breen", exact: true });
  await expect(athlete).toBeVisible();
  await expect(athlete).toHaveAttribute("href", /^\/athletes\/emer-breen\?q=/);
  // One row per athlete
  await expect(page.getByRole("link", { name: "Emer Breen", exact: true })).toHaveCount(1);

  await athlete.click();
  await expect(page).toHaveURL(/\/athletes\/emer-breen\?q=/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Emer Breen");
  const results = page.locator('table a[href^="/results/"]');
  expect(await results.count()).toBeGreaterThanOrEqual(3);
  // Doubles partners link to their own profiles
  await expect(page.getByRole("link", { name: "Grainne Bolger" }).first()).toHaveAttribute(
    "href",
    "/athletes/grainne-bolger",
  );

  await results.first().click();
  await expect(page).toHaveURL(/\/results\/\d+\?q=/);
  await expect(page.getByRole("heading", { level: 1 }).getByRole("link", { name: /Emer Breen/ })).toBeVisible();

  await page.getByRole("link", { name: /Back to search/ }).click();
  await expect(page).toHaveURL(/\/\?q=Emer/);
  await expect(page.getByRole("searchbox")).toHaveValue("Emer Breen");
  await expect(page.locator('a[href^="/athletes/"]').first()).toBeVisible();
});

test("search is diacritic-insensitive", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Ciaran");
  await expect(page.getByText(/Ciarán/).first()).toBeVisible();
});

test("profile invites logged-out visitors to log in to claim", async ({ page }) => {
  await page.goto("/athletes/emer-breen");
  const cta = page.getByRole("link", { name: /Log in to claim/ });
  await expect(cta).toHaveAttribute("href", "/login?next=%2Fathletes%2Femer-breen");
  await cta.click();
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign-in link/ })).toBeVisible();
});
