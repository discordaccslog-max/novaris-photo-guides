/* Novaris Photo Guides — the order confirmation PDF. */
import { PdfDoc, textWidth } from "./pdf.js";

const INK = [31, 29, 26];
const MUTED = [91, 85, 77];
const AMBER = [143, 74, 6];
const LINE = [217, 207, 190];

/*
  details: {
    productName, licenseCode, issuedAtLabel, orderRef (optional),
    siteUrl, supportEmail, fieldKitUrl, paper ("letter" | "a4")
  }
*/
export function buildConfirmationPdf(details) {
  const d = details;
  const doc = new PdfDoc({ size: d.paper || "letter", title: `Order confirmation - ${d.productName}` });
  const m = doc.margin;
  const w = doc.contentWidth;

  doc.rect(0, 0, doc.width, 8, { stroke: null, fill: [224, 154, 44] });
  doc.text("NOVARIS PHOTO GUIDES", m, m + 8, { size: 9, font: "bold", color: AMBER });
  doc.text("Order confirmation", m, m + 38, { size: 24, font: "bold", color: INK });
  doc.y = m + 56;
  doc.paragraph("Your order is complete and your product has been delivered. Your license is shown below and was activated in the browser where this confirmation was issued.", { size: 11.5, color: MUTED });

  // License code panel
  doc.y += 6;
  const panelY = doc.y;
  doc.rect(m, panelY, w, 86, { stroke: LINE, fill: [251, 248, 242], width: 1 });
  doc.text("LICENSE CODE", m + 18, panelY + 24, { size: 8.5, font: "bold", color: MUTED });
  const codeSize = 22;
  doc.text(d.licenseCode, m + 18, panelY + 56, { size: codeSize, font: "mono", color: INK });
  doc.text("Enter this code in the Field Kit on any device you use.", m + 18, panelY + 74, { size: 9.5, color: MUTED });
  doc.y = panelY + 86 + 22;

  // Details
  const rows = [
    ["Product", d.productName],
    ["Status", "Order complete. Delivered as instant access in the Novaris Field Kit."],
    ["Date and time", d.issuedAtLabel]
  ];
  if (d.orderRef) rows.push(["Order reference", d.orderRef]);
  rows.push(["Field Kit", d.fieldKitUrl]);
  const labelW = 120;
  for (const [label, value] of rows) {
    doc.ensureSpace(30);
    doc.line(m, doc.y, m + w, doc.y, { color: LINE });
    doc.y += 16;
    doc.text(label, m, doc.y, { size: 10, color: MUTED });
    const startY = doc.y - 11;
    doc.y = startY;
    doc.paragraph(value, { size: 10.5, font: label === "Product" ? "bold" : "regular", x: m + labelW, width: w - labelW, gap: 4 });
    if (label === "Field Kit") doc.link(m + labelW, startY, Math.min(w - labelW, textWidth(value, 10.5)), 14, value);
  }
  doc.line(m, doc.y, m + w, doc.y, { color: LINE });
  doc.y += 22;

  doc.text("Using your guide", m, doc.y + 4, { size: 13, font: "bold" });
  doc.y += 16;
  const steps = [
    `On this device: open the Field Kit at ${d.fieldKitUrl}. Your license is already active in the browser where this confirmation was issued.`,
    "On another phone, tablet, or computer: open the Field Kit there and enter the license code above.",
    "Add the Field Kit to your home screen to use your guides offline on location.",
    "Keep this confirmation. If you lose your code, contact us with your order number and we will send a replacement."
  ];
  steps.forEach((s, i) => doc.paragraph(`${i + 1}.  ${s}`, { size: 10.5, x: m + 4, width: w - 4, gap: 3 }));
  doc.y += 10;

  doc.text("Policies", m, doc.y + 4, { size: 13, font: "bold" });
  doc.y += 18;
  const links = [
    ["Terms of Service", `${d.siteUrl}/terms.html`],
    ["Refund Policy (full refund within 14 days, no reason required)", `${d.siteUrl}/refunds.html`],
    ["Delivery Policy", `${d.siteUrl}/delivery.html`]
  ];
  for (const [label, url] of links) {
    doc.ensureSpace(30);
    doc.text(label, m, doc.y + 10, { size: 10.5, font: "bold" });
    doc.text(url, m, doc.y + 24, { size: 10, color: AMBER });
    doc.link(m, doc.y + 12, textWidth(url, 10), 14, url);
    doc.y += 34;
  }

  doc.ensureSpace(40);
  doc.y += 6;
  doc.paragraph(`Questions or a lost code: ${d.supportEmail}. We reply within two business days.`, { size: 10, color: MUTED });
  doc.text(`Novaris Photo Guides  ·  ${d.siteUrl}`, m, doc.height - 30, { size: 8.5, color: MUTED });
  return doc.output();
}
