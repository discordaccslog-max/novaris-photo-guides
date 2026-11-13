/*
  Novaris Photo Guides — license codes (runs in the browser and in Node).

  Format:  NOVA-PT-ABCD-EFGH-JKMN
           prefix, product code, then 10 random characters and 2 check characters.

  Characters come from a 31-symbol alphabet with no 0/O or 1/I/L.
  Two weighted checksums modulo 31 (a prime) guarantee that every
  single-character error and every swap of two adjacent characters
  is rejected; a random string passes only about 1 time in 961.
*/

export const PREFIX = "NOVA";
export const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const MOD = ALPHABET.length; // 31
const RANDOM_LENGTH = 10;
const BODY_LENGTH = 2 + RANDOM_LENGTH; // product code + random
const FULL_LENGTH = BODY_LENGTH + 2; // + two check characters

/* Product codes and the guides each one unlocks. */
export const PRODUCT_CODES = {
  PT: { slug: "portrait-session-guide", unlocks: ["portrait-session-guide"] },
  WD: { slug: "wedding-day-guide", unlocks: ["wedding-day-guide"] },
  PD: { slug: "product-photography-guide", unlocks: ["product-photography-guide"] },
  FD: { slug: "landscape-travel-field-guide", unlocks: ["landscape-travel-field-guide"] },
  EV: { slug: "event-coverage-guide", unlocks: ["event-coverage-guide"] },
  CR: {
    slug: "complete-reference-library",
    unlocks: [
      "portrait-session-guide",
      "wedding-day-guide",
      "product-photography-guide",
      "landscape-travel-field-guide",
      "event-coverage-guide"
    ]
  }
};

export function codeForSlug(slug) {
  for (const code of Object.keys(PRODUCT_CODES)) {
    if (PRODUCT_CODES[code].slug === slug) return code;
  }
  return null;
}

const valueOf = (ch) => ALPHABET.indexOf(ch);
const weight1 = (i) => i + 1; // 1..13
const weight2 = (i) => ((i + 1) * (i + 1)) % MOD; // distinct, non-zero for 1..14

function inverse(n) {
  n = ((n % MOD) + MOD) % MOD;
  for (let x = 1; x < MOD; x++) if ((n * x) % MOD === 1) return x;
  throw new Error("No inverse");
}

/* Returns the two check characters for a 12-character body. */
export function checkCharacters(body) {
  let s1 = 0;
  for (let i = 0; i < BODY_LENGTH; i++) s1 += weight1(i) * valueOf(body[i]);
  const c1 = (((-s1 * inverse(weight1(BODY_LENGTH))) % MOD) + MOD) % MOD;
  const withC1 = body + ALPHABET[c1];
  let s2 = 0;
  for (let i = 0; i < withC1.length; i++) s2 += weight2(i) * valueOf(withC1[i]);
  const c2 = (((-s2 * inverse(weight2(BODY_LENGTH + 1))) % MOD) + MOD) % MOD;
  return ALPHABET[c1] + ALPHABET[c2];
}

function checksumsHold(full) {
  let s1 = 0;
  for (let i = 0; i <= BODY_LENGTH; i++) s1 += weight1(i) * valueOf(full[i]);
  let s2 = 0;
  for (let i = 0; i < FULL_LENGTH; i++) s2 += weight2(i) * valueOf(full[i]);
  return s1 % MOD === 0 && s2 % MOD === 0;
}

/* Formats the 14 characters after the prefix as NOVA-XX-XXXX-XXXX-XXXX. */
export function format(full) {
  return [PREFIX, full.slice(0, 2), full.slice(2, 6), full.slice(6, 10), full.slice(10, 14)].join("-");
}

/*
  Normalizes what a person typed: ignores case, spaces, dashes and other
  separators, and accepts the code with or without the NOVA prefix.
*/
export function normalize(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  let rest = raw;
  if (rest.startsWith(PREFIX)) rest = rest.slice(PREFIX.length);
  return rest;
}

export function validate(input) {
  const raw = String(input || "").trim();
  if (!raw) return { valid: false, error: "Enter your license code." };
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length === PREFIX.length + FULL_LENGTH && !compact.startsWith(PREFIX)) {
    return { valid: false, error: "License codes start with NOVA (with the letter O). Check the first four characters." };
  }
  const rest = normalize(raw);
  const bad = [...rest].filter((ch) => !ALPHABET.includes(ch));
  if (bad.length) {
    const confusable = bad.some((ch) => "01ILO".includes(ch));
    return {
      valid: false,
      error: confusable
        ? "License codes never use 0, O, 1, I or L. Check the characters and try again."
        : "That code contains characters that aren't used in license codes."
    };
  }
  if (rest.length !== FULL_LENGTH) {
    return { valid: false, error: "That code is the wrong length. Codes look like NOVA-XX-XXXX-XXXX-XXXX." };
  }
  const productCode = rest.slice(0, 2);
  const product = PRODUCT_CODES[productCode];
  if (!product || !checksumsHold(rest)) {
    return { valid: false, error: "That code isn't valid. Check for a mistyped or swapped character." };
  }
  return {
    valid: true,
    code: format(rest),
    productCode,
    slug: product.slug,
    unlocks: product.unlocks.slice()
  };
}

function randomBytes(n) {
  const bytes = new Uint8Array(n);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

/* Maps bytes to alphabet characters without bias (rejection sampling). */
function charsFromBytes(bytes, count, out = []) {
  const limit = MOD * Math.floor(256 / MOD); // 248
  for (const b of bytes) {
    if (out.length >= count) break;
    if (b < limit) out.push(ALPHABET[b % MOD]);
  }
  return out;
}

function assemble(productCode, randomChars) {
  if (!PRODUCT_CODES[productCode]) throw new Error("Unknown product code: " + productCode);
  const body = productCode + randomChars.join("");
  return format(body + checkCharacters(body));
}

/* A new random code for a product. */
export function generateRandom(productCode) {
  const chars = [];
  while (chars.length < RANDOM_LENGTH) charsFromBytes(randomBytes(32), RANDOM_LENGTH, chars);
  return assemble(productCode, chars);
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  return new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", data));
}

/* The same order reference always produces the same code for a product. */
export async function generateFromOrder(productCode, orderId) {
  const ref = String(orderId).trim();
  if (!ref) throw new Error("Missing order reference");
  const chars = [];
  let round = 0;
  while (chars.length < RANDOM_LENGTH) {
    charsFromBytes(await sha256(`novaris:${productCode}:${ref}:${round}`), RANDOM_LENGTH, chars);
    round++;
  }
  return assemble(productCode, chars);
}

/* Query-string keys that payment providers use for an order or session ID. */
export const ORDER_PARAMS = ["session_id", "order_id", "order", "transaction_id", "txn_id", "token"];

export function orderIdFromSearch(search) {
  const params = new URLSearchParams(search || "");
  for (const key of ORDER_PARAMS) {
    const value = params.get(key);
    if (value && value.trim() && !/^\{.*\}$/.test(value.trim())) return value.trim().slice(0, 200);
  }
  return null;
}
