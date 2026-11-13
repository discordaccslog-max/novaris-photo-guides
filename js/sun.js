/*
  Novaris Photo Guides — sun times (browser and Node).

  Solar position follows the NOAA solar calculator equations. Times are
  found for the sun crossing a given altitude, refined iteratively.
  Golden hour: sun between −4° and +6°. Blue hour: sun between −6° and −4°.
  Sunrise and sunset use −0.833° (refraction and the sun's radius).
*/

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const DAY_MS = 86400000;

export const ALTITUDES = { sunrise: -0.833, goldenHigh: 6, goldenLow: -4, blueLow: -6 };

function solarParams(ms) {
  const jd = ms / DAY_MS + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const L0 = (((280.46646 + T * (36000.76983 + T * 0.0003032)) % 360) + 360) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C =
    Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) +
    Math.sin(3 * M * RAD) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD)) * DEG;
  const y = Math.tan((eps / 2) * RAD) ** 2;
  const eot =
    4 *
    DEG *
    (y * Math.sin(2 * L0 * RAD) -
      2 * e * Math.sin(M * RAD) +
      4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
      0.5 * y * y * Math.sin(4 * L0 * RAD) -
      1.25 * e * e * Math.sin(2 * M * RAD));
  return { decl, eot };
}

/* Sun elevation in degrees (no refraction) at a UTC instant. */
export function sunAltitude(ms, lat, lon) {
  const { decl, eot } = solarParams(ms);
  const d = new Date(ms);
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
  const trueSolar = (((minutes + eot + 4 * lon) % 1440) + 1440) % 1440;
  const hourAngle = trueSolar / 4 < 0 ? trueSolar / 4 + 180 : trueSolar / 4 - 180;
  const cosZenith =
    Math.sin(lat * RAD) * Math.sin(decl * RAD) + Math.cos(lat * RAD) * Math.cos(decl * RAD) * Math.cos(hourAngle * RAD);
  return 90 - Math.acos(Math.max(-1, Math.min(1, cosZenith))) * DEG;
}

function solarNoonMs(dayUtcMs, lon) {
  let noon = dayUtcMs + (720 - 4 * lon) * 60000;
  for (let i = 0; i < 3; i++) {
    const { eot } = solarParams(noon);
    noon = dayUtcMs + (720 - 4 * lon - eot) * 60000;
  }
  return noon;
}

/* Time the sun crosses an altitude on the morning (rising) or evening side of a solar noon. */
function crossing(noonMs, lat, lon, altitude, rising) {
  let t = noonMs;
  for (let i = 0; i < 5; i++) {
    const { decl } = solarParams(t);
    const cosH =
      (Math.sin(altitude * RAD) - Math.sin(lat * RAD) * Math.sin(decl * RAD)) /
      (Math.cos(lat * RAD) * Math.cos(decl * RAD));
    if (cosH > 1) return { ms: null, state: "below" };
    if (cosH < -1) return { ms: null, state: "above" };
    const H = Math.acos(cosH) * DEG;
    const { eot } = solarParams(t);
    const dayStart = Math.floor(noonMs / DAY_MS) * DAY_MS;
    const noon = dayStart + (720 - 4 * lon - eot) * 60000;
    const shifted = noon + (noonMs - noon > DAY_MS / 2 ? DAY_MS : noonMs - noon < -DAY_MS / 2 ? -DAY_MS : 0);
    t = shifted + (rising ? -1 : 1) * H * 4 * 60000;
  }
  return { ms: t, state: "ok" };
}

function azimuthAt(ms, lat, altitude, rising) {
  const { decl } = solarParams(ms);
  const cosA =
    (Math.sin(decl * RAD) - Math.sin(altitude * RAD) * Math.sin(lat * RAD)) /
    (Math.cos(altitude * RAD) * Math.cos(lat * RAD));
  const A = Math.acos(Math.max(-1, Math.min(1, cosA))) * DEG;
  return rising ? A : 360 - A;
}

/*
  Sun times for a local calendar date.
  date: "YYYY-MM-DD"; lat/lon in degrees (east and north positive);
  offsetMinutes: the location's UTC offset in minutes (e.g. −300 for UTC−5).
  Returns UTC milliseconds for each event (or null when the sun doesn't reach that altitude).
*/
export function sunTimes(date, lat, lon, offsetMinutes) {
  const [Y, M, D] = date.split("-").map(Number);
  const dayUtc = Date.UTC(Y, M - 1, D);
  // Choose the solar noon that falls on the requested local date.
  let noon = null;
  for (const shift of [0, -1, 1]) {
    const candidate = solarNoonMs(dayUtc + shift * DAY_MS, lon);
    const local = new Date(candidate + offsetMinutes * 60000);
    if (local.getUTCFullYear() === Y && local.getUTCMonth() === M - 1 && local.getUTCDate() === D) {
      noon = candidate;
      break;
    }
  }
  if (noon === null) noon = solarNoonMs(dayUtc, lon);

  const at = (alt, rising) => crossing(noon, lat, lon, alt, rising);
  const sunrise = at(ALTITUDES.sunrise, true);
  const sunset = at(ALTITUDES.sunrise, false);
  const g6r = at(ALTITUDES.goldenHigh, true);
  const g6s = at(ALTITUDES.goldenHigh, false);
  const g4r = at(ALTITUDES.goldenLow, true);
  const g4s = at(ALTITUDES.goldenLow, false);
  const b6r = at(ALTITUDES.blueLow, true);
  const b6s = at(ALTITUDES.blueLow, false);

  let polar = null;
  if (sunrise.state === "above") polar = "sun-up-all-day";
  if (sunrise.state === "below") polar = "sun-down-all-day";

  return {
    date,
    lat,
    lon,
    offsetMinutes,
    polar,
    solarNoon: noon,
    sunrise: sunrise.ms,
    sunset: sunset.ms,
    morningBlue: { start: b6r.ms, end: g4r.ms },
    morningGolden: { start: g4r.ms, end: g6r.ms },
    eveningGolden: { start: g6s.ms, end: g4s.ms },
    eveningBlue: { start: g4s.ms, end: b6s.ms },
    sunriseAzimuth: sunrise.ms ? azimuthAt(sunrise.ms, lat, ALTITUDES.sunrise, true) : null,
    sunsetAzimuth: sunset.ms ? azimuthAt(sunset.ms, lat, ALTITUDES.sunrise, false) : null,
    noonAltitude: sunAltitude(noon, lat, lon)
  };
}

/* "HH:MM" at a UTC offset. */
export function formatTime(ms, offsetMinutes) {
  if (ms === null || ms === undefined) return "—";
  const d = new Date(ms + offsetMinutes * 60000);
  return String(d.getUTCHours()).padStart(2, "0") + ":" + String(d.getUTCMinutes()).padStart(2, "0");
}

export function formatOffset(offsetMinutes) {
  const sign = offsetMinutes < 0 ? "−" : "+";
  const abs = Math.abs(offsetMinutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export function compassPoint(deg) {
  const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return points[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}
