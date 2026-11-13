const fs = require("fs");
const path = require("path");
const S = require("./svg");
const products = require("./products-data");

const OUT = process.argv[2];
const BASE = "https://discordaccslog-max.github.io/novaris-photo-guides/";
const EMAIL = "novarissupportmails@gmail.com";
const MAIL = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const UPDATED = "November 4, 2026";
const ISO_DATE = "2026-11-04";
const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";

const esc = (s) => String(s).replace(/&(?!amp;)/g, "&amp;").replace(/"/g, "&quot;");
const html = (s) => String(s).replace(/&(?!amp;)/g, "&amp;");
const fmt = (n) => "$" + n;

function head({ title, desc, file, noindex }) {
  const url = BASE + (file === "index.html" ? "" : file);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Novaris Photo Guides">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${noindex ? "" : `<meta property="og:url" content="${url}">\n`}<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="theme-color" content="#f4efe6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151311" media="(prefers-color-scheme: dark)">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="css/styles.css">
<script>document.documentElement.classList.add("js");</script>
<script src="js/products.js" defer></script>
<script src="js/main.js" defer></script>
</head>`;
}

const NAV = [["index.html#guides", "Guides", "guides"], ["about.html", "About", "about"], ["faq.html", "FAQ", "faq"], ["contact.html", "Contact", "contact"]];

function header(current) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html">${S.logo}<span>Novaris <span class="brand-sub">Photo Guides</span></span></a>
    <nav class="site-nav" aria-label="Main">
      <ul>
${NAV.map(([href, label, key]) => `        <li><a href="${href}"${key === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("\n")}
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <p class="footer-brand">Novaris Photo Guides</p>
        <p>Printable PDF reference guides for photographers: shot lists, lighting diagrams, posing references, settings charts, and planning worksheets.</p>
        <p>Support: ${MAIL}</p>
      </div>
      <nav aria-label="Guides">
        <p class="footer-heading">Guides</p>
        <ul class="footer-links footer-links-single">
${products.map((q) => `          <li><a href="${q.id}.html">${html(q.name)}</a></li>`).join("\n")}
        </ul>
      </nav>
      <div class="footer-cols">
        <nav aria-label="Policies and help">
          <p class="footer-heading">Policies and help</p>
          <ul class="footer-links">
            <li><a href="terms.html">Terms</a></li>
            <li><a href="privacy.html">Privacy</a></li>
            <li><a href="refunds.html">Refunds</a></li>
            <li><a href="delivery.html">Delivery</a></li>
            <li><a href="disclaimer.html">Disclaimer</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="about.html">About</a></li>
          </ul>
        </nav>
      </div>
    </div>
    <p class="footer-mark" aria-hidden="true">Novaris</p>
    <div class="footer-bottom">
      <p>&copy; <span data-year>2026</span> Novaris Photo Guides. All rights reserved.</p>
      <p>Prices in USD. Applicable taxes are calculated at checkout.</p>
    </div>
  </div>
</footer>`;
}

function pageDoc({ title, desc, file, current, body, noindex, mainAttrs = "", prefix = "" }) {
  return `${head({ title, desc, file, noindex }).replace("<head>\n", "<head>\n" + prefix)}
<body id="top">
<div class="progress" aria-hidden="true"></div>
${header(current)}
<main id="main"${mainAttrs}>
${body}
</main>
<a class="to-top" href="#top"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden">Back to top</span></a>
${footer()}
</body>
</html>
`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(OUT, file)), { recursive: true });
  fs.writeFileSync(path.join(OUT, file), content);
}

const metaLine = `Instant digital download · <a href="refunds.html">14-day refund policy</a> · Taxes calculated at checkout`;

// ---------- Home ----------

function productCard(p, i) {
  return `      <article class="card reveal${p.id === "complete-reference-library" ? " card-featured" : ""}" style="--stagger:${i}" data-product="${p.id}">
        <span class="card-glow" aria-hidden="true"><span></span></span>
        ${p.id === "complete-reference-library" ? '<span class="card-tag">All five guides</span>\n        ' : ""}${S.icons[p.icon]}
        <h3><a href="${p.id}.html">${html(p.name)}</a></h3>
        <p>${html(p.short)}</p>
        <div class="card-foot">
          <span class="card-price"><span data-price>${fmt(p.price)}</span><span class="visually-hidden"> US dollars</span></span>
          <span class="card-link" aria-hidden="true">View contents &rarr;</span>
        </div>
      </article>`;
}

const Y = '<span class="yes" aria-hidden="true">&#10003;</span><span class="visually-hidden">Included</span>';
const N = '<span class="no" aria-hidden="true">&mdash;</span><span class="visually-hidden">Not included</span>';
const matrix = [
  ["portrait-session-guide", "Portrait Session", [1, 1, 1, 0, 1, 0]],
  ["wedding-day-guide", "Wedding Day", [1, 0, 0, 0, 1, 1]],
  ["product-photography-guide", "Product Photography", [1, 1, 0, 1, 0, 0]],
  ["landscape-travel-field-guide", "Landscape &amp; Travel Field", [0, 0, 0, 1, 1, 1]],
  ["event-coverage-guide", "Event Coverage", [1, 1, 0, 1, 1, 0]]
];

const homeFaq = [
  ["How do I get my guide after buying?", `A download link is emailed to you immediately after payment and is also shown on the order confirmation screen. There is nothing shipped. See the <a href="delivery.html">Delivery Policy</a> for details.`],
  ["Are the guides editable or fillable?", "No. The guides are flat PDFs designed to be printed and written on. They can't be edited or filled in on screen."],
  ["Can I use the client questionnaires and worksheets with my clients?", `Yes. Your license covers use in your own photography work, including sharing worksheets designed for clients, such as questionnaires, with your own clients. The <a href="terms.html">Terms of Service</a> set out the full license.`],
  ["What if I change my mind?", `You can request a full refund within 14 days of purchase, with no reason required. Email ${MAIL} with your order number. See the <a href="refunds.html">Refund Policy</a>.`]
];

function faqItem([q, a]) {
  return `      <details class="faq-item">
        <summary>${q}</summary>
        <div class="faq-answer"><p>${a}</p></div>
      </details>`;
}

function home() {
  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-intro">
      <span class="eyebrow">Photography reference guides &middot; PDF</span>
      <h1 id="hero-title"><span class="line"><span>Printed references</span></span> <span class="line"><span>for the shoot</span></span> <span class="line"><span>in front of you.</span></span></h1>
      <p class="lede">Novaris Photo Guides are downloadable PDFs of shot lists, lighting setup diagrams, posing references, settings charts, and planning worksheets, each organized around one kind of photography. They are reference and planning pages to use while you work, not courses or lessons.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#guides">Browse the six guides</a>
        <a class="btn btn-ghost" href="#included">What every guide includes</a>
      </div>
      <ul class="hero-specs" aria-label="At a glance">
        <li><strong>6</strong><span>guides</span></li>
        <li><strong>2</strong><span>page sizes</span></li>
        <li><strong>PDF</strong><span>print-ready</span></li>
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
      <span class="eyebrow"><span class="eyebrow-num">01</span>The guides</span>
      <h2 id="guides-title">Six guides, one for each kind of work</h2>
      <p>Each guide collects the reference pages for one kind of photography in a single PDF. Open any guide to see its full contents, preview illustrations of representative pages, and who it suits before you buy.</p>
    </div>
    <div class="card-grid">
${products.map(productCard).join("\n")}
    </div>
  </div>
</section>

${showcase()}

<section class="section" id="included" aria-labelledby="included-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">03</span>Included in every guide</span>
      <h2 id="included-title">What you get with each guide</h2>
      <p>Every guide follows the same format, so the pages work the same way whichever guide you open.</p>
    </div>
    <div class="feature-grid">
      <div class="feature reveal" style="--stagger:0"><h3>Two page sizes</h3><p>Each guide comes as a US Letter PDF and an A4 PDF, so it prints at full size on standard paper in North America and elsewhere.</p></div>
      <div class="feature reveal" style="--stagger:1"><h3>Flat, print-ready PDFs</h3><p>The files are flat PDFs laid out for printing. They aren't editable or fillable; print the pages you need and write on them.</p></div>
      <div class="feature reveal" style="--stagger:2"><h3>Reference pages, not lessons</h3><p>Shot lists, diagrams, charts, and worksheets to consult during planning and on the job. No video, no course modules, no critique.</p></div>
      <div class="feature reveal" style="--stagger:3"><h3>Brand-neutral throughout</h3><p>Gear checklists and setups describe equipment by type, such as a softbox or a reflector, never by manufacturer or model.</p></div>
      <div class="feature reveal" style="--stagger:4"><h3>Use in your own work</h3><p>Use the guides in personal and commercial photography, print them as often as you need for your own use, and share client-facing worksheets with your clients.</p></div>
      <div class="feature reveal" style="--stagger:5"><h3>Simple refunds</h3><p>Ask for a full refund within 14 days of purchase, with no reason required and nothing to return.</p></div>
    </div>

    <div class="table-scroll reveal">
      <table class="matrix">
        <caption>Page types in each guide</caption>
        <thead>
          <tr><th scope="col">Guide</th><th scope="col">Shot lists</th><th scope="col">Lighting setups</th><th scope="col">Posing references</th><th scope="col">Settings charts</th><th scope="col">Planning worksheets</th><th scope="col">Gear checklist</th></tr>
        </thead>
        <tbody>
${matrix.map(([id, name, cols]) => `          <tr><th scope="row"><a href="${id}.html">${name}</a></th>${cols.map((c) => `<td>${c ? Y : N}</td>`).join("")}</tr>`).join("\n")}
          <tr><th scope="row"><a href="complete-reference-library.html">Complete Reference Library</a></th><td colspan="6">All of the above, in all five guides</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section-dark" id="how-it-works" aria-labelledby="how-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">04</span>Purchase and delivery</span>
      <h2 id="how-title">How buying a guide works</h2>
      <p>Everything is digital. There is no account to create and nothing is shipped.</p>
    </div>
    <ol class="steps">
      <li class="reveal" style="--stagger:0"><h3>Review the guide</h3><p>Each guide's page lists its full contents, formats, price, and who it is and isn't for.</p></li>
      <li class="reveal" style="--stagger:1"><h3>Pay at checkout</h3><p>Payment is handled by a third-party payment provider. Applicable taxes are calculated at checkout.</p></li>
      <li class="reveal" style="--stagger:2"><h3>Download right away</h3><p>A download link is emailed immediately after payment and shown on the order confirmation screen.</p></li>
      <li class="reveal" style="--stagger:3"><h3>Print what you need</h3><p>Choose the US Letter or A4 file and print the pages for the job in front of you.</p></li>
    </ol>
    <p class="reveal" style="margin-top:2.5rem">Read the <a href="delivery.html">Delivery Policy</a> and <a href="refunds.html">Refund Policy</a> for the details.</p>
  </div>
</section>

<section class="section" id="faq-preview" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">05</span>Questions</span>
      <h2 id="faq-title">Common questions</h2>
    </div>
    <div class="faq-list reveal">
${homeFaq.map(faqItem).join("\n")}
    </div>
    <p class="reveal" style="margin-top:2rem"><a class="btn btn-ghost" href="faq.html">Read all questions</a></p>
  </div>
</section>`;
  write("index.html", pageDoc({
    title: "Novaris Photo Guides — Printable photography reference guides (PDF)",
    desc: "Downloadable PDF reference guides for photographers: shot lists, lighting setup diagrams, posing references, settings charts, and planning worksheets for portraits, weddings, products, landscapes, and events.",
    file: "index.html", current: "", body
  }));
}

// ---------- Product pages ----------

function productPage(p, i) {
  const previews = p.previews.map((fn) => {
    const v = fn();
    const svg = v.svg || products[v.ref].previews[v.idx]().svg;
    return `      <figure class="preview reveal" style="--stagger:${0}">
        <div class="preview-page">${svg}</div>
        <figcaption><strong>${v.cap[0]}</strong>${html(v.cap[1])}</figcaption>
      </figure>`;
  }).map((s, k) => s.replace("--stagger:0", "--stagger:" + k));

  let contents;
  if (p.contents) {
    contents = `<div class="contents-grid">
${p.contents.map(([h, d], k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><h3>${html(h)}</h3><p>${html(d)}</p></div>`).join("\n")}
    </div>`;
  } else {
    contents = `<div class="contents-grid">
${products.slice(0, 5).map((q, k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><h3><a href="${q.id}.html">${html(q.name)}</a></h3><p>${html(q.short)}</p></div>`).join("\n")}
    </div>`;
  }

  const others = products.filter((q) => q.id !== p.id);
  const libraryNote = p.id !== "complete-reference-library"
    ? `<p class="muted">This guide is also part of the <a href="complete-reference-library.html">Complete Reference Library</a>, which includes all five guides.</p>`
    : `<p class="muted">Each guide in the library is also sold on its own.</p>`;

  const body = `
<div class="wrap">
  <div class="page-head">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="index.html">Home</a></li><li><a href="index.html#guides">Guides</a></li><li aria-current="page">${html(p.name)}</li></ol>
    </nav>
  </div>
  <div class="product-top">
    <div>
      ${S.icons[p.icon]}
      <h1>${html(p.name)}</h1>
      <p class="lede">${html(p.lede)}</p>
      <p class="muted">A downloadable PDF reference guide in US Letter and A4. Reference and planning material for use while you work; not a course, lesson, or critique service.</p>
    </div>
    <aside class="buy-box" aria-labelledby="price-title">
      <h2 id="price-title">${html(p.name)}</h2>
      <p class="price"><span data-price>${fmt(p.price)}</span><span class="price-currency">USD</span></p>
      <p class="price-meta">${metaLine}</p>
      <div class="buy-slot" data-buy></div>
      <ul class="buy-facts">
        <li><span>Format</span><span>PDF download</span></li>
        <li><span>Page sizes</span><span>US Letter and A4</span></li>
        <li><span>Editable</span><span>No, flat for printing</span></li>
        <li><span>Delivery</span><span>Link by email</span></li>
        <li><span>Refunds</span><span>Within 14 days</span></li>
      </ul>
    </aside>
  </div>
</div>

<section class="section section-alt" aria-labelledby="contents-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">What's inside</span>
      <h2 id="contents-title">${p.contents ? "Contents of the guide" : "The five guides in the library"}</h2>
      <p>${p.contents ? "The guide is organized into the sections below. Every section is included in both the US Letter and A4 files." : "The library contains each of these guides in full, exactly as they are sold individually."}</p>
    </div>
    ${contents}
  </div>
</section>

<section class="section" aria-labelledby="preview-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Page previews</span>
      <h2 id="preview-title">Representative pages</h2>
      <p>Illustrations of three representative page layouts from ${p.id === "complete-reference-library" ? "guides in the library" : "this guide"}. They show the layout and structure of each page type.</p>
    </div>
    <div class="preview-grid">
${previews.join("\n")}
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
${p.forWho.map((x) => `          <li>${html(x)}</li>`).join("\n")}
        </ul>
      </div>
      <div class="fit-col not reveal" style="--stagger:1">
        <h3>Not the right fit for</h3>
        <ul>
${p.notFor.map((x) => `          <li>${html(x)}</li>`).join("\n")}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="format-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Formats</span>
      <h2 id="format-title">Formats and sizes</h2>
    </div>
    <div class="format-grid">
    <div>
    <ul class="spec-list reveal">
      <li><span>File type</span><span>PDF, delivered by download</span></li>
      <li><span>Page sizes</span><span>US Letter (8.5 &times; 11 in) and A4 (210 &times; 297 mm), both included</span></li>
      <li><span>Editing</span><span>Flat PDFs, not editable or fillable. Print the pages and write on them.</span></li>
      <li><span>Printing</span><span>Unlimited printing for your own use, at home or at a print shop</span></li>
      <li><span>Gear references</span><span>Equipment is described by type, never by brand</span></li>
${p.extraFormat ? `      <li><span>Also included</span><span>${html(p.extraFormat)}</span></li>\n` : ""}      <li><span>License</span><span>Personal and commercial use in your own photography work. See the <a href="terms.html">Terms of Service</a>.</span></li>
    </ul>
    <div class="reveal" style="margin-top:2rem">${libraryNote}</div>
    </div>
    <figure class="size-figure reveal">
      ${S.pageSizes()}
      <figcaption>Every purchase includes a US Letter file and an A4 file.</figcaption>
    </figure>
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
        <a class="btn btn-ghost" href="index.html#guides">See all guides</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="other-title">
  <div class="wrap">
    <h2 id="other-title" class="reveal">Other guides</h2>
    <ul class="related reveal">
${others.map((q) => `      <li><a href="${q.id}.html">${html(q.name)} &middot; ${fmt(q.price)}</a></li>`).join("\n")}
    </ul>
  </div>
</section>`;
  write(`${p.id}.html`, pageDoc({ title: p.title, desc: p.meta, file: `${p.id}.html`, current: "guides", body, mainAttrs: ` data-product="${p.id}"` }));
}

// ---------- Prose pages ----------

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
  write(file, pageDoc({ title, desc, file, current, body }));
}

function about() {
  prosePage({
    file: "about.html", current: "about",
    title: "About Novaris Photo Guides — what we make and why",
    desc: "Novaris Photo Guides makes printable PDF reference guides for photographers: shot lists, lighting diagrams, posing references, settings charts, and planning worksheets.",
    eyebrow: "About", h1: "About Novaris Photo Guides",
    lede: "We make printable reference guides for photographers. Each one gathers the shot lists, diagrams, charts, and worksheets for one kind of photography into a single PDF.",
    content: `
    <h2>What we make</h2>
    <p>Novaris Photo Guides sells six downloadable PDFs: five guides, each covering one kind of photography, and a library that includes all five. The guides cover <a href="portrait-session-guide.html">portrait sessions</a>, <a href="wedding-day-guide.html">wedding days</a>, <a href="product-photography-guide.html">product photography</a>, <a href="landscape-travel-field-guide.html">landscape and travel</a>, and <a href="event-coverage-guide.html">event coverage</a>.</p>
    <p>Inside each guide are the kinds of pages a photographer reaches for while planning or working: shot lists, lighting setup diagrams, posing references, settings reference charts, and planning worksheets. Which page types appear depends on the kind of photography. A wedding guide needs a timeline and a family formals planner; a landscape guide needs sunrise and sunset planning sheets. Each guide's page lists exactly what it contains.</p>

    <h2>Why reference pages</h2>
    <p>Much of the work around a shoot is remembering things: which shots a client asked for, where a light went last time, what time the sun clears the ridge, which family groups come after the ceremony. That information tends to live in scattered notes, screenshots, and memory.</p>
    <p>We think it's easier to work from a printed page. A shot list on a clipboard can be checked off without unlocking a phone. A lighting diagram taped beside a tabletop is there when you need it. A planning sheet filled in before a session becomes the plan for the session. The guides exist to put those pages in one place, in a consistent layout, ready to print.</p>

    <h2>How the guides are put together</h2>
    <ul>
      <li><strong>One kind of photography per guide.</strong> Each guide stays focused, so you print only what applies to the job.</li>
      <li><strong>Both paper sizes.</strong> Every guide comes as a US Letter PDF and an A4 PDF.</li>
      <li><strong>Flat files for printing.</strong> The PDFs aren't editable or fillable. They're meant to be printed and written on.</li>
      <li><strong>Brand-neutral.</strong> Equipment is described by type, such as a softbox, a reflector, or a wide lens, never by manufacturer.</li>
      <li><strong>Starting points, not rules.</strong> Settings and setups are written as places to begin. Light, gear, and subjects vary, and you adjust from there.</li>
    </ul>

    <h2>What the guides are not</h2>
    <p>The guides are reference and planning material. They aren't courses, video lessons, coaching, or critique, and they don't include feedback on anyone's photographs. If you're looking for instruction, these guides aren't designed to provide it. The <a href="disclaimer.html">Disclaimer</a> covers this in more detail.</p>

    <h2>How we sell</h2>
    <p>Prices are listed in US dollars on each guide's page, and applicable taxes are calculated at checkout. Payment is handled by a third-party payment provider, so we never see your full card details. A download link arrives by email immediately after payment. If a guide isn't right for you, you can ask for a full refund within 14 days, with no reason required.</p>
    <p>This website uses no cookies, no analytics, and no advertising trackers. The <a href="privacy.html">Privacy Policy</a> explains what information we receive when you buy and how we use it.</p>

    <h2>Get in touch</h2>
    <p>Questions about a guide or an order go to ${MAIL}. We reply within two business days. More on the <a href="contact.html">Contact</a> page.</p>`
  });
}

const faqGroups = [
  ["Buying and delivery", [
    ["How is my guide delivered?", `<p>Every guide is a digital download. A download link is emailed to you immediately after payment and is also shown on the order confirmation screen. Nothing is shipped. See the <a href="delivery.html">Delivery Policy</a>.</p>`],
    ["My download email hasn't arrived. What should I do?", `<p>If the email hasn't arrived within an hour, check your spam or junk folder first. If it isn't there, email ${MAIL} with your order number and the email address you used at checkout, and we'll resend the link.</p>`],
    ["Who handles payment, and are taxes included?", `<p>Payment is handled at checkout by a third-party payment provider. Novaris Photo Guides never sees your full card details. Prices are shown in US dollars, and applicable taxes are calculated at checkout based on your location.</p>`],
    ["What does the Complete Reference Library include?", `<p>The <a href="complete-reference-library.html">Complete Reference Library</a> includes all five guides: Portrait Session, Wedding Day, Product Photography, Landscape &amp; Travel Field, and Event Coverage. Each is included in full, in both US Letter and A4.</p>`]
  ]],
  ["Files and printing", [
    ["What file format are the guides?", `<p>Each guide is a PDF. You receive two versions of every guide: one sized for US Letter (8.5 &times; 11 in) and one for A4 (210 &times; 297 mm). Any standard PDF reader will open them.</p>`],
    ["Can I print the guides?", `<p>Yes. Printing is unlimited for your own use. Print at home, at the office, or at a print shop, and print the same pages again for each job.</p>`],
    ["Are the guides editable or fillable?", `<p>No. The guides are flat PDFs. You can't type into the worksheets or change the text on screen. They're designed to be printed and filled in by hand.</p>`]
  ]],
  ["Using the guides", [
    ["Can I use the guides for paid client work?", `<p>Yes. The license covers personal and commercial use in your own photography work. You can also share worksheets designed for clients, such as the client questionnaire, with your own clients.</p>`],
    ["Can I share or resell the files?", `<p>No. You may not resell, redistribute, or upload the guides to template or file-sharing sites, or present them as your own work. The full license is in the <a href="terms.html">Terms of Service</a>.</p>`],
    ["Are the gear recommendations tied to a brand?", `<p>No. Gear checklists and lighting setups describe equipment by type, such as a softbox, reflector, flash, or tripod. No camera, lens, lighting, or software brand is recommended, and Novaris Photo Guides isn't affiliated with any manufacturer.</p>`],
    ["Are these courses, or will you review my photos?", `<p>Neither. The guides are reference and planning material: shot lists, diagrams, charts, and worksheets. They aren't lessons, and they don't include feedback or critique on anyone's work.</p>`],
    ["Will the settings charts work with my camera?", `<p>The charts give starting points that apply to cameras generally, not to a particular model. Light, lenses, and conditions vary, so treat each value as a place to begin and adjust from there. See the <a href="disclaimer.html">Disclaimer</a>.</p>`]
  ]],
  ["Refunds and support", [
    ["What is the refund policy?", `<p>You can request a full refund on any purchase within 14 days, with no reason required. Email ${MAIL} with your order number. Refunds go to your original payment method and are issued within 5 business days of your request. Your payment provider may take a few more days to process it. Nothing needs to be returned. See the <a href="refunds.html">Refund Policy</a>.</p>`],
    ["A file won't open or looks damaged. What now?", `<p>Email ${MAIL} with your order number and a short description of the problem. We'll send a replacement file, or issue a refund if you prefer.</p>`],
    ["How quickly do you answer support emails?", `<p>We reply within two business days. Include your order number and the email address you used at checkout so we can find your order quickly.</p>`]
  ]]
];

function faq() {
  const body = `
<div class="wrap narrow">
  <header class="page-head">
    <span class="eyebrow">FAQ</span>
    <h1>Frequently asked questions</h1>
    <p class="lede">Answers about delivery, files, printing, licensing, and refunds. Anything else, email ${MAIL}.</p>
    <nav class="chips" aria-label="FAQ topics">
${faqGroups.map(([g], gi) => `      <a href="#faq-g${gi}">${g}</a>`).join("\n")}
    </nav>
  </header>
${faqGroups.map(([g, items], gi) => `  <section aria-labelledby="faq-g${gi}" style="margin-bottom:3.5rem">
    <h2 id="faq-g${gi}" class="reveal">${g}</h2>
    <div class="faq-list reveal">
${items.map(faqItem).join("\n").replace(/<div class="faq-answer"><p>(<p>[\s\S]*?<\/p>)<\/p><\/div>/g, '<div class="faq-answer">$1</div>')}
    </div>
  </section>`).join("\n")}
</div>
<div class="section" aria-hidden="true" style="padding-top:0"></div>`;
  write("faq.html", pageDoc({
    title: "FAQ — delivery, formats, printing, licensing and refunds | Novaris Photo Guides",
    desc: "Answers about Novaris Photo Guides: download delivery, PDF formats in US Letter and A4, printing, editing, client use, refunds, missing downloads, and brand-neutral gear references.",
    file: "faq.html", current: "faq", body
  }));
}

function contact() {
  prosePage({
    file: "contact.html", current: "contact",
    title: "Contact Novaris Photo Guides — support by email",
    desc: "Contact Novaris Photo Guides by email for order, download, and refund help. Replies within two business days.",
    eyebrow: "Contact", h1: "Contact us",
    lede: "Support is handled by email. We reply within two business days.",
    content: `
    <div class="contact-card">
      <p class="muted" style="margin-bottom:.4em">Support email</p>
      <p class="contact-email"><a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <p style="margin:0">Response time: within two business days.</p>
    </div>

    <h2>What to include</h2>
    <p>To help us find your order and answer in one reply, please include:</p>
    <ul>
      <li><strong>Your order number</strong>, from your confirmation email or the order confirmation screen.</li>
      <li><strong>The email address you used at checkout</strong>, if you're writing from a different address.</li>
      <li><strong>The guide</strong> your question is about.</li>
      <li><strong>A short description</strong> of what you need, such as a resent download link, a replacement file, or a refund.</li>
    </ul>

    <h2>Common requests</h2>
    <ul>
      <li><strong>Download email didn't arrive:</strong> check your spam folder first. If it's not there after an hour, email us and we'll resend the link. See the <a href="delivery.html">Delivery Policy</a>.</li>
      <li><strong>Refund:</strong> send your order number within 14 days of purchase. No reason is required. See the <a href="refunds.html">Refund Policy</a>.</li>
      <li><strong>File won't open:</strong> tell us what happens when you open it, and we'll send a replacement or a refund, whichever you prefer.</li>
      <li><strong>Privacy requests:</strong> to access, correct, or delete your information, see the <a href="privacy.html">Privacy Policy</a>.</li>
    </ul>

    <h2>Before you write</h2>
    <p>Many questions about formats, printing, and licensing are answered on the <a href="faq.html">FAQ</a> page. Please note that the guides are reference material, and we don't offer critique of photographs or individual photography advice by email.</p>`
  });
}

function terms() {
  prosePage({
    file: "terms.html",
    title: "Terms of Service | Novaris Photo Guides",
    desc: "The terms that apply when you use the Novaris Photo Guides website and buy its PDF reference guides, including the license for personal and commercial use.",
    eyebrow: "Legal", h1: "Terms of Service", updated: true,
    content: `
    <p>These terms explain the rules for using this website and buying guides from Novaris Photo Guides. We've written them in plain language. "We," "us," and "our" mean Novaris Photo Guides. "You" means the person using the site or buying a guide.</p>

    <h2>1. Accepting these terms</h2>
    <p>By using this website or buying a guide, you agree to these Terms of Service, together with our <a href="privacy.html">Privacy Policy</a>, <a href="refunds.html">Refund Policy</a>, <a href="delivery.html">Delivery Policy</a>, and <a href="disclaimer.html">Disclaimer</a>. If you don't agree, please don't use the site or buy a guide.</p>

    <h2>2. What we sell</h2>
    <p>Novaris Photo Guides sells digital reference materials for photographers. Each guide is a downloadable PDF containing reference and planning pages such as shot lists, lighting setup diagrams, posing references, settings reference charts, and planning worksheets. Each guide is supplied in US Letter and A4 page sizes as flat PDFs that are not editable or fillable.</p>
    <p>The guides are reference and planning materials. They are not courses, lessons, coaching, or critique, and they do not include feedback on your work.</p>

    <h2>3. Your license</h2>
    <p>When you buy a guide, we grant you a non-exclusive, non-transferable license to use it as follows:</p>
    <ul>
      <li><strong>Personal and commercial use</strong> of the guide in your own photography work, including paid client work.</li>
      <li><strong>Unlimited printing</strong> of the guide for your own use.</li>
      <li><strong>Sharing client worksheets</strong>: you may share pages designed for clients, such as questionnaires, with your own clients, in print or as part of your client communication.</li>
    </ul>
    <p>The license is personal to you. Buying a guide gives you the right to use it; it does not transfer ownership of the guide or its content.</p>

    <h2>4. What you may not do</h2>
    <p>You may not:</p>
    <ul>
      <li>resell, sublicense, rent, or give away the guides or any part of them;</li>
      <li>redistribute the files, or share them with people other than your own clients as described above;</li>
      <li>upload the guides or any pages from them to template marketplaces, file-sharing sites, shared drives open to the public, or similar services;</li>
      <li>claim the guides, their pages, or their diagrams as your own work, or include them in products you sell.</li>
    </ul>

    <h2>5. Prices, taxes, and payment</h2>
    <p>Prices are listed in US dollars on each guide's page. Applicable taxes are calculated at checkout based on your location and are shown before you pay. Payment is handled by a third-party payment provider at checkout. Your payment is subject to that provider's terms, and we never receive your full payment card details. We may change prices for future purchases at any time; a price change never affects an order you have already paid for.</p>

    <h2>6. Delivery</h2>
    <p>Guides are delivered digitally by download, as described in our <a href="delivery.html">Delivery Policy</a>.</p>

    <h2>7. Refunds</h2>
    <p>Refunds are available as described in our <a href="refunds.html">Refund Policy</a>, including a full refund on any purchase requested within 14 days.</p>

    <h2>8. Ownership</h2>
    <p>All content in the guides and on this website, including text, layouts, worksheets, charts, diagrams, and illustrations, is owned by Novaris Photo Guides and protected by copyright and other intellectual property laws. Except for the license granted in section 3, no rights are given to you.</p>

    <h2>9. Reference only</h2>
    <p>The guides are starting points for planning and reference. Results depend on your equipment, light, location, and subjects. Please read our <a href="disclaimer.html">Disclaimer</a>, which forms part of these terms.</p>

    <h2>10. Disclaimer of warranties</h2>
    <p>To the extent permitted by law, the guides and this website are provided "as is" and "as available," without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. This does not affect your right to a refund under our Refund Policy or any rights you have under law that cannot be excluded.</p>

    <h2>11. Limitation of liability</h2>
    <p>To the extent permitted by law, our total liability to you for any claim relating to a guide or this website is limited to the amount you paid for the guide that the claim relates to. We are not liable for indirect, incidental, special, or consequential losses, such as lost profits, lost data, or lost business. Some jurisdictions don't allow certain limitations of liability, so parts of this section may not apply to you.</p>

    <h2>12. Governing law</h2>
    <p>These terms are governed by the laws of the State of Georgia, United States, without regard to its conflict-of-law rules. This does not remove any consumer protection rights you have under the laws of the place where you live.</p>

    <h2>13. Changes to these terms</h2>
    <p>We may update these terms from time to time. When we do, we'll post the new version on this page and change the "Last updated" date at the top. The terms in effect when you placed an order apply to that order. Continuing to use the site after an update means you accept the updated terms.</p>

    <h2>14. Contact</h2>
    <p>Questions about these terms can be sent to ${MAIL}.</p>`
  });
}

function privacy() {
  prosePage({
    file: "privacy.html",
    title: "Privacy Policy | Novaris Photo Guides",
    desc: "How Novaris Photo Guides handles personal information: no cookies, no analytics, no trackers, and order information used only to deliver products and provide support.",
    eyebrow: "Legal", h1: "Privacy Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>The short version:</strong> this website uses no cookies, no analytics, no advertising trackers, and no forms. When you buy a guide, we receive basic order information and use it only to deliver your guide, help you, process refunds, and meet tax and accounting obligations. We never sell your information or share it for advertising.</p>
    </div>

    <h2>Who we are</h2>
    <p>This policy covers the website and store of Novaris Photo Guides. For any privacy question or request, email ${MAIL}.</p>

    <h2>What this website collects</h2>
    <p>This website uses no cookies, no analytics, no advertising trackers, and no forms. We don't build profiles of visitors, and we don't know who browses the site.</p>
    <p>Like any website, the pages are delivered by a hosting provider, and the typefaces are loaded from Google Fonts. To deliver a page or font file, those services receive the technical information that every web request carries, such as your IP address and browser type. They handle it under their own privacy policies; we don't receive or use it.</p>

    <h2>Payments</h2>
    <p>Payments are handled by a third-party payment provider. At checkout, the payment provider collects your name, email address, billing details, and payment information, and processes them under its own privacy policy. Novaris Photo Guides never sees your full payment card details.</p>

    <h2>Information we receive when you buy</h2>
    <p>After a purchase, we receive order information from the payment provider:</p>
    <ul>
      <li>your name;</li>
      <li>your email address;</li>
      <li>the products you purchased;</li>
      <li>your country.</li>
    </ul>
    <p>If you email us, we also receive your email address and whatever you include in your message.</p>

    <h2>How we use it</h2>
    <p>We use order information only to:</p>
    <ul>
      <li>deliver the products you bought;</li>
      <li>provide support when you contact us;</li>
      <li>process refunds;</li>
      <li>meet our tax and accounting obligations.</li>
    </ul>
    <p>We don't send marketing emails, and we don't use your information for any other purpose.</p>
    <p>For visitors in the European Economic Area and the United Kingdom, our legal bases are the performance of our contract with you (delivering your purchase, support, and refunds) and compliance with legal obligations (tax and accounting).</p>

    <h2>What we never do</h2>
    <p>We never sell personal information, and we never share it for advertising, including cross-context behavioral advertising. We share order information only with the payment provider that processes your payment, and otherwise only where needed to meet our tax and accounting obligations or where required by law.</p>

    <h2>How long we keep information</h2>
    <p>We keep order information for as long as legal, tax, and accounting requirements oblige us to, and then delete it. Support emails are kept while needed to resolve your request and for the same record-keeping periods where they relate to an order or refund.</p>

    <h2>Your rights</h2>
    <p>Wherever you live, you can ask us to:</p>
    <ul>
      <li><strong>access</strong> the personal information we hold about you;</li>
      <li><strong>correct</strong> information that is inaccurate;</li>
      <li><strong>delete</strong> your information, except where we must keep it for legal, tax, or accounting reasons;</li>
      <li><strong>object</strong> to or ask us to restrict how we use your information.</li>
    </ul>
    <h3>Residents of the EEA and UK (GDPR)</h3>
    <p>Under the General Data Protection Regulation and the UK GDPR, you have the rights above, plus the right to data portability. You also have the right to complain to your local data protection authority. We respond to requests within one month.</p>
    <h3>California residents (CCPA)</h3>
    <p>Under the California Consumer Privacy Act, as amended, you have the right to know what personal information we collect and how we use it, and the rights to access, correct, and delete it. We don't sell or share personal information, so there is nothing to opt out of. We won't treat you differently for exercising your rights. We respond to requests within 45 days.</p>
    <h3>How to make a request</h3>
    <p>Email ${MAIL} from the email address you used at checkout, or tell us that address and your order number. We may ask you to confirm your identity before acting on a request so that we don't disclose information to the wrong person.</p>

    <h2>Where information is processed</h2>
    <p>Novaris Photo Guides is based in the United States, and the payment provider may process information in other countries. Where information about visitors from the EEA or UK is transferred, it is protected by the safeguards required by law.</p>

    <h2>Children</h2>
    <p>This website and the guides are not directed at children, and we don't knowingly collect personal information from anyone under 16. If you believe a child has given us personal information, email us and we'll delete it.</p>

    <h2>Changes to this policy</h2>
    <p>If we change this policy, we'll post the updated version on this page and change the "Last updated" date at the top. If a change materially affects how we use information we already hold, we'll also email the customers it affects before the change takes effect.</p>

    <h2>Contact</h2>
    <p>Questions or requests about privacy: ${MAIL}.</p>`
  });
}

function refunds() {
  prosePage({
    file: "refunds.html",
    title: "Refund Policy — 14-day refunds, no reason required | Novaris Photo Guides",
    desc: "Novaris Photo Guides offers a full refund on any purchase requested within 14 days, with no reason required and nothing to return.",
    eyebrow: "Policy", h1: "Refund Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>Full refund on any purchase within 14 days. No reason required, and nothing to return.</strong></p>
    </div>

    <h2>Who can get a refund</h2>
    <p>You can get a full refund on any purchase, including the Complete Reference Library, if you request it within 14 days of the purchase date. You don't need to give a reason.</p>

    <h2>How to request a refund</h2>
    <p>Email ${MAIL} with your order number. If you're writing from a different address than the one you used at checkout, include that address too. That's all we need.</p>

    <h2>When you'll receive it</h2>
    <p>Refunds go back to your original payment method. We issue the refund within 5 business days of your request. Your payment provider or bank may take a few additional days to show it on your statement.</p>

    <h2>Nothing to return</h2>
    <p>Because the guides are digital, there's nothing to send back. We simply ask that you stop using the files once you've been refunded.</p>

    <h2>Damaged files</h2>
    <p>If a file is damaged or won't open, tell us when you write. If you'd prefer, we'll send you a replacement file instead of a refund. Either way, the choice is yours.</p>

    <h2>Questions</h2>
    <p>Email ${MAIL}. We reply within two business days. See also our <a href="delivery.html">Delivery Policy</a> and <a href="terms.html">Terms of Service</a>.</p>`
  });
}

function delivery() {
  prosePage({
    file: "delivery.html",
    title: "Delivery Policy — instant digital download | Novaris Photo Guides",
    desc: "All Novaris Photo Guides products are digital. A download link is emailed immediately after payment and shown on the order confirmation screen. Nothing is shipped.",
    eyebrow: "Policy", h1: "Delivery Policy", updated: true,
    content: `
    <div class="callout">
      <p><strong>All products are digital and delivered by download.</strong> There is no physical shipment.</p>
    </div>

    <h2>How delivery works</h2>
    <p>Immediately after your payment goes through, two things happen:</p>
    <ul>
      <li>a download link is shown on the order confirmation screen; and</li>
      <li>the same download link is sent to the email address you entered at checkout.</li>
    </ul>
    <p>Each guide includes a US Letter PDF and an A4 PDF. The Complete Reference Library includes all five guides in both sizes.</p>

    <h2>If the email doesn't arrive</h2>
    <p>Most delivery emails arrive within a few minutes. If yours hasn't arrived within an hour:</p>
    <ol>
      <li>Check your spam, junk, or promotions folder.</li>
      <li>If it isn't there, email ${MAIL} with your order number and the email address you used at checkout.</li>
      <li>We'll resend the download link.</li>
    </ol>

    <h2>If a file won't open</h2>
    <p>The guides open in any standard PDF reader. If a file is damaged or won't open, email us and we'll send a replacement, or a refund if you prefer, as described in our <a href="refunds.html">Refund Policy</a>.</p>

    <h2>No physical shipment</h2>
    <p>Nothing is printed or posted. There are no shipping charges and no delivery times beyond the email above. To use the guides on paper, print them yourself at home or at a print shop.</p>

    <h2>Questions</h2>
    <p>Email ${MAIL}. We reply within two business days.</p>`
  });
}

function disclaimer() {
  prosePage({
    file: "disclaimer.html",
    title: "Disclaimer — reference material, starting points, independence | Novaris Photo Guides",
    desc: "Novaris Photo Guides are reference and planning materials, not instruction. Settings are starting points, photographers are responsible for permissions and releases, and the business is independent of all manufacturers.",
    eyebrow: "Legal", h1: "Disclaimer", updated: true,
    content: `
    <h2>Reference material, not instruction</h2>
    <p>Novaris Photo Guides are reference and planning materials: shot lists, diagrams, charts, and worksheets for photographers to use while planning and working. They are not courses, lessons, or coaching, and they include no feedback on anyone's work.</p>

    <h2>Settings and setups are starting points</h2>
    <p>Gear, light, venues, and subjects all vary. The settings, lighting setups, and diagrams in the guides are starting points for you to adjust to your situation. They are not guaranteed to produce any particular result, and you remain responsible for the choices you make on a shoot.</p>

    <h2>Your responsibilities when photographing</h2>
    <p>When you use the guides, you are responsible for:</p>
    <ul>
      <li>obtaining permission or permits where they are required, including for parks, venues, and public spaces;</li>
      <li>respecting private property and following site rules;</li>
      <li>getting model releases and property releases where they are needed;</li>
      <li>following local laws on photographing people and places;</li>
      <li>using equipment safely, including lighting stands, cables, and flash around people.</li>
    </ul>

    <h2>Independence</h2>
    <p>Novaris Photo Guides is independent. We are not affiliated with, sponsored by, or endorsed by any camera, lens, lighting, or software manufacturer. The guides describe equipment by type and do not recommend any brand.</p>

    <h2>Questions</h2>
    <p>Email ${MAIL}. See also our <a href="terms.html">Terms of Service</a>.</p>`
  });
}

function notFound() {
  const base = `<script>(function(){var p=location.pathname.split("/");var b=/\\.github\\.io$/.test(location.hostname)&&p.length>2?"/"+p[1]+"/":"/";document.write('<base href="'+b+'">');})();</script>\n`;
  const body = `
<div class="wrap notfound">
  <svg viewBox="-60 -60 120 120" role="img" aria-labelledby="nf-title"><title id="nf-title">A closed lens aperture</title><circle r="56" fill="none" stroke="currentColor" stroke-opacity=".3" style="color:var(--ink)"/><circle r="50" fill="#1f1d1a"/><g fill="none" stroke="#e09a2c" stroke-width="1.5" stroke-linejoin="round"><path d="M0 -6 L5.2 -3 L5.2 3 L0 6 L-5.2 3 L-5.2 -3 Z"/><path d="M0 -6 L30 -40 M5.2 -3 L49 4 M5.2 3 L20 46 M0 6 L-30 40 M-5.2 3 L-49 -4 M-5.2 -3 L-20 -46" stroke-opacity=".5"/></g></svg>
  <span class="eyebrow">Error 404</span>
  <h1>This page isn't here</h1>
  <p class="lede">The address may be mistyped, or the page may have moved. Everything on the site is reachable from the links below.</p>
  <div class="btn-row">
    <a class="btn btn-primary" href="index.html">Go to the home page</a>
    <a class="btn btn-ghost" href="index.html#guides">Browse the guides</a>
    <a class="btn btn-ghost" href="faq.html">Read the FAQ</a>
  </div>
</div>`;
  write("404.html", pageDoc({
    title: "Page not found | Novaris Photo Guides",
    desc: "The page you were looking for isn't on the Novaris Photo Guides site.",
    file: "404.html", current: "", body, noindex: true, prefix: base
  }));
}

// ---------- Film strip and showcase ----------

function filmstrip() {
  const items = ["Shot lists", "Lighting setup diagrams", "Posing references", "Settings charts", "Planning worksheets", "Timeline templates", "Scouting worksheets", "Gear checklists", "Client questionnaires", "Run-of-show sheets"];
  const frames = () => items.map((t, i) => `<li class="film-frame"><span class="film-code">${String(i + 1).padStart(2, "0")}A</span>${t}</li>`).join("");
  return `<div class="filmstrip" role="region" aria-label="Page types across the guides">
  <div class="film-track">
    <ul class="film-list">${frames()}</ul>
    <ul class="film-list" aria-hidden="true">${frames()}</ul>
  </div>
</div>`;
}

function showcase() {
  const slides = [
    ["Lighting diagrams", "Top-down setups that mark the subject, camera, lights, modifiers, and reflectors, with placement notes.", 0, 0, "Portrait Session Guide"],
    ["Shot lists", "Checklists organized by session type or by phase of the day, with room for additions on the job.", 1, 1, "Wedding Day Guide"],
    ["Planning worksheets", "Sheets to fill in by hand before a session or shoot: times, locations, people, and must-have shots.", 3, 0, "Landscape &amp; Travel Field Guide"],
    ["Settings charts", "Starting-point settings for common situations, with space to record your own adjustments.", 2, 2, "Product Photography Guide"]
  ];
  const tabs = slides.map(([t, d], i) => `        <button class="tab" type="button" role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          <span class="tab-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="tab-text"><strong>${t}</strong><span>${d}</span></span>
        </button>`).join("\n");
  const panels = slides.map(([t, , pi, vi, guide], i) => {
    const v = products[pi].previews[vi]();
    return `      <figure class="panel" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" data-panel="${i}">
        <div class="preview-page">${v.svg}</div>
        <figcaption>${t} &middot; from the <a href="${products[pi].id}.html">${guide}</a></figcaption>
      </figure>`;
  }).join("\n");
  return `<section class="section showcase-section" id="inside" aria-labelledby="inside-title">
  <div class="wrap showcase" data-tabs>
    <div class="showcase-copy reveal">
      <span class="eyebrow"><span class="eyebrow-num">02</span>Inside a guide</span>
      <h2 id="inside-title">The pages you'll print</h2>
      <p class="muted">Every guide is built from a small set of page types. Choose one to see an illustration of its layout, and select a page to enlarge it.</p>
      <div class="tabs" role="tablist" aria-label="Page types" hidden>
${tabs}
      </div>
    </div>
    <div class="stage reveal">
${panels}
    </div>
  </div>
</section>`;
}

// ---------- Run ----------

home();
products.forEach(productPage);
about(); faq(); contact(); terms(); privacy(); refunds(); delivery(); disclaimer(); notFound();

const pages = ["", "about.html", "faq.html", "contact.html", ...products.map((p) => p.id + ".html"), "terms.html", "privacy.html", "refunds.html", "delivery.html", "disclaimer.html"];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${BASE}${p}</loc><lastmod>${ISO_DATE}</lastmod></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
write("favicon.svg", S.favicon);
write(".nojekyll", "");
console.log("built", pages.length + 1, "pages");
