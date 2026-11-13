/* Novaris Field Kit — small UI helpers shared by all views. */
import { downloadBytes } from "../js/pdf.js";

export const SITE = window.NOVARIS_SITE;
export const PRODUCTS = window.NOVARIS_PRODUCTS;

/* Element builder: h("button", { class: "x", onclick }, "Label", child, ...) */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const ICONS = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  shotlists: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8.5l1.5 1.5 3-3M8.5 14.5l1.5 1.5 3-3"/>',
  lighting: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  poses: '<circle cx="12" cy="5" r="2.2"/><path d="M12 8v6M8 10.5l4-1.5 4 1.5M9.5 21l2.5-7 2.5 7"/>',
  settings: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v4.5l3 2"/>',
  planning: '<rect x="4" y="4.5" width="16" height="16" rx="2"/><path d="M4 9.5h16M9 3v3M15 3v3M8 13.5h3M8 17h6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9.5 14.5L12 17l2.5-2.5"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  location: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  reset: '<path d="M4 4v6h6"/><path d="M5.5 15a7.5 7.5 0 1 0 1.8-7.8L4 10"/>',
  offline: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.2a10 10 0 0 1 14 0M8.5 15.6a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>'
};

export function icon(name, cls = "") {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

export function iconEl(name, cls) {
  const span = document.createElement("span");
  span.className = "ic-wrap";
  span.innerHTML = icon(name, cls);
  return span.firstChild;
}

/* A button with an icon and a visible label. */
export function btn(label, iconName, onclick, cls = "btn", extra = {}) {
  const b = h("button", { type: "button", class: cls, onclick, ...extra });
  if (iconName) b.insertAdjacentHTML("beforeend", icon(iconName));
  b.append(h("span", {}, label));
  return b;
}

/* An icon-only button with an accessible name. */
export function iconBtn(label, iconName, onclick, cls = "icon-btn", extra = {}) {
  const b = h("button", { type: "button", class: cls, "aria-label": label, title: label, onclick, ...extra });
  b.insertAdjacentHTML("beforeend", icon(iconName));
  return b;
}

let toastTimer = null;
export function toast(message, { action, kind = "info", duration = 5000 } = {}) {
  const region = document.getElementById("fk-toasts");
  if (!region) return;
  region.textContent = "";
  const t = h("div", { class: `toast toast-${kind}`, role: kind === "error" ? "alert" : "status" });
  t.insertAdjacentHTML("beforeend", icon(kind === "error" ? "alert" : kind === "success" ? "check" : "info"));
  t.append(h("span", {}, message));
  if (action) t.append(h("button", { type: "button", class: "toast-action", onclick: () => { action.onClick(); t.remove(); } }, action.label));
  t.append(iconBtn("Dismiss", "close", () => t.remove(), "toast-close"));
  region.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), action ? Math.max(duration, 8000) : duration);
}

export function savePdf(bytes, filename) {
  downloadBytes(bytes, filename);
  toast(`Saved ${filename}`, { kind: "success" });
}

export function slugify(s) {
  return String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "export";
}

export function productFor(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function reportHref(guideName, section) {
  const subject = `Field Kit problem: ${guideName || "Field Kit"}${section ? " / " + section : ""}`;
  const body = [
    "What happened:",
    "",
    "",
    "What I expected:",
    "",
    "",
    `Guide: ${guideName || "-"}`,
    `Section: ${section || "-"}`,
    `Screen: ${location.hash || "#/"}`,
    `Device and browser: ${navigator.userAgent}`
  ].join("\n");
  return `mailto:${SITE.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatDate(iso, withTime = false) {
  if (!iso) return "";
  const d = new Date(iso);
  const opts = { year: "numeric", month: "short", day: "numeric" };
  if (withTime) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleString(undefined, opts);
}

/* Modal dialog. Resolves with the value of the chosen button (or null). */
export function dialog({ title, body, buttons = [{ label: "OK", value: true, primary: true }], dismissible = true }) {
  return new Promise((resolve) => {
    const dlg = h("dialog", { class: "fk-dialog", "aria-labelledby": "fk-dialog-title" });
    const close = (v) => { dlg.close(); dlg.remove(); resolve(v); };
    dlg.append(h("h2", { id: "fk-dialog-title" }, title));
    if (typeof body === "string") dlg.append(h("p", {}, body)); else if (body) dlg.append(body);
    const row = h("div", { class: "fk-dialog-actions" });
    for (const b of buttons) row.append(h("button", { type: "button", class: b.primary ? "btn btn-primary" : b.danger ? "btn btn-danger" : "btn", onclick: () => close(b.value) }, b.label));
    dlg.append(row);
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); if (dismissible) close(null); });
    document.body.append(dlg);
    dlg.showModal();
    const primary = dlg.querySelector(".btn-primary") || dlg.querySelector("button");
    if (primary) primary.focus();
  });
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = h("textarea", { class: "visually-hidden" });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/* Standard view footer with print/export and the problem-report link. */
export function viewFooter(guideName, section) {
  return h("p", { class: "fk-report" },
    h("a", { href: reportHref(guideName, section) }, "Report a problem with this section"));
}

export function debounce(fn, ms = 500) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
