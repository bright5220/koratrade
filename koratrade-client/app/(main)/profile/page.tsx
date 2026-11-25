"use client";
import React, { useState } from "react";
import { Panel, cx } from "@/components/ui";
import { User, Shield, CheckCircle2, LogOut, Lock, Copy } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [interests, setInterests] = useState<string[]>(["Stocks", "Crypto"]);

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">Profile</h1>
      <p className="text-sm text-dim mb-8">Manage your details, security, and KYC records.</p>
      
      <div className="flex gap-6 border-b border-line mb-8">
        {[
          { id: "Profile", icon: User },
          { id: "Security", icon: Lock },
          { id: "Verification (KYC)", icon: Shield }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cx("flex items-center gap-2 pb-3 text-sm font-semibold transition-colors border-b-2", activeTab === tab.id ? "text-accent border-accent" : "text-dim border-transparent hover:text-ink")}>
            <tab.icon className="w-4 h-4" /> {tab.id}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Forms */}
        <div className="flex-1">
          <Panel title="Personal details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Full name</label>
                <input type="text" defaultValue="Ben Carson" className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Email (contact support to change)</label>
                <input type="email" defaultValue="user@mail.com" disabled className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-dim opacity-50 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Phone</label>
                <input type="text" defaultValue="+2348000001111" className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Country</label>
                <select className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink outline-none focus:border-accent appearance-none">
                  <option>Angola</option>
                  <option selected>Nigeria</option>
                  <option>United States</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-dim mb-1.5">Investor style</label>
                <select className="w-full bg-void border border-line rounded-[10px] px-4 py-3 text-sm text-ink outline-none focus:border-accent appearance-none">
                  <option selected>Balanced</option>
                  <option>Aggressive</option>
                  <option>Conservative</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-medium text-dim mb-3">Areas of interest</label>
              <div className="flex flex-wrap gap-2">
                {["Stocks", "ETFs", "Crypto", "Agriculture", "Real Estate"].map(i => (
                  <button key={i} onClick={() => toggleInterest(i)} className={cx("px-4 py-2 rounded-full text-xs font-bold transition-all border", interests.includes(i) ? "bg-accent/20 border-accent text-accent" : "bg-void border-line text-dim hover:border-accent hover:text-ink")}>
                    {interests.includes(i) && "✓ "} {i}
                  </button>
                ))}
              </div>
            </div>

            <button className="bg-accent text-white px-6 py-3 rounded-[10px] text-sm font-bold hover:bg-accent-soft transition-colors">
              Save changes
            </button>
          </Panel>
        </div>

        {/* Right Column: Account Card */}
        <div className="w-full md:w-80 shrink-0">
          <Panel title="Account" className="p-0 overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-dim">Account ID</span>
                <span className="text-sm font-bold text-ink flex items-center gap-2">FV-9988-7766 <Copy className="w-3 h-3 text-accent cursor-pointer" /></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dim">Verification</span>
                <span className="text-xs font-bold text-up bg-up/10 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dim">Member since</span>
                <span className="text-sm font-bold text-ink">17 October 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dim">Role</span>
                <span className="text-sm font-bold text-ink">User</span>
              </div>
            </div>
            <button className="w-full bg-panel hover:bg-line border-t border-line text-dim hover:text-ink flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}