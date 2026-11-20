import test from "node:test";
import assert from "node:assert/strict";
import {
  ALPHABET, PREFIX, PRODUCT_CODES, validate, normalize, generateRandom, generateFromOrder,
  orderIdFromSearch, codeForSlug
} from "../../js/license.js";
import { loadClassicScript } from "./helpers.js";

const CODES = Object.keys(PRODUCT_CODES);

test("alphabet has no confusable characters", () => {
  for (const ch of "01ILO") assert.equal(ALPHABET.includes(ch), false, ch);
  assert.equal(new Set(ALPHABET).size, ALPHABET.length);
  assert.equal(ALPHABET.length, 31);
});

test("generated codes have the expected shape and validate", () => {
  for (const pc of CODES) {
    for (let i = 0; i < 50; i++) {
      const code = generateRandom(pc);
      assert.match(code, /^NOVA-[2-9A-Z]{2}-[2-9A-Z]{4}-[2-9A-Z]{4}-[2-9A-Z]{4}$/);
      const r = validate(code);
      assert.equal(r.valid, true, code);
      assert.equal(r.productCode, pc);
      assert.equal(r.code, code);
    }
  }
});

test("the random section is at least 8 characters", () => {
  const code = generateRandom("PT").replace(/-/g, "");
  // NOVA + 2-character product code + random section + 2 check characters
  assert.ok(code.length - 4 - 2 - 2 >= 8);
});

test("entry ignores case, spaces, and dashes", () => {
  const code = generateRandom("PT");
  const variants = [
    code.toLowerCase(),
    code.replace(/-/g, ""),
    code.replace(/-/g, " "),
    "  " + code.replace(/-/g, " - ") + " ",
    code.replace(/-/g, "").toLowerCase().split("").join(" ")
  ];
  for (const v of variants) {
    const r = validate(v);
    assert.equal(r.valid, true, v);
    assert.equal(r.code, code);
  }
});

function allSingleErrors(compact) {
  const out = [];
  const pool = ALPHABET + "01ILO";
  for (let i = 0; i < compact.length; i++) {
    for (const ch of pool) if (ch !== compact[i]) out.push(compact.slice(0, i) + ch + compact.slice(i + 1));
  }
  return out;
}

function allAdjacentSwaps(compact) {
  const out = [];
  for (let i = 0; i < compact.length - 1; i++) {
    if (compact[i] === compact[i + 1]) continue;
    out.push(compact.slice(0, i) + compact[i + 1] + compact[i] + compact.slice(i + 2));
  }
  return out;
}

test("every single-character error is rejected", () => {
  let checked = 0;
  for (const pc of CODES) {
    for (let n = 0; n < 40; n++) {
      const compact = generateRandom(pc).replace(/-/g, "");
      for (const bad of allSingleErrors(compact)) {
        assert.equal(validate(bad).valid, false, `accepted ${bad} (from ${compact})`);
        checked++;
      }
    }
  }
  assert.ok(checked > 100000, `checked ${checked}`);
});

test("every swap of two adjacent characters is rejected", () => {
  let checked = 0;
  for (const pc of CODES) {
    for (let n = 0; n < 200; n++) {
      const compact = generateRandom(pc).replace(/-/g, "");
      for (const bad of allAdjacentSwaps(compact)) {
        assert.equal(validate(bad).valid, false, `accepted ${bad} (from ${compact})`);
        checked++;
      }
    }
  }
  assert.ok(checked > 10000, `checked ${checked}`);
});

test("helpful errors for empty, wrong length, wrong prefix, and confusable characters", () => {
  assert.match(validate("").error, /Enter/);
  assert.match(validate("NOVA-PT-ABCD").error, /wrong length/);
  const compact = generateRandom("WD").replace(/-/g, "");
  assert.match(validate("N0VA" + compact.slice(4)).error, /start with NOVA/);
  assert.match(validate(compact.slice(0, 7) + "0" + compact.slice(8)).error, /never use 0, O, 1, I or L/);
});

test("the same order reference always produces the same code", async () => {
  for (const pc of CODES) {
    const a = await generateFromOrder(pc, "cs_live_a1B2c3D4e5");
    const b = await generateFromOrder(pc, "cs_live_a1B2c3D4e5");
    const c = await generateFromOrder(pc, "  cs_live_a1B2c3D4e5 ");
    const other = await generateFromOrder(pc, "cs_live_a1B2c3D4e6");
    assert.equal(a, b);
    assert.equal(a, c);
    assert.notEqual(a, other);
    assert.equal(validate(a).valid, true);
    assert.equal(validate(a).productCode, pc);
  }
  assert.notEqual(await generateFromOrder("PT", "order-1"), await generateFromOrder("WD", "order-1"));
});

test("order references are read from provider query parameters", () => {
  assert.equal(orderIdFromSearch("?session_id=cs_123"), "cs_123");
  assert.equal(orderIdFromSearch("?order_id=9"), "9");
  assert.equal(orderIdFromSearch("?order=A-1"), "A-1");
  assert.equal(orderIdFromSearch("?transaction_id=T1"), "T1");
  assert.equal(orderIdFromSearch("?txn_id=X"), "X");
  assert.equal(orderIdFromSearch("?token=tok"), "tok");
  assert.equal(orderIdFromSearch("?utm_source=a"), null);
  assert.equal(orderIdFromSearch("?session_id={CHECKOUT_SESSION_ID}"), null);
  assert.equal(orderIdFromSearch(""), null);
});

test("a Complete Reference Library code unlocks all five guides", () => {
  const r = validate(generateRandom("CR"));
  assert.equal(r.valid, true);
  assert.deepEqual(r.unlocks.sort(), [
    "event-coverage-guide", "landscape-travel-field-guide", "portrait-session-guide",
    "product-photography-guide", "wedding-day-guide"
  ]);
  for (const pc of ["PT", "WD", "PD", "FD", "EV"]) {
    const single = validate(generateRandom(pc));
    assert.deepEqual(single.unlocks, [PRODUCT_CODES[pc].slug]);
  }
});

test("js/products.js matches the license system and fixed prices", () => {
  const ALL = loadClassicScript("js/products.js").NOVARIS_PRODUCTS;
  assert.equal(ALL.length, 31);
  const NOVARIS_PRODUCTS = ALL.filter((p) => p.format !== "pdf");
  assert.equal(NOVARIS_PRODUCTS.length, 6);
  for (const p of NOVARIS_PRODUCTS) {
    assert.equal(codeForSlug(p.slug), p.productCode, p.slug);
    assert.equal(p.confirmationPath, `/thank-you/${p.slug}/`);
    assert.equal(typeof p.checkoutUrl, "string");
    assert.equal(p.currency, "USD");
  }
  const prices = Object.fromEntries(NOVARIS_PRODUCTS.map((p) => [p.slug, p.price]));
  assert.deepEqual(prices, {
    "portrait-session-guide": 34, "wedding-day-guide": 52, "product-photography-guide": 39,
    "landscape-travel-field-guide": 29, "event-coverage-guide": 44, "complete-reference-library": 119
  });
});

test("js/products.js PDF guides have prices and add-ons in range", () => {
  const pdfs = loadClassicScript("js/products.js").NOVARIS_PRODUCTS.filter((p) => p.format === "pdf");
  assert.equal(pdfs.length, 25);
  assert.equal(new Set(pdfs.map((p) => p.slug)).size, 25);
  for (const p of pdfs) {
    assert.ok(p.price >= 20 && p.price <= 145, p.slug);
    assert.ok(["portraits", "weddings", "commercial", "outdoors", "events"].includes(p.category), p.slug);
    assert.ok(p.options.length >= 3 && p.options.length <= 4, p.slug);
    assert.equal(p.checkoutUrl, "");
    for (const o of p.options) {
      assert.match(o.id, /^[a-z0-9-]+$/);
      assert.ok(o.price >= 1 && o.price <= 5, o.id);
    }
  }
});

test("site config holds the support email", () => {
  const { NOVARIS_SITE } = loadClassicScript("js/site-config.js");
  assert.equal(NOVARIS_SITE.supportEmail, "buckenovaris@novarisguides.com");
});

test("normalize strips the prefix and separators", () => {
  assert.equal(normalize("nova-pt-abcd"), "PTABCD");
  assert.equal(PREFIX, "NOVA");
});
