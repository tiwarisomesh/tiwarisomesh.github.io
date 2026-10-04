const seq = (n: number, step: number, from = 0) => Array.from({ length: n }, (_, i) => from + i * step);
const vlines = (xs: number[], y0: number, y1: number) => xs.map((x) => `M${x} ${y0}V${y1}`).join("");
const hlines = (ys: number[], x0: number, x1: number) => ys.map((y) => `M${x0} ${y}H${x1}`).join("");
const cross = ([x, y]: number[], r: number) => `M${x - r} ${y}H${x + r}M${x} ${y - r}V${y + r}`;

const holes = [[27, 27], [673, 27], [27, 403], [673, 403]];
const corners = [[80, 90], [1120, 90], [80, 530], [1120, 530]];
const vias = [
  [145, 145], [160, 165], [135, 195], [155, 225], [145, 245], [440, 129],
  [450, 204], [435, 230], [450, 302], [430, 354], [195, 105], [190, 255],
];
const traces = [
  "M92 130H145V145H205", "M92 160H160V165H205", "M92 190H135V195H205", "M92 220H155V225H205", "M92 250H145V245H205",
  "M410 130H440V129H470", "M410 160H450V204H470", "M410 190H435V230H470", "M410 220H450V302H470", "M410 245H430V354H470",
  "M265 335H290", "M390 335H470", "M177 180H195V105H205", "M177 225H190V255H205",
].join("");
// [x, y, size, text] in board coordinates
const labels: [number, number, number, string][] = [
  [71, 50, 7, "J1 / GPIO"], [307, 180, 8, "BCM / SoC"], [307, 222, 5.5, "U1"], [525, 134, 7, "LPDDR"],
  [535, 247, 6, "ETH"], [197, 307, 6, "HDMI"], [340, 307, 6, "POWER"], [141, 162, 5, "CSI"],
  [141, 207, 5, "DSI"], [132, 292, 5, "TP1–TP4"],
];

const Fpc = ({ y }: { y: number }) => (
  <g transform={`translate(105 ${y})`}>
    <rect width="72" height="20" rx="1" />
    <path d={vlines(seq(8, 8, 8), 0, 20)} strokeWidth=".5" />
  </g>
);

export function BlueprintBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden text-accent opacity-[0.13] xl:block"
    >
      <svg
        viewBox="0 0 1200 620"
        fill="none"
        stroke="currentColor"
        className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
      >
        <defs>
          <pattern id="pcb-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" strokeWidth=".35" opacity=".12" />
          </pattern>
        </defs>

        <rect x="70" y="55" width="1060" height="510" fill="url(#pcb-grid)" stroke="none" />
        <path d="M600 35V585M45 310H1155" strokeWidth=".5" strokeDasharray="5 8" opacity=".28" />
        <path d={corners.map((c) => cross(c, 15)).join("")} strokeWidth=".7" opacity=".45" />

        <g transform="translate(250 95)">
          <rect width="700" height="430" rx="20" strokeWidth="1.8" />
          <rect x="10" y="10" width="680" height="410" rx="14" strokeWidth=".55" strokeDasharray="2 6" opacity=".6" />
          {holes.map(([cx, cy]) => (
            <g key={cx + cy}>
              <circle cx={cx} cy={cy} r="9" />
              <circle cx={cx} cy={cy} r="4" />
              <path d={cross([cx, cy], 13)} strokeWidth=".45" />
            </g>
          ))}

          <g transform="translate(50 62)">
            <rect width="42" height="306" rx="3" />
            {seq(20, 15, 10).flatMap((cy) => [12, 30].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />))}
          </g>

          <g transform="translate(205 105)">
            <rect width="205" height="150" rx="4" strokeWidth="1.2" />
            <rect x="17" y="17" width="171" height="116" rx="2" strokeWidth=".55" strokeDasharray="3 5" />
            <rect x="63" y="39" width="79" height="60" rx="2" />
            <path d="M96 39V45C96 48 99 50 102 50C105 50 108 48 108 45V39" strokeWidth=".6" />
            <path d={hlines(seq(10, 7, 42), 48, 63) + hlines(seq(10, 7, 42), 142, 157)} strokeWidth=".65" />
            <path
              d="M20 20h14v9h-14zM171 20h14v9h-14zM20 120h14v9h-14zM171 120h14v9h-14z"
              strokeWidth=".8"
            />
          </g>

          <g transform="translate(470 105)">
            <rect width="110" height="48" rx="2" />
            <rect x="10" y="10" width="90" height="28" strokeWidth=".55" />
            <path d={vlines(seq(8, 12, 12), -10, 0) + vlines(seq(8, 12, 12), 48, 58)} strokeWidth=".55" />
          </g>

          <g transform="translate(470 180)">
            <rect width="130" height="72" rx="3" />
            <rect x="12" y="14" width="106" height="43" rx="2" />
            <path d={vlines(seq(6, 15, 27), 14, 57)} strokeWidth=".55" />
          </g>

          <g transform="translate(470 282)">
            {[0, 52].map((y) => (
              <g key={y}>
                <rect y={y} width="135" height="42" rx="3" />
                <rect x="12" y={y + 10} width="111" height="22" rx="2" strokeWidth=".7" />
                <path d={vlines(seq(6, 14, 28), y + 10, y + 32)} strokeWidth=".45" />
              </g>
            ))}
          </g>

          <g transform="translate(130 315)">
            <rect width="135" height="43" rx="3" />
            <path d={hlines([12, 22, 32], 15, 120)} strokeWidth=".55" />
          </g>

          <g transform="translate(290 315)">
            <rect width="100" height="43" rx="3" />
            {[22, 50, 78].map((cx) => (
              <circle key={cx} cx={cx} cy="21.5" r="7" />
            ))}
          </g>

          <g transform="translate(120 70)">
            {[0, 22, 44].map((cx) => (
              <circle key={cx} cx={cx} cy="0" r="4" />
            ))}
          </g>

          <Fpc y={170} />
          <Fpc y={215} />

          <path d={traces} strokeLinecap="square" strokeLinejoin="round" />
          {vias.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" fill="currentColor" stroke="none" />
          ))}
          {seq(4, 15, 110).map((cx) => (
            <circle key={cx} cx={cx} cy="275" r="4" strokeWidth=".8" />
          ))}

          <g fill="currentColor" stroke="none" fontFamily="monospace" textAnchor="middle" opacity=".7">
            {labels.map(([x, y, size, text]) => (
              <text key={text} x={x} y={y} fontSize={size}>
                {text}
              </text>
            ))}
          </g>
        </g>

        <g fill="currentColor" stroke="none" fontFamily="monospace" fontSize="7" opacity=".45">
          <text x="78" y="76">PCB LAYOUT / DEVELOPMENT BOARD</text>
          <text x="1120" y="550" textAnchor="end">NOT TO SCALE</text>
        </g>
      </svg>
    </div>
  );
}