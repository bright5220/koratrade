"use client";
import React, { useState } from "react";
import { Panel, cx } from "@/components/ui";
import { 
  ArrowLeft, Copy, MessageSquare, AlertTriangle, 
  CheckCircle2, Search, MoreHorizontal 
} from "lucide-react";

// Mock database for the "All Users" view
const MOCK_USERS = [
  { id: "FV-9988-7766", name: "Ben Carson", email: "user@mail.com", country: "Angola", balance: 436339.98, status: "ACTIVE", kyc: "VERIFIED", joined: "17 Oct 2026" },
  { id: "FV-1122-3344", name: "Sarah Jenkins", email: "sarah.j@mail.com", country: "United Kingdom", balance: 15420.00, status: "INVESTIGATION", kyc: "PENDING", joined: "22 Nov 2026" },
  { id: "FV-5544-3322", name: "Michael Chen", email: "m.chen@mail.com", country: "Singapore", balance: 890.50, status: "SUSPENDED", kyc: "VERIFIED", joined: "01 Nov 2026" },
];

export default function AdminManageUsersPage() {
  const [view, setView] = useState<"list" | "detail">("detail");
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [search, setSearch] = useState("");

  const formatCur = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const filteredUsers = MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()));

  // -------------------------
  // LIST VIEW
  // -------------------------
  if (view === "list") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-2">Manage Users</h1>
            <p className="text-sm text-dim">View, edit, and moderate platform members.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-dim" />
            <input 
              type="text" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-void border border-line rounded-[10px] pl-10 pr-4 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
        </div>

        <Panel className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-void border-b border-line text-xs uppercase tracking-wider text-dim">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Account ID</th>
                  <th className="p-4 font-semibold">Balance</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-void/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-ink">{user.name}</p>
                      <p className="text-xs text-dim">{user.email}</p>
                    </td>
                    <td className="p-4 text-sm font-mono text-ink">{user.id}</td>
                    <td className="p-4 text-sm font-bold text-ink">{formatCur(user.balance)}</td>
                    <td className="p-4">
                      <span className={cx("text-[10px] font-bold px-2 py-1 rounded", user.status === "ACTIVE" ? "bg-up/10 text-up" : user.status === "SUSPENDED" ? "bg-down/10 text-down" : "bg-[#f5a623]/10 text-[#f5a623]")}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setSelectedUser(user); setView("detail"); }} className="text-xs bg-line text-ink hover:bg-accent hover:text-white px-3 py-1.5 rounded-[8px] font-bold transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }

  // -------------------------
  // DETAIL VIEW
  // -------------------------
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink mb-1">{selectedUser.name}</h1>
        <p className="text-sm text-dim mb-4">Account {selectedUser.id} · Joined {selectedUser.joined}</p>
        <button onClick={() => setView("list")} className="text-accent hover:text-accent-soft text-sm font-medium flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All users
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-panel border border-line rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a2b4c] text-white flex items-center justify-center font-bold text-xl shrink-0">
            {selectedUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-ink text-lg">{selectedUser.name}</p>
            <p className="text-sm text-dim">{selectedUser.email} · {selectedUser.country}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex gap-2">
            <span className={cx("text-[10px] font-bold px-2 py-1 rounded uppercase", selectedUser.status === "ACTIVE" ? "bg-up/10 text-up" : "bg-down/10 text-down")}>{selectedUser.status}</span>
            <span className={cx("text-[10px] font-bold px-2 py-1 rounded uppercase", selectedUser.kyc === "VERIFIED" ? "bg-accent/20 text-accent" : "bg-[#f5a623]/20 text-[#f5a623]")}>{selectedUser.kyc}</span>
          </div>
          <div className="h-6 w-px bg-line hidden md:block"></div>
          <span className="text-sm text-dim flex items-center gap-1">ID <span className="text-ink font-bold">{selectedUser.id}</span> <Copy className="w-3 h-3 hover:text-accent cursor-pointer" /></span>
          <div className="h-6 w-px bg-line hidden md:block"></div>
          <span className="text-sm text-dim">Balance <span className="text-ink font-bold">{formatCur(selectedUser.balance)}</span></span>
          <button className="bg-void border border-line hover:border-accent hover:text-accent px-4 py-2 rounded-[8px] text-sm font-bold flex items-center gap-2 transition-colors ml-2">
            <MessageSquare className="w-4 h-4" /> Message
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Profile Editor */}
        <div className="space-y-6">
          <Panel title="Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Full name</label>
                <input type="text" defaultValue={selectedUser.name} className="w-full bg-void border border-line rounded-[10px] px-4 py-2.5 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Email</label>
                <input type="email" defaultValue={selectedUser.email} className="w-full bg-void border border-line rounded-[10px] px-4 py-2.5 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Phone</label>
                <input type="text" defaultValue="+2348000001111" className="w-full bg-void border border-line rounded-[10px] px-4 py-2.5 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dim mb-1.5">Country</label>
                <input type="text" defaultValue={selectedUser.country} className="w-full bg-void border border-line rounded-[10px] px-4 py-2.5 text-sm text-ink outline-none focus:border-accent" />
              </div>
            </div>
            <button className="bg-accent text-white px-5 py-2.5 rounded-[8px] text-sm font-bold hover:bg-accent-soft transition-colors">
              Save profile
            </button>
          </Panel>

          <Panel title="Account ID">
            <div className="flex justify-between items-center bg-void border border-line p-4 rounded-[10px]">
               <span className="font-mono text-ink font-bold">{selectedUser.id}</span>
               <button className="text-xs text-accent hover:text-white font-semibold flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
            </div>
          </Panel>
        </div>

        {/* Right Column: Account Standing & KYC */}
        <div className="space-y-6">
          <Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-ink flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-up" /> Account standing</h3>
              <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-up/10 text-up border border-up/20">ACTIVE</span>
            </div>
            
            <p className="text-sm text-dim leading-relaxed mb-6">
              Suspended and under-investigation members can still sign in, but they only see their status page and can message you. Payments, investing and transfers stop, and plan payouts wait until you lift it.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-medium text-dim mb-1.5">Reason (shown to the member)</label>
              <textarea 
                placeholder="e.g. Unusual login activity, we need to confirm your identity" 
                className="w-full bg-void border border-line rounded-[10px] p-3 text-sm text-ink outline-none focus:border-accent min-h-[80px] resize-y"
              ></textarea>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-void border border-line hover:border-down hover:text-down text-ink px-4 py-2.5 rounded-[8px] text-sm font-bold transition-colors">
                <AlertTriangle className="w-4 h-4" /> Suspend
              </button>
              <button className="bg-void border border-line hover:border-[#f5a623] hover:text-[#f5a623] text-ink px-4 py-2.5 rounded-[8px] text-sm font-bold transition-colors">
                Place under investigation
              </button>
              <button className="flex items-center gap-2 bg-void border border-line hover:border-accent hover:text-accent text-ink px-4 py-2.5 rounded-[8px] text-sm font-bold transition-colors">
                <MessageSquare className="w-4 h-4" /> Open chat
              </button>
            </div>
          </Panel>

          <Panel title="KYC verification">
            <div className="flex items-center justify-between p-4 bg-void border border-line rounded-[10px]">
              <div>
                <p className="font-bold text-ink text-sm">Identity Documents</p>
                <p className="text-xs text-dim mt-0.5">Passport & Proof of Address verified.</p>
              </div>
              <button className="text-xs font-semibold text-accent hover:text-white">View files</button>
            </div>
          </Panel>
        </div>
        
      </div>
    </div>
  );
}