/*
  Novaris Photo Guides — licenses saved in this browser.
  Shared by the confirmation pages and the Field Kit. Nothing leaves the device.
*/
import { validate, PRODUCT_CODES } from "./license.js";

export const LICENSE_KEY = "nfk.licenses";

function storage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

export function readJson(key, fallback) {
  const s = storage();
  if (!s) return fallback;
  try {
    const raw = s.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  const s = storage();
  if (!s) return false;
  try {
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getLicenses() {
  const list = readJson(LICENSE_KEY, []);
  return Array.isArray(list) ? list.filter((l) => l && validate(l.code).valid) : [];
}

export function setLicenses(list) {
  return writeJson(LICENSE_KEY, list);
}

/* Validates and saves a code. Returns { ok, license, already, error }. */
export function activate(input, source = "entered") {
  const result = validate(input);
  if (!result.valid) return { ok: false, error: result.error };
  const list = getLicenses();
  const existing = list.find((l) => l.code === result.code);
  if (existing) return { ok: true, already: true, license: existing };
  const license = {
    code: result.code,
    productCode: result.productCode,
    slug: result.slug,
    activatedAt: new Date().toISOString(),
    source
  };
  list.push(license);
  if (!setLicenses(list)) {
    return { ok: false, error: "This browser is blocking storage, so the license can't be saved. Check that private browsing or storage blocking is off." };
  }
  return { ok: true, license };
}

export function removeLicense(code) {
  const list = getLicenses();
  const next = list.filter((l) => l.code !== code);
  setLicenses(next);
  return list.find((l) => l.code === code) || null;
}

export function unlockedSlugs() {
  const set = new Set();
  for (const l of getLicenses()) for (const slug of PRODUCT_CODES[l.productCode].unlocks) set.add(slug);
  return set;
}

export function hasLicenses() {
  return getLicenses().length > 0;
}
