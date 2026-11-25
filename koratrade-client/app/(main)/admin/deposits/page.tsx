"use client";
import React, { useState } from "react";
import { Panel, Badge, cx } from "@/components/ui";
import { CheckCircle2, XCircle, Clock, ExternalLink, Search } from "lucide-react";

const MOCK_DEPOSITS = [
  { id: "DEP-001", user: "Ben Carson (FV-9988-7766)", method: "Bitcoin (BTC)", amount: "$5,020.00", date: "25 Nov 2026, 14:30", status: "PENDING" },
  { id: "DEP-002", user: "Sarah Jenkins (FV-1122-3344)", method: "Bank Wire Transfer", amount: "$15,000.00", date: "25 Nov 2026, 11:15", status: "PENDING" },
  { id: "DEP-003", user: "Michael Chen (FV-5544-3322)", method: "Ethereum (ETH)", amount: "$2,450.00", date: "24 Nov 2026, 09:45", status: "COMPLETED" },
];

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState(MOCK_DEPOSITS);
  const [search, setSearch] = useState("");

  const handleAction = (id: string, action: "COMPLETED" | "REJECTED") => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
  };

  const filtered = deposits.filter(d => d.user.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">Deposits Queue</h1>
          <p className="text-sm text-dim">Review and approve pending user deposits.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-dim" />
          <input 
            type="text" placeholder="Search by User or ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-void border border-line rounded-[10px] pl-10 pr-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <Panel className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-void border-b border-line text-xs uppercase tracking-wider text-dim">
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Method & Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(dep => (
                <tr key={dep.id} className="hover:bg-void/50 transition-colors">
                  <td className="p-4 text-sm font-mono text-ink">{dep.id}</td>
                  <td className="p-4 text-sm text-ink font-medium">{dep.user}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-ink">{dep.amount}</p>
                    <p className="text-xs text-dim">{dep.method}</p>
                  </td>
                  <td className="p-4">
                    <span className={cx("text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-max", dep.status === "PENDING" ? "bg-[#f5a623]/10 text-[#f5a623]" : dep.status === "COMPLETED" ? "bg-up/10 text-up" : "bg-down/10 text-down")}>
                      {dep.status === "PENDING" ? <Clock className="w-3 h-3" /> : dep.status === "COMPLETED" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {dep.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {dep.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAction(dep.id, "COMPLETED")} className="bg-up/10 hover:bg-up text-up hover:text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition-colors">Approve</button>
                        <button onClick={() => handleAction(dep.id, "REJECTED")} className="bg-down/10 hover:bg-down text-down hover:text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition-colors">Reject</button>
                      </div>
                    ) : (
                      <button className="text-dim hover:text-ink text-xs font-semibold flex items-center justify-end gap-1 w-full"><ExternalLink className="w-3 h-3" /> View Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-dim text-sm">No deposits found.</div>}
        </div>
      </Panel>
    </div>
  );
}