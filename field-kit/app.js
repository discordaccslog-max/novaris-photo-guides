/* Novaris Field Kit — app shell, routing, licenses, and device settings. */
import { activate, removeLicense, unlockedSlugs, hasLicenses, getLicenses } from "../js/license-store.js";
import { PRODUCT_CODES } from "../js/license.js";
import * as store from "./store.js";
import { h, btn, iconBtn, icon, toast, dialog, copyText, reportHref, formatDate, SITE, PRODUCTS, productFor } from "./ui.js";

const GUIDES = PRODUCTS.filter((p) => p.productCode !== "CR");
const TABS = {
  shotlists: { label: "Shot Lists", icon: "shotlists" },
  lighting: { label: "Lighting", icon: "lighting" },
  poses: { label: "Poses", icon: "poses" },
  settings: { label: "Settings", icon: "settings" },
  planning: { label: "Planning", icon: "planning" }
};
const VIEWS = {
  shotlists: () => import("./views/shotlists.js"),
  lighting: () => import("./views/lighting.js"),
  poses: () => import("./views/poses.js"),
  settings: () => import("./views/settings.js"),
  planning: () => import("./views/planning.js")
};
const MODES = [
  { id: "standard", label: "Standard display", icon: "contrast" },
  { id: "outdoor", label: "Outdoor high contrast", icon: "sun" },
  { id: "night", label: "Night mode (red)", icon: "moon" }
];

const guideCache = {};
const params = new URLSearchParams(location.search);
const PREVIEW = params.get("preview");
let keyHandler = null;
let deferredInstall = null;
let lastRouteKey = "";

const $main = () => document.getElementById("fk-main");
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

async function loadGuide(slug) {
  if (!guideCache[slug]) guideCache[slug] = (await import(`./guides/${slug}.js`)).default;
  return guideCache[slug];
}

function navigate(path) {
  const target = "#" + path;
  if (location.hash === target) route(); else location.hash = target;
}

/* ---------- Display modes ---------- */

function applyDisplay() {
  const s = store.getSettings();
  document.documentElement.dataset.mode = s.mode;
  document.documentElement.dataset.size = s.large ? "large" : "normal";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = s.mode === "night" ? "#000000" : s.mode === "outdoor" ? "#ffffff" : "#1f1d1a";
  const b = document.getElementById("fk-mode");
  if (b) {
    const m = MODES.find((x) => x.id === s.mode) || MODES[0];
    b.innerHTML = icon(m.icon);
    b.setAttribute("aria-label", `Display: ${m.label}. Change display mode`);
    b.title = `Display: ${m.label}`;
  }
}

function cycleMode() {
  const s = store.getSettings();
  const i = MODES.findIndex((m) => m.id === s.mode);
  const next = MODES[(i + 1) % MODES.length];
  store.updateSettings({ mode: next.id });
  applyDisplay();
  toast(next.label, { duration: 1800 });
}

/* ---------- Shell ---------- */

function shell() {
  const app = document.getElementById("app");
  app.textContent = "";
  if (PREVIEW) {
    document.body.classList.add("fk-preview");
    app.append(h("main", { id: "fk-main", tabindex: "-1" }), h("div", { id: "fk-toasts", class: "fk-toasts" }));
    return;
  }
  const mode = iconBtn("Change display mode", "contrast", cycleMode, "icon-btn", { id: "fk-mode" });
  app.append(
    h("a", { class: "skip-link", href: "#fk-main", onclick: (e) => { e.preventDefault(); $main().focus(); } }, "Skip to content"),
    h("header", { class: "fk-top" },
      h("a", { class: "fk-brand", href: "#/", html: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 6.5L24.2 11.2V20.8L16 25.5 7.8 20.8V11.2Z" fill="none" stroke="#e09a2c" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="16" r="4" fill="#e09a2c"/></svg><span>Field Kit</span>` }),
      h("p", { class: "fk-context", id: "fk-context" }),
      h("div", { class: "fk-top-actions" }, mode,
        h("a", { class: "icon-btn", href: "#/settings", "aria-label": "Field Kit settings", title: "Field Kit settings", html: icon("gear") }))),
    h("div", { class: "fk-body" },
      h("nav", { class: "fk-nav", id: "fk-nav", "aria-label": "Guide sections", hidden: true }),
      h("main", { id: "fk-main", tabindex: "-1" })),
    h("div", { id: "fk-toasts", class: "fk-toasts" }));
  applyDisplay();
}

function setContext(text) {
  const el = document.getElementById("fk-context");
  if (el) el.textContent = text || "";
}

function setNav(guide, activeTab) {
  const nav = document.getElementById("fk-nav");
  if (!nav) return;
  if (!guide) { nav.hidden = true; nav.textContent = ""; document.body.classList.remove("has-tabs"); return; }
  nav.hidden = false;
  document.body.classList.add("has-tabs");
  nav.textContent = "";
  const unlocked = unlockedSlugs();
  const switcher = h("div", { class: "fk-nav-guides" }, h("p", { class: "fk-nav-heading" }, "Your guides"),
    h("ul", {}, GUIDES.filter((g) => unlocked.has(g.slug)).map((g) => h("li", {},
      h("a", { href: `#/guide/${g.slug}`, class: `fk-nav-guide${g.slug === guide.slug ? " is-current" : ""}`, "aria-current": g.slug === guide.slug ? "true" : null }, g.name)))));
  const tabs = h("ul", { class: "fk-tabs" }, guide.tabs.map((t) => h("li", {},
    h("a", { href: `#/guide/${guide.slug}/${t}`, class: `fk-tab${t === activeTab ? " is-active" : ""}`, "aria-current": t === activeTab ? "page" : null, html: `${icon(TABS[t].icon)}<span>${TABS[t].label}</span>` }))));
  nav.append(switcher, h("p", { class: "fk-nav-heading fk-nav-heading-tabs" }, guide.name), tabs);
}

function showView(el, routeKey) {
  const main = $main();
  main.textContent = "";
  main.append(el);
  if (routeKey !== lastRouteKey) {
    lastRouteKey = routeKey;
    window.scrollTo(0, 0);
    const heading = main.querySelector("h1, h2");
    if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
  }
}

/* ---------- Routing ---------- */

async function route() {
  keyHandler = null;
  if (PREVIEW) return renderPreview();
  const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean).map(decodeURIComponent);
  const key = parts.slice(0, 4).join("/");
  if (parts[0] === "start") return renderStart(key);
  if (parts[0] === "settings") return renderSettings(key);
  if (parts[0] === "guide" && parts[1]) return renderGuide(parts[1], parts[2], parts[3], key);
  if (!hasLicenses()) return renderStart(key);
  return renderHome(key);
}

/* ---------- Start screen ---------- */

function activationForm({ onDone, label = "Activate" } = {}) {
  const err = h("p", { class: "fk-error", id: "lic-error", role: "alert" });
  const input = h("input", {
    id: "lic-input", class: "fk-input fk-code-input", type: "text", autocomplete: "off", autocapitalize: "characters",
    spellcheck: "false", inputmode: "text", placeholder: "NOVA-XX-XXXX-XXXX-XXXX", "aria-describedby": "lic-help lic-error", maxlength: "40"
  });
  const form = h("form", { class: "fk-activate", novalidate: true, onsubmit: (e) => {
    e.preventDefault();
    const res = activate(input.value);
    if (!res.ok) {
      err.innerHTML = icon("alert") + `<span>${res.error}</span>`;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    err.textContent = "";
    input.removeAttribute("aria-invalid");
    input.value = "";
    onActivated(res, onDone);
  } },
    h("label", { for: "lic-input", class: "fk-label" }, "License code"),
    h("p", { id: "lic-help", class: "fk-hint" }, "Your code is on your order confirmation. Capitals, spaces, and dashes don't matter."),
    h("div", { class: "fk-activate-row" }, input, btn(label, "key", null, "btn btn-primary", { type: "submit" })),
    err);
  return form;
}

function onActivated(res, onDone) {
  requestPersistence();
  const p = productFor(res.license.slug);
  if (res.already) toast(`${p.name} is already active on this device.`, { kind: "success" });
  else toast(`${p.name} activated on this device.`, { kind: "success" });
  if (!res.already) sessionStorage.setItem("nfk.justActivated", "1");
  if (onDone) return onDone(res);
  const unlocks = PRODUCT_CODES[res.license.productCode].unlocks;
  navigate(unlocks.length === 1 ? `/guide/${unlocks[0]}` : "/");
}

function renderStart(key) {
  setNav(null);
  setContext("");
  const view = h("div", { class: "fk-view fk-start" },
    h("div", { class: "fk-start-mark", "aria-hidden": "true", html: '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="2"/><circle cx="60" cy="60" r="48" fill="#1f1d1a"/><path d="M60 30 L86 45 V75 L60 90 L34 75 V45 Z" fill="none" stroke="#e09a2c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="60" r="10" fill="#e09a2c"/></svg>' }),
    h("h1", { class: "fk-start-title" }, "Novaris Field Kit"),
    h("p", { class: "fk-lede" }, "Your photography field guides, on any phone, tablet, or computer. Enter your license code to open your guides on this device."),
    activationForm(),
    h("div", { class: "fk-start-help" },
      h("p", {}, "Bought a guide on another device? Enter the same code here. ", h("a", { href: "/contact.html" }, "Lost your code?"), " Contact us with your order number and we'll send a replacement."),
      h("p", {}, h("a", { href: "/index.html#guides" }, "See the guides"), " · ", h("a", { href: "/faq.html" }, "FAQ"), " · ", h("a", { href: `mailto:${SITE.supportEmail}` }, SITE.supportEmail))),
    hasLicenses() ? h("p", {}, h("a", { href: "#/", class: "btn" }, "Go to your guides")) : null);
  showView(view, key || "start");
}

/* ---------- Home ---------- */

function renderHome(key) {
  setNav(null);
  setContext("");
  const unlocked = unlockedSlugs();
  const mine = GUIDES.filter((g) => unlocked.has(g.slug));
  const others = GUIDES.filter((g) => !unlocked.has(g.slug));
  const view = h("div", { class: "fk-view" }, h("h1", { class: "fk-view-title" }, "Your guides"));
  if (sessionStorage.getItem("nfk.justActivated")) {
    sessionStorage.removeItem("nfk.justActivated");
    const card = installCard();
    if (card) view.append(card);
  } else {
    const card = !store.getSettings().installDismissed ? installCard() : null;
    if (card) view.append(card);
  }
  if (store.backupReminderDue()) view.append(backupBanner());
  const list = h("ul", { class: "fk-guides" });
  for (const g of mine) {
    list.append(h("li", {}, h("a", { class: "fk-guide-card", href: `#/guide/${g.slug}` },
      h("span", { class: "fk-guide-name" }, g.name),
      h("span", { class: "fk-guide-text" }, g.short),
      h("span", { class: "fk-guide-open", html: `<span>Open</span>${icon("next")}` }))));
  }
  view.append(list);
  if (others.length) {
    view.append(h("section", { class: "fk-section" },
      h("h2", { class: "fk-h-small" }, "Other guides"),
      h("ul", { class: "fk-other" }, others.map((g) => h("li", {}, h("span", { html: icon("lock") }), h("a", { href: `/${g.slug}.html` }, g.name), h("span", { class: "fk-muted" }, ` · $${g.price}`)))),
      h("p", { class: "fk-muted" }, "Have a code for one of these? Add it in ", h("a", { href: "#/settings" }, "Field Kit settings"), ".")));
  }
  showView(view, key || "home");
  maybeWalkthrough();
}

function backupBanner() {
  const b = h("div", { class: "fk-banner", role: "status" });
  b.innerHTML = icon("info");
  b.append(h("div", {},
    h("p", {}, h("strong", {}, "Time for a backup. "), "Your saved work lives only in this browser and hasn't been backed up in the last 30 days."),
    h("div", { class: "fk-row fk-row-wrap" },
      btn("Export backup", "download", () => { exportBackup(); b.remove(); }, "btn btn-small btn-primary"),
      btn("Remind me later", null, () => { store.snoozeBackupReminder(7); b.remove(); }, "btn btn-small"))));
  return b;
}

function installCard() {
  if (isStandalone()) return null;
  const card = h("section", { class: "fk-card fk-install", "aria-labelledby": "install-title" });
  card.append(h("h2", { id: "install-title", class: "fk-h-small", html: icon("phone") + "<span>Use it offline on location</span>" }),
    h("p", {}, "Install the Field Kit on this device. It opens from your home screen and works without a signal once installed."));
  const row = h("div", { class: "fk-row fk-row-wrap" });
  if (deferredInstall) {
    row.append(btn("Install the Field Kit", "download", async () => {
      deferredInstall.prompt();
      const choice = await deferredInstall.userChoice.catch(() => null);
      deferredInstall = null;
      if (choice && choice.outcome === "accepted") { card.remove(); toast("Installed.", { kind: "success" }); }
    }, "btn btn-primary"));
  } else if (isIOS()) {
    card.append(h("p", { class: "fk-steps" }, "In Safari, tap the ", h("strong", {}, "Share"), " button, then ", h("strong", {}, "Add to Home Screen"), "."));
  } else {
    card.append(h("p", { class: "fk-steps" }, "Open your browser's menu and choose ", h("strong", {}, "Install app"), " or ", h("strong", {}, "Add to Home screen"), "."));
  }
  row.append(btn("Not now", null, () => { store.updateSettings({ installDismissed: true }); card.remove(); }, "btn"));
  card.append(row);
  return card;
}

/* ---------- Guides ---------- */

async function renderGuide(slug, tab, item, key) {
  const product = GUIDES.find((g) => g.slug === slug);
  if (!product) return renderHome(key);
  if (!unlockedSlugs().has(slug)) return renderLocked(product, key);
  setContext(product.name);
  const main = $main();
  if (!guideCache[slug]) main.innerHTML = '<p class="fk-loading">Opening guide…</p>';
  let guide;
  try {
    guide = await loadGuide(slug);
  } catch {
    showView(h("div", { class: "fk-view" }, h("h1", { class: "fk-view-title" }, "This guide couldn't load"), h("p", {}, "Check your connection and try again. Once the Field Kit has loaded while online, it works offline."), h("button", { type: "button", class: "btn", onclick: () => route() }, "Try again")), key);
    return;
  }
  const activeTab = guide.tabs.includes(tab) ? tab : guide.tabs[0];
  setNav(guide, activeTab);
  const mod = await VIEWS[activeTab]();
  const ctx = makeCtx(guide, product, item || null, false);
  showView(mod.render(ctx), `guide/${slug}/${activeTab}/${item || ""}`);
  maybeWalkthrough();
}

function makeCtx(guide, product, item, preview) {
  return {
    slug: guide.slug,
    guide,
    guideName: product.name,
    item,
    preview,
    navigate,
    setKeyHandler: (fn) => { keyHandler = fn; },
    openPreviewDoc: () => {}
  };
}

function renderLocked(product, key) {
  setNav(null);
  setContext(product.name);
  const view = h("div", { class: "fk-view fk-start" },
    h("h1", { class: "fk-view-title", html: icon("lock") + `<span>${product.name} isn't active on this device</span>` }),
    h("p", { class: "fk-lede" }, "Enter the license code for this guide, or for the Complete Reference Library, to open it here."),
    activationForm({ onDone: () => navigate(`/guide/${product.slug}`) }),
    h("p", {}, h("a", { href: `/${product.slug}.html` }, `About the ${product.name}`), " · ", h("a", { href: "#/" }, "Your guides")));
  showView(view, key);
}

/* ---------- Preview (product pages embed these) ---------- */

async function renderPreview() {
  const slug = PREVIEW;
  const view = params.get("view");
  const item = params.get("item") || null;
  const product = GUIDES.find((g) => g.slug === slug);
  if (!product) return;
  const guide = await loadGuide(slug);
  const allowed = (guide.previews || []).some((p) => p.view === view && (p.item || null) === item);
  if (!allowed) { $main().textContent = ""; return; }
  const mod = await VIEWS[view]();
  const ctx = makeCtx(guide, product, item, true);
  ctx.openPreviewDoc = () => {};
  const el = mod.render(ctx);
  const main = $main();
  main.textContent = "";
  main.append(h("p", { class: "fk-preview-bar" }, `${product.name} · Field Kit preview`), el);
}

/* ---------- Field Kit settings ---------- */

function renderSettings(key) {
  setNav(null);
  setContext("Settings");
  const s = store.getSettings();
  const view = h("div", { class: "fk-view fk-settings" }, h("h1", { class: "fk-view-title" }, "Field Kit settings"));

  // Licenses
  const licenses = getLicenses();
  const licSec = h("section", { class: "fk-card", "aria-labelledby": "set-lic" }, h("h2", { id: "set-lic", class: "fk-h-small" }, "Licenses"));
  if (licenses.length) {
    const ul = h("ul", { class: "fk-licenses" });
    for (const l of licenses) {
      const p = productFor(l.slug);
      ul.append(h("li", { class: "fk-license" },
        h("div", {}, h("p", { class: "fk-license-name", html: icon("check", "ic-ok") + `<span>${p.name}</span>` }),
          h("p", { class: "fk-code" }, l.code),
          h("p", { class: "fk-muted fk-small" }, `${l.productCode === "CR" ? "Unlocks all five guides. " : ""}Active on this device since ${formatDate(l.activatedAt)}.`)),
        h("div", { class: "fk-row" },
          btn("Copy", "copy", async () => toast((await copyText(l.code)) ? "Code copied." : "Couldn't copy. Select the code and copy it instead.", { kind: "success" }), "btn btn-small"),
          btn("Remove", "trash", () => {
            const removed = removeLicense(l.code);
            renderSettings(key);
            toast(`Removed ${p.name} from this device.`, { action: { label: "Undo", onClick: () => { activate(removed.code, removed.source); renderSettings(key); } } });
          }, "btn btn-small btn-danger-quiet"))));
    }
    licSec.append(ul);
  } else {
    licSec.append(h("p", { class: "fk-muted" }, "No licenses are active on this device yet."));
  }
  licSec.append(h("h3", { class: "fk-h-tiny" }, licenses.length ? "Add another license" : "Add a license"), activationForm({ label: "Add", onDone: () => renderSettings(key) }),
    h("p", { class: "fk-hint" }, "To use your guides on another device, open the Field Kit there and enter the same code."));
  view.append(licSec);

  // Display
  const disp = h("section", { class: "fk-card", "aria-labelledby": "set-disp" }, h("h2", { id: "set-disp", class: "fk-h-small" }, "Display"));
  const modes = h("div", { class: "fk-radio-list", role: "radiogroup", "aria-label": "Display mode" });
  const descs = { standard: "Follows your device's light or dark setting.", outdoor: "Maximum contrast for bright sun.", night: "Dim red on black for dark venues and astrophotography." };
  for (const m of MODES) {
    const id = `mode-${m.id}`;
    const r = h("input", { type: "radio", name: "mode", id, value: m.id });
    r.checked = s.mode === m.id;
    r.addEventListener("change", () => { store.updateSettings({ mode: m.id }); applyDisplay(); });
    modes.append(h("div", { class: "fk-radio" }, r, h("label", { for: id }, h("span", { html: icon(m.icon) }), h("span", {}, h("strong", {}, m.label), h("span", { class: "fk-muted fk-small" }, descs[m.id])))));
  }
  const large = h("input", { type: "checkbox", id: "set-large", class: "fk-switch" });
  large.checked = s.large;
  large.addEventListener("change", () => { store.updateSettings({ large: large.checked }); applyDisplay(); });
  disp.append(modes, h("div", { class: "fk-toggle" }, large, h("label", { for: "set-large" }, "Larger interface (bigger text and controls)")));
  view.append(disp);

  // Paper size
  const paper = h("section", { class: "fk-card", "aria-labelledby": "set-paper" }, h("h2", { id: "set-paper", class: "fk-h-small" }, "PDF page size"));
  const prow = h("div", { class: "fk-segmented", role: "radiogroup", "aria-label": "PDF page size" });
  for (const [v, label] of [["letter", "US Letter"], ["a4", "A4"]]) {
    const r = h("input", { type: "radio", name: "paper", id: `paper-${v}`, value: v });
    r.checked = s.paper === v;
    r.addEventListener("change", () => store.updateSettings({ paper: v }));
    prow.append(r, h("label", { for: `paper-${v}` }, label));
  }
  paper.append(h("p", { class: "fk-muted" }, "Used for every worksheet, shot list, and diagram you export."), prow);
  view.append(paper);

  // Backup
  const bk = h("section", { class: "fk-card", "aria-labelledby": "set-backup" }, h("h2", { id: "set-backup", class: "fk-h-small" }, "Backup"));
  const fileIn = h("input", { type: "file", accept: "application/json,.json", class: "visually-hidden", id: "backup-file" });
  fileIn.addEventListener("change", () => importBackupFile(fileIn.files[0], key));
  bk.append(
    h("p", {}, "Licenses, shot lists, worksheets, settings, and any saved location are stored only in this browser and never sent anywhere. Export a backup to keep a copy, or to move your work to another device."),
    h("p", { class: "fk-muted" }, s.lastBackup ? `Last backup: ${formatDate(s.lastBackup, true)}.` : "No backup made yet on this device."),
    h("div", { class: "fk-row fk-row-wrap" },
      btn("Export backup", "download", () => { exportBackup(); renderSettings(key); }, "btn btn-primary"),
      btn("Import backup", "upload", () => fileIn.click(), "btn")),
    fileIn);
  view.append(bk);

  // Offline and storage
  const off = h("section", { class: "fk-card", "aria-labelledby": "set-off" }, h("h2", { id: "set-off", class: "fk-h-small" }, "Offline and storage"));
  const offStatus = h("p", { class: "fk-status" });
  const storeStatus = h("p", { class: "fk-status" });
  off.append(offStatus, storeStatus);
  const install = installCard();
  if (install) { install.querySelector("button:last-child")?.remove(); off.append(install); }
  view.append(off);
  updateStatus(offStatus, storeStatus);

  // Help
  view.append(h("section", { class: "fk-card", "aria-labelledby": "set-help" }, h("h2", { id: "set-help", class: "fk-h-small" }, "Help"),
    h("ul", { class: "fk-links" },
      h("li", {}, h("button", { type: "button", class: "btn-link", onclick: () => walkthrough(true) }, "Show the walkthrough again")),
      h("li", {}, h("a", { href: reportHref("Field Kit", "Settings") }, "Report a problem")),
      h("li", {}, "Support: ", h("a", { href: `mailto:${SITE.supportEmail}` }, SITE.supportEmail), " (we reply within two business days)"),
      h("li", {}, h("a", { href: "/faq.html" }, "FAQ"), " · ", h("a", { href: "/terms.html" }, "Terms"), " · ", h("a", { href: "/privacy.html" }, "Privacy"), " · ", h("a", { href: "/refunds.html" }, "Refunds"), " · ", h("a", { href: "/delivery.html" }, "Delivery")),
      h("li", {}, h("a", { href: "/index.html" }, "Novaris Photo Guides store")))));
  showView(view, key || "settings");
}

async function updateStatus(offEl, storeEl) {
  const ok = (el, good, text) => { el.innerHTML = icon(good ? "check" : "info", good ? "ic-ok" : "ic-warn") + `<span>${text}</span>`; };
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) ok(offEl, true, "Ready to work offline on this device.");
  else if ("serviceWorker" in navigator) ok(offEl, false, "Getting ready for offline use. Keep this page open for a moment while online, then reload.");
  else ok(offEl, false, "This browser doesn't support offline use. The Field Kit still works while online.");
  if (navigator.storage && navigator.storage.persisted) {
    const persisted = await navigator.storage.persisted().catch(() => false);
    ok(storeEl, persisted, persisted ? "Saved work is protected from automatic clean-up by the browser." : "The browser may clear saved work if the device runs low on space. Keep a backup.");
  } else {
    ok(storeEl, false, "Keep a backup: this browser may clear saved data when space runs low.");
  }
}

function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

function exportBackup() {
  const data = store.buildBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: `novaris-field-kit-backup-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  store.markBackedUp();
  toast("Backup saved. Keep the file somewhere safe.", { kind: "success" });
}

async function importBackupFile(file, key) {
  if (!file) return;
  let data;
  try { data = JSON.parse(await file.text()); } catch { toast("That file couldn't be read as a backup.", { kind: "error" }); return; }
  const check = store.checkBackup(data);
  if (!check.ok) { toast(check.error, { kind: "error" }); return; }
  const docs = Object.keys(data.docs || {}).length;
  const lic = (data.licenses || []).length;
  const ok = await dialog({
    title: "Import this backup?",
    body: `It contains ${lic} license${lic === 1 ? "" : "s"} and ${docs} saved item${docs === 1 ? "" : "s"}, from ${formatDate(data.exportedAt, true)}. Items already on this device are kept unless the backup has a newer copy.`,
    buttons: [{ label: "Cancel", value: false }, { label: "Import", value: true, primary: true }]
  });
  if (!ok) return;
  const res = store.importBackup(data);
  if (!res.ok) { toast(res.error, { kind: "error" }); return; }
  const sm = res.summary;
  toast(`Imported: ${sm.licensesAdded} license${sm.licensesAdded === 1 ? "" : "s"}, ${sm.docsAdded} new and ${sm.docsUpdated} updated item${sm.docsAdded + sm.docsUpdated === 1 ? "" : "s"}.`, { kind: "success" });
  applyDisplay();
  renderSettings(key);
}

/* ---------- Walkthrough ---------- */

const STEPS = [
  { title: "Your guides live here", text: "Each guide you've unlocked opens from Your guides. A license works on any device: enter the same code in the Field Kit there." },
  { title: "Five sections", text: "Shot Lists, Lighting, Poses, Settings, and Planning. On a phone they sit along the bottom of the screen; on a computer, in the sidebar. Each guide shows the sections it contains." },
  { title: "Saved on this device", text: "Shot lists, worksheets, and locations are saved only in this browser. Use Export backup in Field Kit settings to keep a copy or move your work to another device." },
  { title: "Made for the field", text: "The display button at the top switches to a high-contrast outdoor mode or a red night mode. Install the Field Kit to your home screen to use it offline on location." }
];

function maybeWalkthrough() {
  if (!store.getSettings().walkthroughDone && hasLicenses()) setTimeout(() => walkthrough(false), 300);
}

function walkthrough(force) {
  if (document.querySelector(".fk-walkthrough")) return;
  if (!force && store.getSettings().walkthroughDone) return;
  let i = 0;
  const dlg = h("dialog", { class: "fk-dialog fk-walkthrough", "aria-labelledby": "wt-title" });
  const done = () => { store.updateSettings({ walkthroughDone: true }); dlg.close(); dlg.remove(); };
  const draw = () => {
    dlg.textContent = "";
    const s = STEPS[i];
    dlg.append(
      h("p", { class: "fk-step-count" }, `${i + 1} of ${STEPS.length}`),
      h("h2", { id: "wt-title" }, s.title),
      h("p", {}, s.text),
      h("div", { class: "fk-dots", "aria-hidden": "true" }, STEPS.map((_, k) => h("span", { class: k === i ? "is-on" : "" }))),
      h("div", { class: "fk-dialog-actions" },
        h("button", { type: "button", class: "btn", onclick: done }, "Skip"),
        i > 0 ? h("button", { type: "button", class: "btn", onclick: () => { i--; draw(); } }, "Back") : null,
        h("button", { type: "button", class: "btn btn-primary", onclick: () => { if (i < STEPS.length - 1) { i++; draw(); } else done(); } }, i < STEPS.length - 1 ? "Next" : "Done")));
    dlg.querySelector(".btn-primary").focus();
  };
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); done(); });
  document.body.append(dlg);
  dlg.showModal();
  draw();
}

/* ---------- Service worker ---------- */

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || PREVIEW) return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("/field-kit/sw.js", { scope: "/field-kit/" }).catch(() => {});
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloading) return;
    toast("The Field Kit has been updated.", { action: { label: "Reload", onClick: () => { reloading = true; location.reload(); } } });
  });
}

/* ---------- Start ---------- */

window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });
window.addEventListener("hashchange", route);
document.addEventListener("keydown", (e) => { if (keyHandler) keyHandler(e); });
window.addEventListener("storage", (e) => { if (e.key === "nfk.licenses" || e.key === "nfk.settings") { applyDisplay(); route(); } });

shell();
route();
registerServiceWorker();
