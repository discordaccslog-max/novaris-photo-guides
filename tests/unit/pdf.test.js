import test from "node:test";
import assert from "node:assert/strict";
import { PdfDoc, wrapText, textWidth } from "../../js/pdf.js";
import { buildConfirmationPdf } from "../../js/confirmation.js";
import { pdfText } from "./helpers.js";

test("PDF writer produces a valid document with text and links", async () => {
  const doc = new PdfDoc({ size: "a4", title: "Test" });
  doc.text("Hello (world) \\ – “quotes” • ok", 54, 80, { size: 12 });
  doc.paragraph("A longer paragraph that wraps across the width of the page. ".repeat(20));
  doc.link(54, 70, 100, 14, "https://example.org/x");
  const bytes = doc.output();
  assert.equal(String.fromCharCode(...bytes.slice(0, 8)), "%PDF-1.4");
  const r = await pdfText(bytes);
  assert.ok(r.text.includes("Hello (world) \\ – “quotes” • ok"), r.text.slice(0, 80));
  assert.deepEqual(r.links, ["https://example.org/x"]);
});

test("long content flows onto new pages", async () => {
  const doc = new PdfDoc();
  for (let i = 0; i < 120; i++) doc.paragraph(`Line ${i}`);
  const r = await pdfText(doc.output());
  assert.ok(r.pages >= 3);
  assert.match(r.text, /Line 119/);
});

test("word wrapping respects the width", () => {
  const lines = wrapText("one two three four five six seven eight nine ten", 60, 11);
  for (const l of lines) assert.ok(textWidth(l, 11) <= 60 || !l.includes(" "));
  assert.ok(lines.length > 2);
});

test("confirmation PDF contains the order details and policy links", async () => {
  const bytes = buildConfirmationPdf({
    productName: "Wedding Day Guide",
    licenseCode: "NOVA-WD-ABCD-EFGH-JKMN",
    issuedAtLabel: "13 November 2026, 10:30 (UTC+00:00)",
    orderRef: "cs_live_123",
    siteUrl: "https://novaris-photo-guides.vercel.app",
    supportEmail: "buckenovaris@novarisguides.com",
    fieldKitUrl: "https://novaris-photo-guides.vercel.app/field-kit/",
    paper: "letter"
  });
  const r = await pdfText(bytes);
  for (const s of ["Order confirmation", "Your order is complete", "Wedding Day Guide", "NOVA-WD-ABCD-EFGH-JKMN", "13 November 2026", "cs_live_123", "Terms of Service", "Refund Policy", "Delivery Policy", "buckenovaris@novarisguides.com"]) {
    assert.ok(r.text.includes(s), `missing ${s}`);
  }
  for (const page of ["terms.html", "refunds.html", "delivery.html"]) {
    assert.ok(r.links.some((l) => l.endsWith(page)), `missing link ${page}`);
  }
});

test("confirmation PDF without an order reference leaves that line out", async () => {
  const r = await pdfText(buildConfirmationPdf({
    productName: "Portrait Session Guide", licenseCode: "NOVA-PT-ABCD-EFGH-JKMN", issuedAtLabel: "1 January 2027, 09:00",
    siteUrl: "https://x.test", supportEmail: "a@b.c", fieldKitUrl: "https://x.test/field-kit/", paper: "a4"
  }));
  assert.equal(r.text.includes("Order reference"), false);
  assert.ok(r.text.includes("NOVA-PT-ABCD-EFGH-JKMN"));
});
