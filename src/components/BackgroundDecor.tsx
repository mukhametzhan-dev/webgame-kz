const shapes = [
  { top: "6%", left: "8%", size: 46, kind: "square", delay: "0s", rotate: 12 },
  { top: "16%", left: "82%", size: 34, kind: "star", delay: "1.2s", rotate: -10 },
  { top: "70%", left: "5%", size: 40, kind: "circle", delay: "2.1s", rotate: 0 },
  { top: "82%", left: "88%", size: 50, kind: "square", delay: "0.6s", rotate: -18 },
  { top: "38%", left: "92%", size: 30, kind: "circle", delay: "3s", rotate: 0 },
  { top: "50%", left: "2%", size: 28, kind: "star", delay: "1.8s", rotate: 20 },
  { top: "6%", left: "45%", size: 26, kind: "circle", delay: "2.6s", rotate: 0 },
  { top: "90%", left: "45%", size: 36, kind: "star", delay: "0.3s", rotate: 8 },
];

function Shape({ kind, size }: { kind: string; size: number }) {
  const stroke = "rgba(255,255,255,0.35)";
  if (kind === "square") {
    return (
      <rect x="4" y="4" width={size - 8} height={size - 8} rx={size * 0.18} fill="none" stroke={stroke} strokeWidth="3" />
    );
  }
  if (kind === "circle") {
    return <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="none" stroke={stroke} strokeWidth="3" />;
  }
  // star
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill="none" stroke={stroke} strokeWidth="3" />;
}

export function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {shapes.map((s, i) => (
        <svg
          key={i}
          className="animate-float absolute"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, transform: `rotate(${s.rotate}deg)` }}
          width={s.size}
          height={s.size}
          viewBox={`0 0 ${s.size} ${s.size}`}
        >
          <Shape kind={s.kind} size={s.size} />
        </svg>
      ))}
    </div>
  );
}
