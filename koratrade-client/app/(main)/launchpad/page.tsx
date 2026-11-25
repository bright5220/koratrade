"use client";
import React, { useState } from "react";
import { Panel, cx } from "@/components/ui";

export default function LaunchpadPage() {
  const [amount, setAmount] = useState("1000");
  const [tier, setTier] = useState(30);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Configuration Column */}
      <div className="w-full md:w-1/3 space-y-6">
        <h1 className="text-2xl font-serif font-bold text-ink">DAO Launchpad & Staking</h1>
        <Panel title="Stake for Benefits">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2"><span className="text-dim">Amount to lock</span><span className="text-ink font-bold">Available: 5,000 VX</span></div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-ink outline-none focus:border-accent" />
          </div>
          <div className="mb-8 space-y-3">
            <p className="text-sm text-dim mb-2">Lock period & Promotional Tier</p>
            {[{ d: 30, t: "Base", a: "12% APY" }, { d: 90, t: "Silver", a: "28% APY" }, { d: 180, t: "Gold", a: "54% APY" }].map(opt => (
              <button key={opt.d} onClick={() => setTier(opt.d)} className={cx("w-full flex justify-between items-center p-4 rounded-[10px] border transition-colors", tier === opt.d ? "bg-accent/10 border-accent" : "bg-void border-line")}>
                <div className="text-left">
                  <p className={cx("font-bold text-sm", tier === opt.d ? "text-accent" : "text-ink")}>{opt.d} Days ({opt.t})</p>
                  <p className="text-xs text-dim mt-0.5">{opt.d === 30 ? "Standard Returns" : "Early Launchpad Access"}</p>
                </div>
                <span className="font-bold text-ink text-sm">{opt.a}</span>
              </button>
            ))}
          </div>
          <button className="w-full bg-accent hover:bg-accent-soft text-white font-bold py-4 rounded-[12px] transition-colors">
            Lock & Activate Tier
          </button>
        </Panel>
      </div>

      {/* Stats Column */}
      <div className="w-full md:w-2/3 space-y-6 pt-12">
        <div className="grid grid-cols-2 gap-4">
          <Panel className="bg-[#1a2b4c] border-none"><p className="text-sm text-white/70 mb-2">Total Locked Value</p><p className="text-4xl font-bold text-white">0</p></Panel>
          <Panel className="bg-void border border-line"><p className="text-sm text-dim mb-2">Active DAO Stakes</p><p className="text-4xl font-bold text-ink">0</p></Panel>
        </div>
        <Panel title="Your Active Promotional Packages" className="h-64 flex flex-col items-center justify-center text-center">
          <p className="text-dim text-sm mt-8">No active packages<br/>Stake your tokens to gain VIP access to early crypto launches and earn up to 54% APY.</p>
        </Panel>
      </div>
    </div>
  );
}