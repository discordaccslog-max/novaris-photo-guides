/*
  Novaris Field Kit — original SVG diagrams.
  Lighting setups are drawn from above; poses use one consistent figure style
  built from joint angles; composition diagrams are simple framed sketches.
  Each function returns an SVG string. palette "screen" uses CSS variables so
  display modes recolor the diagrams; palette "print" uses fixed colors for exports.
*/

const RAD = Math.PI / 180;
const PRINT = {
  floor: "#f4efe6", grid: "#e2d8c6", ink: "#1f1d1a", muted: "#6b645a", soft: "#d9cfbe",
  accent: "#c77d16", light: "#f2b45a", paper: "#fbf8f2", label: "#1f1d1a", halo: "#f4efe6", figure2: "#5b554d"
};

function paint(palette) {
  const screen = palette !== "print";
  const fill = (n) => (screen ? `style="fill:var(--dg-${n})"` : `fill="${PRINT[n]}"`);
  const stroke = (n, extra = "") => (screen ? `style="stroke:var(--dg-${n});fill:none;${extra}"` : `stroke="${PRINT[n]}" fill="none" ${extra ? `style="${extra}"` : ""}`);
  const both = (f, s) => (screen ? `style="fill:var(--dg-${f});stroke:var(--dg-${s})"` : `fill="${PRINT[f]}" stroke="${PRINT[s]}"`);
  return { fill, stroke, both, screen };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/* ---------------- Lighting diagrams ---------------- */

function icon(type, p) {
  const { fill, stroke, both } = p;
  switch (type) {
    case "subject":
      return `<ellipse cx="0" cy="3" rx="16" ry="9" ${fill("ink")}/><circle cx="0" cy="-2" r="7.5" ${fill("muted")}/>`;
    case "product":
      return `<rect x="-11" y="-11" width="22" height="22" rx="3" ${fill("ink")}/>`;
    case "camera":
      return `<rect x="-14" y="-4" width="28" height="16" rx="3" ${fill("ink")}/><rect x="-6" y="-13" width="12" height="10" rx="1.5" ${fill("ink")}/>`;
    case "camera-flash":
      return `<rect x="-14" y="-2" width="28" height="16" rx="3" ${fill("ink")}/><rect x="-6" y="-11" width="12" height="10" rx="1.5" ${fill("ink")}/><rect x="-5" y="-21" width="10" height="9" rx="1.5" ${fill("accent")}/>`;
    case "softbox":
      return `<path d="M-6 9 L6 9 L18 -6 L-18 -6 Z" ${fill("ink")}/><rect x="-19" y="-9" width="38" height="4" rx="1.5" ${fill("light")}/>`;
    case "umbrella":
      return `<path d="M-18 4 Q0 -16 18 4" ${stroke("ink", "stroke-width:4;stroke-linecap:round")}/><line x1="0" y1="-5" x2="0" y2="12" ${stroke("ink", "stroke-width:2")}/><path d="M-14 0 Q0 -12 14 0" ${stroke("light", "stroke-width:2")}/>`;
    case "strip":
      return `<rect x="-20" y="-3" width="40" height="10" rx="2" ${fill("ink")}/><rect x="-20" y="-6" width="40" height="4" rx="1.5" ${fill("light")}/>`;
    case "flash":
      return `<rect x="-7" y="-4" width="14" height="13" rx="2" ${fill("ink")}/><rect x="-7" y="-8" width="14" height="5" rx="1" ${fill("light")}/>`;
    case "light":
      return `<circle cx="0" cy="4" r="9" ${fill("ink")}/><path d="M-6 -2 L6 -2 L10 -12 L-10 -12 Z" ${fill("light")}/>`;
    case "window":
      return `<rect x="-4" y="-38" width="8" height="76" rx="2" ${fill("light")}/><rect x="-6" y="-40" width="2" height="80" ${fill("muted")}/>`;
    case "reflector":
      return `<path d="M-18 4 Q0 -8 18 4" ${stroke("muted", "stroke-width:5;stroke-linecap:round")}/>`;
    case "card":
      return `<rect x="-16" y="-2.5" width="32" height="5" rx="1" ${both("paper", "muted")}/>`;
    case "flag":
      return `<rect x="-16" y="-2.5" width="32" height="5" rx="1" ${fill("ink")}/>`;
    case "diffusion":
      return `<rect x="-26" y="-3" width="52" height="6" rx="1" ${both("paper", "muted")} stroke-dasharray="3 2"/>`;
    case "backdrop":
      return `<path d="M-80 8 Q0 -12 80 8" ${stroke("muted", "stroke-width:6;stroke-linecap:round")}/>`;
    case "sun": {
      let rays = "";
      for (let a = 0; a < 360; a += 45) rays += `<line x1="${(Math.cos(a * RAD) * 15).toFixed(1)}" y1="${(Math.sin(a * RAD) * 15).toFixed(1)}" x2="${(Math.cos(a * RAD) * 21).toFixed(1)}" y2="${(Math.sin(a * RAD) * 21).toFixed(1)}" ${stroke("accent", "stroke-width:2;stroke-linecap:round")}/>`;
      return `<circle r="11" ${fill("light")}/>${rays}`;
    }
    case "sky":
      return `<path d="M-34 10 A34 34 0 0 1 34 10 Z" ${fill("light")} opacity=".55"/><path d="M-24 10 A24 24 0 0 1 24 10" ${stroke("accent", "stroke-width:1.5;stroke-dasharray:3 3")}/>`;
    case "shade":
      return `<rect x="-160" y="-70" width="320" height="120" rx="6" ${fill("ink")} opacity=".1"/>`;
    case "table":
      return `<rect x="-70" y="-46" width="140" height="92" rx="4" ${both("soft", "muted")} opacity=".7"/>`;
    case "wall":
      return `<rect x="-5" y="-110" width="10" height="220" ${fill("muted")} opacity=".6"/>`;
    case "ceiling":
      return `<rect x="-120" y="-16" width="240" height="32" rx="4" ${both("soft", "muted")} opacity=".7" stroke-dasharray="5 4"/>`;
    case "audience": {
      let dots = "";
      for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) dots += `<circle cx="${-54 + c * 18 + (r % 2) * 9}" cy="${-14 + r * 14}" r="5.5" ${fill("muted")}/>`;
      return dots;
    }
    default:
      return `<circle r="8" ${fill("muted")}/>`;
  }
}

const NO_ROTATE = new Set(["window", "backdrop", "sun", "sky", "shade", "table", "wall", "ceiling", "audience", "subject", "product"]);
const LABEL_OFFSET = { backdrop: -16, shade: -58, ceiling: -24, wall: 0, table: 60, audience: 34, window: 50, sky: 26 };

function facing(el, setup) {
  const beam = (setup.beams || []).find((b) => b.from === el.id);
  if (beam) {
    const t = setup.elements.find((e) => e.id === beam.to);
    if (t) return Math.atan2(t.x - el.x, -(t.y - el.y)) / RAD;
  }
  return el.rot || 0;
}

export function lightingSvg(setup, { palette = "screen", selected = null, interactive = true } = {}) {
  const p = paint(palette);
  const { fill, stroke } = p;
  let out = `<rect x="0" y="0" width="360" height="300" rx="10" ${fill("floor")}/>`;
  for (let x = 20; x < 360; x += 20) out += `<line x1="${x}" y1="0" x2="${x}" y2="300" ${stroke("grid", "stroke-width:.6")}/>`;
  for (let y = 20; y < 300; y += 20) out += `<line x1="0" y1="${y}" x2="360" y2="${y}" ${stroke("grid", "stroke-width:.6")}/>`;

  const byId = Object.fromEntries(setup.elements.map((e) => [e.id, e]));
  // Areas first, then beams, then objects.
  const areas = setup.elements.filter((e) => ["shade", "table", "ceiling", "wall"].includes(e.type));
  const objects = setup.elements.filter((e) => !areas.includes(e));
  const draw = (el) => {
    const rot = NO_ROTATE.has(el.type) ? 0 : facing(el, setup);
    const sel = selected === el.id;
    const labelY = el.y + (LABEL_OFFSET[el.type] ?? 30);
    const labelX = el.type === "wall" ? el.x + 12 : el.x;
    const anchor = el.type === "wall" ? "start" : "middle";
    const attrs = interactive
      ? ` class="dg-el${sel ? " is-selected" : ""}" data-id="${esc(el.id)}" role="button" tabindex="0" aria-pressed="${sel}" aria-label="${esc(el.label)}. ${esc(el.role)}"`
      : "";
    const ring = sel ? `<circle cx="${el.x}" cy="${el.y}" r="25" ${stroke("accent", "stroke-width:2.5;stroke-dasharray:4 3")}/>` : "";
    const hit = interactive ? `<circle cx="${el.x}" cy="${el.y}" r="24" fill="transparent"/>` : "";
    return `<g${attrs}>${hit}${ring}<g transform="translate(${el.x} ${el.y}) rotate(${rot.toFixed(1)})">${icon(el.type, p)}</g>` +
      `<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-size="10.5" font-weight="600" font-family="Inter, system-ui, sans-serif" ${fill("label")} ${p.screen ? 'class="dg-label"' : `stroke="${PRINT.halo}" stroke-width="3" paint-order="stroke"`}>${esc(el.label)}</text></g>`;
  };
  out += areas.map(draw).join("");
  for (const b of setup.beams || []) {
    const a = byId[b.from], t = byId[b.to];
    if (!a || !t) continue;
    const dx = t.x - a.x, dy = t.y - a.y, len = Math.hypot(dx, dy) || 1;
    const sx = a.x + (dx / len) * 20, sy = a.y + (dy / len) * 20, ex = t.x - (dx / len) * 22, ey = t.y - (dy / len) * 22;
    const bounce = b.kind === "bounce";
    out += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" ${stroke(bounce ? "muted" : "accent", `stroke-width:${bounce ? 1.4 : 1.8};stroke-dasharray:${bounce ? "2 4" : "6 4"};stroke-linecap:round`)} marker-end="url(#arrow-${bounce ? "b" : "a"}-${palette})"/>`;
  }
  out += objects.map(draw).join("");
  const defs = `<defs><marker id="arrow-a-${palette}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" ${fill("accent")}/></marker><marker id="arrow-b-${palette}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" ${fill("muted")}/></marker></defs>`;
  return `<svg class="diagram" viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Overhead lighting diagram: ${esc(setup.title)}">${defs}${out}</svg>`;
}

/* ---------------- Pose figures ---------------- */

const BODY = { head: 11, neck: 5, torso: 50, shoulder: 18, hip: 12, upperArm: 28, foreArm: 26, thigh: 42, shin: 42, limb: 9 };
const GROUND = 272;

function figureParts(f, pose) {
  const s = (f.scale || 1) * 1.32;
  const b = Object.fromEntries(Object.entries(BODY).map(([k, v]) => [k, v * s]));
  const narrow = 1 - 0.45 * (f.turn || 0);
  const lean = (f.lean || 0) * RAD;
  const ground = pose.prop === "ground" && f.seated;
  const hipY = f.seated ? (ground ? GROUND - 10 * s : GROUND - b.shin - 10 * s) : GROUND - (b.thigh + b.shin) * 0.985;
  const H = [f.x, hipY];
  const up = [Math.sin(lean), -Math.cos(lean)];
  const perp = [Math.cos(lean), Math.sin(lean)];
  const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
  const N = add(H, up, b.torso);
  const shoulders = [add(N, perp, -b.shoulder * narrow), add(N, perp, b.shoulder * narrow)];
  const hips = [add(H, perp, -b.hip * narrow), add(H, perp, b.hip * narrow)];
  const tilt = lean + (f.headTilt || 0) * RAD;
  const head = [N[0] + Math.sin(tilt) * (b.neck + b.head), N[1] - Math.cos(tilt) * (b.neck + b.head)];
  const dir = (deg) => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
  const limbs = [];
  (f.arms || [[8, 8], [8, 8]]).forEach(([a, bend], i) => {
    const upper = i === 0 ? 90 + a : 90 - a;
    const fore = i === 0 ? upper - bend : upper + bend;
    const elbow = add(shoulders[i], dir(upper), b.upperArm);
    const wrist = add(elbow, dir(fore), b.foreArm);
    limbs.push({ kind: "arm", pts: [shoulders[i], elbow, wrist] });
  });
  (f.legs || [[4, 0], [-4, 0]]).forEach(([a, bend], i) => {
    const upper = i === 0 ? 90 + a : 90 - a;
    const lower = i === 0 ? upper - bend : upper + bend;
    const thigh = f.seated ? b.thigh * (ground ? 0.8 : 0.5) : b.thigh;
    const knee = add(hips[i], dir(upper), thigh);
    const foot = add(knee, dir(lower), b.shin);
    limbs.push({ kind: "leg", pts: [hips[i], knee, foot] });
  });
  return { b, s, H, N, shoulders, hips, head, limbs };
}

export function poseSvg(pose, { palette = "screen" } = {}) {
  const p = paint(palette);
  const { fill, stroke } = p;
  let out = `<rect x="0" y="0" width="360" height="300" rx="10" ${fill("floor")}/>`;
  out += `<line x1="16" y1="${GROUND + 2}" x2="344" y2="${GROUND + 2}" ${stroke("soft", "stroke-width:2")}/>`;
  const parts = pose.figures.map((f) => ({ f, ...figureParts(f, pose) }));

  // Props
  if (pose.prop === "stool") {
    for (const { f, H, s } of parts) {
      if (!f.seated) continue;
      out += `<rect x="${H[0] - 24 * s}" y="${H[1] + 6 * s}" width="${48 * s}" height="${6 * s}" rx="2" ${fill("soft")}/>`;
      out += `<line x1="${H[0] - 18 * s}" y1="${H[1] + 12 * s}" x2="${H[0] - 22 * s}" y2="${GROUND}" ${stroke("soft", "stroke-width:4")}/><line x1="${H[0] + 18 * s}" y1="${H[1] + 12 * s}" x2="${H[0] + 22 * s}" y2="${GROUND}" ${stroke("soft", "stroke-width:4")}/>`;
      out += `<line x1="${H[0] - 20 * s}" y1="${GROUND - 26}" x2="${H[0] + 20 * s}" y2="${GROUND - 26}" ${stroke("soft", "stroke-width:3")}/>`;
    }
  }
  if (pose.prop === "wall-left") out += `<rect x="96" y="40" width="12" height="${GROUND - 38}" ${fill("soft")}/>`;
  if (pose.prop === "ground") out += `<ellipse cx="180" cy="${GROUND}" rx="140" ry="12" ${fill("soft")} opacity=".7"/>`;

  // Figures: background figures (non-accent, larger) first, then accent figures.
  const order = parts.slice().sort((a, b) => (a.f.accent === b.f.accent ? (b.s - a.s) : a.f.accent ? 1 : -1));
  for (const { f, b, shoulders, hips, head, limbs } of order) {
    const col = f.accent ? "accent" : "figure2";
    const limbStyle = (w) => stroke(col, `stroke-width:${w.toFixed(1)};stroke-linecap:round;stroke-linejoin:round`);
    for (const l of limbs.filter((x) => x.kind === "leg")) out += `<polyline points="${l.pts.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" ${limbStyle(b.limb * 1.15)}/>`;
    const torso = [shoulders[0], shoulders[1], hips[1], hips[0]].map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ");
    out += `<polygon points="${torso}" ${p.screen ? `style="fill:var(--dg-${col});stroke:var(--dg-${col});stroke-width:${(b.limb * 0.9).toFixed(1)};stroke-linejoin:round"` : `fill="${PRINT[col]}" stroke="${PRINT[col]}" stroke-width="${(b.limb * 0.9).toFixed(1)}" stroke-linejoin="round"`}/>`;
    for (const l of limbs.filter((x) => x.kind === "arm")) out += `<polyline points="${l.pts.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" ${limbStyle(b.limb)}/>`;
    out += `<circle cx="${head[0].toFixed(1)}" cy="${head[1].toFixed(1)}" r="${b.head.toFixed(1)}" ${fill(col)}/>`;
  }

  // Crop guide for headshots
  if (pose.crop === "head") {
    const { head, b } = parts[0];
    out += `<rect x="${(head[0] - 64).toFixed(1)}" y="${(head[1] - 30).toFixed(1)}" width="128" height="${(b.head * 2 + 66).toFixed(1)}" rx="3" ${stroke("muted", "stroke-width:1.5;stroke-dasharray:6 4")}/>`;
    out += `<text x="${(head[0] + 68).toFixed(1)}" y="${(head[1] - 16).toFixed(1)}" font-size="10" font-family="Inter, system-ui, sans-serif" ${fill("muted")}>Crop</text>`;
  }

  // Camera height marker
  const main = parts.find((q) => q.f.accent) || parts[0];
  const camY = pose.camera === "eye" ? main.head[1] : pose.camera === "waist" ? main.H[1] : main.N[1] + 14;
  out += `<line x1="314" y1="${camY.toFixed(1)}" x2="292" y2="${camY.toFixed(1)}" ${stroke("muted", "stroke-width:1.2;stroke-dasharray:3 3")}/>`;
  out += `<g transform="translate(330 ${camY.toFixed(1)})"><rect x="-11" y="-7" width="22" height="14" rx="2.5" ${fill("ink")}/><rect x="-18" y="-4" width="8" height="8" rx="1.5" ${fill("ink")}/></g>`;
  out += `<text x="330" y="${(camY + 22).toFixed(1)}" text-anchor="middle" font-size="9" font-family="Inter, system-ui, sans-serif" ${fill("muted")}>Camera</text>`;

  return `<svg class="diagram" viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pose diagram: ${esc(pose.title)}">${out}</svg>`;
}

/* ---------------- Composition diagrams ---------------- */

export function compositionSvg(id, { palette = "screen" } = {}) {
  const p = paint(palette);
  const { fill, stroke } = p;
  const frame = `<rect x="10" y="10" width="300" height="200" rx="4" ${fill("paper")}/>`;
  const border = `<rect x="10" y="10" width="300" height="200" rx="4" ${stroke("ink", "stroke-width:2")}/>`;
  const guide = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${stroke("accent", "stroke-width:1.5;stroke-dasharray:5 4")}/>`;
  let body = "";
  switch (id) {
    case "thirds":
      body = `<path d="M10 143 L80 120 L140 132 L210 104 L310 128 L310 210 L10 210 Z" ${fill("soft")}/>` +
        guide(110, 10, 110, 210) + guide(210, 10, 210, 210) + guide(10, 77, 310, 77) + guide(10, 143, 310, 143) +
        `<circle cx="210" cy="77" r="12" ${fill("light")}/>`;
      break;
    case "leading":
      body = `<path d="M10 150 L310 150 L310 210 L10 210 Z" ${fill("soft")}/><path d="M120 210 L200 96 L214 96 L250 210 Z" ${fill("muted")}/>` +
        guide(120, 210, 207, 90) + guide(250, 210, 207, 90) + `<circle cx="207" cy="84" r="8" ${fill("accent")}/>`;
      break;
    case "foreground":
      body = `<path d="M10 120 L90 70 L150 110 L220 60 L310 115 L310 210 L10 210 Z" ${fill("soft")}/>` +
        `<path d="M10 210 L10 160 Q40 128 92 150 Q130 168 138 210 Z" ${fill("ink")}/>` + guide(60, 170, 200, 80);
      break;
    case "layers":
      body = `<path d="M10 110 Q80 70 150 100 T310 90 L310 210 L10 210 Z" ${fill("soft")} opacity=".55"/>` +
        `<path d="M10 140 Q90 100 170 130 T310 120 L310 210 L10 210 Z" ${fill("muted")} opacity=".6"/>` +
        `<path d="M10 175 Q100 140 190 165 T310 160 L310 210 L10 210 Z" ${fill("ink")} opacity=".85"/>`;
      break;
    case "horizon":
      body = `<line x1="160" y1="10" x2="160" y2="210" ${stroke("ink", "stroke-width:2")}/>` +
        `<path d="M10 170 L160 170 L160 210 L10 210 Z" ${fill("soft")}/><path d="M160 60 L310 60 L310 210 L160 210 Z" ${fill("soft")}/>` +
        guide(10, 170, 160, 170) + guide(160, 60, 310, 60) +
        `<text x="85" y="30" text-anchor="middle" font-size="11" font-family="Inter, system-ui, sans-serif" ${fill("muted")}>More sky</text>` +
        `<text x="235" y="30" text-anchor="middle" font-size="11" font-family="Inter, system-ui, sans-serif" ${fill("muted")}>More land</text>`;
      break;
    case "symmetry":
      body = `<path d="M60 110 L130 50 L160 76 L200 40 L260 110 Z" ${fill("muted")}/><path d="M60 110 L130 170 L160 144 L200 180 L260 110 Z" ${fill("soft")}/>` +
        guide(10, 110, 310, 110) + guide(160, 10, 160, 210);
      break;
    default:
      body = "";
  }
  return `<svg class="diagram" viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Composition diagram">${frame}${body}${border}</svg>`;
}

/* ---------------- Rasterize for PDF export (browser only) ---------------- */

export function svgToJpeg(svg, width = 1080) {
  return new Promise((resolve, reject) => {
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
    const ratio = vb ? Number(vb[2]) / Number(vb[1]) : 300 / 360;
    const height = Math.round(width * ratio);
    const markup = svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const sized = markup.replace("<svg", `<svg width="${width}" height="${height}"`);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.9), width, height });
    };
    img.onerror = () => reject(new Error("Could not render the diagram."));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(sized);
  });
}
