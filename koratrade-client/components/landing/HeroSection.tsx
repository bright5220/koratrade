"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-void flex flex-col items-center text-center px-4 min-h-screen">
      {/* Deep Background Glow */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-ink mb-6 tracking-tight leading-tight">
          Practise trading crypto with money that isn't real.
        </h1>
        <p className="text-lg md:text-xl text-dim mb-10 max-w-2xl mx-auto leading-relaxed">
          VaultX is a paper-trading demo. Live-style prices, a full order book and a strategy simulator, all with sample funds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="bg-accent hover:bg-accent-soft text-white px-8 py-3.5 rounded-full font-medium text-lg transition-colors flex items-center gap-2"
          >
            Open the demo <ChevronRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/auth"
            className="bg-transparent border border-line text-ink hover:border-accent hover:text-accent px-8 py-3.5 rounded-full font-medium text-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
      </motion.div>

      {/* 3D Animated Dashboard Mockup */}
      <div style={{ perspective: "1200px" }} className="w-full max-w-5xl relative z-10 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 150, rotateX: 25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.2 }}
          className="w-full rounded-[24px] border border-line bg-panel p-2 shadow-[0_0_100px_rgba(124,92,255,0.15)]"
        >
          {/* Inner Screen Representation */}
          <div className="w-full aspect-[16/9] rounded-[20px] bg-void border border-line overflow-hidden relative flex flex-col">
            
            {/* Mock Top Nav */}
            <div className="w-full h-16 border-b border-line flex items-center px-6 justify-between bg-panel/50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-accent rounded-full" />
                </div>
                <div className="w-24 h-5 bg-line rounded-md" />
              </div>
              <div className="w-16 h-8 bg-line rounded-full" />
            </div>

            {/* Mock Content Area */}
            <div className="flex flex-1 w-full">
              {/* Mock Sidebar */}
              <div className="w-64 border-r border-line p-6 space-y-4 hidden md:block">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-8 bg-line/30 rounded-md" />
                ))}
              </div>
              
              {/* Mock Main Dashboard */}
              <div className="flex-1 p-8 space-y-8 flex flex-col">
                <div className="w-64 h-12 bg-line/50 rounded-lg" />
                
                <div className="flex gap-6">
                  <div className="h-32 flex-1 bg-line/20 border border-line rounded-xl" />
                  <div className="h-32 flex-1 bg-line/20 border border-line rounded-xl" />
                  <div className="h-32 flex-1 bg-line/20 border border-line rounded-xl" />
                </div>

                <div className="flex-1 bg-gradient-to-t from-accent/5 to-transparent border border-line rounded-xl relative overflow-hidden">
                  {/* Decorative chart line */}
                  <svg className="absolute bottom-0 w-full h-full preserve-3d" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <path 
                      d="M0,300 L0,250 C100,200 200,280 300,150 C400,20 500,220 600,100 C700,-20 800,180 900,100 L1000,50 L1000,300 Z" 
                      fill="rgba(124, 92, 255, 0.1)" 
                    />
                    <path 
                      d="M0,250 C100,200 200,280 300,150 C400,20 500,220 600,100 C700,-20 800,180 900,100 L1000,50" 
                      fill="none" 
                      stroke="#1b5e3a" 
                      strokeWidth="4" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}