/* Novaris Field Kit — Planning tab: worksheets, timelines, questionnaires, sun planner, composition, pocket card. */
import { h, btn, icon, savePdf, slugify, viewFooter, toast, formatDate } from "../ui.js";
import { getDoc, getSettings, getLocation, saveLocation, docsFor } from "../store.js";
import { templateBlock, createDoc, EDITORS } from "./docs.js";
import { notFound } from "./shotlists.js";
import { sunTimes, formatTime, formatOffset, compassPoint } from "../../js/sun.js";
import { compositionSvg, svgToJpeg } from "../diagrams.js";
import { exportSun, exportPocketCard, exportGallery } from "../export.js";

const DOC_KINDS = new Set(["worksheet", "table", "groups", "checklist", "questionnaire"]);

export function render(ctx) {
  const route = `/guide/${ctx.slug}/planning`;
  const items = ctx.guide.planning || [];

  if (ctx.item) {
    const tool = items.find((t) => t.id === ctx.item && !DOC_KINDS.has(t.kind));
    if (tool) return toolView(ctx, tool, route);
    if (ctx.preview) {
      const t = items.find((x) => x.id === ctx.item);
      if (t && DOC_KINDS.has(t.kind)) return EDITORS[t.kind](ctx, createDoc(t.kind, t, ctx.slug, t.title), t, route);
    }
    const doc = getDoc(ctx.item);
    const template = doc && items.find((t) => t.id === doc.templateId);
    if (!doc || !template) return notFound(route);
    return EDITORS[template.kind](ctx, doc, template, route);
  }

  const root = h("div", { class: "fk-view" },
    h("h2", { class: "fk-view-title" }, "Planning"),
    h("p", { class: "fk-lede" }, "Fill in worksheets before the shoot and use them on the day. Everything you enter is saved on this device. Export any of them as a PDF or print them."));
  for (const t of items) {
    if (DOC_KINDS.has(t.kind)) root.append(templateBlock(ctx, t.kind, t, route));
    else {
      root.append(h("section", { class: "fk-card fk-template" },
        h("h3", {}, t.title),
        h("p", { class: "fk-muted" }, t.description),
        h("div", { class: "fk-row" }, h("a", { class: "btn btn-primary", href: `#${route}/${t.id}`, html: icon(t.kind === "sun" ? "sun" : t.kind === "pocket" ? "pdf" : "planning") + "<span>Open</span>" }))));
    }
  }
  root.append(viewFooter(ctx.guideName, "Planning"));
  return root;
}

function toolView(ctx, tool, route) {
  const back = ctx.preview ? null : h("a", { class: "fk-back", href: `#${route}`, html: icon("back") + "<span>Planning</span>" });
  let body;
  if (tool.kind === "sun") body = sunPlanner(ctx, tool);
  else if (tool.kind === "composition") body = composition(ctx, tool);
  else if (tool.kind === "pocket") body = pocket(ctx, tool);
  return h("div", { class: "fk-view fk-detail" }, back, h("h2", { class: "fk-view-title" }, tool.title), h("p", { class: "fk-lede" }, tool.description), body, viewFooter(ctx.guideName, tool.title));
}

/* ---------- Sun planner ---------- */

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function deviceOffset(dateIso) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return -new Date(y, m - 1, d, 12).getTimezoneOffset();
}

/* UTC offset (minutes) of a named time zone at midday on a date, daylight saving included. */
export function zoneOffset(zone, dateIso) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const noon = Date.UTC(y, m - 1, d, 12);
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(new Date(noon)).find((p) => p.type === "timeZoneName");
    const match = /GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?/.exec(part ? part.value : "");
    if (!match) return null;
    if (!match[1]) return 0;
    return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] || 0));
  } catch {
    return null;
  }
}

const DEVICE_ZONE = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { return ""; } })();
const ZONES = (() => { try { return Intl.supportedValuesOf("timeZone"); } catch { return []; } })();

export function sunRows(r, off) {
  const range = (a, b) => (a === null && b === null ? "Not today" : `${formatTime(a, off)} – ${formatTime(b, off)}`);
  const dir = (az) => (az === null ? "" : ` · ${compassPoint(az)} ${Math.round(az)}°`);
  return [
    ["Blue hour (morning)", range(r.morningBlue.start, r.morningBlue.end)],
    ["Golden hour (morning)", range(r.morningGolden.start, r.morningGolden.end)],
    ["Sunrise", r.sunrise === null ? "No sunrise" : formatTime(r.sunrise, off) + dir(r.sunriseAzimuth)],
    ["Solar noon", `${formatTime(r.solarNoon, off)} · sun ${Math.round(r.noonAltitude)}° high`],
    ["Sunset", r.sunset === null ? "No sunset" : formatTime(r.sunset, off) + dir(r.sunsetAzimuth)],
    ["Golden hour (evening)", range(r.eveningGolden.start, r.eveningGolden.end)],
    ["Blue hour (evening)", range(r.eveningBlue.start, r.eveningBlue.end)]
  ];
}

function compass(r) {
  const line = (az, cls, label) => {
    if (az === null) return "";
    const rad = (az - 90) * Math.PI / 180;
    const x = 100 + Math.cos(rad) * 72, y = 100 + Math.sin(rad) * 72;
    const lx = 100 + Math.cos(rad) * 88, ly = 100 + Math.sin(rad) * 88;
    return `<line x1="100" y1="100" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="${cls}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" class="${cls}-dot"/><text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" class="fk-compass-label">${label}</text>`;
  };
  let ticks = "";
  for (let a = 0; a < 360; a += 30) {
    const rad = (a - 90) * Math.PI / 180;
    ticks += `<line x1="${(100 + Math.cos(rad) * 62).toFixed(1)}" y1="${(100 + Math.sin(rad) * 62).toFixed(1)}" x2="${(100 + Math.cos(rad) * 68).toFixed(1)}" y2="${(100 + Math.sin(rad) * 68).toFixed(1)}" class="fk-compass-tick"/>`;
  }
  return `<svg viewBox="-10 -10 220 220" class="fk-compass" role="img" aria-label="Compass showing the sunrise and sunset directions"><circle cx="100" cy="100" r="68" class="fk-compass-ring"/>${ticks}` +
    ["N", "E", "S", "W"].map((p, i) => { const rad = (i * 90 - 90) * Math.PI / 180; return `<text x="${(100 + Math.cos(rad) * 50).toFixed(1)}" y="${(100 + Math.sin(rad) * 50 + 5).toFixed(1)}" text-anchor="middle" class="fk-compass-cardinal">${p}</text>`; }).join("") +
    line(r.sunriseAzimuth, "fk-sunrise", "Rise") + line(r.sunsetAzimuth, "fk-sunset", "Set") + `<circle cx="100" cy="100" r="4" class="fk-compass-center"/></svg>`;
}

function sunPlanner(ctx, tool) {
  const saved = getLocation();
  const state = {
    date: todayIso(),
    lat: saved ? saved.lat : "",
    lon: saved ? saved.lon : "",
    label: saved ? saved.label || "" : "",
    zone: saved && saved.zone ? saved.zone : "device"
  };
  const out = h("div", { class: "fk-sun-results", "aria-live": "polite" });
  const dateIn = h("input", { id: "sun-date", type: "date", class: "fk-input", value: state.date });
  const latIn = h("input", { id: "sun-lat", type: "number", step: "any", min: "-90", max: "90", inputmode: "decimal", class: "fk-input", placeholder: "e.g. 51.5074", value: state.lat });
  const lonIn = h("input", { id: "sun-lon", type: "number", step: "any", min: "-180", max: "180", inputmode: "decimal", class: "fk-input", placeholder: "e.g. -0.1278", value: state.lon });
  const labelIn = h("input", { id: "sun-label", type: "text", class: "fk-input", placeholder: "Place name (optional)", value: state.label });
  const tzSel = h("select", { id: "sun-tz", class: "fk-input" });

  const tzHint = h("p", { class: "fk-calc-warn fk-small", role: "status" });
  const offsetFor = (dateIso) => {
    if (state.zone === "device") return deviceOffset(dateIso);
    if (state.zone.startsWith("UTC")) return Number(state.zone.slice(3));
    const z = zoneOffset(state.zone, dateIso);
    return z === null ? deviceOffset(dateIso) : z;
  };
  const fillTz = () => {
    const dateIso = dateIn.value || todayIso();
    tzSel.textContent = "";
    tzSel.append(h("option", { value: "device" }, `This device (${DEVICE_ZONE ? DEVICE_ZONE.replace(/_/g, " ") + ", " : ""}${formatOffset(deviceOffset(dateIso))})`));
    if (ZONES.length) {
      for (const z of ZONES) {
        const off = zoneOffset(z, dateIso);
        tzSel.append(h("option", { value: z }, `${z.replace(/_/g, " ")} (${off === null ? "?" : formatOffset(off)})`));
      }
    } else {
      for (let m = -12 * 60; m <= 14 * 60; m += 30) tzSel.append(h("option", { value: "UTC" + m }, formatOffset(m)));
    }
    tzSel.value = state.zone;
    if (tzSel.value !== state.zone) { state.zone = "device"; tzSel.value = "device"; }
  };

  const compute = () => {
    out.textContent = "";
    const lat = parseFloat(latIn.value), lon = parseFloat(lonIn.value);
    if (!dateIn.value || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      out.append(h("p", { class: "fk-muted" }, "Enter a date and a location (latitude and longitude), or use your current location."));
      return null;
    }
    const off = offsetFor(dateIn.value);
    const r = sunTimes(dateIn.value, lat, lon, off);
    tzHint.textContent = Math.abs((lon / 15) * 60 - off) > 150
      ? "This location may be in a different time zone from the one selected. Choose the location's time zone to see its local clock times."
      : "";
    const rows = sunRows(r, off);
    if (r.polar === "sun-up-all-day") out.append(h("p", { class: "fk-calc-warn" }, "The sun stays above the horizon all day on this date (midnight sun)."));
    if (r.polar === "sun-down-all-day") out.append(h("p", { class: "fk-calc-warn" }, "The sun stays below the horizon all day on this date (polar night)."));
    out.append(
      h("p", { class: "fk-muted" }, `${state.label || `${lat.toFixed(4)}, ${lon.toFixed(4)}`} · ${new Date(dateIn.value + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })} · times in ${formatOffset(off)}`),
      h("div", { class: "fk-sun-layout" },
        h("dl", { class: "fk-sun-list" }, rows.map(([k, v]) => [h("dt", {}, k), h("dd", {}, v)])),
        h("div", { html: compass(r) })));
    return { r, rows, off, lat, lon };
  };

  const persistLocation = () => {
    const lat = parseFloat(latIn.value), lon = parseFloat(lonIn.value);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) { toast("Enter a valid latitude and longitude first.", { kind: "error" }); return; }
    saveLocation({ lat, lon, label: labelIn.value.trim(), zone: state.zone });
    toast("Location saved on this device only.", { kind: "success" });
  };

  const useMine = btn("Use my current location", "location", () => {
    if (!navigator.geolocation) { toast("This browser can't share your location. Enter coordinates instead.", { kind: "error" }); return; }
    useMine.disabled = true;
    navigator.geolocation.getCurrentPosition((pos) => {
      useMine.disabled = false;
      latIn.value = pos.coords.latitude.toFixed(4);
      lonIn.value = pos.coords.longitude.toFixed(4);
      if (!labelIn.value) labelIn.value = "My location";
      state.zone = "device";
      if (!ctx.preview) saveLocation({ lat: Number(latIn.value), lon: Number(lonIn.value), label: labelIn.value, zone: "device" });
      fillTz(); compute();
      toast(ctx.preview ? "Location found." : "Location found and saved on this device only.", { kind: "success" });
    }, (err) => {
      useMine.disabled = false;
      toast(err.code === 1 ? "Location permission was declined. Enter coordinates instead." : "Couldn't get your location. Enter coordinates instead.", { kind: "error" });
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
  }, "btn");

  [dateIn, latIn, lonIn].forEach((el) => el.addEventListener("input", () => { if (el === dateIn) fillTz(); compute(); }));
  labelIn.addEventListener("input", compute);
  tzSel.addEventListener("change", () => { state.zone = tzSel.value; compute(); });

  const actions = h("div", { class: "fk-doc-actions" });
  if (!ctx.preview) {
    actions.append(
      btn("Save location", "location", persistLocation, "btn btn-small"),
      btn("Export PDF", "pdf", () => {
        const res = compute();
        if (!res) return;
        const placeLabel = labelIn.value.trim() || `${res.lat.toFixed(4)}, ${res.lon.toFixed(4)}`;
        savePdf(exportSun({ placeLabel, dateLabel: dateIn.value, offsetLabel: formatOffset(res.off), rows: res.rows, paper: getSettings().paper, guideName: ctx.guideName, note: "Calculated for reference. Terrain, buildings, and weather change when light reaches you." }), `sun-${slugify(placeLabel)}-${dateIn.value}.pdf`);
      }, "btn btn-small"),
      btn("Print", "print", () => window.print(), "btn btn-small"));
  }

  fillTz();
  const form = h("div", { class: "fk-card" },
    h("div", { class: "fk-calc-grid" },
      h("div", { class: "fk-field" }, h("label", { for: "sun-date" }, "Date"), dateIn),
      h("div", { class: "fk-field fk-span-2" }, h("label", { for: "sun-tz" }, "Time zone at the location"), tzSel, tzHint),
      h("div", { class: "fk-field" }, h("label", { for: "sun-lat" }, "Latitude (north +)"), latIn),
      h("div", { class: "fk-field" }, h("label", { for: "sun-lon" }, "Longitude (east +)"), lonIn),
      h("div", { class: "fk-field fk-span-2" }, h("label", { for: "sun-label" }, "Place name"), labelIn)),
    h("div", { class: "fk-row fk-row-wrap" }, useMine),
    h("p", { class: "fk-hint" }, "Your location is used only to calculate times on this device. If you save it, it is stored only in this browser and never sent anywhere."));
  const wrap = h("div", {}, actions, form, out,
    h("p", { class: "fk-muted fk-small" }, "Golden hour here means the sun between 4° below and 6° above the horizon; blue hour, between 6° and 4° below. Times are calculated for reference; terrain, buildings, and weather change when light actually reaches you."));
  compute();
  return wrap;
}

/* ---------- Composition reference ---------- */

function composition(ctx, tool) {
  const actions = h("div", { class: "fk-doc-actions" });
  if (!ctx.preview) {
    actions.append(
      btn("Export PDF", "pdf", async () => {
        try {
          const items = [];
          for (const it of tool.items) items.push({ title: it.title, text: it.text, image: await svgToJpeg(compositionSvg(it.id, { palette: "print" }), 900) });
          savePdf(exportGallery({ title: tool.title, guideName: ctx.guideName, paper: getSettings().paper, items }), "composition-reference.pdf");
        } catch (err) { toast(err.message, { kind: "error" }); }
      }, "btn btn-small"),
      btn("Print", "print", () => window.print(), "btn btn-small"));
  }
  return h("div", {}, actions, h("ul", { class: "fk-grid" }, tool.items.map((it) => h("li", { class: "fk-card fk-comp" },
    h("div", { class: "fk-tile-art", html: compositionSvg(it.id) }),
    h("h3", {}, it.title),
    h("p", {}, it.text)))));
}

/* ---------- Pocket card ---------- */

function pocket(ctx, tool) {
  const loc = getLocation();
  const gearDoc = docsFor(ctx.slug, "checklist")[0];
  const gearTemplate = (ctx.guide.planning || []).find((p) => p.kind === "checklist");
  const gear = gearDoc
    ? gearDoc.data.sections.flatMap((s) => s.items.map((i) => i.text))
    : gearTemplate ? gearTemplate.sections.flatMap((s) => s.items.map((i) => (typeof i === "string" ? i : i.text))) : [];
  const dateIn = h("input", { id: "pocket-date", type: "date", class: "fk-input", value: todayIso() });
  const rows = ctx.guide.settings.tables[0].rows;
  return h("div", {},
    h("div", { class: "fk-card" },
      h("h3", {}, "What goes on the card"),
      h("ul", {},
        h("li", {}, `Field settings: ${rows.length} starting points`),
        h("li", {}, loc ? `Sun times for ${loc.label || "your saved location"} on the date below` : "Sun times: save a location in the sunrise and sunset planner to include them"),
        h("li", {}, gearDoc ? `Gear checklist: your saved list “${gearDoc.title}” (${gear.length} items)` : `Gear checklist: the standard list (${gear.length} items)`)),
      loc ? h("div", { class: "fk-field" }, h("label", { for: "pocket-date" }, "Date for sun times"), dateIn) : null,
      ctx.preview ? null : h("div", { class: "fk-row" }, btn("Export pocket card PDF", "pdf", () => {
        let sun = null;
        if (loc) {
          const z = loc.zone && loc.zone !== "device" ? zoneOffset(loc.zone, dateIn.value) : null;
          const off = z === null ? deviceOffset(dateIn.value) : z;
          const r = sunTimes(dateIn.value, loc.lat, loc.lon, off);
          sun = { placeLabel: loc.label || `${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`, dateLabel: dateIn.value, offsetLabel: formatOffset(off), rows: sunRows(r, off).map(([k, v]) => [k, v.replace(/ · .*/, "")]) };
        }
        savePdf(exportPocketCard({ settingsRows: rows, sun, gear, guideName: ctx.guideName }), "pocket-card.pdf");
      }, "btn btn-primary"))),
    h("p", { class: "fk-muted fk-small" }, `Pages are 4 × 6 in. Print at actual size and trim, or fold a full sheet. Last saved location: ${loc ? formatDate(loc.savedAt) : "none"}.`));
}
