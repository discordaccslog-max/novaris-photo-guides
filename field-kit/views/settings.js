/* Novaris Field Kit — Settings tab: reference tables and the exposure calculator. */
import { h, btn, savePdf, slugify, viewFooter } from "../ui.js";
import { getSettings } from "../store.js";
import { APERTURES, SHUTTERS, ISOS, solve, formatAperture, formatShutter, formatIso } from "../../js/exposure.js";
import { exportSettings } from "../export.js";

const CALC_KEY = "nfk.calc";

function loadCalc() {
  try { return { ...defaults(), ...JSON.parse(sessionStorage.getItem(CALC_KEY) || "{}") }; } catch { return defaults(); }
}
function defaults() {
  return { baseA: 8, baseS: 1 / 125, baseI: 100, newA: 5.6, newS: 1 / 250, newI: 100, nd: 0, solveFor: "shutter" };
}
function saveCalc(state) {
  try { sessionStorage.setItem(CALC_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

export function render(ctx) {
  const settings = ctx.guide.settings;
  const root = h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Settings reference"),
    h("p", { class: "fk-lede" }, "Starting points for common situations, and a calculator for equivalent exposures. Gear, light, and subjects vary, so adjust from here."));

  const actions = h("div", { class: "fk-doc-actions" });
  if (!ctx.preview) {
    actions.append(
      btn("Export PDF", "pdf", () => savePdf(exportSettings(settings, { paper: getSettings().paper, guideName: ctx.guideName }), `${slugify(ctx.guideName)}-settings.pdf`), "btn btn-small"),
      btn("Print", "print", () => window.print(), "btn btn-small"));
  }
  root.append(actions);

  for (const table of settings.tables) {
    const t = h("table", { class: "fk-table" },
      h("caption", {}, table.title),
      h("thead", {}, h("tr", {}, ["Situation", "Aperture", "Shutter", "ISO", "Notes"].map((c) => h("th", { scope: "col" }, c)))),
      h("tbody", {}, table.rows.map((r) => h("tr", {},
        h("th", { scope: "row" }, r.situation),
        h("td", { "data-label": "Aperture" }, r.aperture),
        h("td", { "data-label": "Shutter" }, r.shutter),
        h("td", { "data-label": "ISO" }, r.iso),
        h("td", { "data-label": "Notes" }, r.notes)))));
    root.append(h("div", { class: "fk-table-wrap" }, t));
  }
  if (settings.rules) root.append(h("section", { class: "fk-card" }, h("h3", {}, "Rules of thumb"), h("ul", {}, settings.rules.map((r) => h("li", {}, r)))));

  root.append(calculator(settings.nd));
  root.append(viewFooter(ctx.guideName, "Settings"));
  return root;
}

function select(id, label, list, value, fmt, onChange) {
  const s = h("select", { id, class: "fk-input" });
  list.forEach((v, i) => {
    const o = h("option", { value: String(i) }, fmt(v));
    if (Math.abs(v - value) < 1e-9) o.selected = true;
    s.append(o);
  });
  s.addEventListener("change", () => onChange(list[Number(s.value)]));
  return h("div", { class: "fk-field" }, h("label", { for: id }, label), s);
}

export function calculator(withNd) {
  const state = loadCalc();
  if (!withNd) state.nd = 0;
  const wrap = h("section", { class: "fk-card fk-calc", "aria-labelledby": "calc-title" });
  const result = h("div", { class: "fk-calc-result", "aria-live": "polite" });
  const newFields = h("div", { class: "fk-calc-grid" });

  const update = () => {
    saveCalc(state);
    const base = { aperture: state.baseA, shutter: state.baseS, iso: state.baseI };
    const next = { aperture: state.newA, shutter: state.newS, iso: state.newI, nd: state.nd };
    const r = solve(base, next, state.solveFor);
    const label = { shutter: "Shutter speed", aperture: "Aperture", iso: "ISO" }[state.solveFor];
    result.textContent = "";
    const offset = Math.abs(r.offsetStops) < 0.04 ? "" : ` (${r.offsetStops > 0 ? "+" : "−"}${Math.abs(r.offsetStops).toFixed(1)} stop from exact)`;
    result.append(
      h("p", { class: "fk-calc-label" }, `Equivalent ${label.toLowerCase()}`),
      h("p", { class: "fk-calc-value" }, r.inStandardRange ? r.nearestLabel : r.exactLabel));
    if (r.inStandardRange) {
      result.append(h("p", { class: "fk-muted" }, `Exact: ${r.exactLabel}. Nearest standard setting: ${r.nearestLabel}${offset}.`));
    } else {
      const beyond = state.solveFor === "shutter" && r.exact > 30
        ? "Longer than 30 seconds: use bulb mode with a remote release or timer."
        : "Outside the usual range of settings. Change another setting to bring it back in range.";
      result.append(h("p", { class: "fk-calc-warn" }, beyond));
    }
    result.append(h("p", { class: "fk-muted" }, `Metered exposure: EV ${r.ev100.toFixed(1)} at ISO 100.`));
  };

  const drawNewFields = () => {
    newFields.textContent = "";
    if (state.solveFor !== "aperture") newFields.append(select("calc-na", "New aperture", APERTURES, state.newA, formatAperture, (v) => { state.newA = v; update(); }));
    if (state.solveFor !== "shutter") newFields.append(select("calc-ns", "New shutter", SHUTTERS, state.newS, formatShutter, (v) => { state.newS = v; update(); }));
    if (state.solveFor !== "iso") newFields.append(select("calc-ni", "New ISO", ISOS, state.newI, formatIso, (v) => { state.newI = v; update(); }));
    if (withNd) {
      const nd = h("select", { id: "calc-nd", class: "fk-input" });
      for (const n of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 15]) {
        const o = h("option", { value: String(n) }, n === 0 ? "None" : `${n} stops (ND${2 ** n})`);
        if (n === state.nd) o.selected = true;
        nd.append(o);
      }
      nd.addEventListener("change", () => { state.nd = Number(nd.value); update(); });
      newFields.append(h("div", { class: "fk-field" }, h("label", { for: "calc-nd" }, "ND filter"), nd));
    }
  };

  const solveGroup = h("div", { class: "fk-segmented", role: "radiogroup", "aria-label": "Solve for" });
  for (const [key, label] of [["shutter", "Shutter"], ["aperture", "Aperture"], ["iso", "ISO"]]) {
    const rid = `solve-${key}`;
    const r = h("input", { type: "radio", name: "solve", id: rid, value: key });
    r.checked = state.solveFor === key;
    r.addEventListener("change", () => { state.solveFor = key; drawNewFields(); update(); });
    solveGroup.append(r, h("label", { for: rid }, label));
  }

  wrap.append(
    h("h3", { id: "calc-title" }, "Exposure calculator"),
    h("p", { class: "fk-muted" }, "Enter a correct (metered) exposure, then change settings to find an equivalent one."),
    h("h4", {}, "Metered exposure"),
    h("div", { class: "fk-calc-grid" },
      select("calc-ba", "Aperture", APERTURES, state.baseA, formatAperture, (v) => { state.baseA = v; update(); }),
      select("calc-bs", "Shutter", SHUTTERS, state.baseS, formatShutter, (v) => { state.baseS = v; update(); }),
      select("calc-bi", "ISO", ISOS, state.baseI, formatIso, (v) => { state.baseI = v; update(); })),
    h("h4", {}, "Solve for"),
    solveGroup,
    h("h4", {}, "New settings"),
    newFields,
    result);
  drawNewFields();
  update();
  return wrap;
}
