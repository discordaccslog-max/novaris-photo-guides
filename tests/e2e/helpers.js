import fs from "node:fs";
import { generateRandom, generateFromOrder } from "../../js/license.js";
import { pdfText } from "../unit/helpers.js";

export { generateRandom, generateFromOrder, pdfText };

export const PRODUCTS = [
  ["portrait-session-guide", "PT", "Portrait Session Guide"],
  ["wedding-day-guide", "WD", "Wedding Day Guide"],
  ["product-photography-guide", "PD", "Product Photography Guide"],
  ["landscape-travel-field-guide", "FD", "Landscape & Travel Field Guide"],
  ["event-coverage-guide", "EV", "Event Coverage Guide"],
  ["complete-reference-library", "CR", "Complete Reference Library"]
];
export const GUIDES = PRODUCTS.filter(([, c]) => c !== "CR");

/* Opens the Field Kit with licenses (and optional settings) already saved. */
export async function openKitWith(page, codes, hash = "#/", settings = { walkthroughDone: true, installDismissed: true }) {
  await page.goto("/field-kit/");
  await page.evaluate(([codes, settings]) => {
    const map = { PT: "portrait-session-guide", WD: "wedding-day-guide", PD: "product-photography-guide", FD: "landscape-travel-field-guide", EV: "event-coverage-guide", CR: "complete-reference-library" };
    localStorage.setItem("nfk.licenses", JSON.stringify(codes.map((code) => ({ code, productCode: code.slice(5, 7), slug: map[code.slice(5, 7)], activatedAt: new Date().toISOString(), source: "entered" }))));
    localStorage.setItem("nfk.settings", JSON.stringify(settings));
  }, [codes, settings]);
  await page.goto("/field-kit/" + hash);
}

export async function downloadBytes(page, click) {
  const [download] = await Promise.all([page.waitForEvent("download"), click()]);
  const file = await download.path();
  return { name: download.suggestedFilename(), bytes: fs.readFileSync(file) };
}
