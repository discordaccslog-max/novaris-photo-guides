/*
  Novaris Photo Guides — generates the static storefront pages, confirmation
  pages, sitemap, and the Field Kit service worker.  Run: npm run build
  Product names and prices come from js/products.js; the support email from js/site-config.js.
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import * as S from "./site-svg.js";
import { PRODUCT_PAGES, MATRIX } from "./site-content.js";
import { makeServiceWorker } from "./make-sw.js";
import { pdfLibrarySection, pdfProductPage, previews } from "./pdf-pages.js";
import { loadGuides } from "./make-catalog-pdfs.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (rel) => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx); return ctx.window; };
const { NOVARIS_PRODUCTS: PRODUCTS } = load("js/products.js");
const { NOVARIS_SITE: SITE } = load("js/site-config.js");

const BASE = SITE.siteUrl.replace(/\/$/, "");
const EMAIL = SITE.supportEmail;
const MAIL = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const UPDATED = "November 13, 2026";
const ISO_DATE = "2026-11-13";
const FIELD_KIT = PRODUCTS.filter((p) => p.format !== "pdf");
const PDFS = PRODUCTS.filter((p) => p.format === "pdf");
const GUIDES = FIELD_KIT.filter((p) => p.productCode !== "CR");
const CONTENT = Object.fromEntries((await loadGuides()).map((g) => [g.slug, g]));

const esc = (s) => String(s).replace(/&(?!amp;|#)/g, "&amp;").replace(/"/g, "&quot;");
const html = (s) => String(s).replace(/&(?!amp;|#)/g, "&amp;");
const fmt = (n) => "$" + n;
const metaLine = `Instant access with a license · <a href="/refunds.html">14-day refund policy</a> · Applicable taxes are shown at checkout.`;

/* ---------- Layout ---------- */

function head({ title, desc, url, noindex }) {
  const canonical = url === null ? null : BASE + url;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Novaris Photo Guides">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${canonical && !noindex ? `<meta property="og:url" content="${canonical}">\n` : ""}<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="theme-color" content="#f4efe6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151311" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/css/styles.css">
<script>document.documentElement.classList.add("js");</script>
<script src="/js/site-config.js" defer></script>
<script src="/js/products.js" defer></script>
<script src="/js/cart.js" defer></script>
<script src="/js/main.js" defer></script>
</head>`;
}

const NAV = [["/index.html#guides", "Guides", "guides"], ["/field-kit/", "Field Kit", "fieldkit"], ["/about.html", "About", "about"], ["/faq.html", "FAQ", "faq"], ["/contact.html", "Contact", "contact"]];

function header(current) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/index.html">${S.logo}<span>Novaris <span class="brand-sub">Photo Guides</span></span></a>
    <nav class="site-nav" aria-label="Main">
      <ul>
${NAV.map(([href, label, key]) => `        <li><a href="${href}"${key === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("\n")}
      </ul>
    </nav>
    <a class="header-cart" href="/cart.html" aria-label="Cart"${current === "cart" ? ' aria-current="page"' : ""}>${S.icons.cart}<span>Cart</span><span class="cart-count" data-cart-count hidden>0</span></a>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <p class="footer-brand">Novaris Photo Guides</p>
        <p>Photography field guides for your phone and printable PDF guides: shot lists, lighting diagrams, posing references, settings, and planning worksheets.</p>
        <p>Support: <a href="mailto:${EMAIL}" data-support-email>${EMAIL}</a></p>
        <p><a href="/field-kit/#/start">Activate a license</a></p>
      </div>
      <nav aria-label="Guides">
        <p class="footer-heading">Guides</p>
        <ul class="footer-links footer-links-single">
${FIELD_KIT.map((q) => `          <li><a href="/${q.slug}.html">${html(q.name)}</a></li>`).join("\n")}
          <li><a href="/index.html#pdf-guides">PDF guide library (${PDFS.length} guides)</a></li>
        </ul>
      </nav>
      <div class="footer-cols">
        <nav aria-label="Policies and help">
          <p class="footer-heading">Policies and help</p>
          <ul class="footer-links">
            <li><a href="/terms.html">Terms</a></li>
            <li><a href="/privacy.html">Privacy</a></li>
            <li><a href="/refunds.html">Refunds</a></li>
            <li><a href="/delivery.html">Delivery</a></li>
            <li><a href="/disclaimer.html">Disclaimer</a></li>
            <li><a href="/consumer-rights.html">Consumer rights</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/faq.html">FAQ</a></li>
            <li><a href="/field-kit/">Field Kit</a></li>
            <li><a href="/about.html">About</a></li>
          </ul>
        </nav>
      </div>
    </div>
    <p class="footer-mark" aria-hidden="true">Novaris</p>
    <div class="footer-bottom">
      <p>&copy; <span data-year>2026</span> Novaris Photo Guides. All rights reserved.</p>
      <p>Prices in USD. Applicable taxes are shown at checkout.</p>
    </div>
  </div>
</footer>`;
}

const TO_TOP = `<a class="to-top" href="#top"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden">Back to top</span></a>`;

function pageDoc({ title, desc, url, current, body, noindex, mainAttrs = "", extraHead = "" }) {
  return `${head({ title, desc, url, noindex }).replace("</head>", extraHead + "</head>")}
<body id="top">
<div class="progress" aria-hidden="true"></div>
${header(current)}
<main id="main"${mainAttrs}>
${body}
</main>
${TO_TOP}
${footer()}
</body>
</html>
`;
}

function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/* ---------- Shared pieces ---------- */

function kitFrame(slug, p, i = 0) {
  const src = `/field-kit/?preview=${slug}&view=${p.view}${p.item ? `&item=${p.item}` : ""}`;
  return `      <figure class="kit-preview reveal" style="--stagger:${i}">
        <div class="kit-frame"><iframe src="${src}" title="Field Kit preview: ${esc(p.caption)}" loading="lazy"></iframe></div>
        <figcaption>${html(p.caption)}</figcaption>
      </figure>`;
}

function faqItem([q, a]) {
  return `      <details class="faq-item">
        <summary>${q}</summary>
        <div class="faq-answer">${a.startsWith("<p>") ? a : `<p>${a}</p>`}</div>
      </details>`;
}

const Y = '<span class="yes" aria-hidden="true">&#10003;</span><span class="visually-hidden">Included</span>';
const N = '<span class="no" aria-hidden="true">&mdash;</span><span class="visually-hidden">Not included</span>';

function productCard(p, i) {
  const page = PRODUCT_PAGES[p.slug];
  return `      <article class="card reveal${p.productCode === "CR" ? " card-featured" : ""}" style="--stagger:${i}" data-product="${p.slug}">
        <span class="card-glow" aria-hidden="true"><span></span></span>
        ${p.productCode === "CR" ? '<span class="card-tag">All five guides, one license</span>\n        ' : ""}${S.icons[page.icon]}
        <h3><a href="/${p.slug}.html">${html(p.name)}</a></h3>
        <p>${html(p.short)}</p>
        <div class="card-foot">
          <span class="card-price"><span data-price>${fmt(p.price)}</span><span class="visually-hidden"> US dollars</span></span>
          <span class="card-link" aria-hidden="true">View details &rarr;</span>
        </div>
      </article>`;
}

function filmstrip() {
  const items = ["Checkable shot lists", "Tap-to-explain lighting diagrams", "Illustrated posing references", "Exposure calculator", "Sunrise and sunset planner", "Planning worksheets", "Client questionnaires", "PDF export and printing", "Offline on location", "Outdoor and night modes"];
  const frames = () => items.map((t, i) => `<li class="film-frame"><span class="film-code">${String(i + 1).padStart(2, "0")}A</span>${t}</li>`).join("");
  return `<div class="filmstrip" role="region" aria-label="What the field guides do">
  <div class="film-track">
    <ul class="film-list">${frames()}</ul>
    <ul class="film-list" aria-hidden="true">${frames()}</ul>
  </div>
</div>`;
}

/* ---------- Home ---------- */

const homeFaq = [
  ["What do I get when I buy a guide?", `Instant access. After payment you're taken to a confirmation page that shows your license code and activates it in that browser, with an Open Field Kit button that goes straight into your guide. See the <a href="/delivery.html">Delivery Policy</a>.`],
  ["What's the difference between Field Kit and PDF guides?", "Field Kit guides are interactive: they run in your browser, save your shot lists and worksheets, and unlock with a license code. PDF guides are printable files you download after payment, with optional add-ons such as pocket cards, planners, and templates."],
  ["Do the guides work on my phone, and offline?", "Yes. The Field Kit runs in any modern web browser on a phone, tablet, or computer. Install it to your home screen and, once it has loaded, your guides work offline on location."],
  ["Can I use one license on more than one device?", "Yes. Open the Field Kit on the other device and enter the same license code. A Complete Reference Library code unlocks all five guides."],
  ["What if I change my mind?", `You can request a full refund within 14 days of purchase, with no reason required, through the <a href="/contact.html">Contact page</a>. See the <a href="/refunds.html">Refund Policy</a>.`]
];

function home() {
  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-intro">
      <span class="eyebrow">Photography field guides &middot; On your phone and in print</span>
      <h1 id="hero-title"><span class="line"><span>Field guides for</span></span> <span class="line"><span>the shoot in</span></span> <span class="line"><span>front of you.</span></span></h1>
      <p class="lede">Novaris Photo Guides makes reference and planning guides for photographers, in two formats. Interactive Field Kit guides run in your web browser and are built for use on a phone during a shoot, unlocked with a license code. Printable PDF guides cover ${PDFS.length} more kinds of work, each with optional add-ons. Both hold shot lists, lighting diagrams, settings, and planning worksheets for one kind of photography.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#guides">Browse the guides</a>
        <a class="btn btn-ghost" href="/field-kit/">Open the Field Kit</a>
      </div>
      <ul class="hero-specs" aria-label="At a glance">
        <li><strong>${PRODUCTS.length}</strong><span>guides</span></li>
        <li><strong>6</strong><span>interactive</span></li>
        <li><strong>${PDFS.length}</strong><span>printable PDFs</span></li>
        <li><strong>14</strong><span>day refunds</span></li>
      </ul>
    </div>
    <div class="hero-visual">${S.aperture()}</div>
  </div>
</section>

${filmstrip()}

<section class="section section-alt" id="guides" aria-labelledby="guides-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">01</span>Interactive Field Kit guides</span>
      <h2 id="guides-title">Six interactive guides for your phone</h2>
      <p>Field Kit guides run in your browser, work offline once installed, and unlock with a license code. Open any guide to see everything it contains, live previews, who it suits, and what you need, before you buy.</p>
    </div>
    <div class="card-grid">
${FIELD_KIT.map(productCard).join("\n")}
    </div>
  </div>
</section>

${pdfLibrarySection(PDFS)}

<section class="section showcase-section" id="inside" aria-labelledby="inside-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">03</span>Inside the Field Kit</span>
      <h2 id="inside-title">Try it right here</h2>
      <p>These previews run the real Field Kit. Tap the parts of a lighting diagram, tick shots off a list, or change the date in the sun planner. Nothing you do in a preview is saved.</p>
    </div>
    <div class="kit-grid">
${kitFrame("portrait-session-guide", { view: "lighting", item: "one-light", caption: "Portrait Session Guide: a lighting diagram you can tap." }, 0)}
${kitFrame("wedding-day-guide", { view: "shotlists", item: "wedding-day", caption: "Wedding Day Guide: the full-day shot list." }, 1)}
${kitFrame("landscape-travel-field-guide", { view: "planning", item: "sun", caption: "Landscape & Travel Field Guide: the sun planner." }, 2)}
    </div>
  </div>
</section>

<section class="section section-alt" id="included" aria-labelledby="included-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">04</span>How the Field Kit works</span>
      <h2 id="included-title">How the Field Kit guides work</h2>
      <p>Every interactive guide runs in the same Field Kit, so they all work the same way.</p>
    </div>
    <div class="feature-grid">
      <div class="feature reveal" style="--stagger:0"><h3>Runs in your browser</h3><p>Works in any modern browser on a phone, tablet, or computer. There's nothing to download from an app store.</p></div>
      <div class="feature reveal" style="--stagger:1"><h3>One license, any device</h3><p>Your license code unlocks your guide. Enter the same code on each phone, tablet, or computer you use.</p></div>
      <div class="feature reveal" style="--stagger:2"><h3>Offline on location</h3><p>Install the Field Kit to your home screen and, once loaded, your guides work without a signal.</p></div>
      <div class="feature reveal" style="--stagger:3"><h3>Saved on your device</h3><p>Shot lists, worksheets, and locations are stored only in your browser and never sent anywhere. Backups are built in.</p></div>
      <div class="feature reveal" style="--stagger:4"><h3>Print or save as PDF</h3><p>Every worksheet, shot list, and diagram can be printed or exported as a PDF in US Letter or A4.</p></div>
      <div class="feature reveal" style="--stagger:5"><h3>Built for the field</h3><p>Large touch targets, a high-contrast outdoor mode for bright sun, and a dim red night mode for dark venues.</p></div>
    </div>

    <div class="table-scroll reveal">
      <table class="matrix">
        <caption>What each guide contains</caption>
        <thead>
          <tr><th scope="col">Guide</th><th scope="col">Shot lists</th><th scope="col">Lighting diagrams</th><th scope="col">Posing references</th><th scope="col">Settings and calculator</th><th scope="col">Planning worksheets</th><th scope="col">Client questionnaire</th><th scope="col">Sun planner</th></tr>
        </thead>
        <tbody>
${MATRIX.map(([slug, name, c]) => `          <tr><th scope="row"><a href="/${slug}.html">${html(name)}</a></th>${["shot", "light", "pose", "set", "plan", "quest", "sun"].map((k) => `<td>${c[k] ? Y : N}</td>`).join("")}</tr>`).join("\n")}
          <tr><th scope="row"><a href="/complete-reference-library.html">Complete Reference Library</a></th><td colspan="7">All five guides, unlocked by one license</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section-dark" id="how-it-works" aria-labelledby="how-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">05</span>Purchase and delivery</span>
      <h2 id="how-title">How buying a guide works</h2>
      <p>Everything is digital and delivered instantly. There is no account to create and nothing is shipped.</p>
    </div>
    <ol class="steps">
      <li class="reveal" style="--stagger:0"><h3>Review the guide</h3><p>Each guide's page shows what it contains, live previews, the price, and who it is and isn't for.</p></li>
      <li class="reveal" style="--stagger:1"><h3>Add to cart and check out</h3><p>Add guides to your cart, with any add-ons, confirm that you agree to the Terms of Service and Refund Policy, then pay at checkout. Applicable taxes are shown at checkout.</p></li>
      <li class="reveal" style="--stagger:2"><h3>Get your guide</h3><p>Field Kit guides: your confirmation page shows your license code and activates it. PDF guides: your download link, with any add-ons, is shown right after payment and emailed to you.</p></li>
      <li class="reveal" style="--stagger:3"><h3>Use it anywhere</h3><p>Enter your Field Kit code on your other devices, or save and print your PDFs. Both work on location without a signal.</p></li>
    </ol>
    <p class="reveal" style="margin-top:2.5rem">Read the <a href="/delivery.html">Delivery Policy</a> and <a href="/refunds.html">Refund Policy</a> for the details.</p>
  </div>
</section>

<section class="section" id="faq-preview" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">06</span>Questions</span>
      <h2 id="faq-title">Common questions</h2>
    </div>
    <div class="faq-list reveal">
${homeFaq.map(faqItem).join("\n")}
    </div>
    <p class="reveal" style="margin-top:2rem"><a class="btn btn-ghost" href="/faq.html">Read all questions</a></p>
  </div>
</section>`;
  write("index.html", pageDoc({
    title: "Novaris Photo Guides: interactive photography field guides for your phone",
    desc: "Interactive photography field guides that run in your browser: checkable shot lists, tap-to-explain lighting diagrams, posing references, exposure calculators, sun planner, and planning worksheets for portraits, weddings, products, landscapes, and events.",
    url: "/", current: "", body
  }));
}

/* ---------- Product pages ---------- */

function productPage(p) {
  const page = PRODUCT_PAGES[p.slug];
  const isLib = p.productCode === "CR";
  const contents = isLib
    ? GUIDES.map((g, k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><h3><a href="/${g.slug}.html">${html(g.name)}</a></h3><p>${html(g.short)}</p></div>`).join("\n")
    : page.contents.map(([t, d], k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><h3>${html(t)}</h3><p>${html(d)}</p></div>`).join("\n");
  const others = PRODUCTS.filter((q) => q.slug !== p.slug);
  const body = `
<div class="wrap">
  <div class="page-head">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/index.html">Home</a></li><li><a href="/index.html#guides">Guides</a></li><li aria-current="page">${html(p.name)}</li></ol>
    </nav>
  </div>
  <div class="product-top">
    <div>
      ${S.icons[page.icon]}
      <h1>${html(p.name)}</h1>
      <p class="lede">${html(page.lede)}</p>
      <p class="muted">An interactive field guide that runs in the Novaris Field Kit in your web browser and unlocks with a license code. It is a reference and planning tool for use while you work, not a course, lesson, or critique service.</p>
    </div>
    <aside class="buy-box" aria-labelledby="price-title">
      <h2 id="price-title">${html(p.name)}</h2>
      <p class="price"><span data-price>${fmt(p.price)}</span><span class="price-currency">USD</span></p>
      <p class="price-meta">${metaLine}</p>
      <div class="buy-slot" data-buy></div>
      <ul class="buy-facts">
        <li><span>Format</span><span>Interactive field guide in your browser</span></li>
        <li><span>Works on</span><span>Phones, tablets, and computers</span></li>
        <li><span>Delivery</span><span>License code, instantly after payment</span></li>
        <li><span>Offline</span><span>Yes, once installed</span></li>
        <li><span>Exports</span><span>Print or PDF (US Letter or A4)</span></li>
        <li><span>Refunds</span><span>Within 14 days, no reason needed</span></li>
      </ul>
    </aside>
  </div>
</div>

<section class="section section-alt" aria-labelledby="contents-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">What's inside</span>
      <h2 id="contents-title">${isLib ? "The five guides in the library" : "What the guide contains and does"}</h2>
      <p>${isLib ? "One license unlocks each of these guides in full, exactly as they are sold individually." : "Everything below is in the guide. Your saved work stays on your device, and every list, worksheet, and diagram can be printed or exported as a PDF."}</p>
    </div>
    <div class="contents-grid">
${contents}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="preview-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Live previews</span>
      <h2 id="preview-title">Try parts of ${isLib ? "the library" : "the guide"}</h2>
      <p>These previews run the real Field Kit. Tap, tick, and change values to see how it works. Nothing you do here is saved.</p>
    </div>
    <div class="kit-grid">
${page.previews.map((pv, i) => kitFrame(pv.guide || p.slug, pv, i)).join("\n")}
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="fit-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Fit</span>
      <h2 id="fit-title">Who it's for, and who it isn't</h2>
    </div>
    <div class="fit-grid">
      <div class="fit-col reveal" style="--stagger:0">
        <h3>A good fit for</h3>
        <ul>
${page.forWho.map((x) => `          <li>${html(x)}</li>`).join("\n")}
        </ul>
      </div>
      <div class="fit-col not reveal" style="--stagger:1">
        <h3>Not the right fit for</h3>
        <ul>
${page.notFor.map((x) => `          <li>${html(x)}</li>`).join("\n")}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="need-title">
  <div class="wrap narrow">
    <div class="section-head reveal">
      <span class="eyebrow">Requirements</span>
      <h2 id="need-title">What you need</h2>
    </div>
    <ul class="spec-list reveal">
      <li><span>Device</span><span>A phone, tablet, or computer with a modern web browser, such as a current version of Safari, Chrome, Edge, or Firefox</span></li>
      <li><span>Connection</span><span>Internet access to activate your license and load the Field Kit the first time; after installing, guides work offline</span></li>
      <li><span>Storage</span><span>Your saved work is kept in your browser's storage on each device; use the built-in backup to keep a copy</span></li>
      <li><span>Exports</span><span>A PDF viewer or printer for the PDFs you export</span></li>
      <li><span>Gear</span><span>Any camera: equipment is described by type, never by brand</span></li>
      <li><span>License</span><span>Personal and commercial use in your own photography work. See the <a href="/terms.html">Terms of Service</a>.</span></li>
    </ul>
    <div class="reveal" style="margin-top:2rem">
      <h3>How delivery works</h3>
      <p>After payment you're shown a confirmation page with your license code, already activated in that browser. The Open Field Kit button takes you straight into ${isLib ? "your guides" : "the guide"}. To use it on another device, open the Field Kit there and enter the same code. Details are in the <a href="/delivery.html">Delivery Policy</a>.</p>
      ${isLib ? '<p class="muted">Each guide in the library is also sold on its own.</p>' : '<p class="muted">This guide is also part of the <a href="/complete-reference-library.html">Complete Reference Library</a>, which unlocks all five guides with one license.</p>'}
    </div>
  </div>
</section>

<section class="section section-dark" aria-labelledby="closing-title">
  <div class="wrap">
    <div class="closing-buy">
      <div>
        <h2 id="closing-title">${html(p.name)}</h2>
        <p class="price"><span data-price>${fmt(p.price)}</span><span class="price-currency">USD</span></p>
        <p class="price-meta">${metaLine}</p>
      </div>
      <div class="btn-row">
        <div class="buy-slot" data-buy></div>
        <a class="btn btn-ghost" href="/index.html#guides">See all guides</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="other-title">
  <div class="wrap">
    <h2 id="other-title" class="reveal">Other guides</h2>
    <ul class="related reveal">
${others.map((q) => `      <li><a href="/${q.slug}.html">${html(q.name)} &middot; ${fmt(q.price)}</a></li>`).join("\n")}
    </ul>
  </div>
</section>`;
  write(`${p.slug}.html`, pageDoc({ title: page.title, desc: page.meta, url: `/${p.slug}.html`, current: "guides", body, mainAttrs: ` data-product="${p.slug}"` }));
}

/* ---------- Prose pages ---------- */

function slug(t) { return t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "and").toLowerCase().replace(/^[0-9]+\.\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function prosePage({ file, current = "", title, desc, eyebrow, h1, lede, content, updated }) {
  const heads = [];
  content = content.replace(/<h2>([\s\S]*?)<\/h2>/g, (m, t) => { const id = slug(t); heads.push([id, t]); return `<h2 id="${id}">${t}</h2>`; });
  const toc = heads.length >= 4 ? `<details class="toc" data-toc>
      <summary>On this page</summary>
      <p class="toc-title" aria-hidden="true">On this page</p>
      <ol>
${heads.map(([id, t]) => `        <li><a href="#${id}">${t.replace(/^[0-9]+\.\s*/, "")}</a></li>`).join("\n")}
      </ol>
    </details>` : "";
  const body = `
<div class="wrap">
  <header class="page-head">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${h1}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ""}
  </header>
  <div class="prose-layout${toc ? "" : " no-toc"}">
    ${toc}
  <div class="prose">
    ${updated ? `<p class="updated">Last updated: <time datetime="${ISO_DATE}">${UPDATED}</time></p>` : ""}
${content}
  </div>
  </div>
</div>
<div class="section" aria-hidden="true" style="padding-top:0"></div>`;
  write(file, pageDoc({ title, desc, url: "/" + file, current, body }));
}

function about() {
  prosePage({
    file: "about.html", current: "about",
    title: "About Novaris Photo Guides: what we make and why",
    desc: "Novaris Photo Guides makes interactive photography field guides that run in the browser: shot lists, lighting diagrams, posing references, settings calculators, and planning worksheets.",
    eyebrow: "About", h1: "About Novaris Photo Guides",
    lede: "We make interactive field guides for photographers. Each one gathers the shot lists, diagrams, calculators, and worksheets for one kind of photography into a tool you can use on your phone during a shoot.",
    content: `
    <h2>What we make</h2>
    <p>Novaris Photo Guides sells guides in two formats. Five interactive field guides, each covering one kind of photography, run in the Field Kit, with a library that unlocks all five with one license. A further ${PDFS.length} printable PDF guides cover kinds of work from newborn sessions to drone planning, each with optional add-ons; see the <a href="/index.html#pdf-guides">PDF guide library</a>. The interactive guides cover <a href="/portrait-session-guide.html">portrait sessions</a>, <a href="/wedding-day-guide.html">wedding days</a>, <a href="/product-photography-guide.html">product photography</a>, <a href="/landscape-travel-field-guide.html">landscape and travel</a>, and <a href="/event-coverage-guide.html">event coverage</a>.</p>
    <p>The guides run in the <a href="/field-kit/">Novaris Field Kit</a>, a web app that works in any modern browser on a phone, tablet, or computer. Inside are the things a photographer reaches for while planning or working: shot lists you can tick off, lighting diagrams you can tap to see what each light does, posing references, settings tables with an exposure calculator, a sunrise and sunset planner, and planning worksheets. Which of these a guide contains depends on the kind of photography; each guide's page lists exactly what's inside.</p>

    <h2>Why a field guide on your phone</h2>
    <p>Much of the work around a shoot is remembering things: which shots a client asked for, where a light went last time, when the sun drops behind the ridge, which family group comes next. That information tends to live in scattered notes and screenshots.</p>
    <p>A phone is already in your pocket on every shoot. The Field Kit puts the plan and the reference on it, in a layout made for quick glances: large buttons, a progress bar on every shot list, a high-contrast mode for bright sun, and a red night mode for dark venues. When paper is better, every worksheet and list prints or exports as a PDF.</p>

    <h2>How the guides are built</h2>
    <ul>
      <li><strong>One kind of photography per guide,</strong> so each stays focused.</li>
      <li><strong>Your work stays on your device.</strong> Saved shot lists, worksheets, and locations are stored only in your browser. Nothing is sent to us.</li>
      <li><strong>Works offline.</strong> Install the Field Kit to your home screen and your guides work without a signal once loaded.</li>
      <li><strong>Brand-neutral.</strong> Equipment is described by type, such as a softbox or a reflector, never by manufacturer.</li>
      <li><strong>Starting points, not rules.</strong> Settings and setups are places to begin. Light, gear, and subjects vary, and you adjust from there.</li>
    </ul>

    <h2>What the guides are not</h2>
    <p>The guides are reference and planning tools. They aren't courses, video lessons, coaching, or critique, and they don't include feedback on anyone's photographs. The <a href="/disclaimer.html">Disclaimer</a> covers this in more detail.</p>

    <h2>How we sell</h2>
    <p>Prices are listed in US dollars on each guide's page, and applicable taxes are shown at checkout. Payment is handled by a third-party payment provider, so we never see your full card details. Field Kit license codes appear on your confirmation page as soon as payment is complete, and PDF guides are delivered by download link right after payment. If a guide isn't right for you, you can ask for a full refund within 14 days, with no reason required.</p>
    <p>This website uses no cookies, no analytics, and no advertising trackers. The <a href="/privacy.html">Privacy Policy</a> explains what information we receive when you buy and how we use it.</p>

    <h2>Get in touch</h2>
    <p>Questions about a guide or an order go to ${MAIL}. We reply within two business days. More on the <a href="/contact.html">Contact</a> page.</p>`
  });
}

const faqGroups = [
  ["Buying and delivery", [
    ["What do I receive after I buy a Field Kit guide?", `<p>As soon as payment is complete, you're shown a confirmation page. It shows your product, the date and time, your order reference when the payment provider supplies one, and your license code. The code is activated automatically in that browser, and the <strong>Open Field Kit</strong> button takes you straight into your guide. You can save the confirmation as a PDF or print it. Nothing is shipped. See the <a href="/delivery.html">Delivery Policy</a>.</p>`],
    ["Who handles payment, and are taxes included?", `<p>Payment is handled at checkout by a third-party payment provider; Novaris Photo Guides never sees your full card details. Prices are shown in US dollars, and applicable taxes are calculated and shown at checkout before you pay.</p>`],
    ["Why do I have to tick a box before checkout?", `<p>In your cart, before checkout, you confirm that you agree to the <a href="/terms.html">Terms of Service</a> and <a href="/refunds.html">Refund Policy</a>, so the license terms and the 14-day refund are clear before you pay.</p>`],
    ["What does the Complete Reference Library include?", `<p>All five guides: Portrait Session, Wedding Day, Product Photography, Landscape &amp; Travel Field, and Event Coverage. One license code unlocks all of them in the Field Kit.</p>`]
  ]],
  ["Cart and checkout", [
    ["How do I buy a guide?", `<p>Open the guide's page, choose any add-ons, and select <strong>Add to cart</strong>. You can add several guides, then open your <a href="/cart.html">cart</a>, confirm that you agree to the Terms of Service and Refund Policy, and continue to checkout.</p>`],
    ["Can I change add-ons after adding a guide to my cart?", `<p>Yes. Select <strong>Change add-ons</strong> in your cart, tick or untick add-ons on the guide's page, then select <strong>Update cart</strong>.</p>`],
    ["Is my cart saved?", `<p>Your cart is kept in the browser you're using, on that device, until you check out or remove the items. It isn't sent to us before checkout.</p>`]
  ]],
  ["PDF guides and add-ons", [
    ["What's in a PDF guide?", `<p>Each PDF guide is a printable reference for one kind of photography: shot lists with tick boxes, overhead lighting or position diagrams, settings tables, planning worksheets, and checklists. Each guide's page lists every section and shows excerpts before you buy.</p>`],
    ["How do I receive a PDF guide?", `<p>Right after payment, your download link is shown on the checkout confirmation and sent to the email address you used at checkout. Any add-ons you chose are delivered with the guide. See the <a href="/delivery.html">Delivery Policy</a>.</p>`],
    ["What are add-ons?", `<p>Add-ons are extra PDFs, such as pocket settings cards, planners, questionnaires, and message templates, that you can tick on a guide's page before you add it to your cart. The price box shows the total with the add-ons you choose.</p>`],
    ["What page size are PDF guides?", `<p>US Letter (8.5 × 11 in). They print on A4 using "fit to page." Pocket card add-ons are 4 × 6 in. The Wedding &amp; Portrait Pro Bundle has an add-on with A4 editions of every guide.</p>`],
    ["Can I print PDF guides and share worksheets with clients?", `<p>Yes. You can print them as often as you need for your own work and share client worksheets and questionnaires with your own clients. Please don't share or resell the files themselves. See the <a href="/terms.html">Terms of Service</a>.</p>`]
  ]],
  ["Licenses and devices", [
    ["How do licenses work?", `<p>Each purchase comes with a license code that starts with NOVA. Entering it in the Field Kit unlocks your guide in that browser. Codes are checked on your device; there's no account or password. Capitals, spaces, and dashes don't matter when you type a code.</p>`],
    ["How do I use my guide on another device?", `<p>Open the <a href="/field-kit/">Field Kit</a> on the other phone, tablet, or computer and enter the same license code. Your licenses are saved separately on each device. To move saved shot lists and worksheets too, use Export backup and Import backup in the Field Kit's settings.</p>`],
    ["Which devices and browsers are supported?", `<p>Any phone, tablet, or computer with a modern browser, such as a current version of Safari, Chrome, Edge, or Firefox. The Field Kit is designed for phones first, with large touch targets, and switches to a sidebar layout on larger screens.</p>`],
    ["I've lost my license code. What now?", `<p>If you activated it on a device, the code is listed in the Field Kit's settings under Licenses. Otherwise, write to us through the <a href="/contact.html">Contact page</a> with your order number and the email you used at checkout, and we'll send you a replacement.</p>`],
    ["Can I share my license code?", `<p>No. A license is for your own use. Codes may not be shared, published, sold, or transferred. See the <a href="/terms.html">Terms of Service</a>.</p>`]
  ]],
  ["Using the Field Kit", [
    ["Does it work offline on location?", `<p>Yes. After the Field Kit has loaded once while you're online, install it to your home screen: in Safari, tap Share and then Add to Home Screen; in other browsers, choose Install app or Add to Home screen. Your guides and saved work then open without a signal.</p>`],
    ["Where is my work saved? Should I back it up?", `<p>Shot lists, worksheets, settings, and any saved location are stored only in your browser on that device and never sent anywhere. Browsers can clear stored data, for example when a device runs low on space or if you clear site data, so use <strong>Export backup</strong> in the Field Kit's settings regularly. The Field Kit reminds you if you haven't made a backup in 30 days.</p>`],
    ["Can I print or export worksheets?", `<p>Yes. Every shot list, worksheet, timeline, planner, diagram, and settings table has Export PDF and Print buttons. Choose US Letter or A4 in the Field Kit's settings. Worksheets can also be exported blank to fill in by hand.</p>`],
    ["Can I share the client questionnaires with my clients?", `<p>Yes. In the Portrait Session and Wedding Day guides you can edit the questions, add your business name and how clients should return it, and export a PDF to send to your own clients. Sharing questionnaires with your clients is part of your license.</p>`],
    ["How is my location used in the sun planner?", `<p>The sun planner calculates sunrise, sunset, golden hour, and blue hour on your device. If you choose Use my current location, your browser asks permission and the coordinates are used only on your device. If you save a location, it's stored only in your browser and is never sent to us or anyone else.</p>`],
    ["Are gear recommendations brand-specific?", `<p>No. Equipment is described by type, such as a softbox, reflector, flash, or tripod. No camera, lens, lighting, or software brand is recommended, and Novaris Photo Guides isn't affiliated with any manufacturer.</p>`],
    ["Are these courses, or will you review my photos?", `<p>Neither. The guides are reference and planning tools. They aren't lessons, and they don't include feedback or critique on anyone's work.</p>`]
  ]],
  ["Refunds and support", [
    ["What is the refund policy?", `<p>You can request a full refund on any purchase within 14 days, with no reason required, through the <a href="/contact.html">Contact page</a> with your order number. Refunds go to your original payment method within 5 business days of your request; your payment provider may take a few more days to process it. Your license ends when the purchase is refunded. See the <a href="/refunds.html">Refund Policy</a>.</p>`],
    ["Something isn't working. What should I do?", `<p>Use the <strong>Report a problem</strong> link in the Field Kit, which opens an email to us with the guide and section filled in, or write to ${MAIL}. We reply within two business days.</p>`]
  ]]
];

function faq() {
  const body = `
<div class="wrap narrow">
  <header class="page-head">
    <span class="eyebrow">FAQ</span>
    <h1>Frequently asked questions</h1>
    <p class="lede">Licenses, devices, offline use, backups, exports, and refunds. Anything else, email ${MAIL}.</p>
    <nav class="chips" aria-label="FAQ topics">
${faqGroups.map(([g], gi) => `      <a href="#faq-g${gi}">${g}</a>`).join("\n")}
    </nav>
  </header>
${faqGroups.map(([g, items], gi) => `  <section aria-labelledby="faq-g${gi}" style="margin-bottom:3.5rem">
    <h2 id="faq-g${gi}" class="reveal">${g}</h2>
    <div class="faq-list reveal">
${items.map(faqItem).join("\n")}
    </div>
  </section>`).join("\n")}
</div>
<div class="section" aria-hidden="true" style="padding-top:0"></div>`.replace('href="/refunds.html"', 'href="/refunds.html"');
  write("faq.html", pageDoc({
    title: "FAQ: licenses, devices, offline use, backups, and refunds | Novaris Photo Guides",
    desc: "Answers about Novaris Photo Guides: what you receive after purchase, how licenses work, using guides on another device, offline use, backups, PDF exports, client questionnaires, location privacy, lost codes, and refunds.",
    url: "/faq.html", current: "faq", body
  }));
}

function contact() {
  prosePage({
    file: "contact.html", current: "contact",
    title: "Contact Novaris Photo Guides: support by email",
    desc: "Contact Novaris Photo Guides by email for help with orders, licenses, the Field Kit, and refunds. Replies within two business days.",
    eyebrow: "Contact", h1: "Contact us",
    lede: "Support is handled by email. We reply within two business days.",
    content: `
    <div class="contact-card">
      <p class="muted" style="margin-bottom:.4em">Support email</p>
      <p class="contact-email"><a href="mailto:${EMAIL}" data-support-email>${EMAIL}</a></p>
      <p style="margin:0">Response time: within two business days.</p>
    </div>

    <h2>What to include</h2>
    <p>So we can find your order and answer in one reply, please include:</p>
    <ul>
      <li><strong>Your order number</strong>, from your confirmation page or the payment provider's receipt.</li>
      <li><strong>The email address you used at checkout.</strong></li>
      <li><strong>The guide</strong> your message is about.</li>
      <li><strong>What you need</strong>, such as a replacement license code, help with the Field Kit, or a refund.</li>
    </ul>

    <h2>Refunds</h2>
    <p>To request a refund, email us within 14 days of purchase with your order number. No reason is required. See the <a href="/refunds.html">Refund Policy</a>.</p>

    <h2>Lost license codes</h2>
    <p>Email us with your order number and the email used at checkout, and we'll send a replacement code. If you activated the code on any device, it's also listed in the Field Kit's settings under Licenses.</p>

    <h2>Problems with the Field Kit</h2>
    <p>The <strong>Report a problem</strong> link at the bottom of each Field Kit section opens an email to us with the guide and section filled in. Tell us what happened and what device and browser you use.</p>

    <h2>Privacy requests</h2>
    <p>To access, correct, or delete the order information we hold, or to object to how we use it, email us. See the <a href="/privacy.html">Privacy Policy</a>.</p>

    <h2>Before you write</h2>
    <p>Many questions about licenses, devices, offline use, and backups are answered on the <a href="/faq.html">FAQ</a> page. The guides are reference tools, so we don't offer critique of photographs or individual photography advice by email.</p>`
  });
}

function terms() {
  prosePage({
    file: "terms.html",
    title: "Terms of Service | Novaris Photo Guides",
    desc: "The terms that apply when you use the Novaris Photo Guides website and Field Kit and buy a license for a browser-based field guide.",
    eyebrow: "Legal", h1: "Terms of Service", updated: true,
    content: `
    <p>These terms explain the rules for using this website and the Novaris Field Kit, and for buying a license to a guide. "We," "us," and "our" mean Novaris Photo Guides. "You" means the person using the site or buying a license.</p>

    <h2>1. Accepting these terms</h2>
    <p>By using this website or the Field Kit, or by buying a license, you agree to these Terms of Service, together with our <a href="/privacy.html">Privacy Policy</a>, <a href="/refunds.html">Refund Policy</a>, <a href="/delivery.html">Delivery Policy</a>, and <a href="/disclaimer.html">Disclaimer</a>. Before checkout, you confirm that you agree to these Terms and the Refund Policy by ticking a box beside the buy button. If you don't agree, please don't buy a license or use the guides.</p>

    <h2>2. What we sell</h2>
    <p>We sell licenses to two kinds of digital photography guides:</p>
    <ul>
      <li><strong>Field Kit guides</strong>: browser-based guides that run in the Novaris Field Kit, a web app on this website, unlocked with a license code. They contain reference and planning tools such as shot lists, lighting diagrams, posing references, settings tables and calculators, sun times, worksheets, and questionnaires, and they can export pages as PDFs.</li>
      <li><strong>PDF guides</strong>: printable PDF files delivered by download, containing shot lists, diagrams, settings tables, worksheets, and checklists. PDF guides may be bought with optional add-ons, which are additional PDF files.</li>
    </ul>
    <p>The guides are reference and planning tools. They are not courses, lessons, coaching, or critique, and they do not include feedback on your work.</p>

    <h2>3. Your license</h2>
    <p>When you buy a guide, we grant you a personal, non-exclusive, non-transferable license to:</p>
    <ul>
      <li>use the guide for personal and commercial purposes in your own photography work, including paid client sessions;</li>
      <li>use the guide on the devices you use yourself, by entering your license code in the Field Kit on each one;</li>
      <li>download, print, and export pages from the guide for your own use, as often as you need;</li>
      <li>keep copies of PDF guides on the devices you use yourself;</li>
      <li>share client questionnaires and client worksheets, including printed or exported copies, with your own clients.</li>
    </ul>
    <p>Buying a license gives you the right to use the guide. It does not transfer ownership of the guide or its content.</p>

    <h2>4. What you may not do</h2>
    <p>You may not:</p>
    <ul>
      <li>resell, sublicense, rent, or redistribute the guides or any part of them, including exported PDFs (other than client questionnaires shared with your own clients);</li>
      <li>share, publish, sell, or transfer your license code, or use another person's code;</li>
      <li>upload the guides or their content to template marketplaces, file-sharing sites, or similar services;</li>
      <li>copy the guides' content into products of your own, or claim it as your own work;</li>
      <li>attempt to get around the license system or use the guides without a valid license.</li>
    </ul>

    <h2>5. Your data and backups</h2>
    <p>The licenses you activate and the work you save in the Field Kit, such as shot lists, worksheets, and locations, are stored only in your browser on each device. We don't receive or keep a copy. You are responsible for backing up your own data using the Export backup feature in the Field Kit. We can't recover data that your browser or device deletes.</p>

    <h2>6. Prices, taxes, and payment</h2>
    <p>Prices are listed in US dollars on each guide's page. Applicable taxes are calculated and shown at checkout before you pay. Payment is handled by a third-party payment provider, and your payment is also subject to that provider's terms. We never receive your full payment card details. We may change prices for future purchases; a price change never affects an order you have already paid for.</p>

    <h2>7. Delivery</h2>
    <p>Licenses are delivered digitally and immediately, as described in our <a href="/delivery.html">Delivery Policy</a>.</p>

    <h2>8. Refunds</h2>
    <p>Refunds are available as described in our <a href="/refunds.html">Refund Policy</a>, including a full refund on any purchase requested within 14 days. When a purchase is refunded, its license ends and you must stop using that guide and delete any copies of its files. If you are a consumer in the EU or UK, please also see <a href="/consumer-rights.html">Consumer rights</a>.</p>

    <h2>9. Ownership</h2>
    <p>All content in the guides, the Field Kit, and this website, including text, layouts, diagrams, illustrations, and software, is owned by Novaris Photo Guides and protected by copyright and other intellectual property laws. Except for the license in section 3, no rights are given to you.</p>

    <h2>10. Reference only</h2>
    <p>The guides are starting points for planning and reference. Results depend on your equipment, light, location, and subjects. Please read our <a href="/disclaimer.html">Disclaimer</a>, which forms part of these terms.</p>

    <h2>11. Disclaimer of warranties</h2>
    <p>To the extent permitted by law, the guides, the Field Kit, and this website are provided "as is" and "as available," without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. This does not affect your right to a refund under our Refund Policy, or any rights you have as a consumer that cannot be excluded by law.</p>

    <h2>12. Limitation of liability</h2>
    <p>To the extent permitted by law, our total liability to you for any claim relating to a guide, the Field Kit, or this website is limited to the amount you paid for the license the claim relates to. We are not liable for indirect, incidental, special, or consequential losses, such as lost profits, lost data, or lost business. Nothing in these terms limits liability that cannot be limited by law.</p>

    <h2>13. Changes to these terms</h2>
    <p>We may update these terms from time to time. When we do, we'll post the new version on this page and change the "Last updated" date at the top. The terms in effect when you placed an order apply to that order.</p>

    <h2>14. Contact</h2>
    <p>Questions about these terms can be sent through our <a href="/contact.html">Contact page</a>.</p>`
  });
}

function privacy() {
  prosePage({
    file: "privacy.html",
    title: "Privacy Policy | Novaris Photo Guides",
    desc: "How Novaris Photo Guides handles personal information: no cookies, analytics, or trackers; licenses and saved work stay in your own browser; order information is used only for support, refunds, and tax and accounting.",
    eyebrow: "Legal", h1: "Privacy Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>The short version:</strong> this website uses no cookies, no analytics, and no advertising trackers. Your licenses, saved shot lists, worksheets, and any location you choose to use are stored only in your own browser and are never sent to us. When you buy, we receive basic order information from the payment provider and use it only for support, refunds, and tax and accounting. We never sell it or share it for advertising.</p>
    </div>

    <h2>Who we are</h2>
    <p>This policy covers the Novaris Photo Guides website, the Novaris Field Kit, and our store. For any privacy question or request, use our <a href="/contact.html">Contact page</a>.</p>

    <h2>What this website collects</h2>
    <p>This website and the Field Kit use no cookies, no analytics, no advertising trackers, and no forms that send information to us. Our fonts are served from this website itself.</p>
    <p>The website is hosted by Vercel. To deliver pages and keep the service secure, Vercel processes the technical information that every web request carries, such as your IP address, browser type, and the page requested, under its own privacy policy. We don't use this information to identify or profile you.</p>

    <h2>What stays on your device</h2>
    <p>The Field Kit stores the following only in your browser's storage on the device you're using:</p>
    <ul>
      <li>license codes you activate;</li>
      <li>shot lists, checklists, worksheets, timelines, planners, and questionnaires you create;</li>
      <li>display and export preferences;</li>
      <li>any location you save in the sun planner.</li>
    </ul>
    <p>None of this is sent to us or anyone else. We can't see it, and we can't recover it if your browser or device deletes it, so please use the Export backup feature. Backup files are saved to your device and stay under your control.</p>
    <p><strong>Location.</strong> The sun planner can use your current location if you choose "Use my current location" and allow it in your browser. The coordinates are used only on your device to calculate sun times, and are stored only in your browser if you save them. You can enter coordinates by hand instead.</p>

    <h2>Payments</h2>
    <p>Payments are handled by third-party payment providers. At checkout, the payment provider collects your name, email address, billing details, and payment information and processes them under its own privacy policy. Novaris Photo Guides never sees your full payment card details.</p>

    <h2>Information we receive when you buy</h2>
    <p>After a purchase, we receive order information from the payment provider: your name, your email address, the products you purchased, and your country. If you email us, we also receive your email address and whatever you include in your message.</p>

    <h2>How we use it</h2>
    <p>We use order information only to provide support (including replacing lost license codes), to process refunds, and to meet our tax and accounting obligations. For visitors in the European Economic Area and the United Kingdom, our legal bases are the performance of our contract with you and compliance with legal obligations.</p>

    <h2>What we never do</h2>
    <p>We never sell personal information, and we never share it for advertising, including cross-context behavioral advertising. We share order information only with the payment provider that processes your payment, and otherwise only where needed to meet tax and accounting obligations or where required by law.</p>

    <h2>How long we keep information</h2>
    <p>We keep order information for as long as tax and accounting law requires, and then delete it. Support emails are kept while needed to resolve your request and, where they relate to an order or refund, for the same record-keeping periods.</p>

    <h2>Your rights</h2>
    <p>Wherever you live, you can ask us to give you a copy of the personal information we hold about you, correct it, or delete it (except where we must keep it for legal, tax, or accounting reasons), and you can object to or ask us to restrict how we use it. Make a request through our <a href="/contact.html">Contact page</a>, ideally from the email address you used at checkout. We may ask you to confirm your identity before acting on a request.</p>
    <h3>Residents of the EEA and UK (GDPR)</h3>
    <p>Under the GDPR and the UK GDPR you have the rights above, plus the right to data portability. You can also complain to your local data protection authority. We respond to requests within one month.</p>
    <h3>California residents (CCPA)</h3>
    <p>Under the California Consumer Privacy Act, as amended, you have the right to know what personal information we collect and how we use it, and the rights to access, correct, and delete it. We don't sell or share personal information, so there is nothing to opt out of. We won't treat you differently for exercising your rights. We respond to requests within 45 days.</p>

    <h2>Children</h2>
    <p>This website and the guides are not directed at children under 13, and we don't knowingly collect personal information from children under 13. If you believe a child has given us personal information, contact us and we'll delete it.</p>

    <h2>Changes to this policy</h2>
    <p>If we change this policy, we'll post the updated version on this page and change the "Last updated" date at the top. If a change materially affects how we use order information we already hold, we'll also email the customers it affects before the change takes effect.</p>

    <h2>Contact</h2>
    <p>Questions or requests about privacy: use our <a href="/contact.html">Contact page</a>.</p>`
  });
}

function refunds() {
  prosePage({
    file: "refunds.html",
    title: "Refund Policy: 14-day refunds, no reason required | Novaris Photo Guides",
    desc: "Novaris Photo Guides offers a full refund on any purchase requested within 14 days, with no reason required.",
    eyebrow: "Policy", h1: "Refund Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>Full refund on any purchase within 14 days. No reason required.</strong></p>
    </div>

    <h2>Who can get a refund</h2>
    <p>You can get a full refund on any purchase, including the Complete Reference Library, if you request it within 14 days of the purchase date. You don't need to give a reason.</p>

    <h2>How to request a refund</h2>
    <p>Request your refund through our <a href="/contact.html">Contact page</a> with your order number. If you're writing from a different address than the one you used at checkout, include that address too.</p>

    <h2>When you'll receive it</h2>
    <p>Refunds go back to your original payment method. We issue the refund within 5 business days of your request. Your payment provider or bank may take a few additional days to show it on your statement.</p>

    <h2>What happens to your license</h2>
    <p>When a purchase is refunded, its license ends. For Field Kit guides, please stop using the guide and remove the license from the Field Kit on your devices (Field Kit settings, Licenses). For PDF guides and add-ons, please delete your copies of the files. There's nothing to send back.</p>

    <h2>If something doesn't work</h2>
    <p>If a guide isn't working on your device, tell us what's happening through the <a href="/contact.html">Contact page</a>. We'll try to fix it with you; whatever happens, you can still have a full refund within 14 days.</p>

    <h2>Your legal rights</h2>
    <p>This policy is in addition to any rights you have under consumer law. If you are a consumer in the EU or UK, see <a href="/consumer-rights.html">Consumer rights</a>.</p>

    <h2>Questions</h2>
    <p>Use our <a href="/contact.html">Contact page</a>. We reply within two business days. See also our <a href="/delivery.html">Delivery Policy</a> and <a href="/terms.html">Terms of Service</a>.</p>`
  });
}

function delivery() {
  prosePage({
    file: "delivery.html",
    title: "Delivery Policy: instant access with a license | Novaris Photo Guides",
    desc: "All Novaris Photo Guides products are digital. After payment, a confirmation page issues your license code and activates it in that browser. Nothing is shipped.",
    eyebrow: "Policy", h1: "Delivery Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>All products are digital and delivered instantly.</strong> Field Kit guides are delivered as a license code; PDF guides and their add-ons are delivered by download. There is no physical shipment.</p>
    </div>

    <h2>Field Kit guides: how delivery works</h2>
    <ol>
      <li><strong>Add to cart and pay.</strong> Add the guide to your cart. In your cart, you tick that you agree to the <a href="/terms.html">Terms of Service</a> and <a href="/refunds.html">Refund Policy</a>, then pay at checkout.</li>
      <li><strong>Confirmation page.</strong> As soon as payment is complete, you're shown a confirmation page. It states that your order is complete, shows your product, the date and time, your order reference when the payment provider supplies one, and your license code, and it activates the license in that browser automatically. You can save the confirmation as a PDF or print it.</li>
      <li><strong>Open your guide.</strong> The Open Field Kit button takes you straight into your guide in the Novaris Field Kit.</li>
      <li><strong>Other devices.</strong> To use your guide on another phone, tablet, or computer, open the <a href="/field-kit/">Field Kit</a> there and enter the same license code.</li>
    </ol>

    <h2>PDF guides: how delivery works</h2>
    <ol>
      <li><strong>Choose and pay.</strong> On the guide's page, tick any add-ons you want and add the guide to your cart. In your cart, tick that you agree to the <a href="/terms.html">Terms of Service</a> and <a href="/refunds.html">Refund Policy</a>, then pay at checkout.</li>
      <li><strong>Download.</strong> As soon as payment is complete, your download link is shown on the checkout confirmation and sent to the email address you entered at checkout. It includes the guide and every add-on you chose.</li>
      <li><strong>Keep your files.</strong> Save the PDFs to your devices. They open in any PDF viewer and work without a connection.</li>
    </ol>
    <p>If your download email hasn't arrived within an hour, check your spam folder, then contact us through the <a href="/contact.html">Contact page</a> with your order number and we'll send your files again.</p>

    <h2>Offline use</h2>
    <p>Once the Field Kit has loaded on a device while online, you can install it to the home screen and use your guides offline on location.</p>

    <h2>Lost license codes</h2>
    <p>If you lose your code, request a replacement through our <a href="/contact.html">Contact page</a> with your order number and the email used at checkout. If you activated the code on any device, it's also listed in the Field Kit's settings under Licenses.</p>

    <h2>How long access lasts</h2>
    <p>Online access to the Field Kit continues for as long as Novaris Photo Guides operates. Your saved work is stored on your own devices, so please keep a backup using the Field Kit's Export backup feature.</p>

    <h2>No physical shipment</h2>
    <p>Nothing is printed or posted, and there are no shipping charges.</p>

    <h2>Questions</h2>
    <p>Use our <a href="/contact.html">Contact page</a>. We reply within two business days.</p>`
  });
}

function disclaimer() {
  prosePage({
    file: "disclaimer.html",
    title: "Disclaimer: reference tools, starting points, independence | Novaris Photo Guides",
    desc: "Novaris Photo Guides are reference and planning tools, not instruction. Settings are starting points, sun times are for reference, photographers are responsible for permissions and releases, and the business is independent of all manufacturers.",
    eyebrow: "Legal", h1: "Disclaimer", updated: true,
    content: `
    <h2>Reference and planning tools, not instruction</h2>
    <p>Novaris Photo Guides are reference and planning tools: shot lists, diagrams, calculators, and worksheets for photographers to use while planning and working. They are not courses, lessons, or coaching, and they include no feedback on anyone's work.</p>

    <h2>Settings and setups are starting points</h2>
    <p>Gear, light, venues, and subjects all vary. The settings, lighting setups, diagrams, and calculator results in the guides are starting points for you to adjust to your situation. They are not guaranteed to produce any particular result, and you remain responsible for the choices you make on a shoot.</p>

    <h2>Sun times are for reference</h2>
    <p>Sunrise, sunset, golden hour, and blue hour times are calculated in your browser for reference. Terrain, buildings, weather, and the time zone you choose all affect when light actually reaches you. Allow a margin when planning.</p>

    <h2>Your responsibilities when photographing</h2>
    <p>When you use the guides, you are responsible for:</p>
    <ul>
      <li>obtaining permits or permission where required, including for parks, venues, and public spaces;</li>
      <li>respecting private property and site rules;</li>
      <li>getting model releases and property releases where they are needed;</li>
      <li>following local laws on photographing people and places;</li>
      <li>using equipment safely, including light stands, cables, and flash around people.</li>
    </ul>

    <h2>Independence</h2>
    <p>Novaris Photo Guides is independent. We are not affiliated with, sponsored by, or endorsed by any camera, lens, lighting, or software maker. The guides describe equipment by type and do not recommend any brand.</p>

    <h2>Questions</h2>
    <p>Use our <a href="/contact.html">Contact page</a>. See also our <a href="/terms.html">Terms of Service</a>.</p>`
  });
}

function consumerRights() {
  prosePage({
    file: "consumer-rights.html",
    title: "Consumer rights (EU and UK) | Novaris Photo Guides",
    desc: "Information for consumers in the EU and UK about buying digital content from Novaris Photo Guides: the 14-day right to cancel, our refund policy, and your rights if content is faulty.",
    eyebrow: "Legal", h1: "Consumer rights", updated: true,
    lede: "Information for consumers, especially in the European Union and the United Kingdom, about buying digital content from Novaris Photo Guides.",
    content: `
    <h2>Who you are buying from</h2>
    <p>You are buying from Novaris Photo Guides. You can reach us by email at ${MAIL} or through our <a href="/contact.html">Contact page</a>. Payment is taken by a third-party payment provider at checkout.</p>

    <h2>What you are buying</h2>
    <p>Each purchase is a license to digital content: either a browser-based field guide in the Novaris Field Kit, unlocked by a license code and supplied on the order confirmation page, or a printable PDF guide (with any add-ons you choose), supplied by download link straight after payment. Both are supplied immediately after payment. Each guide's page describes its contents and functionality and lists what you need to use it (a modern web browser on a phone, tablet, or computer).</p>

    <h2>Price and taxes</h2>
    <p>Prices are shown in US dollars. Applicable taxes, such as VAT or sales tax, are calculated for your location and shown at checkout before you pay, together with the total you will be charged.</p>

    <h2>Your right to cancel and our refund policy</h2>
    <p>For digital content, EU and UK law gives consumers a 14-day right to cancel that normally ends once supply begins, if you agreed to that. You don't need to rely on that rule with us: our <a href="/refunds.html">Refund Policy</a> gives you a full refund on any purchase if you ask within 14 days of purchase, with no reason required, even though your guide is supplied straight away. To use it, contact us with your order number. Refunds go to your original payment method within 5 business days of your request, and your license ends.</p>

    <h2>If the content is faulty or not as described</h2>
    <p>Under EU and UK consumer law, digital content must match its description, be fit for purpose, and be of satisfactory quality. If a guide doesn't work as described, tell us through the <a href="/contact.html">Contact page</a>. We'll work to fix the problem; if we can't, you're entitled to a refund. These statutory rights apply in addition to our Refund Policy and are not limited by our <a href="/terms.html">Terms of Service</a>.</p>

    <h2>Using the content</h2>
    <p>The guides work in current versions of common browsers on phones, tablets, and computers. Your saved work is stored in your own browser, so please keep a backup with the Field Kit's Export backup feature. See the <a href="/delivery.html">Delivery Policy</a> for how access works across devices and offline.</p>

    <h2>Complaints</h2>
    <p>If you're unhappy with anything, email ${MAIL}. We reply within two business days and aim to resolve complaints directly.</p>

    <h2>Customers elsewhere</h2>
    <p>Wherever you live, our 14-day Refund Policy applies, together with any rights you have under the consumer protection laws where you live.</p>`
  });
}

function cartPage() {
  const body = `
<div class="wrap narrow">
  <header class="page-head">
    <span class="eyebrow">Cart</span>
    <h1>Your cart</h1>
  </header>
  <div class="cart" data-cart-page>
    <p class="muted">Loading your cart…</p>
    <noscript><p>Your cart needs JavaScript. Please turn it on to continue.</p></noscript>
  </div>
</div>
<div class="section" aria-hidden="true" style="padding-top:0"></div>`;
  write("cart.html", pageDoc({ title: "Your cart | Novaris Photo Guides", desc: "Review the guides and add-ons in your cart before checkout.", url: "/cart.html", current: "cart", body, noindex: true }));
}

/*
  Checkout is a placeholder until the custom checkout form and payment method
  are built. The order comes from window.NOVARIS_CART.items() (js/cart.js).
*/
function checkoutPage() {
  const body = `
<div class="wrap narrow">
  <header class="page-head">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/cart.html">Cart</a></li><li aria-current="page">Checkout</li></ol>
    </nav>
    <span class="eyebrow">Checkout</span>
    <h1>Checkout</h1>
  </header>
  <div class="checkout-layout">
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" class="checkout-heading">Order summary</h2>
      <div data-checkout-summary><p class="muted">Loading your order…</p></div>
    </section>
    <section class="checkout-form" aria-labelledby="payment-title" data-checkout-ready hidden>
      <h2 id="payment-title" class="checkout-heading">Payment</h2>
      <!-- Placeholder: the custom checkout form and payment method go here. -->
      <div class="checkout-placeholder" data-checkout-form>
        <p><strong>Checkout is coming soon.</strong></p>
        <p>Payment isn't available yet, so no order can be placed and nothing will be charged. Your cart stays saved in this browser.</p>
      </div>
      <p class="muted small">Questions? Write to ${MAIL}.</p>
    </section>
  </div>
</div>
<div class="section" aria-hidden="true" style="padding-top:0"></div>`;
  write("checkout.html", pageDoc({ title: "Checkout | Novaris Photo Guides", desc: "Checkout for Novaris Photo Guides.", url: "/checkout.html", current: "cart", body, noindex: true }));
}

function notFound() {
  const body = `
<div class="wrap notfound">
  <svg viewBox="-60 -60 120 120" role="img" aria-labelledby="nf-title"><title id="nf-title">A closed lens aperture</title><circle r="56" fill="none" stroke="currentColor" stroke-opacity=".3" style="color:var(--ink)"/><circle r="50" fill="#1f1d1a"/><g fill="none" stroke="#e09a2c" stroke-width="1.5" stroke-linejoin="round"><path d="M0 -6 L5.2 -3 L5.2 3 L0 6 L-5.2 3 L-5.2 -3 Z"/><path d="M0 -6 L30 -40 M5.2 -3 L49 4 M5.2 3 L20 46 M0 6 L-30 40 M-5.2 3 L-49 -4 M-5.2 -3 L-20 -46" stroke-opacity=".5"/></g></svg>
  <span class="eyebrow">Error 404</span>
  <h1>This page isn't here</h1>
  <p class="lede">The address may be mistyped, or the page may have moved. Everything on the site is reachable from the links below.</p>
  <div class="btn-row">
    <a class="btn btn-primary" href="/index.html">Go to the home page</a>
    <a class="btn btn-ghost" href="/index.html#guides">Browse the guides</a>
    <a class="btn btn-ghost" href="/field-kit/">Open the Field Kit</a>
  </div>
</div>`;
  write("404.html", pageDoc({ title: "Page not found | Novaris Photo Guides", desc: "The page you were looking for isn't on the Novaris Photo Guides site.", url: null, current: "", body, noindex: true }));
}

/* ---------- Confirmation pages ---------- */

function thankYou(p) {
  const isLib = p.productCode === "CR";
  const body = `
<div class="wrap ty" data-confirmation data-product="${p.slug}" data-product-code="${p.productCode}" data-product-name="${esc(p.name)}">
  <div class="ty-grid">
    <section class="ty-tray" aria-labelledby="ty-code-label">
      <div class="ty-print">
        <p class="ty-code-label" id="ty-code-label">License code</p>
        <p class="ty-code" data-code aria-live="polite"><span class="ty-code-wait">Preparing your code…</span></p>
        <button type="button" class="btn btn-ghost ty-copy" data-copy disabled>Copy code</button>
        <p class="ty-status" data-status role="status"></p>
      </div>
      <noscript><p class="ty-noscript">Your license code is created by this page in your browser. Please turn on JavaScript and reload this page to see it. If you can't, contact us at ${EMAIL} with your order number and we'll send your code.</p></noscript>
    </section>
    <section class="ty-details" aria-labelledby="ty-title">
      <span class="eyebrow">Order confirmation</span>
      <h1 id="ty-title">Your order is complete</h1>
      <p class="lede">Your ${html(p.name)} is delivered and ready to use. ${isLib ? "This license unlocks all five guides." : ""}</p>
      <dl class="ty-list">
        <div><dt>Product</dt><dd>${html(p.name)}</dd></div>
        <div><dt>Status</dt><dd>Order complete · delivered as instant access in the Novaris Field Kit</dd></div>
        <div><dt>Date and time</dt><dd data-issued>—</dd></div>
        <div data-order-row hidden><dt>Order reference</dt><dd data-order>—</dd></div>
      </dl>
      <div class="btn-row ty-actions">
        <a class="btn btn-primary" data-open href="/field-kit/#/guide/${isLib ? "portrait-session-guide" : p.slug}">Open Field Kit</a>
        <button type="button" class="btn btn-ghost" data-save disabled>Save confirmation (PDF)</button>
        <button type="button" class="btn btn-ghost" data-print>Print</button>
      </div>
      <h2 class="ty-h">Using your ${isLib ? "guides" : "guide"}</h2>
      <ul class="ty-steps">
        <li><strong>On this device:</strong> your license is already active in this browser. Open Field Kit takes you straight in.</li>
        <li><strong>On another device:</strong> open the Field Kit at <a href="/field-kit/">${BASE.replace(/^https:\/\//, "")}/field-kit/</a> and enter the code above.</li>
        <li><strong>Offline:</strong> add the Field Kit to your home screen to use it on location without a signal.</li>
        <li><strong>Keep this code.</strong> Save or print this confirmation. If you lose the code, contact us with your order number for a replacement.</li>
      </ul>
      <p class="ty-policies">Your purchase is covered by our <a href="/terms.html">Terms of Service</a>, <a href="/refunds.html">Refund Policy</a> (full refund within 14 days, no reason required), and <a href="/delivery.html">Delivery Policy</a>. Questions: <a href="mailto:${EMAIL}" data-support-email>${EMAIL}</a>.</p>
    </section>
  </div>
</div>`;
  write(`thank-you/${p.slug}/index.html`, pageDoc({
    title: `Order confirmation: ${p.name} | Novaris Photo Guides`,
    desc: `Your ${p.name} order is complete. Your license code and access to the Novaris Field Kit.`,
    url: null, current: "", body, noindex: true,
    extraHead: `<script type="module" src="/js/thank-you.js"></script>\n`
  }));
}

/* ---------- Run ---------- */

home();
FIELD_KIT.forEach(productPage);
const bundleGuides = [
  { name: "Wedding Day Guide (PDF edition)", href: "/wedding-day-guide.html", text: "A full-day shot list by phase, a timeline, a family formals grouping planner, a venue scouting worksheet, a gear checklist, a client questionnaire, and settings." },
  { name: "Portrait Session Guide (PDF edition)", href: "/portrait-session-guide.html", text: "Shot lists for headshot, family, and couples sessions, six lighting setups, twelve posing references, settings, a planning sheet, and a client questionnaire." },
  ...["engagement-session-guide", "elopement-small-wedding-guide", "newborn-baby-session-guide", "maternity-portrait-guide", "large-group-reunion-guide"].map((slug) => { const q = PDFS.find((x) => x.slug === slug); return { name: q.name, href: "/" + slug + ".html", text: q.short }; })
];
PDFS.forEach((p) => pdfProductPage(p, CONTENT[p.slug], { pageDoc, write, PRODUCTS, MAIL, extra: p.slug === "wedding-portrait-pro-bundle" ? { bundleGuides, bundlePreviews: ["engagement-session-guide", "newborn-baby-session-guide", "large-group-reunion-guide"].map((slug, k) => previews(CONTENT[slug])[k % 2]) } : {} }));
cartPage(); checkoutPage();
about(); faq(); contact(); terms(); privacy(); refunds(); delivery(); disclaimer(); consumerRights(); notFound();
FIELD_KIT.forEach(thankYou);

const pages = ["/", "/about.html", "/faq.html", "/contact.html", ...PRODUCTS.map((p) => `/${p.slug}.html`), "/terms.html", "/privacy.html", "/refunds.html", "/delivery.html", "/disclaimer.html", "/consumer-rights.html"];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${BASE}${p}</loc><lastmod>${ISO_DATE}</lastmod></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
write("favicon.svg", S.favicon);
const sw = makeServiceWorker(ROOT);
console.log(`Built ${pages.length} indexed pages, 6 confirmation pages, 404. Service worker ${sw.version} caches ${sw.count} files.`);
