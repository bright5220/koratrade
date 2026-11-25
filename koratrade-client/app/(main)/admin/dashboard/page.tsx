"use client";
import React from "react";
import { Panel, cx, Badge } from "@/components/ui";
import { Users, ArrowDownRight, Activity, Wallet, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboardPage() {
  const formatCur = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">Admin Command Center</h1>
        <p className="text-sm text-dim">Platform overview and real-time system metrics.</p>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div whileHover={{ y: -2 }} className="bg-panel border border-line rounded-[16px] p-5">
          <div className="flex items-center gap-3 mb-3 text-dim"><Wallet className="w-5 h-5 text-accent" /> <span className="text-sm font-semibold">Total Platform TVL</span></div>
          <h2 className="text-2xl font-bold text-ink">{formatCur(12450000.00)}</h2>
          <p className="text-xs text-up mt-2 font-medium">+2.4% this week</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -2 }} className="bg-panel border border-line rounded-[16px] p-5">
          <div className="flex items-center gap-3 mb-3 text-dim"><Users className="w-5 h-5 text-accent" /> <span className="text-sm font-semibold">Active Users</span></div>
          <h2 className="text-2xl font-bold text-ink">4,281</h2>
          <p className="text-xs text-up mt-2 font-medium">+124 new today</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-panel border border-line rounded-[16px] p-5">
          <div className="flex items-center gap-3 mb-3 text-dim"><ArrowDownRight className="w-5 h-5 text-[#f5a623]" /> <span className="text-sm font-semibold">Pending Deposits</span></div>
          <h2 className="text-2xl font-bold text-ink">18</h2>
          <p className="text-xs text-[#f5a623] mt-2 font-medium">Requires approval</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-panel border border-line rounded-[16px] p-5">
          <div className="flex items-center gap-3 mb-3 text-dim"><ShieldAlert className="w-5 h-5 text-down" /> <span className="text-sm font-semibold">Pending KYC</span></div>
          <h2 className="text-2xl font-bold text-ink">7</h2>
          <p className="text-xs text-dim mt-2 font-medium">In review queue</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="System Alerts & Health">
          <div className="space-y-4">
            <div className="flex gap-3 items-start p-3 bg-void border border-line rounded-[10px]">
              <Activity className="w-5 h-5 text-up shrink-0" />
              <div>
                <p className="text-sm font-bold text-ink">Trading Engine Operational</p>
                <p className="text-xs text-dim mt-0.5">All global market feeds are synced and latency is &lt; 50ms.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-[10px]">
              <ShieldAlert className="w-5 h-5 text-[#f5a623] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#f5a623]">High Withdrawal Volume Detected</p>
                <p className="text-xs text-[#f5a623]/80 mt-0.5">Unusual spike in SOL withdrawals over the last hour.</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Recent Platform Activity">
          <div className="divide-y divide-line">
            {[
              { a: "New User Registration", u: "mike@example.com", t: "2 mins ago" },
              { a: "Large Deposit Initiated", u: "FV-4451-9920", t: "15 mins ago" },
              { a: "KYC Document Uploaded", u: "FV-9988-7766", t: "1 hour ago" },
            ].map((act, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-ink">{act.a}</p>
                  <p className="text-xs text-dim">{act.u}</p>
                </div>
                <span className="text-xs text-dim">{act.t}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}