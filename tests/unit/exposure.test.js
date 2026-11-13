import test from "node:test";
import assert from "node:assert/strict";
import { solve, ev100, nearestStandard, formatShutter, formatAperture } from "../../js/exposure.js";

const base = { aperture: 8, shutter: 1 / 125, iso: 100 };

test("opening the aperture one stop halves the shutter time", () => {
  const r = solve(base, { aperture: 5.6, iso: 100 }, "shutter");
  assert.equal(r.nearestLabel, "1/250");
  assert.ok(Math.abs(r.offsetStops) < 0.05);
});

test("raising ISO two stops shortens the shutter by two stops", () => {
  const r = solve(base, { aperture: 8, iso: 400 }, "shutter");
  assert.equal(r.nearestLabel, "1/500");
});

test("solving for aperture", () => {
  const r = solve(base, { shutter: 1 / 30, iso: 100 }, "aperture");
  assert.equal(r.nearestLabel, "f/16");
});

test("solving for ISO", () => {
  const r = solve(base, { aperture: 8, shutter: 1 / 500 }, "iso");
  assert.equal(r.nearestLabel, "ISO 400");
  assert.ok(Math.abs(r.exact - 400) < 1);
});

test("a 10-stop ND filter turns 1/125 into about 8 seconds", () => {
  const r = solve(base, { aperture: 8, iso: 100, nd: 10 }, "shutter");
  assert.ok(Math.abs(r.exact - 1024 / 125) < 1e-9);
  assert.equal(r.nearestLabel, "8 s");
});

test("very long exposures are shown in minutes and flagged as beyond standard speeds", () => {
  const r = solve({ aperture: 8, shutter: 1, iso: 100 }, { aperture: 8, iso: 100, nd: 10 }, "shutter");
  assert.equal(r.exactLabel, "17 min 4 s");
  assert.equal(r.inStandardRange, false);
});

test("EV100 of f/8, 1/125, ISO 100 is about 13", () => {
  assert.ok(Math.abs(ev100(base) - 12.97) < 0.01);
});

test("nearest standard values and formatting", () => {
  assert.equal(nearestStandard("aperture", 5.5).value, 5.6);
  assert.equal(formatAperture(5.6), "f/5.6");
  assert.equal(formatShutter(1 / 60), "1/60");
  assert.equal(formatShutter(0.5), "0.5 s");
  assert.equal(formatShutter(25), "25 s");
});
