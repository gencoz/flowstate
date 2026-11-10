import { expect, test } from "@playwright/test";

test("creates a project, adds a task and records the workflow", async ({ page }) => {
  await page.goto("/");

  const mobileMenu = page.getByRole("button", { name: "Open menu" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();

  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill("E2E launch");
  await page.getByLabel("Description").fill("Verified through the browser");
  await page.getByRole("button", { name: "Create project" }).click();

  await expect(page.getByRole("heading", { name: "E2E launch" })).toBeVisible();
  const closeMenu = page.getByRole("button", { name: "Close menu" });
  if (await closeMenu.isVisible()) await closeMenu.click();
  await page.getByRole("button", { name: "Add task" }).first().click();
  await page.getByLabel("Task name").fill("Ship browser test");
  await page.getByLabel("Description").fill("Exercise the complete user workflow");
  await page.getByRole("textbox", { name: "Due date" }).fill("2026-11-20");
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByRole("button", { name: "Ship browser test" })).toBeVisible();
  await page.getByLabel("Move Ship browser test").selectOption("done");
  await expect(page.getByRole("region", { name: "Board summary" }).getByText("100%")).toBeVisible();

  await page.getByRole("button", { name: "Open recent activity" }).click();
  await expect(page.getByRole("dialog", { name: "Recent activity" }).getByText("Ship browser test").first()).toBeVisible();
});

test("keeps task movement discoverable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only interaction check");
  await page.goto("/");
  const moveControl = page.getByLabel("Move Build command palette");
  await expect(moveControl).toBeVisible();
  await expect(moveControl).toHaveValue("in-progress");
});
