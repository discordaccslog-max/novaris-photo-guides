import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const catalog = () => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.resolve("js/products.js"), "utf8"), ctx); return ctx.window.NOVARIS_PRODUCTS; };
const PDF_PAGES = catalog().filter((p) => p.format === "pdf").map((p) => `/${p.slug}.html`);

const PAGES = ["/", "/about.html", "/faq.html", "/contact.html", "/terms.html", "/privacy.html", "/refunds.html", "/delivery.html", "/disclaimer.html", "/consumer-rights.html",
  "/portrait-session-guide.html", "/wedding-day-guide.html", "/product-photography-guide.html", "/landscape-travel-field-guide.html", "/event-coverage-guide.html", "/complete-reference-library.html", ...PDF_PAGES];

test("every product page has an Add to cart button and no direct buy link", async ({ page }) => {
  await page.goto("/portrait-session-guide.html");
  await expect(page.locator(".price-meta").first()).toHaveText("Instant access with a license · 14-day refund policy · Applicable taxes are shown at checkout.");
  await expect(page.locator(".buy-box .cart-button")).toHaveText("Add to cart — $34");
  await expect(page.locator(".closing-buy .cart-button")).toHaveCount(1);
  await expect(page.locator(".buy-button")).toHaveCount(0);
  await expect(page.locator(".header-cart [data-cart-count]")).toBeHidden();
});

test("cart: add guides with add-ons, change them, and remove them", async ({ page }) => {
  await page.goto("/engagement-session-guide.html");
  const box = page.locator(".buy-box");
  const button = box.locator(".cart-button");
  await expect(page.locator(".addon")).toHaveCount(4);
  await expect(box.locator("[data-total]")).toHaveText("$30");
  await page.locator("label[for='addon-couple-questionnaire']").click();
  await page.locator("label[for='addon-prompt-card-deck']").click();
  await expect(box.locator("[data-total]")).toHaveText("$35");
  await expect(button).toHaveText("Add to cart with 2 add-ons — $35");
  await button.click();
  await expect(button).toHaveText("View cart");
  await expect(box.locator(".cart-status")).toHaveText("In your cart.");
  await expect(page.locator(".header-cart [data-cart-count]")).toHaveText("1");
  // Changing add-ons offers an update; the cart keeps the saved choice until then.
  await page.locator("label[for='addon-couple-questionnaire']").click();
  await expect(button).toHaveText("Update cart with 1 add-on — $33");
  await button.click();
  await expect(button).toHaveText("View cart");
  // Add-ons are restored from the cart on the next visit.
  await page.reload();
  await expect(page.locator("#addon-prompt-card-deck")).toBeChecked();
  await expect(page.locator("#addon-couple-questionnaire")).not.toBeChecked();

  await page.goto("/wedding-day-guide.html");
  await page.locator(".buy-box .cart-button").click();
  await expect(page.locator(".header-cart [data-cart-count]")).toHaveText("2");

  await page.goto("/cart.html");
  const items = page.locator(".cart-item");
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText("Engagement Session Guide");
  await expect(items.first()).toContainText("+ Prompt card deck");
  await expect(items.first().locator(".cart-item-total")).toHaveText("$33");
  await expect(page.locator("[data-cart-subtotal]")).toHaveText("$85");
  await expect(items.first().locator("a[href='/engagement-session-guide.html#add-ons']")).toHaveText("Change add-ons");
  await page.getByRole("button", { name: "Remove Wedding Day Guide from your cart" }).click();
  await expect(items).toHaveCount(1);
  await expect(page.locator("[data-cart-subtotal]")).toHaveText("$33");
  await expect(page.locator(".header-cart [data-cart-count]")).toHaveText("1");
});

test("cart: checkout needs the terms box, and checkout is a placeholder", async ({ page }) => {
  await page.goto("/cart.html");
  await expect(page.locator(".cart-empty")).toContainText("Your cart is empty.");
  await page.goto("/drone-aerial-planning-guide.html");
  await page.locator(".buy-box .cart-button").click();
  await page.goto("/cart.html");
  const go = page.locator(".cart-checkout");
  await expect(page.locator(".buy-check")).toContainText("I agree to the Terms of Service and Refund Policy");
  await expect(page.locator(".buy-check a[href='/terms.html']")).toHaveCount(1);
  await expect(page.locator(".buy-check a[href='/refunds.html']")).toHaveCount(1);
  await expect(go).toHaveAttribute("aria-disabled", "true");
  await expect(go).not.toHaveAttribute("href", /.+/);
  await expect(page.locator(".buy-hint")).toBeVisible();
  await page.locator("#cart-agree").check();
  await expect(go).toHaveAttribute("href", "/checkout.html");
  await expect(page.locator(".buy-hint")).toBeHidden();
  await go.click();
  await expect(page).toHaveURL(/\/checkout\.html$/);
  await expect(page.locator("[data-checkout-summary] .cart-item")).toContainText("Drone & Aerial Planning Guide");
  await expect(page.locator("[data-checkout-form]")).toContainText("Checkout is coming soon.");
  await expect(page.locator("[data-checkout-form] input")).toHaveCount(0);
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex, nofollow");
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
  const all = [...PAGES, "/404.html", "/cart.html", "/checkout.html", "/thank-you/portrait-session-guide/", "/field-kit/"];
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
  for (const p of [...PAGES, "/cart.html", "/checkout.html", "/thank-you/wedding-day-guide/", "/field-kit/"]) {
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
