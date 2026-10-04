const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
};

const bend = (p: number, R: number, r: number, s: 0 | 1) =>
  p + (s ? 1 : -1) * (Math.asin(r / (2 * R)) * 180) / Math.PI;

const track = (p: number, R: number, r: number, s: 0 | 1) =>
  `M0,0 A${R},${R} 0 0 ${s} ${pt(r, bend(p, R, r, s))}`;

const wedge = (r0: number, r1: number, a0: number, a1: number) =>
  `M${pt(r0, a0)}L${pt(r1, a0)}A${r1},${r1} 0 0 1 ${pt(r1, a1)}L${pt(r0, a1)}A${r0},${r0} 0 0 0 ${pt(r0, a0)}Z`;

const ticks = (r0: number, r1: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i * 360) / n;
    return `M${pt(r0, a)}L${pt(r1, a)}`;
  }).join(" ");

const rings = [96, 168, 184, 232, 256, 296, 368, 440];

const soft = [
  [25, 110, 120, 1],
  [100, 130, 110, 0],
  [200, 100, 105, 1],
  [285, 140, 128, 0],
  [75, 200, 160, 1],
] as const;

const jet = [
  [-40, 600, 1],
  [-34, 800, 0],
  [-36, 1100, 1],
] as const;

const muon = [146, 1400, 0] as const;

export function EventDisplay({ className }: { className?: string }) {
  const [phi, R, sweep] = muon;

  return (
    <svg
      viewBox="-480 -480 960 960"
      width="960"
      height="960"
      className={`event-display ${className ?? ""}`}
      fill="none"
    >
      <g stroke="var(--event-detector)" strokeWidth={1} opacity={0.42}>
        {rings.map((r) => (
          <circle key={r} r={r} strokeDasharray={r >= 368 ? "2 5" : undefined} />
        ))}
        <path d={ticks(168, 184, 36)} stroke="var(--event-detector-bright)" />
        <path d={ticks(232, 256, 18)} stroke="var(--event-detector-bright)" />

        {soft.map(([p, R, r, s], i) => (
          <path
            key={p}
            d={track(p, R, r, s)}
            stroke={`var(--event-track-${i + 1})`}
            strokeWidth={1.2}
            opacity={0.78}
          />
        ))}
      </g>

      <g fill="var(--event-jet)" opacity={0.42}>
        <path d={wedge(168, 184, -43, -29)} />
        <path d={wedge(232, 256, -46, -26)} />
      </g>

      <g stroke="var(--event-jet)" strokeWidth={1.8} opacity={0.92}>
        {jet.map(([p, R, s]) => (
          <path key={p} d={track(p, R, 168, s)} />
        ))}
      </g>

      <path
        d={track(phi, R, 440, sweep)}
        stroke="var(--event-muon)"
        strokeWidth={2}
        opacity={0.95}
      />

      <g fill="var(--event-hit)">
        {[368, 440].map((r) => (
          <circle
            key={r}
            r={2.4}
            transform={`translate(${pt(r, bend(phi, R, r, sweep))})`}
          />
        ))}
      </g>
    </svg>
  );
}
