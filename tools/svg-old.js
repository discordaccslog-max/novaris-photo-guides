// SVG builders for icons, hero motif, and preview pages.
const INK = "#1f1d1a", MUTED = "#6b645a", LINE = "#d9cfbe", AMBER = "#c77d16", SOFT = "#efe7d8";
const FONT = 'font-family="Inter, system-ui, sans-serif"';

let pageCount = 0;
const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;");

const logo = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.6"/><g fill="none" stroke="#e09a2c" stroke-width="1.6" stroke-linecap="round"><path d="M16 6.5 L24.2 11.2"/><path d="M24.2 11.2 L24.2 20.8"/><path d="M24.2 20.8 L16 25.5"/><path d="M16 25.5 L7.8 20.8"/><path d="M7.8 20.8 L7.8 11.2"/><path d="M7.8 11.2 L16 6.5"/></g><circle cx="16" cy="16" r="4" fill="#e09a2c"/></svg>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1f1d1a"/><circle cx="16" cy="16" r="11" fill="none" stroke="#f4efe6" stroke-width="1.6"/><path d="M16 8.6 L22.4 12.3 L22.4 19.7 L16 23.4 L9.6 19.7 L9.6 12.3 Z" fill="none" stroke="#e09a2c" stroke-width="1.8" stroke-linejoin="round"/><circle cx="16" cy="16" r="3.4" fill="#e09a2c"/></svg>\n`;

const icons = {
  portrait: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="36" height="38" rx="3"/><circle cx="24" cy="20" r="7"/><path d="M12 39c2-7 7-10 12-10s10 3 12 10"/></svg>`,
  wedding: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="18" cy="27" r="11"/><circle cx="30" cy="27" r="11"/><path d="M20 9l4-4 4 4-4 4z"/></svg>`,
  product: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 40h40"/><path d="M4 40c0-14 4-22 4-34"/><rect x="20" y="20" width="10" height="20" rx="2"/><path d="M23 20v-5h4v5"/><path d="M36 8l-6 8M40 14l-7 5M31 5l-3 9"/></svg>`,
  landscape: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="33" cy="14" r="5"/><path d="M3 40l13-18 9 12 6-7 14 13z"/><path d="M3 44h42"/></svg>`,
  event: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l8 6"/><rect x="4" y="2" width="8" height="7" rx="1.5" transform="rotate(36 8 6)"/><path d="M16 12l-6 30h28L30 26z" stroke-dasharray="2 3"/><path d="M6 44h36"/><circle cx="27" cy="34" r="3"/><path d="M22 44c0-4 2-6 5-6s5 2 5 6"/></svg>`,
  library: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="14" y="4" width="26" height="34" rx="2"/><path d="M10 9v32a2 2 0 0 0 2 2h24"/><path d="M6 14v31a2 2 0 0 0 2 2h22" opacity=".6"/><path d="M20 13h14M20 19h14M20 25h9"/></svg>`
};

function aperture() {
  const d = 40, s = d * Math.tan(Math.PI / 6);
  let blades = "";
  for (let i = 0; i < 6; i++) {
    const fill = i % 2 ? "#2d2a26" : "#35312c";
    blades += `<g transform="rotate(${i * 60})"><rect class="ap-blade" x="${(-s).toFixed(2)}" y="-240" width="260" height="${240 - d}" fill="${fill}" stroke="#e09a2c" stroke-opacity=".45" stroke-width="1"/></g>`;
  }
  let ticks = "";
  for (let i = 0; i < 48; i++) {
    const long = i % 4 === 0;
    ticks += `<line x1="0" y1="-104" x2="0" y2="${long ? -114 : -109}" transform="rotate(${i * 7.5})" stroke="currentColor" stroke-width="${long ? 1.4 : 0.8}" stroke-opacity="${long ? 0.7 : 0.4}"/>`;
  }
  return `<svg class="aperture" viewBox="-124 -124 248 248" role="img" aria-labelledby="ap-title">
  <title id="ap-title">Illustration of a lens aperture slowly opening and closing, with warm light behind it</title>
  <defs>
    <radialGradient id="ap-light"><stop offset="0" stop-color="#ffd38a"/><stop offset=".45" stop-color="#e09a2c" stop-opacity=".85"/><stop offset="1" stop-color="#e09a2c" stop-opacity="0"/></radialGradient>
    <radialGradient id="ap-halo"><stop offset=".7" stop-color="#e09a2c" stop-opacity=".5"/><stop offset="1" stop-color="#e09a2c" stop-opacity="0"/></radialGradient>
    <clipPath id="ap-clip"><circle r="97"/></clipPath>
  </defs>
  <circle class="ap-falloff" r="124" fill="url(#ap-halo)"/>
  <g class="ap-ring" style="color:var(--ink)">${ticks}</g>
  <circle r="100" fill="#1f1d1a" stroke="currentColor" stroke-opacity=".25" style="color:var(--ink)"/>
  <circle class="ap-glow" r="70" fill="url(#ap-light)"/>
  <g clip-path="url(#ap-clip)">${blades}</g>
  <circle r="97" fill="none" stroke="#4a443d" stroke-width="2"/>
</svg>`;
}

// ---------- Preview page builders (viewBox 300 x 388, US Letter proportions) ----------

function page(label, inner, title, desc) {
  const id = "pv-" + (++pageCount);
  return `<svg viewBox="0 0 300 388" role="img" aria-labelledby="${id}-t ${id}-d" ${FONT}>
<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>
<rect width="300" height="388" fill="#fbf8f2"/>
<rect x="20" y="20" width="4" height="26" fill="${AMBER}"/>
<text x="32" y="30" font-size="7" letter-spacing="1.4" fill="${MUTED}">${esc(label.toUpperCase())}</text>
<text x="32" y="44" font-size="12.5" font-weight="600" fill="${INK}" font-family="Fraunces, Georgia, serif">${esc(title)}</text>
${inner}
<line x1="20" y1="366" x2="280" y2="366" stroke="${LINE}"/>
<text x="20" y="377" font-size="6.5" fill="${MUTED}">Novaris Photo Guides</text>
</svg>`;
}

function lines(x, y, w, n, gap = 9) {
  let o = "";
  for (let i = 0; i < n; i++) o += `<line x1="${x}" y1="${y + i * gap}" x2="${x + w}" y2="${y + i * gap}" stroke="${LINE}" stroke-width="1"/>`;
  return o;
}

// Top-down lighting diagram
function lighting({ label, title, desc, items, notes }) {
  let g = `<rect x="20" y="58" width="260" height="190" rx="4" fill="${SOFT}"/>`;
  // floor grid
  for (let x = 40; x < 280; x += 20) g += `<line x1="${x}" y1="58" x2="${x}" y2="248" stroke="#e3d9c6" stroke-width=".6"/>`;
  for (let y = 78; y < 248; y += 20) g += `<line x1="20" y1="${y}" x2="280" y2="${y}" stroke="#e3d9c6" stroke-width=".6"/>`;
  for (const it of items) {
    const { type, x, y, rot = 0, text, tx = x, ty = y + 26 } = it;
    if (type === "subject") g += `<circle cx="${x}" cy="${y}" r="11" fill="${INK}"/><circle cx="${x}" cy="${y - 4}" r="4" fill="#fbf8f2"/>`;
    if (type === "product") g += `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="2" fill="${INK}"/>`;
    if (type === "camera") g += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-11" y="-7" width="22" height="14" rx="2" fill="${INK}"/><rect x="-5" y="-13" width="10" height="7" fill="${INK}"/></g>`;
    if (type === "softbox") g += `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-16 -4 L16 -4 L9 8 L-9 8 Z" fill="${AMBER}"/><rect x="-16" y="-6" width="32" height="3" fill="${INK}"/></g>`;
    if (type === "flash") g += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-6" y="-5" width="12" height="10" rx="1.5" fill="${AMBER}"/><path d="M-6 5 L-10 11 M6 5 L10 11" stroke="${INK}" stroke-width="1.2"/></g>`;
    if (type === "reflector") g += `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-15 0 Q0 -8 15 0" fill="none" stroke="${MUTED}" stroke-width="3" stroke-linecap="round"/></g>`;
    if (type === "window") g += `<rect x="${x - 2}" y="${y - 34}" width="4" height="68" fill="${AMBER}" opacity=".9"/><path d="M${x + 4} ${y - 30} L${x + 40} ${y - 10} M${x + 4} ${y} L${x + 44} ${y} M${x + 4} ${y + 30} L${x + 40} ${y + 10}" stroke="${AMBER}" stroke-width=".8" stroke-dasharray="3 3"/>`;
    if (type === "backdrop") g += `<path d="M${x - 60} ${y} Q${x} ${y - 14} ${x + 60} ${y}" fill="none" stroke="${MUTED}" stroke-width="5" stroke-linecap="round"/>`;
    if (type === "wall") g += `<rect x="${x - 3}" y="${y - 87}" width="6" height="174" fill="${MUTED}" opacity=".35"/>`;
    if (type === "beam") g += `<line x1="${x}" y1="${y}" x2="${it.x2}" y2="${it.y2}" stroke="${AMBER}" stroke-width="1" stroke-dasharray="4 3"/>`;
    if (type === "angle") g += `<path d="${it.d}" fill="none" stroke="${MUTED}" stroke-width=".8"/>`;
    if (text) g += `<text x="${tx}" y="${ty}" font-size="7.5" text-anchor="middle" fill="${INK}" font-weight="600">${esc(text)}</text>`;
  }
  let y = 268;
  g += `<text x="20" y="${y}" font-size="7" letter-spacing="1.2" fill="${MUTED}">NOTES</text>`;
  notes.forEach((n, i) => {
    g += `<circle cx="24" cy="${y + 14 + i * 16}" r="2" fill="${AMBER}"/><text x="32" y="${y + 17 + i * 16}" font-size="8" fill="${INK}">${esc(n)}</text>`;
  });
  g += lines(20, y + 18 + notes.length * 16, 260, Math.max(0, 5 - notes.length), 14);
  return page(label, g, title, desc);
}

// Checklist / shot list layout
function shotList({ label, title, desc, columns = ["Shot", "Framing", "Done"], rows }) {
  let g = `<rect x="20" y="60" width="260" height="18" fill="${INK}"/>`;
  g += `<text x="28" y="72" font-size="7" fill="#fbf8f2" letter-spacing="1">${esc(columns[0].toUpperCase())}</text>`;
  g += `<text x="196" y="72" font-size="7" fill="#fbf8f2" letter-spacing="1">${esc(columns[1].toUpperCase())}</text>`;
  g += `<text x="270" y="72" font-size="7" fill="#fbf8f2" text-anchor="end" letter-spacing="1">${esc(columns[2].toUpperCase())}</text>`;
  rows.forEach((r, i) => {
    const y = 78 + i * 24;
    if (i % 2 === 0) g += `<rect x="20" y="${y}" width="260" height="24" fill="${SOFT}"/>`;
    g += `<text x="28" y="${y + 15}" font-size="8" fill="${INK}">${esc(r[0])}</text>`;
    g += `<text x="196" y="${y + 15}" font-size="7.5" fill="${MUTED}">${esc(r[1] || "")}</text>`;
    g += `<rect x="260" y="${y + 7}" width="10" height="10" rx="1.5" fill="none" stroke="${INK}" stroke-width="1"/>`;
  });
  const end = 78 + rows.length * 24 + 16;
  g += `<text x="20" y="${end}" font-size="7" letter-spacing="1.2" fill="${MUTED}">ADDED ON THE DAY</text>`;
  g += lines(20, end + 14, 260, Math.max(1, Math.floor((356 - end - 14) / 14) + 1), 14);
  return page(label, g, title, desc);
}

// Form-style planning sheet
function planning({ label, title, desc, fields, boxes = [], extra = "" }) {
  let g = "";
  let y = 70;
  for (let i = 0; i < fields.length; i += 2) {
    [fields[i], fields[i + 1]].forEach((f, k) => {
      if (!f) return;
      const x = 20 + k * 136;
      g += `<text x="${x}" y="${y}" font-size="6.8" letter-spacing="1" fill="${MUTED}">${esc(f.toUpperCase())}</text>`;
      g += `<line x1="${x}" y1="${y + 14}" x2="${x + 124}" y2="${y + 14}" stroke="${INK}" stroke-width=".8"/>`;
    });
    y += 30;
  }
  y += 4;
  for (const b of boxes) {
    g += `<rect x="20" y="${y}" width="260" height="${b.h}" rx="3" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;
    g += `<rect x="20" y="${y}" width="260" height="16" rx="3" fill="${SOFT}"/>`;
    g += `<text x="28" y="${y + 11}" font-size="7" letter-spacing="1" fill="${INK}" font-weight="600">${esc(b.title.toUpperCase())}</text>`;
    g += lines(28, y + 30, 244, Math.floor((b.h - 22) / 14), 14);
    y += b.h + 10;
  }
  return page(label, g + extra, title, desc);
}

// Table / reference chart
function chart({ label, title, desc, headers, rows, foot }) {
  const widths = headers.length === 4 ? [104, 52, 52, 52] : [86, 44, 44, 44, 42];
  let g = `<rect x="20" y="60" width="260" height="20" fill="${INK}"/>`;
  let x = 26;
  headers.forEach((h, i) => { g += `<text x="${x}" y="73" font-size="6.8" fill="#fbf8f2" letter-spacing=".8">${esc(h.toUpperCase())}</text>`; x += widths[i]; });
  rows.forEach((r, ri) => {
    const y = 80 + ri * 26;
    if (ri % 2 === 0) g += `<rect x="20" y="${y}" width="260" height="26" fill="${SOFT}"/>`;
    let cx = 26;
    r.forEach((c, i) => {
      g += `<text x="${cx}" y="${y + 16}" font-size="${i === 0 ? 7.6 : 7.4}" fill="${i === 0 ? INK : MUTED}" ${i === 0 ? 'font-weight="600"' : ""}>${esc(c)}</text>`;
      cx += widths[i];
    });
  });
  const end = 80 + rows.length * 26 + 18;
  if (foot) {
    g += `<rect x="20" y="${end}" width="260" height="34" rx="3" fill="none" stroke="${AMBER}" stroke-width="1"/>`;
    g += `<text x="28" y="${end + 14}" font-size="7.2" fill="${INK}">${esc(foot[0])}</text>`;
    g += `<text x="28" y="${end + 26}" font-size="7.2" fill="${INK}">${esc(foot[1])}</text>`;
  }
  const after = end + (foot ? 52 : 0);
  g += `<text x="20" y="${after}" font-size="7" letter-spacing="1.2" fill="${MUTED}">MY ADJUSTMENTS</text>`;
  g += lines(20, after + 14, 260, Math.max(1, Math.floor((356 - after - 14) / 14) + 1), 14);
  return page(label, g, title, desc);
}

// Timeline template
function timeline({ label, title, desc, rows }) {
  let g = `<line x1="62" y1="64" x2="62" y2="${64 + rows.length * 28}" stroke="${AMBER}" stroke-width="1.5"/>`;
  rows.forEach((r, i) => {
    const y = 70 + i * 28;
    g += `<line x1="20" y1="${y + 10}" x2="48" y2="${y + 10}" stroke="${INK}" stroke-width=".8"/>`;
    g += `<text x="34" y="${y + 6}" font-size="6" fill="${MUTED}" text-anchor="middle">TIME</text>`;
    g += `<circle cx="62" cy="${y + 6}" r="4" fill="#fbf8f2" stroke="${AMBER}" stroke-width="1.5"/>`;
    g += `<text x="74" y="${y + 6}" font-size="8.2" fill="${INK}" font-weight="600">${esc(r[0])}</text>`;
    g += `<text x="74" y="${y + 17}" font-size="7" fill="${MUTED}">${esc(r[1])}</text>`;
  });
  const end = 70 + rows.length * 28 + 10;
  g += `<text x="20" y="${end}" font-size="7" letter-spacing="1.2" fill="${MUTED}">TRAVEL AND BUFFER NOTES</text>`;
  g += lines(20, end + 14, 260, Math.max(1, Math.floor((356 - end - 14) / 14) + 1), 14);
  return page(label, g, title, desc);
}

// Family formals grouping planner
function grouping({ label, title, desc, groups }) {
  let g = "";
  groups.forEach((gr, i) => {
    const y = 62 + i * 46;
    g += `<rect x="20" y="${y}" width="260" height="40" rx="3" fill="${i % 2 ? "#fbf8f2" : SOFT}" stroke="${LINE}"/>`;
    g += `<text x="28" y="${y + 14}" font-size="6.5" fill="${MUTED}" letter-spacing="1">GROUP ${i + 1}</text>`;
    g += `<text x="28" y="${y + 28}" font-size="8.2" fill="${INK}" font-weight="600">${esc(gr[0])}</text>`;
    for (let p = 0; p < gr[1]; p++) {
      const cx = 160 + p * 14;
      g += `<circle cx="${cx}" cy="${y + 15}" r="4" fill="${p < gr[2] ? AMBER : INK}"/><path d="M${cx - 6} ${y + 31} q6 -10 12 0" fill="${p < gr[2] ? AMBER : INK}"/>`;
    }
    g += `<rect x="262" y="${y + 15}" width="10" height="10" rx="1.5" fill="none" stroke="${INK}"/>`;
  });
  const end = 62 + groups.length * 46 + 12;
  g += `<text x="20" y="${end}" font-size="7" letter-spacing="1.2" fill="${MUTED}">FAMILY CONTACT WHO KNOWS EVERYONE</text>`;
  g += lines(20, end + 14, 260, 1, 14);
  return page(label, g, title, desc);
}

// Sun planning with compass
function sunPlanner({ label, title, desc }) {
  const fields = ["Location", "Date", "Sunrise", "Sunset", "Golden hour (am)", "Golden hour (pm)", "Blue hour (am)", "Blue hour (pm)"];
  let g = "";
  let y = 70;
  for (let i = 0; i < fields.length; i += 2) {
    [fields[i], fields[i + 1]].forEach((f, k) => {
      const x = 20 + k * 136;
      g += `<text x="${x}" y="${y}" font-size="6.8" letter-spacing="1" fill="${MUTED}">${esc(f.toUpperCase())}</text>`;
      g += `<line x1="${x}" y1="${y + 14}" x2="${x + 124}" y2="${y + 14}" stroke="${INK}" stroke-width=".8"/>`;
    });
    y += 30;
  }
  const cx = 86, cy = 262, r = 48;
  g += `<text x="20" y="${y + 6}" font-size="7" letter-spacing="1.2" fill="${MUTED}">SUN DIRECTION</text>`;
  g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SOFT}" stroke="${INK}" stroke-width=".8"/>`;
  for (let a = 0; a < 360; a += 15) {
    const rad = (a * Math.PI) / 180, l = a % 90 === 0 ? 8 : 4;
    g += `<line x1="${(cx + Math.sin(rad) * r).toFixed(1)}" y1="${(cy - Math.cos(rad) * r).toFixed(1)}" x2="${(cx + Math.sin(rad) * (r - l)).toFixed(1)}" y2="${(cy - Math.cos(rad) * (r - l)).toFixed(1)}" stroke="${INK}" stroke-width=".8"/>`;
  }
  [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([t, a]) => {
    const rad = (a * Math.PI) / 180;
    g += `<text x="${(cx + Math.sin(rad) * (r + 9)).toFixed(1)}" y="${(cy - Math.cos(rad) * (r + 9) + 3).toFixed(1)}" font-size="7.5" font-weight="600" text-anchor="middle" fill="${INK}">${t}</text>`;
  });
  g += `<path d="M${cx} ${cy} L${cx + 38} ${cy - 25}" stroke="${AMBER}" stroke-width="1.6"/><circle cx="${cx + 38}" cy="${cy - 25}" r="5" fill="${AMBER}"/>`;
  g += `<path d="M${cx} ${cy} L${cx - 40} ${cy - 22}" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="3 2"/><circle cx="${cx - 40}" cy="${cy - 22}" r="4" fill="none" stroke="${MUTED}" stroke-width="1.2"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${INK}"/>`;
  g += `<text x="166" y="${y + 14}" font-size="7" fill="${INK}" font-weight="600">Sunrise bearing</text>`;
  g += `<line x1="166" y1="${y + 26}" x2="280" y2="${y + 26}" stroke="${INK}" stroke-width=".8"/>`;
  g += `<text x="166" y="${y + 44}" font-size="7" fill="${INK}" font-weight="600">Sunset bearing</text>`;
  g += `<line x1="166" y1="${y + 56}" x2="280" y2="${y + 56}" stroke="${INK}" stroke-width=".8"/>`;
  g += `<text x="166" y="${y + 74}" font-size="7" fill="${INK}" font-weight="600">Cloud and weather</text>`;
  g += lines(166, y + 86, 114, 2, 12);
  g += `<text x="166" y="${y + 118}" font-size="7" fill="${INK}" font-weight="600">Arrive by</text>`;
  g += `<line x1="166" y1="${y + 130}" x2="280" y2="${y + 130}" stroke="${INK}" stroke-width=".8"/>`;
  g += `<text x="20" y="340" font-size="7" letter-spacing="1.2" fill="${MUTED}">COMPOSITION IDEAS</text>`;
  g += lines(20, 354, 260, 1, 12);
  return page(label, g, title, desc);
}

// Scouting worksheet with sketch grid
function scouting({ label, title, desc }) {
  const fields = ["Location name", "Access / parking", "Permits needed", "Best light (time)"];
  let g = "", y = 70;
  for (let i = 0; i < fields.length; i += 2) {
    [fields[i], fields[i + 1]].forEach((f, k) => {
      const x = 20 + k * 136;
      g += `<text x="${x}" y="${y}" font-size="6.8" letter-spacing="1" fill="${MUTED}">${esc(f.toUpperCase())}</text>`;
      g += `<line x1="${x}" y1="${y + 14}" x2="${x + 124}" y2="${y + 14}" stroke="${INK}" stroke-width=".8"/>`;
    });
    y += 30;
  }
  g += `<text x="20" y="${y + 4}" font-size="7" letter-spacing="1.2" fill="${MUTED}">SITE SKETCH</text>`;
  const top = y + 12;
  g += `<rect x="20" y="${top}" width="260" height="140" fill="${SOFT}" stroke="${LINE}"/>`;
  for (let gx = 33; gx < 280; gx += 13) for (let gy = top + 13; gy < top + 140; gy += 13) g += `<circle cx="${gx}" cy="${gy}" r=".7" fill="${MUTED}"/>`;
  g += `<path d="M30 ${top + 120} C80 ${top + 90} 120 ${top + 110} 170 ${top + 70} S250 ${top + 40} 272 ${top + 30}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
  g += `<path d="M120 ${top + 128} l10 -16 l10 16 z" fill="${AMBER}"/><text x="146" y="${top + 126}" font-size="7" fill="${INK}">Viewpoint 1</text>`;
  g += `<path d="M216 ${top + 70} l10 -16 l10 16 z" fill="${AMBER}"/><text x="240" y="${top + 68}" font-size="7" fill="${INK}">2</text>`;
  g += `<path d="M262 ${top + 20} l0 -8 m-3 3 l3 -3 l3 3" stroke="${INK}" fill="none"/><text x="262" y="${top + 30}" font-size="6.5" text-anchor="middle" fill="${INK}">N</text>`;
  const y2 = top + 158;
  g += `<text x="20" y="${y2}" font-size="7" letter-spacing="1.2" fill="${MUTED}">HAZARDS, TIDES, CLOSURES</text>`;
  g += lines(20, y2 + 14, 260, 3, 14);
  return page(label, g, title, desc);
}

module.exports = { logo, favicon, icons, aperture, lighting, shotList, planning, chart, timeline, grouping, sunPlanner, scouting };

module.exports.pageSizes = function () {
  const k = 22;
  const lw = 8.5 * k, lh = 11 * k, aw = 8.27 * k, ah = 11.69 * k;
  const x0 = 26, base = 282;
  return `<svg class="size-diagram" viewBox="0 0 240 310" role="img" aria-labelledby="ps-t ps-d" font-family="Inter, system-ui, sans-serif">
<title id="ps-t">US Letter and A4 page sizes compared</title>
<desc id="ps-d">Two page outlines aligned at the bottom left corner. US Letter is 8.5 by 11 inches, slightly wider. A4 is 210 by 297 millimetres, slightly taller.</desc>
<rect x="${x0}" y="${(base - ah).toFixed(1)}" width="${aw.toFixed(1)}" height="${ah.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4"/>
<rect x="${x0}" y="${(base - lh).toFixed(1)}" width="${lw.toFixed(1)}" height="${lh.toFixed(1)}" fill="#e09a2c" fill-opacity=".12" stroke="#e09a2c" stroke-width="1.8"/>
<text x="${x0 + 10}" y="${(base - lh + 24).toFixed(1)}" font-size="14" font-weight="600" fill="currentColor">US Letter</text>
<text x="${x0 + 10}" y="${(base - lh + 40).toFixed(1)}" font-size="12" fill="currentColor" opacity=".75">8.5 × 11 in</text>
<text x="${x0 + 10}" y="${(base - ah - 8).toFixed(1)}" font-size="14" font-weight="600" fill="currentColor">A4</text>
<text x="${x0 + 36}" y="${(base - ah - 8).toFixed(1)}" font-size="12" fill="currentColor" opacity=".75">210 × 297 mm</text>
<line x1="${x0}" y1="${base + 12}" x2="${x0 + lw}" y2="${base + 12}" stroke="currentColor" stroke-width=".8" opacity=".5"/>
<text x="${x0 + lw / 2}" y="${base + 24}" font-size="11" text-anchor="middle" fill="currentColor" opacity=".75">Both sizes included</text>
</svg>`;
};
