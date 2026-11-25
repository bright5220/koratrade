"use client";
import React, { useState } from "react";
import { PageHeader, Button, cx } from "@/components/ui";
import { FileText, ExternalLink } from "lucide-react";

// Mock Data
const kycData = {
  pending: [], // Empty to match screenshot 305967
  approved: [
    { id: 1, name: "Test Member", accountId: "FV-9988-7766", documentType: "National ID", date: "17 Oct 2026" }
  ],
  rejected: []
};

export default function AdminKYCPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");

  const tabs = ["Pending", "Approved", "Rejected"];
  
  const currentList = activeTab === "Pending" ? kycData.pending :
                      activeTab === "Approved" ? kycData.approved :
                      kycData.rejected;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="KYC reviews"
        description="Check documents and approve or reject members."
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cx(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-colors border",
              activeTab === tab
                ? "bg-[#1a2b4c] text-white border-[#1a2b4c]"
                : "bg-void border-line text-ink hover:border-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Container */}
      <div className="bg-void border border-line rounded-[16px] overflow-hidden">
        {currentList.length === 0 ? (
          <div className="p-8 text-center text-dim bg-panel rounded-[12px] m-4 border border-line">
            Nothing in this list.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-panel border-b border-line text-xs font-semibold text-dim uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {currentList.map(item => (
                  <tr key={item.id} className="hover:bg-panel/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-accent hover:underline cursor-pointer">{item.name}</p>
                      <p className="text-xs text-dim mt-0.5">{item.accountId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-dim" />
                        <span className="text-ink">{item.documentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dim">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="secondary" className="py-1.5 px-3 text-xs">
                        Open in reviews <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}