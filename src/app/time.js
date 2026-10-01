import { W, H } from "../core/tables.js";

// World time. The clock counts game minutes from midnight on the world's "today" (a date rolled
// with the calendar). Positions of ships, caravans and the sun are pure functions of this number,
// so nothing is simulated step by step and every zoom level agrees on where things are.
// The sun: latitude comes from the map's y (pole to pole), local solar time from x (the map wraps
// like a globe), and the seasons from the day of the year and the world's axial tilt.

export const SPEEDS = [
  { k: "pause", n: "Paused", f: 0 }, { k: "1", n: "Real time", f: 1 / 60 }, { k: "60", n: "1 minute per second", f: 1 },
  { k: "3600", n: "1 hour per second", f: 60 }, { k: "86400", n: "1 day per second", f: 1440 },
  { k: "month", n: "1 month per second", f: 43800 }, { k: "year", n: "1 year per second", f: 525600 },
];

export function makeClock() {
  return { t: 0, speed: 2, anim: 0, last: 0 };
}
export function resetClock(clock, cal) { clock.t = (cal.hour ?? 8) * 60; clock.anim = 0; }

// advance by real milliseconds; returns true if anything moved
export function tick(clock, dtMs) {
  const f = SPEEDS[clock.speed].f; if (!f) return false;
  clock.t += dtMs / 1000 * f;          // game minutes
  clock.anim += dtMs / 1000;            // real seconds, for small looping animations
  return true;
}

export function dateOf(cal, tMin) {
  const dayAbs = cal.startDay + Math.floor(tMin / 1440);
  const yOff = Math.floor(dayAbs / cal.yearDays), doy = ((dayAbs % cal.yearDays) + cal.yearDays) % cal.yearDays;
  let m = 0, d = doy;
  while (m < cal.months.length - 1 && d >= cal.months[m].days) { d -= cal.months[m].days; m++; }
  const totalDays = (cal.year + yOff) * cal.yearDays + doy;
  const weekday = cal.weekdays[((totalDays % cal.weekdays.length) + cal.weekdays.length) % cal.weekdays.length];
  const minute = ((tMin % 1440) + 1440) % 1440;
  return { year: cal.year + yOff, doy, month: m, day: d + 1, weekday, minute, totalDays: totalDays + minute / 1440 };
}
export const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
export function moonPhase(moon, totalDays) { const p = (moon.phase + totalDays / moon.period) % 1; return p < 0 ? p + 1 : p; }
export function phaseName(p) {
  return p < 0.03 || p > 0.97 ? "New" : p < 0.22 ? "Waxing crescent" : p < 0.28 ? "First quarter" : p < 0.47 ? "Waxing gibbous" : p < 0.53 ? "Full" : p < 0.72 ? "Waning gibbous" : p < 0.78 ? "Last quarter" : "Waning crescent";
}

// the clock shows local solar time at a world x; "base" time is at the map's middle meridian
export const localMinutes = (tMin, wx) => (((tMin + (wx / W - 0.5) * 1440) % 1440) + 1440) % 1440;

// sine of the sun's altitude at a world point
export function sunAlt(cal, tMin, wx, wy) {
  const doy = ((cal.startDay + tMin / 1440) % cal.yearDays + cal.yearDays) % cal.yearDays;
  const dec = -cal.tilt * Math.PI / 180 * Math.cos(2 * Math.PI * doy / cal.yearDays); // day 0 is midwinter in the north
  const lat = (0.5 - wy / H) * Math.PI, ha = (localMinutes(tMin, wx) / 60 - 12) * Math.PI / 12;
  return Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha);
}
// how dark it is: 0 in daylight to 1 at full night
export const darkness = s => s > 0.08 ? 0 : s < -0.2 ? 1 : (0.08 - s) / 0.28;

// A small image of night over one copy of the world, redrawn when time moves. Drawn scaled over
// the map with smoothing, so the terminator is soft at every zoom.
const NW = 192, NH = 120;
export function makeNight() {
  const cv = document.createElement("canvas"); cv.width = NW; cv.height = NH;
  const g = cv.getContext("2d"), img = g.createImageData(NW, NH), buf = new Uint32Array(img.data.buffer);
  let lastT = -1e9, any = false;
  function update(cal, tMin) {
    if (Math.abs(tMin - lastT) < 1.5) return any;
    lastT = tMin; any = false;
    for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
      const s = sunAlt(cal, tMin, (i + 0.5) / NW * W, (j + 0.5) / NH * H), d = darkness(s);
      // night is a deep blue; the twilight band gets a warm edge
      const tw = Math.max(0, 1 - Math.abs(s + 0.02) / 0.09) * 0.35;
      const a = Math.min(0.68, d * 0.68 + tw * 0.25);
      const r = Math.round(12 + tw * 200), gg = Math.round(20 + tw * 90), b = Math.round(52 - tw * 20);
      buf[j * NW + i] = ((Math.round(a * 255) << 24) | (b << 16) | (gg << 8) | r) >>> 0;
      if (a > 0.02) any = true;
    }
    g.putImageData(img, 0, 0);
    return any;
  }
  return { canvas: cv, update, get any() { return any; } };
}
