"use client";
import React, { useState } from "react";
import { useWallet } from "@/lib/WalletContext";
import { Panel, cx } from "@/components/ui";
import { Copy, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SendPage() {
  const { usdBalance } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-ink mb-8">Send money</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Send Process */}
        <div className="flex-1 space-y-4">
          
          {/* Step 1 */}
          <Panel className={cx("transition-opacity", step === 1 ? "opacity-100" : "opacity-50")}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-ink text-lg">1. Find member</h2>
              <p className="text-xs text-dim">Instant free transfers to other VaultX members.</p>
            </div>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={step === 2}
                placeholder="Recipient's Account ID or email" 
                className="flex-1 bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink outline-none focus:border-accent disabled:opacity-50"
              />
              <button 
                onClick={() => { if(recipient) setStep(2); }}
                disabled={!recipient || step === 2}
                className="bg-accent text-white px-6 py-3 rounded-[10px] text-sm font-bold hover:bg-accent-soft transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                Find member <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-dim font-medium">Recent recipients</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setRecipient("FV-4556-3392"); setStep(2); }} className="bg-void border border-line hover:border-accent text-xs font-semibold text-ink px-3 py-1.5 rounded-full transition-colors">FV-4556-3392</button>
                <button onClick={() => { setRecipient("FV-0000-0001"); setStep(2); }} className="bg-void border border-line hover:border-accent text-xs font-semibold text-ink px-3 py-1.5 rounded-full transition-colors">FV-0000-0001</button>
              </div>
            </div>
          </Panel>

          {/* Step 2 */}
          <Panel className={cx("transition-opacity relative overflow-hidden", step === 2 ? "opacity-100" : "opacity-40 pointer-events-none")}>
            {step === 2 && (
              <button onClick={() => setStep(1)} className="absolute top-6 right-6 text-xs text-accent hover:text-white">Change Recipient</button>
            )}
            <h2 className="font-bold text-ink text-lg mb-6">2. Amount and PIN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-dim mb-1">Sending to</label>
                <div className="bg-void border border-line rounded-[10px] p-3 text-sm font-semibold text-ink flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-up" /> {recipient}</div>
              </div>
              <div>
                <label className="block text-xs text-dim mb-1">Amount (USD)</label>
                <input type="number" placeholder="0.00" className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-lg font-bold text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-dim mb-1">4-Digit Security PIN</label>
                <input type="password" maxLength={4} placeholder="••••" className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-lg text-ink tracking-[0.5em] outline-none focus:border-accent" />
              </div>
              <button className="w-full bg-accent text-white py-4 rounded-[12px] font-bold text-base mt-2 hover:bg-accent-soft transition-colors">
                Authorize Transfer
              </button>
            </div>
          </Panel>
        </div>

        {/* Right Column: Receive */}
        <div className="w-full md:w-80 shrink-0">
          <Panel className="bg-panel border border-line rounded-[24px]">
            <h2 className="font-bold text-ink text-lg mb-4">Receive money</h2>
            <p className="text-sm text-dim leading-relaxed mb-6">Share your Account ID with another member so they can send you money.</p>
            
            <div className="bg-void border border-line rounded-[16px] p-6 text-center mb-6">
              <p className="text-2xl font-bold text-ink mb-3 tracking-wide">FV-9988-7766</p>
              <button onClick={() => alert("Copied")} className="flex items-center justify-center gap-2 w-full bg-line text-ink hover:bg-white hover:text-black py-2 rounded-[8px] text-xs font-semibold transition-colors">
                <Copy className="w-3 h-3" /> Copy Account ID
              </button>
            </div>

            <div className="flex justify-between items-center text-sm border-t border-line pt-4">
              <span className="text-dim">Available Balance:</span>
              <span className="font-bold text-ink">${usdBalance.toLocaleString()}</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}