"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "@/lib/AuthContext";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const EASE = [0.22, 1, 0.36, 1] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12.5" fill="none" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="8" fill="none" stroke="#7c5cff" strokeOpacity="0.45" />
        <path d="M14 4.5v4M14 19.5v4M4.5 14h4M19.5 14h4" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2" fill="#7c5cff" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-[#f1eef8]">VaultX</span>
    </span>
  );
}

function Field({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<"input"> & { id: string; label: string; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-[#9a93b3]">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        {...props}
        className={cx(
          "w-full rounded-[12px] border bg-[#07060d] px-4 py-3 text-[15px] text-[#f1eef8] outline-none transition-colors placeholder:text-[#615a7a]",
          error ? "border-[#ff6b7a]" : "border-[#26203d] focus:border-[#7c5cff]",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-[#ff6b7a]">{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const reduce = useReducedMotion();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Pass the exact fields your AuthContext expects
        login({ 
          email: data.user.email, 
          isAdmin: data.user.isAdmin,
          balance: data.user.balance || 0,
          kycStatus: data.user.kycStatus || "Pending",
          botActive: data.user.botActive || false
        });
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    }
    setLoading(false);
  };

  const loginAsDemo = () => {
    // Pass the exact fields your AuthContext expects here too
    login({ 
      email: "demo@vaultx.app", 
      isAdmin: false,
      balance: 16361.24,
      kycStatus: "Approved",
      botActive: true
    });
    router.push("/dashboard");
  };

  return (
    <div className="relative grid min-h-screen bg-[#07060d] text-[#f1eef8] lg:grid-cols-[1.05fr_1fr]">
      {/* Left: brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-[#26203d] bg-[#0b0914] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(91,46,255,0.22),transparent_70%)]"
        />
        <Link href="/" aria-label="VaultX home" className="relative self-start">
          <Logo />
        </Link>

        <div className="relative flex flex-col justify-center max-w-md">
          <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.025em]">
            Your paper portfolio is where you left it.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[#9a93b3]">
            Sign in to keep trading with sample funds and simulated prices.
          </p>
        </div>

        <span className="relative inline-flex items-center gap-1.5 self-start rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2.5 py-1 text-xs text-[#a48bff]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c5cff]" aria-hidden="true" />
          Demo, sample data
        </span>
      </aside>

      {/* Right: the form */}
      <main className="relative flex items-center justify-center px-6 py-14">
        <motion.div
          className="relative w-full max-w-[360px]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="mb-10 lg:hidden">
            <Link href="/" aria-label="VaultX home">
              <Logo />
            </Link>
          </div>

          <h2 className="text-[28px] font-semibold tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-[#9a93b3]">
            New to VaultX?{" "}
            <Link href="/signup" className="text-[#a48bff] underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {error && (
              <div className="rounded-[12px] border border-[#ff6b7a]/30 bg-[#ff6b7a]/10 p-3 text-sm text-[#ff6b7a]">
                {error}
              </div>
            )}
            
            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="group relative mt-2 w-full overflow-hidden rounded-[12px] bg-[#7c5cff] py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#6a48f5] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-[#615a7a]">
            <span className="h-px flex-1 bg-[#26203d]" /> or <span className="h-px flex-1 bg-[#26203d]" />
          </div>

          <button
            onClick={loginAsDemo}
            className="flex w-full items-center justify-center rounded-[12px] border border-[#26203d] bg-transparent py-3.5 text-[15px] font-medium text-[#f1eef8] transition-colors hover:border-[#615a7a] active:scale-[0.97]"
          >
            Continue as Demo Trader
          </button>
        </motion.div>
      </main>
    </div>
  );
}