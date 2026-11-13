/*
  Novaris Photo Guides — a small PDF writer (browser and Node, no dependencies).

  Supports text in the standard Helvetica, Helvetica-Bold and Courier-Bold
  fonts (WinAnsi encoding), word wrapping, lines, rectangles, JPEG images,
  web links, and US Letter or A4 pages. Coordinates are in points, measured
  from the top-left corner of the page.
*/

export const PAGE_SIZES = {
  letter: { width: 612, height: 792, label: "US Letter" },
  a4: { width: 595.28, height: 841.89, label: "A4" },
  pocket: { width: 288, height: 432, label: "4 × 6 in" }
};

// Glyph widths (1/1000 em) for character codes 32–126.
const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const HELV_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

// Unicode characters outside ASCII that WinAnsi can show, with widths [regular, bold].
const EXTRA = {
  "•": [149, 350, 350], "–": [150, 556, 556], "—": [151, 1000, 1000],
  "‘": [145, 222, 278], "’": [146, 222, 278], "“": [147, 333, 500], "”": [148, 333, 500],
  "…": [133, 1000, 1000], "×": [215, 584, 584], "·": [183, 278, 278], "©": [169, 737, 737],
  "°": [176, 400, 400], "é": [233, 556, 556], "è": [232, 556, 556], "à": [224, 556, 556],
  "ü": [252, 556, 611], "ö": [246, 556, 611], "ä": [228, 556, 556], "ñ": [241, 556, 611],
  " ": [32, 278, 278], "−": [45, 333, 333], "→": [62, 584, 584], "↑": [94, 469, 584]
};

const FONTS = {
  regular: { key: "F1", base: "Helvetica" },
  bold: { key: "F2", base: "Helvetica-Bold" },
  mono: { key: "F3", base: "Courier-Bold" }
};

function charInfo(ch, font) {
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) {
    const w = font === "mono" ? 600 : (font === "bold" ? HELV_BOLD : HELV)[code - 32];
    return { byte: code, width: w };
  }
  const extra = EXTRA[ch];
  if (extra) return { byte: extra[0], width: font === "mono" ? 600 : font === "bold" ? extra[2] : extra[1] };
  return { byte: 63, width: font === "mono" ? 600 : 556 }; // "?"
}

export function textWidth(str, size, font = "regular") {
  let w = 0;
  for (const ch of String(str)) w += charInfo(ch, font).width;
  return (w * size) / 1000;
}

function encodeText(str, font) {
  let out = "";
  for (const ch of String(str)) {
    const b = charInfo(ch, font).byte;
    if (b === 40 || b === 41 || b === 92) out += "\\" + String.fromCharCode(b);
    else out += String.fromCharCode(b);
  }
  return out;
}

const num = (n) => (Math.round(n * 100) / 100).toString();
const rgb = (c) => c.map((v) => num(v / 255)).join(" ");

export function wrapText(str, width, size, font = "regular") {
  const lines = [];
  for (const paragraph of String(str).split(/\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(""); continue; }
    let line = "";
    for (const word of words) {
      const candidate = line ? line + " " + word : word;
      if (textWidth(candidate, size, font) <= width || !line) {
        if (!line && textWidth(word, size, font) > width) {
          // Break a single very long word.
          let part = "";
          for (const ch of word) {
            if (textWidth(part + ch, size, font) > width && part) { lines.push(part); part = ""; }
            part += ch;
          }
          line = part;
        } else {
          line = candidate;
        }
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

function base64ToBytes(b64) {
  if (typeof atob === "function") {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

export class PdfDoc {
  constructor({ size = "letter", title = "Document", margin = 54 } = {}) {
    this.size = PAGE_SIZES[size] || PAGE_SIZES.letter;
    this.title = title;
    this.margin = margin;
    this.pages = [];
    this.images = [];
    this.y = margin;
    this.addPage();
  }

  get width() { return this.size.width; }
  get height() { return this.size.height; }
  get contentWidth() { return this.size.width - this.margin * 2; }

  addPage() {
    this.page = { ops: [], links: [], images: new Set() };
    this.pages.push(this.page);
    this.y = this.margin;
    return this;
  }

  ensureSpace(h) {
    if (this.y + h > this.height - this.margin) this.addPage();
  }

  text(str, x, y, { size = 11, font = "regular", color = [31, 29, 26] } = {}) {
    const f = FONTS[font] || FONTS.regular;
    this.page.ops.push(`BT /${f.key} ${num(size)} Tf ${rgb(color)} rg ${num(x)} ${num(this.height - y)} Td (${encodeText(str, font)}) Tj ET`);
    return this;
  }

  /* Wrapped text at the cursor; moves the cursor down and breaks pages as needed. */
  paragraph(str, { size = 11, font = "regular", color, lineHeight = 1.4, x = this.margin, width = this.contentWidth, gap = 6 } = {}) {
    const lh = size * lineHeight;
    for (const line of wrapText(str, width, size, font)) {
      this.ensureSpace(lh);
      this.text(line, x, this.y + size, { size, font, color });
      this.y += lh;
    }
    this.y += gap;
    return this;
  }

  line(x1, y1, x2, y2, { width = 0.75, color = [120, 112, 100], dash = null } = {}) {
    const d = dash ? `[${dash.join(" ")}] 0 d ` : "[] 0 d ";
    this.page.ops.push(`${d}${num(width)} w ${rgb(color)} RG ${num(x1)} ${num(this.height - y1)} m ${num(x2)} ${num(this.height - y2)} l S`);
    return this;
  }

  rect(x, y, w, h, { stroke = [120, 112, 100], fill = null, width = 0.75 } = {}) {
    const parts = [`[] 0 d ${num(width)} w`];
    if (stroke) parts.push(`${rgb(stroke)} RG`);
    if (fill) parts.push(`${rgb(fill)} rg`);
    parts.push(`${num(x)} ${num(this.height - y - h)} ${num(w)} ${num(h)} re`);
    parts.push(fill && stroke ? "B" : fill ? "f" : "S");
    this.page.ops.push(parts.join(" "));
    return this;
  }

  /* jpeg: Uint8Array of a baseline JPEG, or a data:image/jpeg;base64 URL. */
  image(jpeg, x, y, w, h, pixelWidth, pixelHeight) {
    const bytes = typeof jpeg === "string" ? base64ToBytes(jpeg.replace(/^data:image\/jpeg;base64,/, "")) : jpeg;
    const id = this.images.length;
    this.images.push({ bytes, pixelWidth, pixelHeight });
    this.page.images.add(id);
    this.page.ops.push(`q ${num(w)} 0 0 ${num(h)} ${num(x)} ${num(this.height - y - h)} cm /Im${id} Do Q`);
    return this;
  }

  link(x, y, w, h, url) {
    this.page.links.push({ x, y, w, h, url });
    return this;
  }

  output() {
    const chunks = [];
    const offsets = [];
    let length = 0;
    const push = (data) => {
      const bytes = typeof data === "string" ? latin1(data) : data;
      chunks.push(bytes);
      length += bytes.length;
    };
    const latin1 = (s) => {
      const b = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255;
      return b;
    };

    // Object numbering: 1 catalog, 2 pages, 3–5 fonts, 6 info, then images, then pages/contents/annotations.
    let next = 7;
    const imageIds = this.images.map(() => next++);
    const pageObjs = this.pages.map((p) => ({ page: next++, content: next++, annots: p.links.map(() => next++) }));
    const total = next;

    const obj = (n, body) => {
      offsets[n] = length;
      push(`${n} 0 obj\n`);
      if (typeof body === "string") push(body); else body();
      push("\nendobj\n");
    };

    push("%PDF-1.4\n%âãÏÓ\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, `<< /Type /Pages /Count ${this.pages.length} /Kids [${pageObjs.map((p) => p.page + " 0 R").join(" ")}] >>`);
    obj(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    obj(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    obj(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>");
    const date = new Date();
    const pdfDate = "D:" + date.toISOString().replace(/[-:T]/g, "").slice(0, 14) + "Z";
    obj(6, `<< /Title (${encodeText(this.title, "regular")}) /Producer (Novaris Photo Guides) /CreationDate (${pdfDate}) >>`);

    this.images.forEach((img, i) => {
      obj(imageIds[i], () => {
        push(`<< /Type /XObject /Subtype /Image /Width ${img.pixelWidth} /Height ${img.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`);
        push(img.bytes);
        push("\nendstream");
      });
    });

    this.pages.forEach((p, i) => {
      const ids = pageObjs[i];
      const xobjects = [...p.images].map((id) => `/Im${id} ${imageIds[id]} 0 R`).join(" ");
      const resources = `<< /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >>${xobjects ? ` /XObject << ${xobjects} >>` : ""} >>`;
      const annots = ids.annots.length ? ` /Annots [${ids.annots.map((a) => a + " 0 R").join(" ")}]` : "";
      obj(ids.page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(this.width)} ${num(this.height)}] /Resources ${resources} /Contents ${ids.content} 0 R${annots} >>`);
      const content = p.ops.join("\n");
      obj(ids.content, () => {
        const bytes = latin1(content);
        push(`<< /Length ${bytes.length} >>\nstream\n`);
        push(bytes);
        push("\nendstream");
      });
      p.links.forEach((l, k) => {
        const rect = [l.x, this.height - l.y - l.h, l.x + l.w, this.height - l.y].map(num).join(" ");
        obj(ids.annots[k], `<< /Type /Annot /Subtype /Link /Rect [${rect}] /Border [0 0 0] /A << /S /URI /URI (${encodeText(l.url, "regular")}) >> >>`);
      });
    });

    const xref = length;
    let table = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let n = 1; n < total; n++) table += String(offsets[n]).padStart(10, "0") + " 00000 n \n";
    push(table);
    push(`trailer\n<< /Size ${total} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

    const out = new Uint8Array(length);
    let pos = 0;
    for (const c of chunks) { out.set(c, pos); pos += c.length; }
    return out;
  }
}

/* Triggers a file download in the browser. */
export function downloadBytes(bytes, filename, type = "application/pdf") {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
