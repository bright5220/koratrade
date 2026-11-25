"use client";
import React, { useState } from "react";
import { Panel, cx, Toggle } from "@/components/ui";
import { Cpu, ShieldCheck, Zap, Activity } from "lucide-react";

export default function BotPage() {
  const [isActive, setIsActive] = useState(false);
  const [stopLoss, setStopLoss] = useState(15);
  const [strategy, setStrategy] = useState("Balanced");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Controls */}
        <div className="md:col-span-1 space-y-6">
          <Panel>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-ink flex items-center gap-2"><Cpu className="w-5 h-5 text-accent" /> AI Engine Core</h3>
            </div>
            <p className="text-sm text-dim mb-6">Executes trades with up to 89% accuracy.</p>
            
            <div className="flex items-center justify-between p-4 bg-void border border-line rounded-[12px] mb-4">
              <div>
                <p className="font-semibold text-ink text-sm">Engine Active (24/7)</p>
                <p className="text-xs text-dim mt-1">Scanning markets globally</p>
              </div>
              <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
            </div>

            <div className="p-4 bg-void border border-line rounded-[12px]">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-ink text-sm">Hard Stop-Loss Limit</p>
                <span className="text-accent font-bold">{stopLoss}%</span>
              </div>
              <input type="range" min="5" max="30" value={stopLoss} onChange={e => setStopLoss(parseInt(e.target.value))} className="w-full accent-accent" />
              <p className="text-xs text-dim mt-4">Strict algorithmic risk management. The engine will instantly halt trading if portfolio drawdown reaches {stopLoss}%.</p>
            </div>
          </Panel>
        </div>

        {/* Strategies & Logs */}
        <div className="md:col-span-2 space-y-6">
          <Panel title="Operational Strategy">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{n: "Cautious (Preservation)", d: "Focuses on capital protection."}, {n: "Balanced (Recommended)", d: "Optimal risk-to-reward ratio."}, {n: "Aggressive (High Yield)", d: "Frequent algorithmic trades."}].map(s => (
                <button key={s.n} onClick={() => setStrategy(s.n)} className={cx("p-4 rounded-[12px] border text-left transition-colors", strategy === s.n ? "bg-accent/10 border-accent" : "bg-void border-line hover:border-accent/50")}>
                  <p className={cx("font-bold text-sm mb-2", strategy === s.n ? "text-accent" : "text-ink")}>{s.n}</p>
                  <p className="text-xs text-dim leading-relaxed">{s.d}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Live AI Trade Log">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-line">
                <div className="flex gap-4 items-center">
                  <span className="text-xs text-dim">Just now</span>
                  <span className="text-xs font-bold bg-up/20 text-up px-2 py-1 rounded">PROFIT SECURED</span>
                  <span className="text-sm font-bold text-ink">BTC/USD</span>
                </div>
                <span className="text-sm text-dim">Algorithmic entry executed at 89.2% confidence</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}