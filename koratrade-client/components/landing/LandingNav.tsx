"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { SecondaryButton } from "./LandingButton";

export function LandingNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 24], [0, 0.8]);
  const blur = useTransform(scrollY, [0, 24], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.header 
      style={{ backgroundColor: useTransform(bgOpacity, v => `rgba(37, 33, 51, ${v})`), backdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" aria-label="VaultX Home" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="stroke-accent" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="12" cy="12" r="4" className="fill-accent" />
          </svg>
          <span className="font-semibold text-ink tracking-tight">VaultX</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-dim hover:text-ink transition-colors">What's inside</a>
          <SecondaryButton href="/auth" className="px-4 py-2 !rounded-[8px]">Sign in</SecondaryButton>
        </div>
      </div>
    </motion.header>
  );
}