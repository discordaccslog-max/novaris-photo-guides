/*
  Builds fulfillment-kit/ from the LIVE site: screenshots of every delivery step
  for every product, a screen recording of one complete flow, the plain-text
  business summary, and Fulfillment-Overview.pdf.  Run: npm run kit
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { chromium, devices, request as pwRequest } from "@playwright/test";
import { generateRandom, validate } from "../js/license.js";
import { startServer } from "./serve.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "fulfillment-kit");
const SHOTS = path.join(OUT, "screenshots");
const load = (rel) => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx); return ctx.window; };
const { NOVARIS_PRODUCTS: PRODUCTS } = load("js/products.js");
const { NOVARIS_SITE: SITE } = load("js/site-config.js");
const BASE = SITE.siteUrl.replace(/\/$/, "");
const DATE = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const CHECKOUT_READY = PRODUCTS.every((p) => /^https:\/\//.test(p.checkoutUrl || ""));
const PHONE = { ...devices["iPhone 13"], locale: "en-US", timezoneId: "America/New_York" };
const DESKTOP = { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: "en-US", timezoneId: "America/New_York" };

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(SHOTS, { recursive: true });

const shots = []; // { file, product, step, caption }
const urlsCited = new Set();
const cite = (u) => { urlsCited.add(u); return u; };

async function snap(page, product, step, caption, { fullPage = false } = {}) {
  const n = String(shots.length + 1).padStart(3, "0");
  const file = `${n}-${product}-${step}.png`;
  await page.screenshot({ path: path.join(SHOTS, file), fullPage });
  shots.push({ file, product, step, caption });
  return file;
}

async function settle(page) {
  await page.evaluate(async () => {
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible"));
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function skipWalkthrough(page) {
  const skip = page.locator(".fk-walkthrough button", { hasText: "Skip" });
  if (await skip.count()) await skip.click();
}

/* Renders PDF pages to PNG with pdf.js, served locally from node_modules. */
async function renderPdf(browser, bytes, baseName, product, caption) {
  const server = await startServer(8671);
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  await page.goto("http://localhost:8671/404.html");
  const images = await page.evaluate(async (b64) => {
    const pdfjs = await import("/node_modules/pdfjs-dist/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs";
    const data = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const doc = await pdfjs.getDocument({ data, standardFontDataUrl: "/node_modules/pdfjs-dist/standard_fonts/" }).promise;
    const out = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const pg = await doc.getPage(i);
      const vp = pg.getViewport({ scale: 1.6 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      out.push(canvas.toDataURL("image/png"));
    }
    return out;
  }, Buffer.from(bytes).toString("base64"));
  await page.close();
  server.close();
  const files = [];
  images.forEach((d, i) => {
    const n = String(shots.length + 1).padStart(3, "0");
    const file = `${n}-${product}-${baseName}${images.length > 1 ? `-p${i + 1}` : ""}.png`;
    fs.writeFileSync(path.join(SHOTS, file), Buffer.from(d.split(",")[1], "base64"));
    shots.push({ file, product, step: baseName, caption: images.length > 1 ? `${caption} (page ${i + 1} of ${images.length})` : caption });
    files.push(file);
  });
  return files;
}

/* What each guide looks like in use (phone). */
const IN_USE = {
  "portrait-session-guide": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/shotlists`);
    await page.locator(".fk-template", { hasText: "Family session" }).getByRole("button", { name: "Start a new session" }).click();
    for (const i of [0, 1, 2]) await page.locator(".fk-check-label").nth(i).click();
    await snap(page, slug, "in-use-shotlist", "Shot list in use: shots ticked off, progress bar, and the next shot highlighted.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/lighting/one-light`);
    await page.locator('.dg-el[data-id="key"]').click();
    await snap(page, slug, "in-use-lighting", "Lighting diagram: the key light tapped, showing its role and setup notes.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/poses/couple-side`);
    await snap(page, slug, "in-use-pose", "Posing reference with notes and suggested camera height.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning`);
    await page.locator(".fk-template", { hasText: "Client questionnaire" }).getByRole("button", { name: "Start new" }).click();
    await snap(page, slug, "in-use-questionnaire", "Client questionnaire editor with PDF exports for the photographer's clients.");
  },
  "wedding-day-guide": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/shotlists`);
    await page.getByRole("button", { name: "Start a new session" }).first().click();
    for (const i of [0, 1, 2, 3]) await page.locator(".fk-check-label").nth(i).click();
    await snap(page, slug, "in-use-shotlist", "Full-day shot list in use, organized by phase.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning`);
    await page.locator(".fk-template", { hasText: "Full-day timeline" }).getByRole("button", { name: "Start new" }).click();
    await snap(page, slug, "in-use-timeline", "Editable full-day timeline.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning`);
    await page.locator(".fk-template", { hasText: "Family formals grouping planner" }).getByRole("button", { name: "Start new" }).click();
    await snap(page, slug, "in-use-formals", "Family formals grouping planner.");
  },
  "product-photography-guide": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/lighting/reflective`);
    await page.locator('.dg-el[data-id="flag"]').click();
    await snap(page, slug, "in-use-lighting", "Lighting diagram for reflective products with the black card tapped.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/shotlists`);
    await page.locator(".fk-template", { hasText: "Standard e-commerce angles" }).getByRole("button", { name: "Start a new session" }).click();
    for (const i of [0, 1]) await page.locator(".fk-check-label").nth(i).click();
    await snap(page, slug, "in-use-shotlist", "E-commerce angle shot list in use.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/settings`);
    await page.locator(".fk-calc").scrollIntoViewIfNeeded();
    await snap(page, slug, "in-use-calculator", "Exposure calculator in the Settings section.");
  },
  "landscape-travel-field-guide": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning/sun`);
    await page.fill("#sun-lat", "37.7459");
    await page.fill("#sun-lon", "-119.5332");
    await page.fill("#sun-label", "Yosemite Valley");
    await page.selectOption("#sun-tz", "America/Los_Angeles");
    await page.locator(".fk-sun-list").scrollIntoViewIfNeeded();
    await snap(page, slug, "in-use-sun", "Sunrise and sunset planner with a location entered: golden and blue hour times and sun directions.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/settings`);
    await page.selectOption("#calc-nd", { value: "10" });
    await page.locator(".fk-calc").scrollIntoViewIfNeeded();
    await snap(page, slug, "in-use-calculator", "Exposure calculator with a 10-stop ND filter selected.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning/composition`);
    await snap(page, slug, "in-use-composition", "Composition reference.");
  },
  "event-coverage-guide": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/lighting/ceiling-bounce`);
    await page.locator('.dg-el[data-id="ceiling"]').click();
    await snap(page, slug, "in-use-lighting", "Flash setup diagram with the bounce surface tapped.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/shotlists`);
    await page.locator(".fk-template", { hasText: "Conference" }).getByRole("button", { name: "Start a new session" }).click();
    for (const i of [0, 1, 2]) await page.locator(".fk-check-label").nth(i).click();
    await snap(page, slug, "in-use-shotlist", "Conference shot list in use.");
    await page.goto(`${BASE}/field-kit/#/guide/${slug}/planning`);
    await page.locator(".fk-template", { hasText: "Run-of-show" }).getByRole("button", { name: "Start new" }).click();
    await snap(page, slug, "in-use-runofshow", "Run-of-show planning sheet.");
  },
  "complete-reference-library": async (page, slug) => {
    await page.goto(`${BASE}/field-kit/#/`);
    await snap(page, slug, "in-use-home", "Your guides: one Complete Reference Library license unlocks all five guides.", { fullPage: true });
    await page.goto(`${BASE}/field-kit/#/settings`);
    await snap(page, slug, "in-use-licenses", "Field Kit settings: the Licenses section lists the active license and has a field for adding another.");
    await page.goto(`${BASE}/field-kit/#/guide/event-coverage-guide/lighting/off-camera`);
    await page.locator('.dg-el[data-id="stand"]').click();
    await snap(page, slug, "in-use-event", "A guide from the library in use: an Event Coverage Guide flash diagram.");
  }
};

async function productFlow(browser, p) {
  const slug = p.slug;
  // 1. Product page (desktop): price, delivery method, refund policy.
  const desk = await browser.newContext(DESKTOP);
  const page = await desk.newPage();
  await page.goto(cite(`${BASE}/${slug}.html`));
  await settle(page);
  await snap(page, slug, "product-page", "Product page, top: price in USD, the delivery method (instant access with a license), the 14-day refund policy link, and the note that applicable taxes are shown at checkout.");
  if (CHECKOUT_READY) {
    const box = page.locator(".buy-box");
    await box.scrollIntoViewIfNeeded();
    await snap(page, slug, "checkout-before", "Buy box with the terms checkbox unticked: the buy button is disabled with a note explaining why.");
    await box.locator(".buy-check input").check();
    await snap(page, slug, "checkout-after", "Buy box after ticking the terms checkbox: the buy button is enabled and opens the payment provider checkout.");
    await box.locator(".buy-check input").uncheck();
  }
  await snap(page, slug, "product-page-full", "Full product page: contents, live Field Kit previews, who it is for, requirements, and how delivery works.", { fullPage: true });

  // 2. Confirmation page (the page buyers are sent to after payment).
  const conf = await desk.newPage();
  await conf.goto(cite(`${BASE}${p.confirmationPath}`));
  await conf.locator("[data-status]").filter({ hasText: "Activated" }).waitFor();
  await conf.waitForTimeout(2600);
  const code = (await conf.locator("[data-code]").getAttribute("aria-label")).replace(/ /g, "");
  if (!validate(code).valid) throw new Error("Confirmation page issued an invalid code");
  await snap(conf, slug, "confirmation", "Confirmation page: order complete, product delivered, date and time, the license code with a copy button, activation in this browser, and the Open Field Kit, Save confirmation (PDF), and Print buttons.", { fullPage: true });

  // 3. Saved confirmation PDF.
  const [download] = await Promise.all([conf.waitForEvent("download"), conf.click("[data-save]")]);
  const pdfBytes = fs.readFileSync(await download.path());
  const pdfName = `confirmation-${slug}.pdf`;
  fs.mkdirSync(path.join(OUT, "confirmation-pdfs"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "confirmation-pdfs", pdfName), pdfBytes);
  await renderPdf(browser, pdfBytes, "confirmation-pdf", slug, "The saved confirmation PDF, with links to the Terms of Service, Refund Policy, and Delivery Policy.");

  // 4. Open Field Kit from the confirmation page (same browser).
  await conf.click("[data-open]");
  await conf.waitForURL(/\/field-kit\//);
  await conf.waitForTimeout(800);
  await snap(conf, slug, "open-field-kit", "Open Field Kit goes straight into the purchased guide in the same browser (first-visit walkthrough shown).");
  await desk.close();

  // 5. Activating the same code on another device (phone).
  const phone = await browser.newContext(PHONE);
  const pp = await phone.newPage();
  await pp.goto(cite(`${BASE}/field-kit/`));
  await pp.fill("#lic-input", code);
  await snap(pp, slug, "activate-start", "Another device: the Field Kit start screen with the license code entered.");
  await pp.click(".fk-activate button[type=submit]");
  await pp.waitForTimeout(700);
  await skipWalkthrough(pp);
  await snap(pp, slug, "activate-done", "After activation, the guide opens on the phone.");

  // 6. Guide in use.
  await IN_USE[slug](pp, slug);
  await phone.close();
  return code;
}

async function recordVideo(browser) {
  const p = PRODUCTS.find((x) => x.slug === "portrait-session-guide");
  const ctx = await browser.newContext({ ...PHONE, recordVideo: { dir: path.join(OUT, "video-tmp"), size: { width: 390, height: 844 } } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${p.confirmationPath}`);
  await page.waitForTimeout(3500);
  await page.locator("[data-code]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.locator("[data-open]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.click("[data-open]");
  await page.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) { await page.locator(".fk-walkthrough .btn-primary").click(); await page.waitForTimeout(900); }
  await page.locator(".fk-walkthrough .btn-primary").click();
  await page.waitForTimeout(800);
  await page.locator(".fk-template", { hasText: "Family session" }).getByRole("button", { name: "Start a new session" }).click();
  await page.waitForTimeout(1000);
  for (const i of [0, 1, 2]) { await page.locator(".fk-check-label").nth(i).click(); await page.waitForTimeout(700); }
  await page.goto(`${BASE}/field-kit/#/guide/portrait-session-guide/lighting/one-light`);
  await page.waitForTimeout(1200);
  await page.locator('.dg-el[data-id="key"]').click();
  await page.waitForTimeout(1500);
  await page.locator(".fk-info").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  const video = page.video();
  await ctx.close();
  fs.renameSync(await video.path(), path.join(OUT, "flow-video-confirmation-to-guide.webm"));
  fs.rmSync(path.join(OUT, "video-tmp"), { recursive: true, force: true });
}

async function checkReviewerCodes(browser, codes) {
  for (const [slug, code] of Object.entries(codes)) {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/field-kit/`);
    await page.fill("#lic-input", code);
    await page.click(".fk-activate button[type=submit]");
    await page.waitForTimeout(600);
    const licenses = await page.evaluate(() => JSON.parse(localStorage.getItem("nfk.licenses") || "[]"));
    if (!licenses.some((l) => l.code === code)) throw new Error(`Reviewer code for ${slug} did not activate on the live site`);
    await ctx.close();
  }
}

/* ---------- Text ---------- */

function summaryText(reviewerCodes) {
  const lines = [];
  const L = (s = "") => lines.push(s);
  L("BUSINESS AND FULFILLMENT SUMMARY");
  L(`Prepared ${DATE}`);
  L();
  L("Business name: Novaris Photo Guides");
  L(`Website: ${cite(BASE + "/")}`);
  L(`Customer support: ${SITE.supportEmail} (replies within two business days)`);
  L(`Contact page: ${cite(BASE + "/contact.html")}`);
  L("Hosting: the website is a static site hosted on Vercel.");
  L();
  L("WHAT WE SELL");
  L("Licenses to interactive photography field guides that run in the web browser on phones, tablets, and computers. The guides live in the Novaris Field Kit, a web app on our website, and are unlocked with a license code. They contain reference and planning tools: shot lists, lighting diagrams, posing references, settings tables with an exposure calculator, a sunrise and sunset planner, planning worksheets, and client questionnaires, with PDF export and printing. All products are digital; nothing is shipped.");
  L();
  L("Products and prices (USD; applicable taxes are shown at checkout):");
  for (const p of PRODUCTS) L(`- ${p.name}: $${p.price} (${cite(BASE + "/" + p.slug + ".html")})`);
  L();
  L("HOW PRODUCTS ARE DELIVERED");
  L(CHECKOUT_READY
    ? "1. On the product page the buyer ticks a box agreeing to the Terms of Service and Refund Policy, then pays through the payment provider's checkout."
    : "1. On the product page, the buy button opens the payment provider's checkout after the buyer ticks a required box agreeing to the Terms of Service and Refund Policy. Buy buttons appear on each product page once its checkout link is added.");
  L(`2. After payment the buyer is taken to the product's confirmation page (for example ${cite(BASE + "/thank-you/portrait-session-guide/")}). It states that the order is complete and the product is delivered, shows the product, date and time, the order reference when the payment provider supplies one, and the license code with a copy button, and it activates the license in that browser automatically. The buyer can save the confirmation as a PDF or print it.`);
  L("3. The Open Field Kit button takes the buyer straight into the purchased guide.");
  L(`4. To use the guide on another device, the buyer opens the Field Kit (${cite(BASE + "/field-kit/")}) and enters the same license code.`);
  L("Delivery is immediate. There is no physical shipment and no shipping charge.");
  L();
  L("REPLACEMENT LICENSES");
  L(`Buyers who lose a code contact ${SITE.supportEmail} with their order number and checkout email. When the payment provider includes its order ID in the confirmation page address, the code is derived from that order ID, so support reissues the identical code from the order reference; otherwise support issues a new valid code for the purchased product. Codes activated on a device are also listed in the Field Kit's settings.`);
  L();
  L("REFUNDS");
  L(`Full refund on any purchase requested within 14 days, no reason required, through the Contact page with the order number. Refunds go to the original payment method within 5 business days of the request; the payment provider's processing time may add a few days. The license ends when a purchase is refunded. Refund Policy: ${cite(BASE + "/refunds.html")}`);
  L();
  L("CUSTOMER DATA");
  L("No customer accounts. The website uses no cookies, analytics, or advertising trackers. Licenses and saved work are stored only in the buyer's own browser. From the payment provider we receive name, email, products purchased, and country, used only for support, refunds, and tax and accounting.");
  L();
  L("POLICIES");
  for (const [n, u] of [["Terms of Service", "/terms.html"], ["Refund Policy", "/refunds.html"], ["Delivery Policy", "/delivery.html"], ["Privacy Policy", "/privacy.html"], ["Disclaimer", "/disclaimer.html"], ["Consumer rights (EU and UK)", "/consumer-rights.html"], ["FAQ", "/faq.html"]]) L(`- ${n}: ${cite(BASE + u)}`);
  L();
  L("REVIEWER ACCESS");
  L(`Open ${BASE}/field-kit/ and enter one of these license codes to use the guides:`);
  for (const p of PRODUCTS) L(`- ${p.name}: ${reviewerCodes[p.slug]}`);
  return lines.join("\n");
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const img = (file) => `data:image/png;base64,${fs.readFileSync(path.join(SHOTS, file)).toString("base64")}`;

function overviewHtml(summary, reviewerCodes) {
  const byProduct = (slug) => shots.filter((s) => s.product === slug && s.step !== "product-page-full");
  const figure = (s) => `<figure><img src="${img(s.file)}" alt=""><figcaption><strong>${esc(s.file)}</strong> · ${esc(s.caption)}</figcaption></figure>`;
  const ex = "portrait-session-guide";
  const exShots = byProduct(ex);
  const pick = (step) => exShots.filter((s) => s.step === step || s.step.startsWith(step));
  const checkout = CHECKOUT_READY
    ? `<p>On each product page, a required checkbox reading “I agree to the Terms of Service and Refund Policy,” with both documents linked, sits above the buy buttons; they stay disabled until it is ticked, then open the payment provider checkout.</p>${pick("checkout").map(figure).join("")}`
    : `<p>The checkout step is described in writing in this kit. On each product page, buy buttons appear when the product's checkout link is in place. Above them is a required checkbox reading “I agree to the Terms of Service and Refund Policy,” with both documents linked; the buy buttons stay disabled, with a short note explaining why, until it is ticked. The button then opens the payment provider's checkout, where applicable taxes are shown before payment. Screenshots of the buy box are added to this kit when the checkout links are in place.</p>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Fulfillment Overview - Novaris Photo Guides</title>
<style>
  @page { size: Letter; margin: 16mm 14mm; }
  body { font: 10.5pt/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1f1d1a; }
  h1 { font-size: 22pt; margin: 0 0 4pt; } h2 { font-size: 15pt; margin: 22pt 0 6pt; border-bottom: 1px solid #ccc; padding-bottom: 4pt; break-after: avoid; }
  h3 { font-size: 12pt; margin: 14pt 0 4pt; break-after: avoid; }
  pre { white-space: pre-wrap; font: 9.5pt/1.45 Consolas, Menlo, monospace; background: #f6f3ee; border: 1px solid #ddd; padding: 10pt; }
  figure { margin: 8pt 0 14pt; break-inside: avoid; }
  figure img { max-width: 100%; max-height: 640px; border: 1px solid #ccc; display: block; }
  figcaption { font-size: 9pt; color: #444; margin-top: 4pt; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
  .grid figure img { max-height: 520px; }
  table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccc; padding: 5pt 7pt; text-align: left; font-size: 10pt; }
  code { font-family: Consolas, Menlo, monospace; }
  .page-break { break-before: page; }
  .muted { color: #555; }
</style></head><body>
<h1>Fulfillment Overview</h1>
<p class="muted">Novaris Photo Guides · ${esc(BASE)} · ${esc(DATE)}</p>

<h2>1. Business and Fulfillment Summary</h2>
<p class="muted">Plain text for payment processor forms. The same text is saved as Business-and-Fulfillment-Summary.txt.</p>
<pre>${esc(summary)}</pre>

<h2 class="page-break">2. Delivery process, step by step</h2>
<p>Example: ${esc(PRODUCTS.find((p) => p.slug === ex).name)}. Every product follows the same steps; each product's screenshots are in section 6. All screenshots were taken on the live site, ${esc(BASE)}.</p>
<h3>Step 1: Product page</h3>
<p>The product page shows the price in USD, the delivery method (“Instant access with a license”), the 14-day refund policy with a link, and that applicable taxes are shown at checkout, together with the guide's full contents, live previews, and requirements, before any purchase step.</p>
${pick("product-page").map(figure).join("")}
<h3>Step 2: Checkout</h3>
${checkout}
<h3>Step 3: Confirmation page</h3>
<p>After payment the buyer is taken to the product's confirmation page. It states the order is complete and the product is delivered; shows the product, date and time, the order reference when the payment provider adds one to the address, and the license code with a copy button; and activates the license in that browser. The screenshots in this kit show the page opened without a payment-provider order ID, so the order reference line does not appear and the code is generated at random. When an order ID is present (<code>session_id</code>, <code>order_id</code>, <code>order</code>, <code>transaction_id</code>, <code>txn_id</code>, or <code>token</code>), the code is generated from it, so the same order always produces the same code.</p>
${pick("confirmation").filter((s) => s.step === "confirmation").map(figure).join("")}
<h3>Step 4: Saved confirmation PDF</h3>
<p>Save confirmation downloads a PDF with the product, date and time, order reference (when available), license code, and links to the Terms of Service, Refund Policy, and Delivery Policy. A Print button prints the page.</p>
${pick("confirmation-pdf").map(figure).join("")}
<h3>Step 5: Open Field Kit</h3>
<p>The Open Field Kit button goes straight into the purchased guide in the same browser, where the license is already active.</p>
${pick("open-field-kit").map(figure).join("")}
<h3>Step 6: Activating on another device</h3>
<p>On another device the buyer opens the Field Kit at ${esc(BASE)}/field-kit/ and enters the same code. The “Activate a license” link in the website footer opens the same start screen.</p>
<div class="grid">${pick("activate").map(figure).join("")}</div>
<h3>Step 7: Using the guide</h3>
<div class="grid">${pick("in-use").map(figure).join("")}</div>

<h2 class="page-break">3. Replacement licenses</h2>
<p>A buyer who loses a code contacts ${esc(SITE.supportEmail)} (or uses the Contact page) with the order number and the email used at checkout. When the payment provider includes its order ID in the confirmation page address, the license code is derived from that order ID, so support reissues the identical code from the order reference. Otherwise, support issues a new valid code for the purchased product. A code that has been activated on a device is also listed in that device's Field Kit settings under Licenses.</p>

<h2>4. Refunds</h2>
<p>Full refund on any purchase requested within 14 days, with no reason required, through the Contact page with the order number. Refunds go to the original payment method within 5 business days of the request; the payment provider's processing time may add a few days. The license ends when a purchase is refunded. Policy: ${esc(BASE)}/refunds.html. EU and UK consumer information: ${esc(BASE)}/consumer-rights.html.</p>

<h2>5. Reviewer access</h2>
<p>Open <strong>${esc(BASE)}/field-kit/</strong> and enter a license code below. Each code was activated on the live site while this kit was built. The Complete Reference Library code unlocks all five guides.</p>
<table><tr><th>Product</th><th>License code</th></tr>
${PRODUCTS.map((p) => `<tr><td>${esc(p.name)}</td><td><code>${esc(reviewerCodes[p.slug])}</code></td></tr>`).join("")}
</table>
<p>Other files in this folder: <code>screenshots/</code> (every step for every product, including full-page product pages), <code>confirmation-pdfs/</code> (the saved confirmation PDFs), <code>flow-video-confirmation-to-guide.webm</code> (screen recording from the confirmation page into a guide in use), and <code>Business-and-Fulfillment-Summary.txt</code>.</p>

${PRODUCTS.map((p, i) => `<h2 class="page-break">6.${i + 1} ${esc(p.name)} ($${p.price})</h2>
<p>Product page: ${esc(BASE)}/${p.slug}.html · Confirmation page: ${esc(BASE)}${esc(p.confirmationPath)}</p>
<div class="grid">${byProduct(p.slug).map(figure).join("")}</div>`).join("\n")}
</body></html>`;
}

/* ---------- Run ---------- */

const browser = await chromium.launch();
console.log(`Building fulfillment kit from ${BASE}`);
for (const p of PRODUCTS) {
  console.log(`  ${p.name}`);
  await productFlow(browser, p);
}
console.log("  Recording flow video");
await recordVideo(browser);

const reviewerCodes = Object.fromEntries(PRODUCTS.map((p) => [p.slug, generateRandom(p.productCode)]));
await checkReviewerCodes(browser, reviewerCodes);
const summary = summaryText(reviewerCodes);
fs.writeFileSync(path.join(OUT, "Business-and-Fulfillment-Summary.txt"), summary + "\n");

// Every URL cited in the kit must load on the live site.
const api = await pwRequest.newContext();
for (const u of urlsCited) {
  const res = await api.get(u);
  if (res.status() !== 200) throw new Error(`Cited URL did not load: ${u} (${res.status()})`);
}
await api.dispose();

const page = await browser.newPage();
await page.setContent(overviewHtml(summary, reviewerCodes), { waitUntil: "load" });
await page.pdf({ path: path.join(OUT, "Fulfillment-Overview.pdf"), format: "Letter", printBackground: true });
await browser.close();
console.log(`Done: ${shots.length} screenshots, ${urlsCited.size} URLs verified. Checkout screenshots: ${CHECKOUT_READY ? "included" : "not included (checkout links are empty)"}.`);
console.log("Reviewer codes:\n" + PRODUCTS.map((p) => `  ${p.name}: ${reviewerCodes[p.slug]}`).join("\n"));
