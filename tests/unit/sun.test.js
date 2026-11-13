import test from "node:test";
import assert from "node:assert/strict";
import { sunTimes, formatTime, formatOffset } from "../../js/sun.js";

// Reference times from published almanac tables (local clock time), checked to within 3 minutes.
const CASES = [
  { name: "New York, June", date: "2024-06-20", lat: 40.7128, lon: -74.006, off: -240, rise: "05:25", set: "20:31" },
  { name: "New York, December", date: "2024-12-21", lat: 40.7128, lon: -74.006, off: -300, rise: "07:16", set: "16:32" },
  { name: "London, June", date: "2024-06-21", lat: 51.5074, lon: -0.1278, off: 60, rise: "04:43", set: "21:21" },
  { name: "London, December", date: "2024-12-21", lat: 51.5074, lon: -0.1278, off: 0, rise: "08:04", set: "15:53" },
  { name: "Sydney, December", date: "2024-12-21", lat: -33.8688, lon: 151.2093, off: 660, rise: "05:41", set: "20:05" },
  { name: "Honolulu, March", date: "2024-03-20", lat: 21.3069, lon: -157.8583, off: -600, rise: "06:35", set: "18:42" }
];

const minutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

for (const c of CASES) {
  test(`sunrise and sunset: ${c.name}`, () => {
    const s = sunTimes(c.date, c.lat, c.lon, c.off);
    assert.equal(s.polar, null);
    assert.ok(Math.abs(minutes(formatTime(s.sunrise, c.off)) - minutes(c.rise)) <= 3, `rise ${formatTime(s.sunrise, c.off)} vs ${c.rise}`);
    assert.ok(Math.abs(minutes(formatTime(s.sunset, c.off)) - minutes(c.set)) <= 3, `set ${formatTime(s.sunset, c.off)} vs ${c.set}`);
  });
}

test("golden and blue hours are in the right order around sunrise and sunset", () => {
  const s = sunTimes("2024-09-15", 47.6062, -122.3321, -420);
  assert.ok(s.morningBlue.start < s.morningBlue.end);
  assert.equal(s.morningBlue.end, s.morningGolden.start);
  assert.ok(s.morningGolden.start < s.sunrise && s.sunrise < s.morningGolden.end);
  assert.ok(s.eveningGolden.start < s.sunset && s.sunset < s.eveningGolden.end);
  assert.equal(s.eveningGolden.end, s.eveningBlue.start);
  assert.ok(s.eveningBlue.start < s.eveningBlue.end);
  assert.ok(s.sunriseAzimuth > 60 && s.sunriseAzimuth < 120);
  assert.ok(s.sunsetAzimuth > 240 && s.sunsetAzimuth < 300);
});

test("midnight sun and polar night are reported", () => {
  assert.equal(sunTimes("2024-06-21", 69.6492, 18.9553, 120).polar, "sun-up-all-day");
  assert.equal(sunTimes("2024-12-21", 69.6492, 18.9553, 60).polar, "sun-down-all-day");
});

test("results fall on the requested local date across the date line", () => {
  const s = sunTimes("2024-12-21", -36.8485, 174.7633, 780); // Auckland
  const local = new Date(s.sunrise + 780 * 60000);
  assert.equal(local.getUTCDate(), 21);
});

test("offset formatting", () => {
  assert.equal(formatOffset(-300), "UTC−05:00");
  assert.equal(formatOffset(330), "UTC+05:30");
});
