"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/lib/WalletContext";
import { Panel, cx } from "@/components/ui";
import { Building2, Leaf, Bitcoin, LineChart, Briefcase, X, Download, CheckCircle2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Category = "All" | "Stocks" | "ETFs" | "Crypto" | "Agriculture" | "Real Estate" | "My Holdings";

const ASSETS = [
  { id: "S1", name: "Novalite Technologies", cat: "Stocks", icon: Briefcase, color: "bg-blue-500/20 text-blue-500", desc: "Listed cloud and chip design company with steady revenue growth.", min: 50, price: 184.20, risk: "MEDIUM" },
  { id: "S2", name: "Apex Energy", cat: "Stocks", icon: Briefcase, color: "bg-blue-500/20 text-blue-500", desc: "Global leader in renewable energy and grid storage solutions.", min: 25, price: 92.15, risk: "LOW" },
  { id: "E1", name: "Vanguard S&P 500", cat: "ETFs", icon: LineChart, color: "bg-purple-500/20 text-purple-500", desc: "Tracks the 500 largest U.S. publicly traded companies.", min: 100, price: 495.20, risk: "LOW" },
  { id: "C1", name: "Bitcoin", cat: "Crypto", icon: Bitcoin, color: "bg-orange-500/20 text-orange-500", desc: "The largest digital currency by market value.", min: 10, price: 94237.74, risk: "HIGH" },
  { id: "A1", name: "Cocoa Estate Note", cat: "Agriculture", icon: Leaf, color: "bg-green-500/20 text-green-500", desc: "Agriculture grown on a 400-hectare estate.", min: 500, price: 1000.00, risk: "LOW", yield: "22% per year" },
  { id: "R1", name: "Central Plaza Commercial", cat: "Real Estate", icon: Building2, color: "bg-yellow-500/20 text-yellow-500", desc: "Premium retail space in high-footfall metropolitan district.", min: 1000, price: 5000.00, risk: "LOW", yield: "8% per year" },
];

export default function InvestPage() {
  const searchParams = useSearchParams();
  const { usdBalance, setUsdBalance, coinBalances, investments, setInvestments } = useWallet();
  const [activeCat, setActiveCat] = useState<Category>("All");
  const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS[0] | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [receipt, setReceipt] = useState<{ id: string, name: string, amount: string, date: string } | null>(null);

  // Auto-switch to holdings if coming from dashboard
  useEffect(() => {
    if (searchParams.get("tab") === "Holdings") setActiveCat("My Holdings");
  }, [searchParams]);

  const filtered = activeCat === "All" ? ASSETS : ASSETS.filter(a => a.cat === activeCat);
  const formatCur = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(investAmount);
    if (!val || !selectedAsset) return;
    if (val < selectedAsset.min) return alert(`Minimum investment is $${selectedAsset.min}`);
    if (val > usdBalance) return alert("Insufficient USD balance.");

    // Deduct Balance
    setUsdBalance(prev => prev - val);
    
    // Save to Global Investments Array
    const newId = `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const dateStr = new Date().toLocaleString();
    
    setInvestments(prev => [{
      id: newId,
      name: selectedAsset.name,
      amount: val,
      date: dateStr,
      yield: selectedAsset.yield || "Variable Market Return"
    }, ...prev]);

    // Show Receipt Modal
    setReceipt({ id: newId, name: selectedAsset.name, amount: formatCur(val), date: dateStr });
  };

  const handleDownload = () => {
    const text = `VaultX Investment Receipt\nID: ${receipt?.id}\nAsset: ${receipt?.name}\nAmount: ${receipt?.amount}\nDate: ${receipt?.date}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${receipt?.id}-receipt.txt`;
    a.click();
    setSelectedAsset(null);
    setReceipt(null);
    setInvestAmount("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Metrics Bar */}
      <div className="flex items-center gap-8 overflow-x-auto pb-4 border-b border-line whitespace-nowrap scrollbar-hide">
        <h1 className="text-2xl font-serif font-bold text-ink mr-4">Invest</h1>
        <div className="flex items-center gap-2"><span className="text-dim text-sm">USD</span><span className="text-ink font-semibold">{formatCur(usdBalance)}</span></div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => setActiveCat("My Holdings")}
          className={cx("px-5 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2", activeCat === "My Holdings" ? "bg-accent border-accent text-white" : "bg-panel border-line text-ink hover:border-accent")}
        >
          <Wallet className="w-4 h-4" /> My Holdings ({investments.length})
        </button>
        {(["All", "Stocks", "ETFs", "Crypto", "Agriculture", "Real Estate"] as Category[]).map(cat => (
          <button 
            key={cat} onClick={() => setActiveCat(cat)}
            className={cx("px-4 py-2 rounded-full text-sm font-medium transition-colors border", activeCat === cat ? "bg-accent/10 border-accent text-accent" : "bg-transparent border-transparent text-dim hover:text-ink hover:border-line")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic Grid: Holdings OR Market Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {activeCat === "My Holdings" ? (
          investments.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-dim border-2 border-dashed border-line rounded-[16px] bg-panel/30">
              <Briefcase className="w-16 h-16 mb-4 text-dim/50" />
              <p className="text-lg font-medium text-ink mb-1">No active investments</p>
              <p className="text-sm">Head to the marketplace to start building your portfolio.</p>
            </div>
          ) : (
            investments.map(inv => (
              <Panel key={inv.id} className="p-0 flex flex-col h-full hover:border-accent transition-colors group">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent/20 text-accent">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1">{inv.name}</h3>
                  <p className="text-sm text-dim mb-4 flex-1">Receipt ID: {inv.id}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-line">
                    <div>
                      <p className="text-[10px] text-dim uppercase">Amount Locked</p>
                      <p className="text-sm font-semibold text-ink">${inv.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dim uppercase">Expected Yield</p>
                      <p className="text-sm font-semibold text-up truncate">{inv.yield}</p>
                    </div>
                  </div>
                  <button className="w-full bg-void text-ink border border-line hover:border-accent hover:text-accent py-2.5 rounded-[10px] text-sm font-bold transition-colors">
                    Manage Position
                  </button>
                </div>
              </Panel>
            ))
          )
        ) : (
          filtered.map(asset => (
            <Panel key={asset.id} className="p-0 flex flex-col h-full hover:border-accent transition-colors group">
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={cx("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", asset.color)}>
                    <asset.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-dim bg-line/50 px-2 py-1 rounded">{asset.cat}</span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-1">{asset.name}</h3>
                <p className="text-sm text-dim leading-relaxed mb-4 flex-1">{asset.desc}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-line">
                  <div>
                    <p className="text-[10px] text-dim uppercase">Minimum</p>
                    <p className="text-sm font-semibold text-ink">${asset.min.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-dim uppercase">{asset.yield ? "Return" : "Price Today"}</p>
                    <p className="text-sm font-semibold text-ink">{asset.yield || `$${asset.price.toFixed(2)}`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAsset(asset)}
                  className="w-full bg-line text-ink hover:bg-accent hover:text-white py-3 rounded-[10px] text-sm font-bold transition-colors"
                >
                  Invest
                </button>
              </div>
            </Panel>
          ))
        )}
      </div>

      {/* Investment Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-panel border border-line rounded-[24px] shadow-2xl overflow-hidden relative"
            >
              {!receipt ? (
                <>
                  <div className="p-6 border-b border-line flex justify-between items-center">
                    <h2 className="text-xl font-bold text-ink">Invest in {selectedAsset.name}</h2>
                    <button onClick={() => { setSelectedAsset(null); setInvestAmount(""); }} className="text-dim hover:text-ink"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleInvest} className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-dim mb-2">Pay with</label>
                      <div className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink font-medium">
                        USD - {formatCur(usdBalance)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dim mb-2">Amount (USD value)</label>
                      <input 
                        type="number" min={selectedAsset.min} max={usdBalance} value={investAmount} onChange={e => setInvestAmount(e.target.value)} placeholder={selectedAsset.min.toString()}
                        className="w-full bg-void border border-accent rounded-[10px] px-4 py-3 text-lg text-ink font-bold outline-none" required
                      />
                      <p className="text-xs text-dim mt-2">Minimum ${selectedAsset.min} - Locked until maturity. This uses {investAmount || "0"} from your USD balance.</p>
                    </div>
                    <button type="submit" className="w-full bg-accent text-white py-4 rounded-[12px] font-bold text-base hover:bg-accent-soft transition-colors">
                      Confirm investment
                    </button>
                  </form>
                </>
              ) : (
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-up/20 text-up rounded-full flex items-center justify-center mb-2"><CheckCircle2 className="w-8 h-8" /></div>
                  <h2 className="text-2xl font-bold text-ink">Investment Confirmed!</h2>
                  <p className="text-dim text-sm">You have successfully invested {receipt.amount} in {receipt.name}.</p>
                  <div className="w-full bg-void border border-line rounded-lg p-4 my-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-dim">Receipt ID</span><span className="font-mono text-ink">{receipt.id}</span></div>
                    <div className="flex justify-between"><span className="text-dim">Date</span><span className="text-ink">{receipt.date}</span></div>
                  </div>
                  <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-line text-ink py-3 rounded-[10px] font-bold hover:bg-white hover:text-black transition-colors">
                    <Download className="w-4 h-4" /> Download Receipt
                  </button>
                  <button onClick={() => { setSelectedAsset(null); setReceipt(null); setInvestAmount(""); setActiveCat("My Holdings"); }} className="text-dim hover:text-ink text-sm font-medium pt-2">View in My Holdings</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}