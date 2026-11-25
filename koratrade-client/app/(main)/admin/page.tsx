"use client";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Badge, PageHeader, Panel, Stat, ButtonLink } from "@/components/ui";
import { SAMPLE_USERS, type DemoUser, usd } from "@/lib/demo-data";
import { useAuth } from "@/lib/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type State = { status: "loading" } | { status: "ready"; users: DemoUser[]; offline: boolean };

export default function AdminPage() {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!user?.isAdmin) return;

    const ctrl = new AbortController();
    fetch(`${API_URL}/api/admin/users`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((users: DemoUser[]) => setState({ status: "ready", users, offline: false }))
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: "ready", users: SAMPLE_USERS, offline: true });
      });
    return () => ctrl.abort();
  }, [user]);

  const handleUpdateBalance = async (email: string, amount: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });
      
      if (res.ok) {
        setState((prev) => {
          if (prev.status !== "ready") return prev;
          return {
            ...prev,
            users: prev.users.map((u) => 
              u.email === email ? { ...u, balance: (u.balance || 0) + amount } : u
            ),
          };
        });
      }
    } catch (err) {
      console.error("Failed to update balance", err);
    }
  };

  const handleUpdateKyc = async (email: string, status: "Approved" | "Pending") => {
    try {
      const res = await fetch(`${API_URL}/api/admin/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status }),
      });
      
      if (res.ok) {
        setState((prev) => {
          if (prev.status !== "ready") return prev;
          return {
            ...prev,
            users: prev.users.map((u) => 
              u.email === email ? { ...u, kycStatus: status } : u
            ),
          };
        });
      }
    } catch (err) {
      console.error("Failed to update KYC", err);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-rise">
        <ShieldAlert size={56} className="text-down mb-6" />
        <h2 className="text-3xl font-semibold mb-3 tracking-tight text-ink">Clearance Required</h2>
        <p className="text-dim mb-8">You do not have master admin privileges to view this console.</p>
        <ButtonLink href="/dashboard" variant="secondary">Return to Dashboard</ButtonLink>
      </div>
    );
  }

  const users = state.status === "ready" ? state.users : [];
  const total = users.reduce((s, u) => s + (u.balance ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Master Admin Console"
        description="Full control over user balances, KYC verification, and AI engine status."
      />

      {state.status === "ready" && state.offline && (
        <p className="mb-4 rounded-[12px] border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          The server isn't running. Showing sample users.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total Registered Users" value={state.status === "loading" ? "…" : String(users.length)} />
        <Stat label="Platform Assets Managed" value={state.status === "loading" ? "…" : usd(total, 0)} />
        <Stat
          label="Active AI Simulators"
          value={state.status === "loading" ? "…" : String(users.filter((u) => u.botActive).length)}
        />
      </div>

      <Panel className="mt-4" title="Client Database" bodyClassName="p-0">
        {state.status === "loading" ? (
          <p className="px-5 py-10 text-center text-sm text-dim">Loading client database…</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-dim">No clients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-faint">
                <tr className="border-b border-line">
                  <th className="px-5 py-3 font-normal">Client Email</th>
                  <th className="px-5 py-3 font-normal">KYC Identity</th>
                  <th className="px-5 py-3 text-right font-normal">Fiat Balance</th>
                  <th className="px-5 py-3 text-right font-normal">Manage Funds</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0 hover:bg-raised/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-ink">
                      {u.email}
                      <p className="text-xs text-dim mt-0.5">AI Engine: <span className={u.botActive ? "text-accent-soft" : "text-faint"}>{u.botActive ? "Active" : "Suspended"}</span></p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Badge tone={u.kycStatus === "Approved" ? "up" : u.kycStatus === "Under Review" ? "accent" : "neutral"}>{u.kycStatus}</Badge>
                        {u.kycStatus === "Under Review" && (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleUpdateKyc(u.email, "Approved")} className="rounded-[4px] bg-up/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-up hover:bg-up/20">Approve</button>
                            <button onClick={() => handleUpdateKyc(u.email, "Pending")} className="rounded-[4px] bg-down/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-down hover:bg-down/20">Reject</button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="num px-5 py-3.5 text-right font-bold text-ink">{usd(u.balance ?? 0)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateBalance(u.email, -1000)}
                          className="rounded-[6px] bg-down/10 px-2.5 py-1.5 text-xs font-medium text-down hover:bg-down/20 transition-colors"
                        >
                          - $1k
                        </button>
                        <button 
                          onClick={() => handleUpdateBalance(u.email, 1000)}
                          className="rounded-[6px] bg-up/10 px-2.5 py-1.5 text-xs font-medium text-up hover:bg-up/20 transition-colors"
                        >
                          + $1k
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}