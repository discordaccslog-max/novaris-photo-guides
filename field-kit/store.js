/*
  Novaris Field Kit — everything the buyer creates, saved only in this browser.
  Keys: nfk.licenses (shared with confirmation pages), nfk.docs, nfk.settings, nfk.location.
*/
import { readJson, writeJson, getLicenses, setLicenses, LICENSE_KEY } from "../js/license-store.js";
import { validate } from "../js/license.js";

const DOCS_KEY = "nfk.docs";
const SETTINGS_KEY = "nfk.settings";
const LOCATION_KEY = "nfk.location";
export const BACKUP_APP = "novaris-field-kit";
export const BACKUP_VERSION = 1;
export const BACKUP_REMINDER_DAYS = 30;

const DEFAULT_SETTINGS = {
  mode: "standard", // standard | outdoor | night
  large: false,
  paper: null, // "letter" | "a4"; null = choose from locale
  walkthroughDone: false,
  firstUse: null,
  lastBackup: null,
  backupSnoozeUntil: null,
  installDismissed: false
};

export function defaultPaper() {
  const lang = (globalThis.navigator && navigator.language) || "en-US";
  return /^(en-US|en-CA|es-MX|fr-CA)$/i.test(lang) ? "letter" : "a4";
}

export function getSettings() {
  const s = { ...DEFAULT_SETTINGS, ...readJson(SETTINGS_KEY, {}) };
  if (!s.paper) s.paper = defaultPaper();
  return s;
}

export function updateSettings(patch) {
  const next = { ...getSettings(), ...patch };
  writeJson(SETTINGS_KEY, next);
  return next;
}

export function getDocs() {
  const docs = readJson(DOCS_KEY, {});
  return docs && typeof docs === "object" ? docs : {};
}

export function getDoc(id) {
  return getDocs()[id] || null;
}

export function docsFor(guide, kind) {
  return Object.values(getDocs())
    .filter((d) => d.guide === guide && (!kind || d.templateKind === kind))
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}

export function newId() {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  return "d" + Date.now().toString(36) + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function saveDoc(doc) {
  const docs = getDocs();
  const now = new Date().toISOString();
  const next = { ...doc, created: doc.created || now, updated: now };
  docs[next.id] = next;
  writeJson(DOCS_KEY, docs);
  const settings = getSettings();
  if (!settings.firstUse) updateSettings({ firstUse: now });
  return next;
}

export function deleteDoc(id) {
  const docs = getDocs();
  const removed = docs[id] || null;
  delete docs[id];
  writeJson(DOCS_KEY, docs);
  return removed;
}

export function restoreDoc(doc) {
  const docs = getDocs();
  docs[doc.id] = doc;
  writeJson(DOCS_KEY, docs);
}

export function getLocation() {
  return readJson(LOCATION_KEY, null);
}

export function saveLocation(loc) {
  writeJson(LOCATION_KEY, loc ? { ...loc, savedAt: new Date().toISOString() } : null);
}

/* ---------- Undo and redo ---------- */

export class History {
  constructor(initial, limit = 200) {
    this.stack = [JSON.stringify(initial)];
    this.index = 0;
    this.limit = limit;
  }
  get current() { return JSON.parse(this.stack[this.index]); }
  get canUndo() { return this.index > 0; }
  get canRedo() { return this.index < this.stack.length - 1; }
  push(state) {
    const s = JSON.stringify(state);
    if (s === this.stack[this.index]) return false;
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(s);
    if (this.stack.length > this.limit) this.stack.shift();
    this.index = this.stack.length - 1;
    return true;
  }
  undo() { if (this.canUndo) this.index--; return this.current; }
  redo() { if (this.canRedo) this.index++; return this.current; }
}

/* ---------- Backup ---------- */

export function buildBackup() {
  const settings = getSettings();
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    licenses: getLicenses(),
    docs: getDocs(),
    settings: { mode: settings.mode, large: settings.large, paper: settings.paper, walkthroughDone: settings.walkthroughDone },
    location: getLocation()
  };
}

export function markBackedUp() {
  return updateSettings({ lastBackup: new Date().toISOString(), backupSnoozeUntil: null });
}

/* Validates a parsed backup file. Returns { ok, error }. */
export function checkBackup(data) {
  if (!data || typeof data !== "object") return { ok: false, error: "That file isn't a Field Kit backup." };
  if (data.app !== BACKUP_APP) return { ok: false, error: "That file isn't a Novaris Field Kit backup." };
  if (typeof data.version !== "number" || data.version > BACKUP_VERSION) {
    return { ok: false, error: "This backup was made by a newer version of the Field Kit. Reload the Field Kit and try again." };
  }
  return { ok: true };
}

/* Merges a backup into this browser. Newer copies of the same document win. */
export function importBackup(data) {
  const check = checkBackup(data);
  if (!check.ok) return check;
  const summary = { licensesAdded: 0, docsAdded: 0, docsUpdated: 0, docsKept: 0 };

  const licenses = getLicenses();
  for (const l of Array.isArray(data.licenses) ? data.licenses : []) {
    const v = validate(l && l.code);
    if (!v.valid || licenses.some((x) => x.code === v.code)) continue;
    licenses.push({ code: v.code, productCode: v.productCode, slug: v.slug, activatedAt: l.activatedAt || new Date().toISOString(), source: "backup" });
    summary.licensesAdded++;
  }
  setLicenses(licenses);

  const docs = getDocs();
  for (const [id, doc] of Object.entries(data.docs && typeof data.docs === "object" ? data.docs : {})) {
    if (!doc || typeof doc !== "object" || !doc.guide || !doc.data) continue;
    const mine = docs[id];
    if (!mine) { docs[id] = { ...doc, id }; summary.docsAdded++; }
    else if ((doc.updated || "") > (mine.updated || "")) { docs[id] = { ...doc, id }; summary.docsUpdated++; }
    else summary.docsKept++;
  }
  writeJson(DOCS_KEY, docs);

  if (data.settings && typeof data.settings === "object") {
    const { mode, large, paper } = data.settings;
    const patch = {};
    if (["standard", "outdoor", "night"].includes(mode)) patch.mode = mode;
    if (typeof large === "boolean") patch.large = large;
    if (paper === "letter" || paper === "a4") patch.paper = paper;
    updateSettings(patch);
  }
  if (data.location && typeof data.location.lat === "number" && typeof data.location.lon === "number") {
    saveLocation(data.location);
  }
  return { ok: true, summary };
}

/* True when the buyer has saved work and no backup in the last 30 days. */
export function backupReminderDue(now = Date.now()) {
  const s = getSettings();
  const hasWork = Object.keys(getDocs()).length > 0;
  if (!hasWork) return false;
  if (s.backupSnoozeUntil && now < Date.parse(s.backupSnoozeUntil)) return false;
  const day = 86400000;
  const since = s.lastBackup ? Date.parse(s.lastBackup) : s.firstUse ? Date.parse(s.firstUse) : now;
  return now - since >= BACKUP_REMINDER_DAYS * day;
}

export function snoozeBackupReminder(days = 7) {
  return updateSettings({ backupSnoozeUntil: new Date(Date.now() + days * 86400000).toISOString() });
}

export { LICENSE_KEY };
