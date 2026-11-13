/*
  Novaris Field Kit — PDF exports of shot lists, worksheets, diagrams, and more.
  Pure functions: each takes data and returns PDF bytes (Uint8Array).
*/
import { PdfDoc, textWidth, wrapText } from "../js/pdf.js";

const INK = [31, 29, 26];
const MUTED = [91, 85, 77];
const LINE = [205, 196, 180];
const AMBER = [143, 74, 6];

function start(title, guideName, paper, subtitle) {
  const doc = new PdfDoc({ size: paper || "letter", title, margin: paper === "pocket" ? 22 : 50 });
  const m = doc.margin;
  const small = paper === "pocket";
  doc.text((guideName || "Novaris Field Kit").toUpperCase(), m, m + 6, { size: small ? 6.5 : 8, font: "bold", color: AMBER });
  doc.y = m + (small ? 12 : 16);
  doc.paragraph(title, { size: small ? 12 : 19, font: "bold", lineHeight: 1.2, gap: small ? 2 : 4 });
  if (subtitle) doc.paragraph(subtitle, { size: small ? 7.5 : 10, color: MUTED, gap: small ? 4 : 8 });
  doc.line(m, doc.y, doc.width - m, doc.y, { color: LINE });
  doc.y += small ? 8 : 14;
  return doc;
}

function finish(doc, guideName) {
  const total = doc.pages.length;
  const current = doc.page;
  doc.pages.forEach((page, i) => {
    doc.page = page;
    const label = `Novaris Photo Guides${guideName ? " · " + guideName : ""}`;
    const size = doc.width < 300 ? 6 : 8;
    doc.text(label, doc.margin, doc.height - doc.margin / 2, { size, color: MUTED });
    if (total > 1) {
      const n = `${i + 1} / ${total}`;
      doc.text(n, doc.width - doc.margin - textWidth(n, size), doc.height - doc.margin / 2, { size, color: MUTED });
    }
  });
  doc.page = current;
  return doc.output();
}

function box(doc, x, y, size, checked) {
  doc.rect(x, y, size, size, { stroke: INK, width: 1 });
  if (checked) {
    doc.line(x + size * 0.2, y + size * 0.55, x + size * 0.42, y + size * 0.78, { width: 1.6, color: AMBER });
    doc.line(x + size * 0.42, y + size * 0.78, x + size * 0.82, y + size * 0.22, { width: 1.6, color: AMBER });
  }
}

const dateLabel = (iso) => {
  try { return new Date(iso || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return ""; }
};

/* Shot lists and checklists. */
export function exportChecklist(doc0, { paper, guideName, blank = false } = {}) {
  const data = doc0.data;
  const items = data.sections.flatMap((s) => s.items);
  const done = items.filter((i) => i.done).length;
  const subtitle = blank ? `${items.length} items` : `${done} of ${items.length} done · ${dateLabel(doc0.updated)}`;
  const doc = start(doc0.title, guideName, paper, subtitle);
  const m = doc.margin, w = doc.contentWidth;
  for (const section of data.sections) {
    doc.ensureSpace(40);
    doc.paragraph(section.title, { size: 12.5, font: "bold", gap: 4 });
    for (const item of section.items) {
      const lines = wrapText(item.text, w - 26, 10.5);
      const noteLines = item.note ? wrapText(item.note, w - 26, 9) : [];
      const h = lines.length * 14 + noteLines.length * 12 + 8;
      doc.ensureSpace(h);
      box(doc, m, doc.y + 1, 11, !blank && item.done);
      lines.forEach((l, i) => doc.text(l, m + 22, doc.y + 10 + i * 14, { size: 10.5 }));
      noteLines.forEach((l, i) => doc.text(l, m + 22, doc.y + 10 + lines.length * 14 + i * 12, { size: 9, color: MUTED }));
      doc.y += h;
    }
    doc.y += 6;
  }
  return finish(doc, guideName);
}

/* Planning worksheets (fields with values, or blank lines to fill by hand). */
export function exportWorksheet(doc0, template, { paper, guideName, blank = false } = {}) {
  const values = (doc0 && doc0.data && doc0.data.values) || {};
  const doc = start(doc0 ? doc0.title : template.title, guideName, paper, blank ? "Blank worksheet" : dateLabel(doc0 && doc0.updated));
  const m = doc.margin, w = doc.contentWidth;
  for (const section of template.sections) {
    doc.ensureSpace(50);
    doc.paragraph(section.title, { size: 12.5, font: "bold", gap: 6 });
    for (const field of section.fields) {
      const value = blank ? "" : String(values[field.id] || "");
      const multi = field.type === "textarea";
      doc.ensureSpace(multi ? 70 : 34);
      doc.text(field.label.toUpperCase(), m, doc.y + 8, { size: 7.5, font: "bold", color: MUTED });
      doc.y += 12;
      if (value) {
        doc.paragraph(value, { size: 10.5, gap: 2 });
        doc.line(m, doc.y, m + w, doc.y, { color: LINE });
        doc.y += 10;
      } else {
        const n = multi ? 3 : 1;
        for (let i = 0; i < n; i++) { doc.y += 18; doc.line(m, doc.y, m + w, doc.y, { color: LINE }); }
        doc.y += 10;
      }
    }
    doc.y += 4;
  }
  return finish(doc, guideName);
}

/* Timelines and run-of-show tables. */
export function exportTable(doc0, template, { paper, guideName } = {}) {
  const rows = doc0.data.rows;
  const doc = start(doc0.title, guideName, paper, dateLabel(doc0.updated));
  const m = doc.margin, w = doc.contentWidth - 18;
  const cols = template.columns.map((c) => ({ ...c, w: c.width * w }));
  const header = () => {
    doc.rect(m, doc.y, w + 18, 18, { stroke: null, fill: [31, 29, 26] });
    let x = m + 18;
    for (const c of cols) { doc.text(c.label.toUpperCase(), x + 4, doc.y + 12, { size: 7.5, font: "bold", color: [251, 248, 242] }); x += c.w; }
    doc.y += 18;
  };
  header();
  rows.forEach((row, i) => {
    const cellLines = cols.map((c) => wrapText(String(row.cells[c.id] || ""), c.w - 8, 9.5));
    const h = Math.max(1, ...cellLines.map((l) => l.length)) * 12.5 + 10;
    if (doc.y + h > doc.height - doc.margin) { doc.addPage(); header(); }
    if (i % 2 === 0) doc.rect(m, doc.y, w + 18, h, { stroke: null, fill: [244, 239, 230] });
    box(doc, m + 4, doc.y + 6, 9, row.done);
    let x = m + 18;
    cols.forEach((c, k) => {
      cellLines[k].forEach((l, li) => doc.text(l, x + 4, doc.y + 15 + li * 12.5, { size: 9.5, font: c.id === "time" ? "bold" : "regular" }));
      x += c.w;
    });
    doc.y += h;
  });
  return finish(doc, guideName);
}

/* Family formals grouping planner. */
export function exportGroups(doc0, { paper, guideName } = {}) {
  const groups = doc0.data.groups;
  const doc = start(doc0.title, guideName, paper, `${groups.length} groups, in shooting order`);
  const m = doc.margin, w = doc.contentWidth;
  groups.forEach((g, i) => {
    const people = g.people ? wrapText(g.people, w - 60, 10) : [];
    const h = 30 + Math.max(1, people.length) * 13;
    doc.ensureSpace(h + 6);
    doc.rect(m, doc.y, w, h, { stroke: LINE, fill: i % 2 ? null : [244, 239, 230] });
    box(doc, m + 10, doc.y + 10, 11, g.done);
    doc.text(`${i + 1}. ${g.name}`, m + 30, doc.y + 19, { size: 11, font: "bold" });
    if (people.length) people.forEach((l, k) => doc.text(l, m + 30, doc.y + 33 + k * 13, { size: 10, color: MUTED }));
    else doc.line(m + 30, doc.y + h - 10, m + w - 12, doc.y + h - 10, { color: LINE });
    doc.y += h + 6;
  });
  return finish(doc, guideName);
}

/* Client questionnaire, blank for the client or with answers recorded. */
export function exportQuestionnaire(doc0, { paper, guideName, blank = true } = {}) {
  const d = doc0.data;
  const title = d.business ? `${d.business}: ${doc0.title}` : doc0.title;
  const doc = new PdfDoc({ size: paper || "letter", title, margin: 54 });
  const m = doc.margin, w = doc.contentWidth;
  if (d.business) doc.text(d.business.toUpperCase(), m, m + 6, { size: 9, font: "bold", color: AMBER });
  doc.y = m + 16;
  doc.paragraph(doc0.title, { size: 20, font: "bold", lineHeight: 1.2, gap: 6 });
  if (d.intro) doc.paragraph(d.intro, { size: 10.5, color: MUTED, gap: 10 });
  if (blank) {
    doc.text("NAME", m, doc.y + 8, { size: 7.5, font: "bold", color: MUTED });
    doc.line(m + 40, doc.y + 10, m + w * 0.6, doc.y + 10, { color: LINE });
    doc.text("DATE", m + w * 0.64, doc.y + 8, { size: 7.5, font: "bold", color: MUTED });
    doc.line(m + w * 0.64 + 34, doc.y + 10, m + w, doc.y + 10, { color: LINE });
    doc.y += 26;
  }
  doc.line(m, doc.y, m + w, doc.y, { color: LINE });
  doc.y += 14;
  d.questions.forEach((q, i) => {
    const answer = blank ? "" : String(q.answer || "");
    doc.ensureSpace(answer ? 40 : 86);
    doc.paragraph(`${i + 1}. ${q.text}`, { size: 11, font: "bold", gap: 4 });
    if (answer) doc.paragraph(answer, { size: 10.5, gap: 10 });
    else { for (let k = 0; k < 3; k++) { doc.y += 18; doc.line(m, doc.y, m + w, doc.y, { color: LINE }); } doc.y += 14; }
  });
  if (d.business || d.contact) {
    doc.ensureSpace(40);
    doc.paragraph([d.business, d.contact].filter(Boolean).join(" · "), { size: 9.5, color: MUTED });
  }
  return doc.output();
}

/* Lighting diagrams, poses, and composition references. */
export function exportDiagram({ title, guideName, summary, image, notes = [], tips = [], paper }) {
  const doc = start(title, guideName, paper, summary);
  const m = doc.margin, w = doc.contentWidth;
  if (image) {
    const h = (w * image.height) / image.width;
    doc.ensureSpace(h + 10);
    doc.image(image.dataUrl, m, doc.y, w, h, image.width, image.height);
    doc.y += h + 16;
  }
  for (const n of notes) {
    doc.ensureSpace(40);
    if (n.label) doc.paragraph(n.label, { size: 11.5, font: "bold", gap: 2 });
    if (n.role) doc.paragraph(n.role, { size: 10.5, color: AMBER, gap: 2 });
    if (n.text) doc.paragraph(n.text, { size: 10.5, gap: 8 });
  }
  if (tips.length) {
    doc.ensureSpace(30);
    doc.paragraph("Tips", { size: 12, font: "bold", gap: 2 });
    tips.forEach((t) => doc.paragraph("•  " + t, { size: 10.5, gap: 2 }));
  }
  return finish(doc, guideName);
}

/* Settings reference tables. */
export function exportSettings(settings, { paper, guideName } = {}) {
  const doc = start("Settings reference", guideName, paper, "Starting points for common situations. Adjust for your light, lens, and subject.");
  const m = doc.margin, w = doc.contentWidth;
  const colW = [0.28, 0.14, 0.12, 0.12, 0.34].map((k) => k * w);
  const labels = ["Situation", "Aperture", "Shutter", "ISO", "Notes"];
  for (const table of settings.tables) {
    doc.ensureSpace(60);
    doc.paragraph(table.title, { size: 12.5, font: "bold", gap: 4 });
    doc.rect(m, doc.y, w, 18, { stroke: null, fill: [31, 29, 26] });
    let x = m;
    labels.forEach((l, i) => { doc.text(l.toUpperCase(), x + 4, doc.y + 12, { size: 7.5, font: "bold", color: [251, 248, 242] }); x += colW[i]; });
    doc.y += 18;
    table.rows.forEach((r, ri) => {
      const cells = [r.situation, r.aperture, r.shutter, r.iso, r.notes];
      const wrapped = cells.map((c, i) => wrapText(String(c), colW[i] - 8, 9.5));
      const h = Math.max(...wrapped.map((l) => l.length)) * 12.5 + 10;
      doc.ensureSpace(h);
      if (ri % 2 === 0) doc.rect(m, doc.y, w, h, { stroke: null, fill: [244, 239, 230] });
      let cx = m;
      wrapped.forEach((lines, i) => { lines.forEach((l, li) => doc.text(l, cx + 4, doc.y + 15 + li * 12.5, { size: 9.5, font: i === 0 ? "bold" : "regular" })); cx += colW[i]; });
      doc.y += h;
    });
    doc.y += 14;
  }
  if (settings.rules && settings.rules.length) {
    doc.paragraph("Rules of thumb", { size: 12, font: "bold", gap: 2 });
    settings.rules.forEach((r) => doc.paragraph("•  " + r, { size: 10.5, gap: 2 }));
  }
  return finish(doc, guideName);
}

/* Sun times for one date and place. rows: [[label, value], ...] */
export function exportSun({ placeLabel, dateLabel: dl, offsetLabel, rows, note, paper, guideName }) {
  const doc = start("Sunrise and sunset plan", guideName, paper, `${placeLabel} · ${dl} · times in ${offsetLabel}`);
  const m = doc.margin, w = doc.contentWidth;
  rows.forEach(([label, value], i) => {
    doc.ensureSpace(26);
    if (i % 2 === 0) doc.rect(m, doc.y, w, 24, { stroke: null, fill: [244, 239, 230] });
    doc.text(label, m + 8, doc.y + 16, { size: 11 });
    doc.text(value, m + w - 8 - textWidth(value, 11, "bold"), doc.y + 16, { size: 11, font: "bold" });
    doc.y += 24;
  });
  doc.y += 12;
  if (note) doc.paragraph(note, { size: 9.5, color: MUTED });
  return finish(doc, guideName);
}

/* Pocket card: 4 × 6 in pages for a camera bag. */
export function exportPocketCard({ settingsRows, sun, gear, guideName }) {
  const doc = start("Pocket card", guideName, "pocket", sun ? `${sun.placeLabel} · ${sun.dateLabel}` : "Field settings and checklist");
  const m = doc.margin, w = doc.contentWidth;
  if (sun) {
    doc.paragraph(`Sun times (${sun.offsetLabel})`, { size: 9, font: "bold", gap: 2 });
    sun.rows.forEach(([label, value]) => {
      doc.ensureSpace(12);
      doc.text(label, m, doc.y + 8, { size: 7.5 });
      doc.text(value, m + w - textWidth(value, 7.5, "bold"), doc.y + 8, { size: 7.5, font: "bold" });
      doc.y += 11;
    });
    doc.y += 6;
  }
  doc.ensureSpace(30);
  doc.paragraph("Field settings", { size: 9, font: "bold", gap: 2 });
  settingsRows.forEach((r) => {
    doc.ensureSpace(20);
    doc.paragraph(r.situation, { size: 7.5, font: "bold", gap: 0, lineHeight: 1.25 });
    doc.paragraph(`${r.aperture} · ${r.shutter} · ISO ${r.iso}`, { size: 7.5, gap: 3, lineHeight: 1.25, color: MUTED });
  });
  if (gear && gear.length) {
    doc.addPage();
    doc.paragraph("Gear checklist", { size: 9, font: "bold", gap: 4 });
    gear.forEach((g) => {
      doc.ensureSpace(12);
      box(doc, m, doc.y + 1, 7, false);
      doc.text(g, m + 12, doc.y + 7.5, { size: 7.5 });
      doc.y += 11;
    });
  }
  return finish(doc, guideName);
}

/* Several diagrams with notes in one PDF (composition reference). */
export function exportGallery({ title, guideName, paper, items }) {
  const doc = start(title, guideName, paper);
  const m = doc.margin, w = doc.contentWidth;
  const imgW = Math.min(w, 300);
  for (const it of items) {
    const imgH = (imgW * it.image.height) / it.image.width;
    doc.ensureSpace(imgH + 70);
    doc.paragraph(it.title, { size: 12.5, font: "bold", gap: 4 });
    doc.image(it.image.dataUrl, m, doc.y, imgW, imgH, it.image.width, it.image.height);
    doc.y += imgH + 8;
    doc.paragraph(it.text, { size: 10.5, gap: 14 });
  }
  return finish(doc, guideName);
}
