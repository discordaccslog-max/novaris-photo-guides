/*
  Support tool for replacement license codes.

  npm run license -- <product-slug> <order-id>   the code the confirmation page issued for that order
  npm run license -- <product-slug>              a new code for that product (orders without an ID)
  npm run license -- check <code>                validate a code someone sends you
*/
import { generateFromOrder, generateRandom, validate, codeForSlug, PRODUCT_CODES } from "../js/license.js";

const [first, second] = process.argv.slice(2);
const slugs = Object.values(PRODUCT_CODES).map((p) => p.slug);

if (!first) {
  console.log("Usage:\n  npm run license -- <product-slug> [order-id]\n  npm run license -- check <code>\n\nProducts:\n  " + slugs.join("\n  "));
  process.exit(0);
}

if (first === "check") {
  const r = validate(second || "");
  console.log(r.valid ? `Valid: ${r.code} (${r.slug}; unlocks ${r.unlocks.join(", ")})` : `Not valid: ${r.error}`);
  process.exit(r.valid ? 0 : 1);
}

const code = codeForSlug(first);
if (!code) {
  console.error(`Unknown product "${first}". Products:\n  ${slugs.join("\n  ")}`);
  process.exit(1);
}
const license = second ? await generateFromOrder(code, second) : generateRandom(code);
console.log(license);
