/*
  Novaris Photo Guides — exposure math (browser and Node).

  Equivalent exposures keep  t × ISO / N² × 2^(−ND stops)  constant,
  where N is the f-number and t the shutter time in seconds.
*/

export const APERTURES = [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32];

export const SHUTTERS = [
  1 / 8000, 1 / 6400, 1 / 5000, 1 / 4000, 1 / 3200, 1 / 2500, 1 / 2000, 1 / 1600, 1 / 1250, 1 / 1000,
  1 / 800, 1 / 640, 1 / 500, 1 / 400, 1 / 320, 1 / 250, 1 / 200, 1 / 160, 1 / 125, 1 / 100,
  1 / 80, 1 / 60, 1 / 50, 1 / 40, 1 / 30, 1 / 25, 1 / 20, 1 / 15, 1 / 13, 1 / 10,
  1 / 8, 1 / 6, 1 / 5, 1 / 4, 0.3, 0.4, 0.5, 0.6, 0.8, 1,
  1.3, 1.6, 2, 2.5, 3.2, 4, 5, 6, 8, 10, 13, 15, 20, 25, 30
];

export const ISOS = [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 51200, 102400];

const log2 = Math.log2;

/* Exposure value at ISO 100 for a set of settings. */
export function ev100({ aperture, shutter, iso, nd = 0 }) {
  return log2((aperture * aperture) / shutter) - log2(iso / 100) + nd;
}

export function formatAperture(n) {
  const r = Math.round(n * 10) / 10;
  return "f/" + (Number.isInteger(r) ? r.toFixed(0) : r.toFixed(1));
}

export function formatShutter(t) {
  if (t >= 60) {
    const total = Math.round(t);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return s ? `${m} min ${s} s` : `${m} min`;
  }
  if (t >= 0.3) {
    const r = t >= 10 ? Math.round(t) : Math.round(t * 10) / 10;
    return `${r} s`;
  }
  return "1/" + Math.round(1 / t);
}

export function formatIso(s) {
  return "ISO " + Math.round(s);
}

export const formatters = { aperture: formatAperture, shutter: formatShutter, iso: formatIso };

/* Nearest value from a list of standard settings, compared in stops. */
export function nearestStandard(kind, value) {
  const list = kind === "aperture" ? APERTURES : kind === "shutter" ? SHUTTERS : ISOS;
  const toStops = (v) => (kind === "aperture" ? 2 * log2(v) : log2(v));
  let best = null;
  for (const candidate of list) {
    const diff = toStops(value) - toStops(candidate);
    if (!best || Math.abs(diff) < Math.abs(best.diff)) best = { value: candidate, diff };
  }
  const inRange = Math.abs(best.diff) <= 1 / 6 + 1e-9;
  return { value: best.value, offsetStops: best.diff, inRange };
}

/*
  Solves for one setting so the new exposure matches the metered one.
  base:   { aperture, shutter, iso }       metered settings (no filter)
  next:   { aperture, shutter, iso, nd }  new settings; the one being solved is ignored
  solveFor: "aperture" | "shutter" | "iso"
*/
export function solve(base, next, solveFor) {
  const nd = Number(next.nd) || 0;
  const filter = Math.pow(2, nd);
  const N1 = base.aperture, t1 = base.shutter, S1 = base.iso;
  let exact;
  if (solveFor === "shutter") {
    exact = t1 * (S1 / next.iso) * ((next.aperture * next.aperture) / (N1 * N1)) * filter;
  } else if (solveFor === "aperture") {
    exact = Math.sqrt(N1 * N1 * (next.shutter / t1) * (next.iso / S1) / filter);
  } else if (solveFor === "iso") {
    exact = S1 * (t1 / next.shutter) * ((next.aperture * next.aperture) / (N1 * N1)) * filter;
  } else {
    throw new Error("solveFor must be aperture, shutter or iso");
  }
  const nearest = nearestStandard(solveFor, exact);
  return {
    solveFor,
    exact,
    exactLabel: formatters[solveFor](exact),
    nearest: nearest.value,
    nearestLabel: formatters[solveFor](nearest.value),
    offsetStops: nearest.offsetStops,
    inStandardRange: nearest.inRange,
    ev100: ev100(base)
  };
}
