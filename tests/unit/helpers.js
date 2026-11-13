import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/* Loads a classic browser script (like js/products.js) and returns its window object. */
export function loadClassicScript(rel) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), context);
  return context.window;
}

/* Extracts the text and link targets of every page of a PDF with pdf.js. */
export async function pdfText(bytes) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), isEvalSupported: false, standardFontDataUrl: path.join(ROOT, "node_modules", "pdfjs-dist", "standard_fonts").split(path.sep).join("/") + "/" }).promise;
  const pages = [];
  const links = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => it.str).join(" "));
    for (const a of await page.getAnnotations()) if (a.url) links.push(a.url);
  }
  return { pages: doc.numPages, text: pages.join("\n"), links };
}
