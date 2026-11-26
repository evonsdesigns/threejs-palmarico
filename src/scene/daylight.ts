export const DAY_LENGTH = 120;

export function daylightAt(elapsed: number) {
  const phase = ((elapsed / DAY_LENGTH + 0.25) % 1 + 1) % 1;
  const angle = phase * Math.PI * 2;
  const altitude = Math.sin(angle);
  const daylight = Math.max(0, Math.min(1, (altitude + 0.08) / 0.3));
  const smoothDaylight = daylight * daylight * (3 - 2 * daylight);
  return {
    elevation: Math.asin(altitude * 0.8) * 180 / Math.PI,
    azimuth: 180 + 70 * Math.cos(angle),
    daylight: smoothDaylight,
  };
}
