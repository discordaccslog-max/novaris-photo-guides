/*
  Novaris Photo Guides — order confirmation pages (/thank-you/<slug>/).
  Issues the license code (from the payment provider's order ID when present,
  so the same order always gets the same code), activates it in this browser,
  and offers a PDF confirmation and printing.
*/
import { generateFromOrder, generateRandom, orderIdFromSearch, validate } from "./license.js";
import { activate, readJson, writeJson } from "./license-store.js";
import { buildConfirmationPdf } from "./confirmation.js";
import { downloadBytes } from "./pdf.js";

const root = document.querySelector("[data-confirmation]");

function offsetLabel(date) {
  const m = -date.getTimezoneOffset();
  const sign = m < 0 ? "−" : "+";
  const a = Math.abs(m);
  return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

function formatIssued(iso) {
  const d = new Date(iso);
  let text;
  try {
    text = d.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
  } catch {
    text = d.toLocaleString();
  }
  return `${text} (${offsetLabel(d)})`;
}

function defaultPaper() {
  const lang = navigator.language || "en-US";
  return /^(en-US|en-CA|es-MX|fr-CA)$/i.test(lang) ? "letter" : "a4";
}

/* Develops the code one character at a time, like a print in a tray. */
function showCode(el, code) {
  el.textContent = "";
  el.setAttribute("aria-label", code.split("").join(" "));
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  [...code].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = ch === "-" ? "ty-ch ty-dash" : "ty-ch";
    span.textContent = ch;
    span.setAttribute("aria-hidden", "true");
    if (!reduce) span.style.animationDelay = `${0.15 + i * 0.07}s`;
    el.append(span);
  });
}

async function issue(productCode, slug) {
  const orderRef = orderIdFromSearch(location.search);
  const key = `nfk.issued.${slug}.${orderRef ? "order:" + orderRef : "direct"}`;
  const stored = readJson(key, null);
  if (stored && validate(stored.code).valid && validate(stored.code).productCode === productCode) {
    return { ...stored, orderRef };
  }
  const code = orderRef ? await generateFromOrder(productCode, orderRef) : generateRandom(productCode);
  const record = { code, issuedAt: new Date().toISOString() };
  writeJson(key, record);
  return { ...record, orderRef };
}

async function main() {
  if (!root) return;
  const slug = root.dataset.product;
  const productCode = root.dataset.productCode;
  const productName = root.dataset.productName;
  const site = window.NOVARIS_SITE || { siteUrl: location.origin, supportEmail: "" };

  const { code, issuedAt, orderRef } = await issue(productCode, slug);
  const codeEl = root.querySelector("[data-code]");
  showCode(codeEl, code);

  root.querySelector("[data-issued]").textContent = formatIssued(issuedAt);
  if (orderRef) {
    root.querySelector("[data-order-row]").hidden = false;
    root.querySelector("[data-order]").textContent = orderRef;
  }

  const status = root.querySelector("[data-status]");
  const result = activate(code, "confirmation");
  if (result.ok) {
    status.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ty-ic"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Activated in this browser</span>';
    status.classList.add("is-ok");
  } else {
    status.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ty-ic"><path d="M12 3l9.5 17h-19zM12 10v4.5M12 17.5v.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>This browser is blocking storage, so the code couldn\'t be saved here. Open the Field Kit and enter the code to activate it.</span>';
    status.classList.add("is-warn");
  }

  const copyBtn = root.querySelector("[data-copy]");
  copyBtn.disabled = false;
  copyBtn.addEventListener("click", async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(code); ok = true; } catch { ok = false; }
    copyBtn.textContent = ok ? "Copied" : "Select the code to copy it";
    setTimeout(() => { copyBtn.textContent = "Copy code"; }, 2500);
  });

  const saveBtn = root.querySelector("[data-save]");
  saveBtn.disabled = false;
  saveBtn.addEventListener("click", () => {
    const bytes = buildConfirmationPdf({
      productName,
      licenseCode: code,
      issuedAtLabel: formatIssued(issuedAt),
      orderRef,
      siteUrl: site.siteUrl,
      supportEmail: site.supportEmail,
      fieldKitUrl: `${site.siteUrl}/field-kit/`,
      paper: defaultPaper()
    });
    downloadBytes(bytes, `novaris-order-confirmation-${slug}.pdf`);
  });

  root.querySelector("[data-print]").addEventListener("click", () => window.print());
}

main();
