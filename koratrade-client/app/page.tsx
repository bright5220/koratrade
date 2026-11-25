"use client";

/*
  VaultX landing page — one self-contained file.
  Paste into: koratrade-client/app/page.tsx
  Needs one package:  npm install motion
*/

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/* ================= Colours (violet scheme) =================
   void #07060D · panel #0F0C1A · raised #171329 · line #26203D
   ink #F1EEF8 · dim #9A93B3 · faint #615A7A
   accent #7C5CFF · accent-soft #A48BFF · glow #5B2EFF · up #3DDC97        */

const EASE = [0.22, 1, 0.36, 1] as const;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ================= Sample data (demo only) ================= */

const HOLDINGS = [
  { symbol: "USD", amount: 4580, price: 1, color: "#9a93b3" },
  { symbol: "BTC", amount: 0.085, price: 94238.1, color: "#7c5cff" },
  { symbol: "ETH", amount: 1.2, price: 3142.5, color: "#3ddc97" },
];
const holdingValue = (h: (typeof HOLDINGS)[number]) => h.amount * h.price;
const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Deterministic price history: identical on server and client, so no hydration mismatch
function seedHistory(base: number, points = 40) {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
  const out: { t: number; price: number }[] = [];
  let p = base - 40;
  for (let i = 0; i < points; i++) {
    p += rand() * 18 + (base - p) * 0.04 + 0.6;
    out.push({ t: i, price: +p.toFixed(2) });
  }
  return out;
}

// Simulated BTC feed: a gentle random walk in the browser (no server needed)
function usePriceFeed(points = 30) {
  const [history, setHistory] = useState(() => seedHistory(94238.1, points));
  useEffect(() => {
    const id = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1].price;
        const next = +(last + (94238.1 - last) * 0.05 + (Math.random() - 0.5) * 22).toFixed(2);
        return [...prev.slice(1), { t: prev[prev.length - 1].t + 1, price: next }];
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);
  const price = history[history.length - 1].price;
  return { change: ((price - history[0].price) / history[0].price) * 100 };
}

/* ================= Logo and demo badge ================= */

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12.5" fill="none" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="8" fill="none" stroke="#7c5cff" strokeOpacity="0.45" />
        <path d="M14 4.5v4M14 19.5v4M4.5 14h4M19.5 14h4" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2" fill="#7c5cff" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight">VaultX</span>
    </span>
  );
}

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2.5 py-1 text-xs text-[#a48bff]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#7c5cff]" aria-hidden="true" />
      Demo, sample data
    </span>
  );
}

/* ================= Page-only styles: button shine and coin orbit ================= */

const PAGE_CSS = `
.shine { transform: translateX(-120%) skewX(-12deg); }
.group:hover .shine { transform: translateX(380%) skewX(-12deg); transition: transform .7s cubic-bezier(.22,1,.36,1); }
@keyframes orbit-spin { to { transform: rotate(360deg); } }
.orbit { animation: orbit-spin 60s linear infinite; }
.orbit-counter { animation: orbit-spin 60s linear infinite reverse; }
.orbit-wrap:hover .orbit, .orbit-wrap:hover .orbit-counter,
.orbit-wrap:focus-within .orbit, .orbit-wrap:focus-within .orbit-counter { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .orbit, .orbit-counter { animation: none !important; }
  .group:hover .shine { transform: translateX(-120%); }
}
`;

/* ================= Helpers ================= */

/** Scales a fixed-size scene (baseWidth px wide) to fit its container's width. */
function useFitScale(baseWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / baseWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return { ref, scale };
}

/* ---------- Mini price line (deterministic data, no Math.random in render) ---------- */

function linePath(values: number[], w: number, h: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function MiniLine({
  w = 300,
  h = 90,
  points = 36,
  base = 94238,
  draw = false,
  delay = 0,
  color = "#3ddc97",
}: {
  w?: number;
  h?: number;
  points?: number;
  base?: number;
  draw?: boolean;
  delay?: number;
  color?: string;
}) {
  const d = linePath(
    seedHistory(base, points).map((p) => p.price),
    w,
    h,
  );
  const id = `ml-${w}-${h}-${points}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L${w},${h} L0,${h} Z`}
        fill={`url(#${id})`}
        initial={draw ? { opacity: 0 } : false}
        whileInView={draw ? { opacity: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.8, duration: 0.6 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        initial={draw ? { pathLength: 0 } : false}
        whileInView={draw ? { pathLength: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/* ---------- Device frames, built in code ---------- */

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[760px]">
      <div className="rounded-t-[18px] border border-[#26203d] bg-[#0b0914] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="relative h-[460px] overflow-hidden rounded-[10px] bg-[#07060d]">{children}</div>
      </div>
      <div className="relative mx-auto h-4 w-[106%] -translate-x-[3%] rounded-b-[14px] border border-t-0 border-[#26203d] bg-gradient-to-b from-[#1a1630] to-[#0d0b18]">
        <div className="absolute left-1/2 top-0 h-1.5 w-24 -translate-x-1/2 rounded-b-md bg-[#0b0914]" />
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[210px] rounded-[34px] border border-[#26203d] bg-[#0b0914] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="relative h-[430px] overflow-hidden rounded-[27px] bg-[#07060d]">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

/* ---------- Screen contents (VaultX's own UI, simplified) ---------- */

const NAV = ["Dashboard", "Trade", "Wallet", "Strategy bot", "Staking", "Settings"];

function DashboardScreen({ draw = false }: { draw?: boolean }) {
  const total = HOLDINGS.reduce((s, h) => s + holdingValue(h), 0);
  return (
    <div className="flex h-full text-[11px]">
      <aside className="w-[150px] shrink-0 border-r border-[#26203d] p-3">
        <div className="mb-5 flex items-center gap-2 px-1 font-semibold">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-[#7c5cff]" /> VaultX
        </div>
        {NAV.map((n, i) => (
          <div
            key={n}
            className={`mb-1 rounded-md px-2 py-1.5 ${i === 0 ? "bg-[#171329] text-[#f1eef8]" : "text-[#9a93b3]"}`}
          >
            {n}
          </div>
        ))}
        <div className="mt-5 inline-flex rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2 py-0.5 text-[9px] text-[#a48bff]">
          Demo, sample data
        </div>
      </aside>
      <div className="flex-1 p-4">
        <p className="text-[15px] font-semibold">Portfolio</p>
        <p className="text-[10px] text-[#615a7a]">Signed in as Demo Trader</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Portfolio value", usd(total)],
            ["Unrealised gain", "+$363.67"],
            ["Cash available", usd(HOLDINGS[0].amount)],
          ].map(([l, v], i) => (
            <div key={l} className="rounded-lg border border-[#26203d] bg-[#0f0c1a] p-2.5">
              <p className="text-[9px] text-[#9a93b3]">{l}</p>
              <p className={`font-mono tabular-nums mt-1 text-[13px] ${i === 1 ? "text-[#3ddc97]" : ""}`}>{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[1.6fr_1fr] gap-2">
          <div className="rounded-lg border border-[#26203d] bg-[#0f0c1a] p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] text-[#9a93b3]">Bitcoin</p>
              <p className="text-[9px] text-[#615a7a]">Simulated feed</p>
            </div>
            <p className="font-mono tabular-nums mt-1 text-[16px]">$94,266.76</p>
            <div className="mt-2">
              <MiniLine w={320} h={130} points={40} draw={draw} delay={0.4} />
            </div>
          </div>
          <div className="rounded-lg border border-[#26203d] bg-[#0f0c1a] p-3">
            <p className="text-[10px] text-[#9a93b3]">Allocation</p>
            <svg viewBox="0 0 100 100" className="mx-auto mt-2 h-[110px] w-[110px]" aria-hidden="true">
              {(() => {
                const c = 2 * Math.PI * 38;
                const lens = HOLDINGS.map((h) => (holdingValue(h) / total) * c);
                const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
                return HOLDINGS.map((h, i) => (
                  <circle
                    key={h.symbol}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={h.color}
                    strokeWidth="9"
                    strokeDasharray={`${lens[i] - 2} ${c}`}
                    strokeDashoffset={-starts[i]}
                    transform="rotate(-90 50 50)"
                  />
                ));
              })()}
            </svg>
            {HOLDINGS.map((h) => (
              <div key={h.symbol} className="mt-1 flex justify-between text-[9px] text-[#9a93b3]">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: h.color }} />
                  {h.symbol}
                </span>
                <span className="font-mono tabular-nums">{((holdingValue(h) / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeScreen({ draw = false }: { draw?: boolean }) {
  return (
    <div className="flex h-full flex-col px-3.5 pb-4 pt-10 text-[11px]">
      <p className="text-[14px] font-semibold">Trade BTC / USD</p>
      <p className="font-mono tabular-nums mt-2 text-[20px]">$94,237.74</p>
      <p className="font-mono tabular-nums text-[10px] text-[#3ddc97]">+0.42% this session</p>
      <div className="mt-3">
        <MiniLine w={180} h={90} points={30} draw={draw} delay={0.4} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-[#26203d] p-1">
        <span className="rounded-md bg-[#3ddc97]/15 py-1.5 text-center text-[#3ddc97]">Buy</span>
        <span className="py-1.5 text-center text-[#9a93b3]">Sell</span>
      </div>
      <div className="mt-2 rounded-lg border border-[#26203d] px-2.5 py-2">
        <p className="text-[9px] text-[#615a7a]">Amount</p>
        <p className="font-mono tabular-nums">0.01000 BTC</p>
      </div>
      <div className="mt-auto rounded-lg bg-[#3ddc97] py-2 text-center font-medium text-[#07060d]">Buy BTC</div>
    </div>
  );
}

function BotScreen({ draw = false }: { draw?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2.5 px-3.5 pb-4 pt-10 text-[11px]">
      <p className="text-[14px] font-semibold">Strategy bot</p>
      <div className="flex items-center justify-between rounded-lg border border-[#26203d] p-2.5">
        <div>
          <p>Running</p>
          <p className="text-[9px] text-[#615a7a]">Watching BTC and ETH</p>
        </div>
        <span className="relative h-4 w-7 rounded-full bg-[#7c5cff]/40">
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-[#a48bff]" />
        </span>
      </div>
      <div className="rounded-lg border border-[#7c5cff] p-2.5">
        <p className="text-[#a48bff]">Balanced</p>
        <p className="text-[9px] text-[#9a93b3]">Trailing stop on every position</p>
      </div>
      <MiniLine w={180} h={70} points={26} draw={draw} delay={0.4} color="#a48bff" />
      {["Paper buy  0.0020 BTC", "No trade, weak signal", "Paper sell  0.10 ETH"].map((l) => (
        <p key={l} className="border-b border-[#26203d] pb-1.5 text-[10px] text-[#9a93b3]">
          {l}
        </p>
      ))}
    </div>
  );
}

function StakingScreen({ draw = false }: { draw?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2.5 px-3.5 pb-4 pt-10 text-[11px]">
      <p className="text-[14px] font-semibold">Staking</p>
      <div className="rounded-lg border border-[#26203d] p-2.5">
        <p className="text-[9px] text-[#615a7a]">Demo tokens available</p>
        <p className="font-mono tabular-nums text-[18px]">4,000</p>
      </div>
      <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
        <span className="rounded-md border border-[#7c5cff] py-1.5 text-[#a48bff]">30 days</span>
        <span className="rounded-md border border-[#26203d] py-1.5 text-[#9a93b3]">90 days</span>
        <span className="rounded-md border border-[#26203d] py-1.5 text-[#9a93b3]">180 days</span>
      </div>
      <MiniLine w={180} h={70} points={22} base={1000} draw={draw} delay={0.4} color="#a48bff" />
      <div className="rounded-lg border border-[#26203d] p-2.5">
        <p className="font-mono tabular-nums">1,000 VX</p>
        <p className="text-[9px] text-[#9a93b3]">Locked for 30 days (simulated)</p>
      </div>
      <div className="mt-auto rounded-lg bg-[#7c5cff] py-2 text-center font-medium text-white">Stake tokens</div>
    </div>
  );
}

const SCENE_W = 1000;
const SCENE_H = 660;
const DIAL = 440;

/** Tick ring of the vault dial, drawn once. */
function DialFace() {
  const c = DIAL / 2;
  return (
    <svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`} aria-hidden="true">
      <defs>
        <radialGradient id="dial-face" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#5b2eff" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#5b2eff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r={c - 2} fill="url(#dial-face)" />
      {Array.from({ length: 90 }, (_, i) => {
        const a = (i / 90) * Math.PI * 2;
        const major = i % 9 === 0;
        const r1 = c - 6;
        const r2 = r1 - (major ? 18 : 8);
        return (
          <line
            key={i}
            x1={c + Math.cos(a) * r1}
            y1={c + Math.sin(a) * r1}
            x2={c + Math.cos(a) * r2}
            y2={c + Math.sin(a) * r2}
            stroke={major ? "#a48bff" : "#3a3160"}
            strokeWidth={major ? 2.5 : 1.25}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={c} cy={c} r={c - 44} fill="none" stroke="#26203d" strokeWidth="1.5" />
      <circle cx={c} cy={c} r={c - 70} fill="none" stroke="#7c5cff" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 6" />
    </svg>
  );
}

function HeroScene() {
  const reduce = useReducedMotion();
  const { ref, scale } = useFitScale(SCENE_W);
  const { change } = usePriceFeed(30);
  const [introDone, setIntroDone] = useState(false);
  const finePointer = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );

  // Mouse tilt (desktop only, after the intro)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(mx, { stiffness: 120, damping: 20 });
  const rotateX = useSpring(my, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), reduce ? 0 : 2300);
    return () => clearTimeout(t);
  }, [reduce]);

  const tiltOn = introDone && finePointer && !reduce;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 12); // ±6°
    my.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Shorthand: with reduced motion, skip straight to the final state
  const from = <T,>(v: T) => (reduce ? false : v);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[1000px]" style={{ height: SCENE_H * scale }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: SCENE_W, height: SCENE_H, transform: `scale(${scale})`, perspective: 1200 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Breathing glow: drifts slowly, brighter when the simulated price is up */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[300px] h-[420px] w-[820px] -translate-x-1/2 rounded-[50%] bg-[#5b2eff] blur-[120px]"
          initial={from({ opacity: 0, scale: 0.6 })}
          animate={{
            opacity: change >= 0 ? 0.62 : 0.42,
            scale: 1,
            x: reduce ? 0 : [0, 30, -30, 0],
            y: reduce ? 0 : [0, -20, 14, 0],
          }}
          transition={{
            opacity: { duration: reduce ? 0 : 1.2, delay: introDone ? 0 : 1.6 },
            scale: { duration: 1, delay: 1.6, ease: EASE },
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* The vault dial: turns like a combination lock, then lies down as the platform */}
        <motion.div
          className="absolute left-1/2 top-[-20px]"
          style={{ width: DIAL, height: DIAL, marginLeft: -DIAL / 2, transformStyle: "preserve-3d" }}
          initial={from({ opacity: 0, scale: 0.72, rotateX: 0, y: 0 })}
          animate={{ opacity: 1, scale: 1.2, rotateX: 72, y: 295 }}
          transition={{
            opacity: { delay: 0.3, duration: 0.4 },
            scale: { delay: 1.25, duration: 0.7, ease: EASE },
            rotateX: { delay: 1.25, duration: 0.7, ease: EASE },
            y: { delay: 1.25, duration: 0.7, ease: EASE },
          }}
        >
          <motion.div
            initial={from({ rotate: 0 })}
            animate={{ rotate: [0, 40, 40, -25, -25, 10] }}
            transition={{ delay: 0.4, duration: 0.85, times: [0, 0.3, 0.42, 0.72, 0.82, 1], ease: "easeInOut" }}
          >
            <DialFace />
          </motion.div>
          {/* A flash of light on each stop of the combination */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-[#a48bff]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.9, 0, 0, 0.9, 0, 0.9, 0] }}
              transition={{ delay: 0.4, duration: 1.05, times: [0, 0.27, 0.32, 0.42, 0.66, 0.7, 0.8, 0.85, 1] }}
            />
          )}
        </motion.div>

        {/* Devices: rise out of the vault, then tilt toward the mouse (or float on touch) */}
        <motion.div
          className="absolute inset-0"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={!reduce && introDone && !finePointer ? { y: [0, -6, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute left-[70px] top-[40px]"
            initial={from({ opacity: 0, y: 90, scale: 0.92, rotateX: 18 })}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 6 }}
            transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
          >
            <LaptopFrame>
              <DashboardScreen />
            </LaptopFrame>
          </motion.div>

          <motion.div
            className="absolute right-[40px] top-[130px]"
            initial={from({ opacity: 0, x: 60, rotate: 6 })}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
          >
            <PhoneFrame>
              <TradeScreen />
            </PhoneFrame>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Sticky nav that gains a background once you scroll ---------- */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-[#26203d] bg-[#07060d]/80 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="VaultX home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="#features" className="hidden px-3 py-2 text-sm text-[#9a93b3] hover:text-[#f1eef8] sm:block">
            What&apos;s inside
          </Link>
          <PressLink href="/auth" variant="secondary">
            Sign in
          </PressLink>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Buttons: press feedback, and a light sweep on the primary one ---------- */
function PressLink({
  href,
  children,
  variant = "primary",
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-[12px] text-sm font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[0.97]",
        large ? "px-6 py-3.5 text-[15px]" : "px-4 py-2.5",
        variant === "primary"
          ? "bg-[#7c5cff] text-white shadow-[0_8px_30px_-8px_rgba(124,92,255,0.7)] hover:bg-[#6a48f5]"
          : "border border-[#26203d] text-[#f1eef8] hover:border-[#615a7a]",
      )}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="shine pointer-events-none absolute inset-y-0 left-0 w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}
      <span className="relative">{children}</span>
    </Link>
  );
}

/* ---------- Hero copy: one short fade-up on load ---------- */
function HeroCopy({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-col items-center text-center"
    >
      {children}
    </motion.div>
  );
}

/* ---------- Numbers that count up when they scroll into view ---------- */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {(reduce ? to : value).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------- Feature row: the device rises, its screen lights up, the chart draws ---------- */
function FeatureDevice({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div aria-hidden="true" className="absolute inset-x-6 bottom-0 top-10 rounded-full bg-[#5b2eff]/40 blur-[80px]" />
      <div className="relative">
        {children}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 rounded-[27px] bg-black"
            initial={{ opacity: 0.85 }}
            whileInView={{ opacity: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ---------- Coin orbit: badges circle the dial like numbers on a safe ---------- */
const COINS = [
  { t: "BTC", live: true },
  { t: "ETH", live: true },
  { t: "SOL", live: true },
  { t: "USDT", live: false },
  { t: "BNB", live: false },
  { t: "XRP", live: false },
];

function CoinOrbit() {
  const R = 170;
  return (
    <div className="orbit-wrap relative mx-auto h-[420px] w-[420px] max-w-full" tabIndex={0} aria-label="Demo assets: BTC, ETH and SOL. USDT, BNB and XRP coming soon.">
      <div aria-hidden="true" className="absolute inset-[60px] rounded-full border border-[#26203d]" />
      <div aria-hidden="true" className="absolute inset-[110px] rounded-full bg-[#5b2eff]/30 blur-[60px]" />
      <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-[120px]">
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const major = i % 4 === 0;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 96}
              y1={100 + Math.sin(a) * 96}
              x2={100 + Math.cos(a) * (major ? 82 : 89)}
              y2={100 + Math.sin(a) * (major ? 82 : 89)}
              stroke={major ? "#a48bff" : "#3a3160"}
              strokeWidth={major ? 2.5 : 1.5}
            />
          );
        })}
        <text x="100" y="106" textAnchor="middle" className="fill-[#f1eef8]" style={{ fontSize: 18, fontWeight: 600 }}>
          VaultX
        </text>
      </svg>
      <div className="orbit absolute inset-0" aria-hidden="true">
        {COINS.map((c, i) => {
          const a = (i / COINS.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div
              key={c.t}
              className="absolute"
              style={{ left: 210 + Math.cos(a) * R - 32, top: 210 + Math.sin(a) * R - 32 }}
            >
              <div
                className={cx(
                  "orbit-counter flex h-16 w-16 flex-col items-center justify-center rounded-full border bg-[#0f0c1a]",
                  c.live ? "border-[#7c5cff]/60" : "border-[#26203d]",
                )}
              >
                <span className={cx("font-mono tabular-nums text-sm", c.live ? "text-[#f1eef8]" : "text-[#615a7a]")}>{c.t}</span>
                {!c.live && <span className="text-[9px] text-[#615a7a]">soon</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATS = [
  { to: 1000, suffix: "+", label: "Paper trades placed in testing" },
  { to: 3, suffix: "", label: "Demo assets: BTC, ETH and SOL" },
  { to: 0, suffix: "", label: "Real funds held" },
];

const FEATURES = [
  {
    title: "A full trade screen",
    body: "Price chart, order book and an order form that places paper orders against the simulated price.",
    link: { href: "/trade", label: "Open the trade screen" },
    Screen: TradeScreen,
  },
  {
    title: "A strategy simulator",
    body: "Pick a risk level and a stop-loss, then see what the rules would have done. Nothing is executed.",
    link: { href: "/bot", label: "Try the simulator" },
    Screen: BotScreen,
  },
  {
    title: "Staking, without the risk",
    body: "Lock demo tokens for 30, 90 or 180 days to see how staking works. No rewards are promised.",
    link: { href: "/launchpad", label: "Explore staking" },
    Screen: StakingScreen,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#07060d] text-[#f1eef8]">
      {/* Top wash of violet behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(91,46,255,0.28),transparent_70%)]"
      />

      <style>{PAGE_CSS}</style>
      <LandingNav />

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-10 md:pt-12">
          <HeroCopy>
            <DemoBadge />
            <h1 className="mt-5 max-w-4xl text-[42px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[56px] md:text-[68px]">
              Practise trading crypto with money that isn&apos;t real.
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-[#9a93b3] md:text-[19px]">
              VaultX is a paper-trading demo. Live-style prices, a full order book and a strategy simulator, all with
              sample funds.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PressLink href="/dashboard" large>
                Open the demo
              </PressLink>
              <PressLink href="/auth" variant="secondary" large>
                Sign in
              </PressLink>
            </div>
          </HeroCopy>

          <div className="mt-8 md:mt-10">
            <HeroScene />
          </div>
        </section>

        {/* Stat strip */}
        <section className="relative mx-auto mt-6 max-w-5xl px-6 pb-8">
          <div className="grid divide-y divide-[#26203d] rounded-[18px] border border-[#26203d] bg-[#0f0c1a]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div key={s.label} className="px-8 py-7 text-center">
                <p className="text-[40px] font-medium leading-none tracking-tight">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm text-[#9a93b3]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 space-y-28 px-6 py-24 md:space-y-36 md:py-32">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
              <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                <h2 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[48px]">{f.title}</h2>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#9a93b3]">{f.body}</p>
                <Link
                  href={f.link.href}
                  className="mt-7 inline-flex rounded-[12px] border border-[#26203d] px-4 py-2.5 text-sm transition-colors hover:border-[#7c5cff] hover:text-[#a48bff] active:scale-[0.97]"
                >
                  {f.link.label}
                </Link>
              </div>
              <div className="flex justify-center">
                <FeatureDevice>
                  <PhoneFrame>
                    <f.Screen draw />
                  </PhoneFrame>
                </FeatureDevice>
              </div>
            </div>
          ))}
        </section>

        {/* Coin orbit */}
        <section className="border-t border-[#26203d]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_1.1fr] md:py-32">
            <div>
              <h2 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[48px]">
                Three demo assets, one vault.
              </h2>
              <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#9a93b3]">
                BTC, ETH and SOL, priced by a simulated feed. More assets are on the way.
              </p>
            </div>
            <CoinOrbit />
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative overflow-hidden border-t border-[#26203d]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-30 blur-[110px]"
            style={{ background: "linear-gradient(135deg, #5b2eff 0%, #7c5cff 45%, #b07cff 100%)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
            <h2 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[56px]">
              Open the demo. Nothing to lose.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[17px] text-[#9a93b3]">
              No sign-up needed. Everything resets when you close the tab.
            </p>
            <div className="mt-9">
              <PressLink href="/dashboard" large>
                Open the demo
              </PressLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#26203d]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-[#615a7a] sm:flex-row sm:justify-between">
          <p>VaultX is a sample project. Prices are simulated and no real funds are held.</p>
          <p>© 2026 VaultX</p>
        </div>
      </footer>
    </div>
  );
}