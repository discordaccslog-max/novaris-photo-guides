/* Building blocks for catalog guide content. Each helper returns one block (usually one page). */

export const shotlist = (title, description, sections, opts = {}) => ({ type: "shotlist", kicker: opts.kicker || "Shot list", title, description, sections, fields: opts.fields, blank: opts.blank ?? 3 });
export const checklist = (title, description, sections, opts = {}) => ({ type: "shotlist", kicker: opts.kicker || "Checklist", title, description, sections, fields: opts.fields, blank: opts.blank ?? 2 });
/* Fields: "Label" is one line; "+Label" gets several lines. */
export const worksheet = (title, description, fields, opts = {}) => ({ type: "worksheet", kicker: opts.kicker || "Worksheet", title, description, fields, columns: opts.columns ?? 2 });
export const table = (title, description, columns, rows, opts = {}) => ({ type: "table", kicker: opts.kicker || "Planner", title, description, columns, rows, blank: opts.blank ?? 0, widths: opts.widths, small: opts.small });
export const cards = (title, description, items, opts = {}) => ({ type: "cards", kicker: opts.kicker || "Reference", title, description, items, cols: opts.cols ?? 2 });
export const templates = (title, description, items) => ({ type: "templates", kicker: "Templates", title, description, items });
export const settings = (title, description, rows, rules = []) => ({ type: "settings", kicker: "Settings reference", title, description, rows, rules });
export const setup = (title, summary, elements, beams = [], tips = []) => ({ type: "setup", kicker: "Lighting setup", title, summary, elements, beams, tips });
export const questionnaire = (title, intro, questions) => ({ type: "questionnaire", kicker: "Client questionnaire", title, intro, questions });
export const text = (title, description, paras = [], bullets = [], opts = {}) => ({ type: "text", kicker: opts.kicker || "Reference", title, description, paras, bullets });
export const storyboard = (title, description, frames = 6, pages = 2) => ({ type: "storyboard", kicker: "Storyboard", title, description, frames, pages });
export const notes = (title = "Notes") => ({ type: "notes", kicker: "Notes", title });
export const calendar = (title, description) => ({ type: "calendar", kicker: "Calendar", title, description });
export const poses = (title, description, items) => ({ type: "poses", kicker: "Posing reference", title, description, items });

/* Settings row shorthand: [situation, aperture, shutter, iso, notes] */
export const rows = (list) => list.map(([situation, aperture, shutter, iso, notes]) => ({ situation, aperture, shutter, iso, notes }));

/* Common diagram elements (overhead view, 360 x 300 canvas; camera at the bottom). */
export const el = (id, type, x, y, label, role, notes, rot = 0) => ({ id, type, x, y, rot, label, role, notes });
export const beam = (from, to, kind) => (kind ? { from, to, kind } : { from, to });

/* ---------- Computed reference tables ---------- */

const COC = 0.03; // circle of confusion for full frame, mm
const fmtM = (m) => (m === Infinity ? "∞" : m >= 10 ? `${Math.round(m)} m` : `${m.toFixed(1)} m`);

/* Hyperfocal distance and the sharp zone when focused at given distances (full frame). */
export function zoneFocusTable(focals, apertures, focusDistances) {
  const out = [];
  for (const f of focals) {
    for (const N of apertures) {
      const H = (f * f) / (N * COC) / 1000 + f / 1000; // metres
      const zones = focusDistances.map((s) => {
        const near = (H * s) / (H + s);
        const far = s >= H ? Infinity : (H * s) / (H - s);
        return `${fmtM(near)} – ${fmtM(far)}`;
      });
      out.push([`${f} mm`, `f/${N}`, fmtM(H), ...zones]);
    }
  }
  return out;
}

/* Total depth of field (mm) at close range for a magnification and f-number (full frame). */
export function macroDofTable(magnifications, apertures) {
  return magnifications.map((m) => [
    m >= 1 ? `${m}:1` : `1:${Math.round(1 / m)}`,
    ...apertures.map((N) => {
      const dof = (2 * N * COC * (m + 1)) / (m * m);
      return dof >= 10 ? `${dof.toFixed(0)} mm` : `${dof.toFixed(1)} mm`;
    })
  ]);
}

/* Longest exposure before stars trail noticeably, by the 500 rule. */
export function fiveHundredRule(focals) {
  return focals.map((f) => [`${f} mm`, `${Math.floor(500 / f)} s`, `${Math.floor(500 / (f * 1.5))} s`, `${Math.floor(500 / (f * 1.6))} s`]);
}

/* Non-lighting overhead diagrams (positions, flight patterns) use the same renderer with their own label. */
export const diagram = (title, summary, elements, beams = [], tips = [], kicker = "Diagram") => ({ ...setup(title, summary, elements, beams, tips), kicker });
