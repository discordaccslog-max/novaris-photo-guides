import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const catalog = () => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.resolve("js/products.js"), "utf8"), ctx); return ctx.window.NOVARIS_PRODUCTS; };
const PDF_PAGES = catalog().filter((p) => p.format === "pdf").map((p) => `/${p.slug}.html`);

const PAGES = ["/", "/about.html", "/faq.html", "/contact.html", "/terms.html", "/privacy.html", "/refunds.html", "/delivery.html", "/disclaimer.html", "/consumer-rights.html",
  "/portrait-session-guide.html", "/wedding-day-guide.html", "/product-photography-guide.html", "/landscape-travel-field-guide.html", "/event-coverage-guide.html", "/complete-reference-library.html", ...PDF_PAGES];

test("no buy button or checkbox shows while checkout links are empty", async ({ page }) => {
  await page.goto("/portrait-session-guide.html");
  await expect(page.locator(".price-meta").first()).toHaveText("Instant access with a license · 14-day refund policy · Applicable taxes are shown at checkout.");
  await expect(page.locator(".buy-button")).toHaveCount(0);
  await expect(page.locator(".buy-check")).toHaveCount(0);
  await expect(page.locator(".buy-slot").first()).toBeEmpty();
});

test("with a checkout link, buy buttons stay disabled until the terms box is ticked", async ({ page }) => {
  // Test-only: serve a catalog with a checkout link to exercise the buy box.
  await page.route("**/js/products.js", async (route) => {
    const body = fs.readFileSync(path.resolve("js/products.js"), "utf8").replace('confirmationPath: "/thank-you/wedding-day-guide/",\n    checkoutUrl: ""', 'confirmationPath: "/thank-you/wedding-day-guide/",\n    checkoutUrl: "https://checkout.invalid/wedding"');
    await route.fulfill({ body, contentType: "text/javascript" });
  });
  await page.goto("/wedding-day-guide.html");
  const box = page.locator(".buy-box");
  await expect(box.locator(".buy-check")).toContainText("I agree to the Terms of Service and Refund Policy");
  await expect(box.locator(".buy-check a[href='/terms.html']")).toHaveCount(1);
  await expect(box.locator(".buy-check a[href='/refunds.html']")).toHaveCount(1);
  const button = box.locator(".buy-button");
  await expect(button).toHaveAttribute("aria-disabled", "true");
  await expect(button).not.toHaveAttribute("href", /.+/);
  await expect(box.locator(".buy-hint")).toBeVisible();
  await box.locator(".buy-check input").check();
  await expect(button).toHaveAttribute("href", "https://checkout.invalid/wedding");
  await expect(box.locator(".buy-hint")).toBeHidden();
  // The closing buy area follows the same choice.
  await expect(page.locator(".closing-buy .buy-check input")).toBeChecked();
});

test("PDF guides: add-ons update the total and are passed to checkout", async ({ page }) => {
  // Test-only: serve a catalog with a checkout link to exercise the add-ons.
  await page.route("**/js/products.js", async (route) => {
    const body = fs.readFileSync(path.resolve("js/products.js"), "utf8").replace(/("outfit-planning-sheet",[^\]]*\],\s+checkoutUrl: )""/, '$1"https://checkout.invalid/engagement"');
    await route.fulfill({ body, contentType: "text/javascript" });
  });
  await page.goto("/engagement-session-guide.html");
  const box = page.locator(".buy-box");
  await expect(box.locator("[data-total]")).toHaveText("$30");
  await expect(page.locator(".addon")).toHaveCount(4);
  await box.locator(".buy-check input").check();
  const button = box.locator(".buy-button");
  await expect(button).toHaveAttribute("href", "https://checkout.invalid/engagement");
  await expect(button).toHaveText("Buy Engagement Session Guide — $30");
  await page.locator("label[for='addon-couple-questionnaire']").click();
  await page.locator("label[for='addon-prompt-card-deck']").click();
  await expect(box.locator("[data-total]")).toHaveText("$35");
  await expect(button).toHaveText("Buy Engagement Session Guide + 2 add-ons — $35");
  await expect(button).toHaveAttribute("href", "https://checkout.invalid/engagement?addons=couple-questionnaire%2Cprompt-card-deck");
  await expect(page.locator(".closing-buy .buy-button")).toHaveAttribute("href", /addons=couple-questionnaire%2Cprompt-card-deck$/);
  await page.locator("label[for='addon-couple-questionnaire']").click();
  await expect(box.locator("[data-total]")).toHaveText("$33");
  await expect(button).toHaveAttribute("href", "https://checkout.invalid/engagement?addons=prompt-card-deck");
});

test("PDF guide library lists every PDF guide and filters by category", async ({ page }) => {
  await page.goto("/index.html#pdf-guides");
  const grid = page.locator("[data-filter-grid]");
  await expect(grid.locator(".card")).toHaveCount(PDF_PAGES.length);
  await expect(page.locator(".chip-filters")).toBeVisible();
  await page.locator(".chip-filter[data-filter='weddings']").click();
  await expect(page.locator(".chip-filter[data-filter='weddings']")).toHaveAttribute("aria-pressed", "true");
  await expect(grid.locator(".card:visible")).toHaveCount(3);
  await page.locator(".chip-filter[data-filter='all']").click();
  await expect(grid.locator(".card:visible")).toHaveCount(PDF_PAGES.length);
  // PDF product pages carry no license-code wording in the buy box.
  await page.goto("/drone-aerial-planning-guide.html");
  await expect(page.locator(".price-meta").first()).toHaveText("Instant PDF download · 14-day refund policy · Applicable taxes are shown at checkout.");
});

test("every internal link and asset on every page resolves", async ({ page, request }) => {
  test.skip(test.info().project.name !== "desktop-chromium", "Run once");
  const seen = new Set();
  const all = [...PAGES, "/404.html", "/thank-you/portrait-session-guide/", "/field-kit/"];
  for (const p of all) {
    await page.goto(p);
    const refs = await page.evaluate(() => [...document.querySelectorAll("a[href], link[href], script[src], iframe[src]")].map((e) => e.getAttribute("href") || e.getAttribute("src")));
    for (const ref of refs) {
      if (!ref || /^(mailto:|https?:|#|data:)/.test(ref)) continue;
      const url = new URL(ref, "http://localhost" + p);
      const key = url.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      const res = await request.get(url.pathname);
      expect(res.status(), `${p} links to ${ref}`).toBe(200);
      if (url.hash && url.hash.length > 1 && key.endsWith(".html") && !url.hash.startsWith("#/")) {
        const html = await res.text();
        expect(html.includes(`id="${url.hash.slice(1)}"`), `${p} links to missing anchor ${ref}`).toBe(true);
      }
    }
  }
  expect(seen.size).toBeGreaterThan(25);
});

test("pages fit narrow screens without sideways scrolling", async ({ page }) => {
  test.skip(test.info().project.name === "desktop-chromium", "Mobile only");
  for (const p of [...PAGES, "/thank-you/wedding-day-guide/", "/field-kit/"]) {
    await page.goto(p);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, p).toBeLessThanOrEqual(1);
  }
});

test("support email, header, and footer links are present", async ({ page }) => {
  await page.goto("/contact.html");
  await expect(page.locator("main a[href='mailto:buckenovaris@novarisguides.com']").first()).toBeVisible();
  await expect(page.locator("main")).toContainText("within two business days");
  await expect(page.locator("main")).toContainText("order number");
  await expect(page.locator("main")).toContainText("email address you used at checkout");
  await expect(page.locator(".site-nav a", { hasText: "Field Kit" })).toHaveAttribute("href", "/field-kit/");
  await expect(page.locator(".site-footer a", { hasText: "Activate a license" })).toHaveAttribute("href", "/field-kit/#/start");
  await expect(page.locator(".site-footer a[href^='mailto:buckenovaris@novarisguides.com']")).toHaveCount(1);
});

test("product page previews render the real Field Kit", async ({ page }) => {
  await page.goto("/event-coverage-guide.html");
  // Previews load lazily, as a visitor scrolls to them.
  await page.locator(".kit-frame").first().scrollIntoViewIfNeeded();
  const frame = page.frameLocator(".kit-frame iframe").first();
  await expect(frame.locator(".fk-preview-bar")).toContainText("Event Coverage Guide");
  await frame.locator('.dg-el[data-id="ceiling"]').click();
  await expect(frame.locator(".fk-info h3")).toHaveText("Ceiling (bounce surface)");
});
