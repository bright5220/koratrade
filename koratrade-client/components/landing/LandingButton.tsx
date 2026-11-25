"use client";
import Link from "next/link";
import { motion } from "motion/react";

export function PrimaryButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }} className="inline-block w-full sm:w-auto">
      <motion.div whileHover="hover" initial="initial">
        <Link 
          href={href} 
          className={`relative overflow-hidden inline-flex items-center justify-center rounded-[12px] bg-accent text-white px-8 py-3.5 text-sm font-medium transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void w-full sm:w-auto ${className}`}
        >
          {children}
          <motion.span 
            className="absolute inset-0 z-10 w-[30%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
            variants={{
              initial: { x: "-150%" },
              hover: { x: "400%", transition: { duration: 0.7, ease: "easeInOut" } }
            }}
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function SecondaryButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }} className="inline-block w-full sm:w-auto">
      <Link 
        href={href} 
        className={`relative inline-flex items-center justify-center rounded-[12px] border border-line bg-transparent text-ink px-8 py-3.5 text-sm font-medium transition-colors hover:border-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void w-full sm:w-auto ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}