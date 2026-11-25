import type { ReactNode } from "react";

type Segment = { value: number; color: string; label: string };

/**
 * The VaultX "vault dial": a tick-marked ring. With segments it shows an
 * allocation; with a needle it shows where a value sits in a range.
 */
export function Dial({
  size = 240,
  segments,
  needle,
  children,
  label,
}: {
  size?: number;
  segments?: Segment[];
  needle?: number; // 0..1 around the lower 270° arc
  children?: ReactNode;
  label: string;
}) {
  const c = size / 2;
  const rTicks = c - 4;
  const rArc = c - 22;
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  const total = segments?.reduce((s, x) => s + x.value, 0) ?? 0;
  const circ = 2 * Math.PI * rArc;
  let offset = 0;

  const needleAngle = needle === undefined ? null : -225 + Math.min(1, Math.max(0, needle)) * 270;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        {ticks.map((i) => {
          const a = (i / 72) * 2 * Math.PI;
          const major = i % 6 === 0;
          const len = major ? 9 : 4;
          return (
            <line
              key={i}
              x1={c + Math.cos(a) * rTicks}
              y1={c + Math.sin(a) * rTicks}
              x2={c + Math.cos(a) * (rTicks - len)}
              y2={c + Math.sin(a) * (rTicks - len)}
              stroke={major ? "var(--color-accent)" : "var(--color-line)"}
              strokeWidth={major ? 1.5 : 1}
            />
          );
        })}
        <circle cx={c} cy={c} r={rArc} fill="none" stroke="var(--color-raised)" strokeWidth="10" />
        {segments?.map((s) => {
          const len = (s.value / total) * circ;
          const el = (
            <circle
              key={s.label}
              cx={c}
              cy={c}
              r={rArc}
              fill="none"
              stroke={s.color}
              strokeWidth="10"
              strokeDasharray={`${Math.max(len - 3, 0)} ${circ}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}
            />
          );
          offset += len;
          return el;
        })}
        {needleAngle !== null && (
          <g
            style={{ transform: `rotate(${needleAngle + 90}deg)`, transformOrigin: "50% 50%", transition: "transform 0.9s cubic-bezier(0.2,0.7,0.2,1)" }}
          >
            <line x1={c} y1={c - rArc + 8} x2={c} y2={c - rArc - 12} stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
