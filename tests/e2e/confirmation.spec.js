import { test, expect } from "@playwright/test";
import { PRODUCTS, generateFromOrder, pdfText, downloadBytes } from "./helpers.js";

for (const [slug, code, name] of PRODUCTS) {
  test.describe(`confirmation page: ${name}`, () => {
    test("issues the order-linked code, shows the details, and activates it", async ({ page }) => {
      const order = `cs_live_${code}_a1b2c3`;
      const expected = await generateFromOrder(code, order);
      await page.goto(`/thank-you/${slug}/?session_id=${order}`);
      await expect(page.locator("h1")).toHaveText("Your order is complete");
      await expect(page.locator("[data-code]")).toHaveAttribute("aria-label", expected.split("").join(" "));
      await expect(page.locator("[data-order]")).toHaveText(order);
      await expect(page.locator("[data-issued]")).not.toHaveText("—");
      await expect(page.locator("[data-status]")).toContainText("Activated in this browser");
      await expect(page.locator(".ty-list")).toContainText(name);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("nfk.licenses")));
      expect(stored.map((l) => l.code)).toContain(expected);

      // The same order always produces the same code, in a fresh browser too.
      await page.evaluate(() => localStorage.clear());
      await page.goto(`/thank-you/${slug}/?session_id=${order}`);
      await expect(page.locator("[data-code]")).toHaveAttribute("aria-label", expected.split("").join(" "));
    });

    test("other provider parameters are read as the order reference", async ({ page }) => {
      for (const key of ["order_id", "order", "transaction_id", "txn_id", "token"]) {
        const expected = await generateFromOrder(code, `ref-${key}`);
        await page.goto(`/thank-you/${slug}/?${key}=ref-${key}`);
        await expect(page.locator("[data-code]")).toHaveAttribute("aria-label", expected.split("").join(" "));
      }
    });

    test("without an order reference, issues a random valid code that stays the same on reload", async ({ page }) => {
      await page.goto(`/thank-you/${slug}/`);
      await expect(page.locator("[data-code]")).toHaveAttribute("aria-label", /^N O V A/);
      const label = await page.locator("[data-code]").getAttribute("aria-label");
      const issued = label.replace(/ /g, "");
      expect(issued).toMatch(new RegExp(`^NOVA-${code}-`));
      await expect(page.locator("[data-order-row]")).toBeHidden();
      await page.reload();
      await expect(page.locator("[data-code]")).toHaveAttribute("aria-label", label);
    });
  });
}

test("the confirmation PDF contains the details and policy links", async ({ page, browserName }) => {
  const order = "cs_live_pdf_check_9";
  const expected = await generateFromOrder("EV", order);
  await page.goto(`/thank-you/event-coverage-guide/?session_id=${order}`);
  await expect(page.locator("[data-save]")).toBeEnabled();
  const { name, bytes } = await downloadBytes(page, () => page.click("[data-save]"));
  expect(name).toBe("novaris-order-confirmation-event-coverage-guide.pdf");
  const pdf = await pdfText(bytes);
  for (const s of ["Order confirmation", "Your order is complete", "Event Coverage Guide", expected, order, "Terms of Service", "Refund Policy", "Delivery Policy", "buckenovaris@novarisguides.com"]) {
    expect(pdf.text, `PDF should contain ${s} (${browserName})`).toContain(s);
  }
  for (const p of ["/terms.html", "/refunds.html", "/delivery.html"]) expect(pdf.links.some((l) => l.endsWith(p))).toBe(true);
});

test("Open Field Kit goes straight into the purchased guide", async ({ page }) => {
  await page.goto("/thank-you/product-photography-guide/?order_id=open-kit-1");
  await expect(page.locator("[data-status]")).toContainText("Activated");
  await page.click("[data-open]");
  await expect(page).toHaveURL(/\/field-kit\/#\/guide\/product-photography-guide/);
  await page.locator(".fk-walkthrough button", { hasText: "Skip" }).click();
  await expect(page.locator("main h2").first()).toHaveText("Shot lists");
});
