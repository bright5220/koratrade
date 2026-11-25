"use client";

/*
  VaultX sign-up page — one self-contained file.
  Paste into: koratrade-client/app/signup/page.tsx   (create the "signup" folder)
  Needs one package:  npm install motion
*/

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/* Colours: void #07060D · panel #0F0C1A · raised #171329 · line #26203D · ink #F1EEF8
   dim #9A93B3 · faint #615A7A · accent #7C5CFF · accent-soft #A48BFF · glow #5B2EFF
   up #3DDC97 · down #FF6B7A */

const EASE = [0.22, 1, 0.36, 1] as const;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Logo ---------- */
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

/* ---------- The vault dial: one click per completed step, opens on submit ---------- */
const DIAL = 300;
const STOPS = [0, 40, -25, 10]; // combination positions for 0, 1, 2, 3 completed fields

function VaultDial({ step, open }: { step: number; open: boolean }) {
  const reduce = useReducedMotion();
  const c = DIAL / 2;
  const t = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 140, damping: 16 };

  return (
    <div className="relative" style={{ width: DIAL, height: DIAL }}>
      {/* Glow grows as the combination is entered */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-6 rounded-full bg-[#5b2eff] blur-[70px]"
        animate={{ opacity: open ? 0.7 : 0.15 + step * 0.12 }}
        transition={{ duration: reduce ? 0 : 0.8 }}
      />

      {/* Outer tick ring: turns to the next number, then lifts away when the vault opens */}
      <motion.svg
        width={DIAL}
        height={DIAL}
        viewBox={`0 0 ${DIAL} ${DIAL}`}
        className="absolute inset-0"
        aria-hidden="true"
        animate={open ? { rotate: 190, scale: 1.25, opacity: 0 } : { rotate: STOPS[step], scale: 1, opacity: 1 }}
        transition={open && !reduce ? { duration: 0.9, ease: EASE } : t}
      >
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const major = i % 6 === 0;
          const r1 = c - 4;
          const r2 = r1 - (major ? 14 : 6);
          return (
            <line
              key={i}
              x1={c + Math.cos(a) * r1}
              y1={c + Math.sin(a) * r1}
              x2={c + Math.cos(a) * r2}
              y2={c + Math.sin(a) * r2}
              stroke={major ? "#a48bff" : "#3a3160"}
              strokeWidth={major ? 2 : 1.25}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={c} cy={c} r={c - 30} fill="none" stroke="#26203d" strokeWidth="1.5" />
      </motion.svg>

      {/* Fixed marker at the top, like a safe's index line */}
      <div aria-hidden="true" className="absolute left-1/2 top-[-6px] h-4 w-[3px] -translate-x-1/2 rounded-full bg-[#7c5cff]" />

      {/* Inner face: progress arcs, then the "vault ready" mark */}
      <div className="absolute inset-[46px] flex items-center justify-center rounded-full border border-[#26203d] bg-[#0f0c1a]/80">
        <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#7c5cff"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.3 1"
              transform={`rotate(${-90 + i * 120 + 6} 50 50)`}
              initial={false}
              animate={{ strokeDashoffset: step > i || open ? 0 : 0.3, opacity: step > i || open ? 1 : 0.15 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
            />
          ))}
        </svg>

        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="open"
              className="flex flex-col items-center"
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : 0.35, duration: 0.5, ease: EASE }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="21" fill="#3ddc97" fillOpacity="0.12" stroke="#3ddc97" />
                <motion.path
                  d="M13 22.5l6 6 12-13"
                  fill="none"
                  stroke="#3ddc97"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: reduce ? 0 : 0.6, duration: 0.5 }}
                />
              </svg>
              <p className="mt-2 text-sm font-medium">Vault ready</p>
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              className="flex flex-col items-center"
              exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            >
              <p className="font-mono text-[40px] font-medium tabular-nums leading-none">
                {step}
                <span className="text-[#615a7a]">/3</span>
              </p>
              <p className="mt-2 text-xs text-[#9a93b3]">steps complete</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Form pieces ---------- */
function Field({
  id,
  label,
  error,
  hint,
  done,
  ...props
}: React.ComponentProps<"input"> & { id: string; label: string; error?: string; hint?: string; done?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-[#9a93b3]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
          className={cx(
            "w-full rounded-[12px] border bg-[#07060d] px-4 py-3 text-[15px] text-[#f1eef8] outline-none transition-colors placeholder:text-[#615a7a]",
            error ? "border-[#ff6b7a]" : "border-[#26203d] focus:border-[#7c5cff]",
            done && "pr-10",
          )}
        />
        <AnimatePresence>
          {done && !error && (
            <motion.span
              aria-hidden="true"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3ddc97]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#ff6b7a]">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-[#615a7a]">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++;
  return s;
}
const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["#ff6b7a", "#ff6b7a", "#e0b25c", "#a48bff", "#3ddc97"];

/* ---------- Page ---------- */
export default function SignUpPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const score = passwordScore(password);
  const pwOk = score >= 2 && password.length >= 8;
  const step = [nameOk, emailOk, pwOk].filter(Boolean).length;

  const errors = submitted
    ? {
        name: nameOk ? undefined : "Enter your name, at least 2 letters.",
        email: emailOk ? undefined : "Enter an email like you@example.com.",
        password: pwOk ? undefined : "Use 8 or more characters with letters and a number.",
        agreed: agreed ? undefined : "Tick the box to confirm you understand this is a demo.",
      }
    : {};

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!nameOk || !emailOk || !pwOk || !agreed) return;
    setOpen(true);
    setTimeout(() => router.push("/dashboard"), reduce ? 600 : 2200);
  };

  return (
    <div className="relative grid min-h-screen bg-[#07060d] text-[#f1eef8] lg:grid-cols-[1.05fr_1fr]">
      {/* Left: brand panel with the vault dial */}
      <aside className="relative hidden overflow-hidden border-r border-[#26203d] bg-[#0b0914] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(91,46,255,0.22),transparent_70%)]"
        />
        <Link href="/" aria-label="VaultX home" className="relative self-start">
          <Logo />
        </Link>

        <div className="relative flex flex-col items-center text-center">
          <VaultDial step={step} open={open} />
          <h1 className="mt-10 max-w-md text-[40px] font-semibold leading-[1.08] tracking-[-0.025em]">
            {open ? "Your demo vault is open." : "Three steps to open your demo vault."}
          </h1>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-[#9a93b3]">
            {open
              ? "Taking you to your dashboard with $16,000 of sample funds."
              : "Each detail you fill in turns the dial. You start with sample funds, never real money."}
          </p>
        </div>

        <span className="relative inline-flex items-center gap-1.5 self-start rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2.5 py-1 text-xs text-[#a48bff]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c5cff]" aria-hidden="true" />
          Demo, sample data
        </span>
      </aside>

      {/* Right: the form */}
      <main className="relative flex items-center justify-center px-6 py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(91,46,255,0.16),transparent_70%)] lg:hidden"
        />
        <motion.div
          className="relative w-full max-w-[400px]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/" aria-label="VaultX home">
              <Logo />
            </Link>
            <span className="font-mono text-sm tabular-nums text-[#9a93b3]">{step}/3</span>
          </div>

          <h2 className="text-[28px] font-semibold tracking-tight">Create your demo account</h2>
          <p className="mt-2 text-sm text-[#9a93b3]">
            Already have one?{" "}
            <Link href="/auth" className="text-[#a48bff] underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field
              id="name"
              label="Full name"
              autoComplete="name"
              placeholder="Ada Obi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              done={nameOk}
              disabled={open}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              done={emailOk}
              disabled={open}
            />

            <div>
              <div className="relative">
                <Field
                  id="password"
                  label="Password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  disabled={open}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-[34px] rounded-md px-2 py-1.5 text-xs text-[#9a93b3] hover:text-[#f1eef8]"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength meter */}
              <div className="mt-2.5 flex items-center gap-3" aria-live="polite">
                <div className="grid flex-1 grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-1 overflow-hidden rounded-full bg-[#171329]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={false}
                        animate={{
                          scaleX: password && score > i ? 1 : 0,
                          backgroundColor: STRENGTH_COLOR[score],
                        }}
                        style={{ originX: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                      />
                    </div>
                  ))}
                </div>
                <span className="w-16 text-right text-xs text-[#9a93b3]">{password ? STRENGTH[score] : ""}</span>
              </div>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-[#9a93b3]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={open}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#7c5cff]"
                  aria-describedby={errors.agreed ? "agreed-error" : undefined}
                />
                <span>I understand VaultX is a demo with simulated prices and no real money.</span>
              </label>
              {errors.agreed && (
                <p id="agreed-error" className="mt-1.5 pl-7 text-xs text-[#ff6b7a]">
                  {errors.agreed}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={open}
              whileTap={reduce || open ? undefined : { scale: 0.97 }}
              className="group relative w-full overflow-hidden rounded-[12px] bg-[#7c5cff] py-3.5 text-[15px] font-medium text-white shadow-[0_8px_30px_-8px_rgba(124,92,255,0.7)] transition-colors hover:bg-[#6a48f5] disabled:bg-[#3ddc97] disabled:text-[#07060d] disabled:shadow-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-[30%] -translate-x-[120%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent group-enabled:group-hover:translate-x-[380%] group-enabled:group-hover:transition-transform group-enabled:group-hover:duration-700 motion-reduce:hidden"
              />
              <span className="relative" role="status">
                {open ? "Account created, opening your vault…" : "Create demo account"}
              </span>
            </motion.button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-[#615a7a]">
            <span className="h-px flex-1 bg-[#26203d]" /> or <span className="h-px flex-1 bg-[#26203d]" />
          </div>

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-[12px] border border-[#26203d] py-3.5 text-[15px] font-medium transition-colors hover:border-[#615a7a] active:scale-[0.97]"
          >
            Skip and use the demo account
          </Link>

          <p className="mt-8 text-center text-xs leading-relaxed text-[#615a7a]">
            This sample app doesn&apos;t store your details on a server. Nothing you enter here is sent anywhere.
          </p>
        </motion.div>
      </main>
    </div>
  );
}