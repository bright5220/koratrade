"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/WalletContext";
import { Panel, Button, Badge, cx } from "@/components/ui";
import { Copy, ArrowDownRight, Send, Briefcase, PieChart } from "lucide-react";
import { motion } from "motion/react";

const MOCK_PRICES: Record<string, number> = { BTC: 94237.74, ETH: 3450.21, SOL: 145.60, USDT: 1.00 };

export default function DashboardPage() {
  const router = useRouter();
  const { usdBalance, coinBalances, investments } = useWallet();

  const portfolioValue = Object.entries(coinBalances).reduce((total, [coin, amount]) => {
    return total + (amount * (MOCK_PRICES[coin] || 0));
  }, 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2 tracking-wide">Overview</h1>
          <p className="text-dim text-sm">Hello, Ben. Here is how your money is doing.</p>
        </div>
        <div className="flex items-center gap-2 bg-panel border border-line rounded-full px-4 py-2">
          <span className="text-xs text-dim">Account ID</span>
          <span className="text-sm font-semibold text-ink">FV-9988-7766</span>
          <button onClick={() => alert("Copied!")} className="text-accent hover:text-accent-soft ml-1">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 3 Colored Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ y: -2 }} className="bg-[#1a2b4c] rounded-[16px] p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-sm font-medium text-white/70 mb-1">Wallet balance</p>
            <h2 className="text-3xl font-bold text-white">{formatCurrency(usdBalance)}</h2>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => router.push('/wallet')} className="bg-white text-black px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">Deposit</button>
            <button onClick={() => router.push('/wallet')} className="bg-black/20 border border-white/20 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-black/40 transition-colors">Withdraw</button>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[#f5a623] rounded-[16px] p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-sm font-medium text-black/70 mb-1">Portfolio value</p>
            <h2 className="text-3xl font-bold text-black">{formatCurrency(portfolioValue)}</h2>
          </div>
          <p className="text-sm text-black/80 font-medium mt-4">Active crypto assets</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[#1b5e3a] rounded-[16px] p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-sm font-medium text-white/70 mb-1">Total gain</p>
            <h2 className="text-3xl font-bold text-white">+{formatCurrency(portfolioValue * 0.015)}</h2>
          </div>
          <p className="text-sm text-white/80 font-medium mt-4">overall</p>
        </motion.div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button onClick={() => router.push('/invest')} className="flex flex-col items-center justify-center gap-2 bg-panel border border-line rounded-[12px] p-4 hover:border-accent hover:text-accent transition-colors text-ink">
          <Briefcase className="w-5 h-5" />
          <span className="text-sm font-medium">Invest</span>
        </button>
        <button onClick={() => router.push('/wallet')} className="flex flex-col items-center justify-center gap-2 bg-panel border border-line rounded-[12px] p-4 hover:border-accent hover:text-accent transition-colors text-ink">
          <ArrowDownRight className="w-5 h-5" />
          <span className="text-sm font-medium">Deposit</span>
        </button>
        <button onClick={() => router.push('/send')} className="flex flex-col items-center justify-center gap-2 bg-panel border border-line rounded-[12px] p-4 hover:border-accent hover:text-accent transition-colors text-ink">
          <Send className="w-5 h-5" />
          <span className="text-sm font-medium">Send</span>
        </button>
        <button onClick={() => router.push('/invest?tab=Holdings')} className="flex flex-col items-center justify-center gap-2 bg-panel border border-line rounded-[12px] p-4 hover:border-accent hover:text-accent transition-colors text-ink">
          <PieChart className="w-5 h-5" />
          <span className="text-sm font-medium">Holdings</span>
        </button>
      </div>

      {/* Restored Lower Sections */}
      <div className="grid grid-cols-1 gap-6">
        <Panel title="Where your money is">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-24 h-24 rounded-full border-8 border-line border-t-[#f5a623] border-r-[#1b5e3a] border-b-accent relative mb-4">
              <div className="absolute inset-0 bg-void rounded-full m-2"></div>
            </div>
            <div className="flex gap-4 text-xs text-dim font-medium">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f5a623]"></div> Agriculture</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#1b5e3a]"></div> Real Estate</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent"></div> Stocks</span>
            </div>
          </div>
        </Panel>

        <Panel title="Recent activity" aside={<button onClick={() => router.push('/wallet')} className="text-sm bg-line px-3 py-1.5 rounded-md hover:bg-line/80 font-medium text-ink transition-colors">View all</button>}>
          <div className="divide-y divide-line">
            
            {/* Inject dynamic investments into recent activity if any exist */}
            {investments.slice(0, 1).map(inv => (
              <div key={inv.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-line flex items-center justify-center shrink-0 mt-0.5"><Briefcase className="w-4 h-4 text-dim" /></div>
                  <div>
                    <p className="font-semibold text-ink text-sm">Investment - {inv.name}</p>
                    <p className="text-xs text-dim mt-1">{inv.date} - Receipt ID: {inv.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right justify-between md:justify-end">
                  <p className="font-semibold text-ink text-sm">-${inv.amount.toFixed(2)}</p>
                  <Button variant="secondary" className="py-1 px-3 text-xs bg-void">Receipt</Button>
                </div>
              </div>
            ))}

            <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-line flex items-center justify-center shrink-0 mt-0.5"><ArrowDownRight className="w-4 h-4 text-dim" /></div>
                <div>
                  <p className="font-semibold text-ink text-sm">Deposit</p>
                  <p className="text-xs text-dim mt-1">23 Oct 2026 - Bitcoin (BTC) - DEPABCD6E9A</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right justify-between md:justify-end">
                <div>
                  <p className="font-semibold text-ink text-sm">+20.00</p>
                  <Badge tone="neutral" className="mt-1">PENDING</Badge>
                </div>
                <Button variant="secondary" className="py-1 px-3 text-xs bg-void">Receipt</Button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}