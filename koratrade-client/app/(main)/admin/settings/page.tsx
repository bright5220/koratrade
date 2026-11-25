"use client";
import React from "react";
import { useWallet } from "@/lib/WalletContext";
import { Panel, cx, Toggle } from "@/components/ui";
import { CreditCard, Bitcoin } from "lucide-react";

export default function AdminSettingsPage() {
  const { paymentMethods, setPaymentMethods } = useWallet();

  const toggleMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">Platform Settings</h1>
      <p className="text-sm text-dim mb-8">Manage global configurations for the VaultX application.</p>

      <Panel title="Deposit & Withdrawal Gateways">
        <p className="text-sm text-dim mb-6">Enable or disable specific payment methods. These changes will instantly reflect in the user Wallet modals.</p>
        
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-void border border-line rounded-[12px]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-panel rounded-full flex items-center justify-center text-dim">
                  {method.type === 'crypto' ? <Bitcoin className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{method.name}</p>
                  <p className="text-xs text-dim mt-0.5 capitalize">{method.type} Gateway</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cx("text-xs font-bold uppercase", method.isActive ? "text-up" : "text-dim")}>{method.isActive ? "Active" : "Disabled"}</span>
                <Toggle checked={method.isActive} onChange={() => toggleMethod(method.id)} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}