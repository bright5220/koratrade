"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/WalletContext";
import { cx, Panel } from "@/components/ui";
import { ArrowDownRight, ArrowUpRight, Send, Briefcase, Copy, X, CreditCard, Bitcoin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Tab = "All" | "Deposits" | "Withdrawals" | "Transfers" | "Investments";

export default function WalletPage() {
  const router = useRouter();
  const { usdBalance, transactions, paymentMethods } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [modalMode, setModalMode] = useState<"deposit" | "withdraw" | null>(null);

  const formatCur = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const activeMethods = paymentMethods.filter(m => m.isActive);

  const filteredTxs = transactions.filter(tx => {
    if (activeTab === "All") return true;
    if (activeTab === "Deposits" && tx.type === "Deposit") return true;
    if (activeTab === "Withdrawals" && tx.type === "Withdrawal") return true;
    if (activeTab === "Transfers" && tx.type === "Transfer") return true;
    if (activeTab === "Investments" && tx.type === "Investment") return true;
    return false;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
      {/* Left Column: Transactions */}
      <div className="flex-1 space-y-6">
        <div className="flex gap-2 border-b border-line pb-2 overflow-x-auto scrollbar-hide">
          {(["All", "Deposits", "Withdrawals", "Transfers", "Investments"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cx("px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors", activeTab === tab ? "bg-accent text-white" : "bg-void text-dim hover:text-ink")}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTxs.map(tx => (
            <div key={tx.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[12px] hover:bg-panel transition-colors border border-transparent hover:border-line">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-panel border border-line flex items-center justify-center shrink-0">
                  {tx.type === "Deposit" ? <ArrowDownRight className="w-5 h-5 text-ink" /> :
                   tx.type === "Withdrawal" ? <ArrowUpRight className="w-5 h-5 text-ink" /> :
                   tx.type === "Investment" ? <Briefcase className="w-5 h-5 text-ink" /> : <Send className="w-5 h-5 text-ink" />}
                </div>
                <div>
                  <p className="font-bold text-ink">{tx.title}</p>
                  <p className="text-xs text-dim mt-1">{tx.date} - {tx.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className={cx("font-bold text-sm", tx.amount > 0 ? "text-up" : "text-ink")}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                  </p>
                  {tx.status === "PENDING" && <span className="text-[10px] uppercase font-bold text-dim bg-line px-2 py-0.5 rounded mt-1 inline-block">PENDING</span>}
                </div>
                <button className="text-xs bg-void border border-line px-3 py-1.5 rounded hover:border-accent hover:text-accent transition-colors">Receipt</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Wallet Cards */}
      <div className="w-full lg:w-80 space-y-4 shrink-0">
        <Panel className="bg-[#1a2b4c] border-none p-6 rounded-[24px]">
          <div className="mb-8">
            <h2 className="text-white font-serif text-2xl font-bold mb-1">Wallet</h2>
            <p className="text-white/60 text-xs">Your balance and every movement of money.</p>
          </div>
          <div className="mb-8">
            <p className="text-white/70 text-sm font-medium mb-1">Available balance</p>
            <h3 className="text-3xl font-bold text-white mb-2">{formatCur(usdBalance)}</h3>
            <p className="text-xs text-white/50 bg-black/20 inline-block px-2 py-1 rounded">+$5,020.00 deposit pending</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setModalMode("deposit")} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-[12px] text-sm font-semibold transition-colors border border-white/10"><ArrowDownRight className="w-4 h-4" /> Deposit</button>
            <button onClick={() => setModalMode("withdraw")} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-[12px] text-sm font-semibold transition-colors border border-white/10"><ArrowUpRight className="w-4 h-4" /> Withdraw</button>
            <button onClick={() => router.push('/send')} className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-[12px] text-sm font-bold hover:bg-gray-200 transition-colors"><Send className="w-4 h-4" /> Send</button>
          </div>
        </Panel>

        <Panel className="flex justify-between items-center p-5 rounded-[24px]">
          <div>
            <p className="text-xs text-dim mb-1">Your Account ID</p>
            <p className="font-bold text-ink text-sm">FV-9988-7766</p>
          </div>
          <button onClick={() => alert("Copied!")} className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-white transition-colors bg-accent/10 px-3 py-2 rounded-[8px]"><Copy className="w-3 h-3" /> Copy</button>
        </Panel>
      </div>

      {/* Dynamic Deposit/Withdraw Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-panel border border-line rounded-[24px] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-line flex justify-between items-center">
                <h2 className="text-xl font-bold text-ink capitalize">{modalMode} Funds</h2>
                <button onClick={() => setModalMode(null)} className="text-dim hover:text-ink"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-dim">Select an approved {modalMode} method:</p>
                {activeMethods.length === 0 ? (
                  <div className="p-4 bg-void border border-line rounded-[12px] text-center text-sm text-dim">No methods currently available. Please contact support.</div>
                ) : (
                  activeMethods.map(method => (
                    <button key={method.id} className="w-full flex items-center justify-between p-4 bg-void border border-line hover:border-accent rounded-[12px] transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-panel rounded-full flex items-center justify-center group-hover:text-accent transition-colors">
                          {method.type === 'crypto' ? <Bitcoin className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        </div>
                        <span className="font-semibold text-ink text-sm">{method.name}</span>
                      </div>
                      <ArrowDownRight className="w-4 h-4 text-dim group-hover:text-accent" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}