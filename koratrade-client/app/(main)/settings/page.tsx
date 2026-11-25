"use client";
import React, { useState } from "react";
import { PageHeader, Panel, Button, cx } from "@/components/ui";

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application preferences and notifications."
      />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* App Preferences */}
        <Panel title="System Preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-sm font-medium text-dim mb-1.5">Display Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-void px-4 py-3 text-sm text-ink outline-none focus:border-accent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dim mb-1.5">Timezone</label>
              <input 
                type="text"
                disabled
                value="Auto-detected (Local time)"
                className="w-full rounded-[10px] border border-line bg-void/50 px-4 py-3 text-sm text-ink/50 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </Panel>

        {/* Notifications */}
        <Panel title="Notifications">
          <div className="space-y-2">
            
            {/* Custom Toggle 1 */}
            <div className="flex items-center justify-between py-3 border-b border-line">
              <div>
                <p className="font-medium text-ink">Email Notifications</p>
                <p className="text-dim text-xs mt-0.5">Get daily portfolio summaries and security alerts.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={cx(
                  "w-11 h-6 rounded-full transition-colors relative shrink-0",
                  emailNotif ? "bg-accent" : "bg-line"
                )}
              >
                <span className={cx(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  emailNotif ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Custom Toggle 2 */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-ink">Push Notifications</p>
                <p className="text-dim text-xs mt-0.5">Receive alerts directly on your active devices.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotif(!pushNotif)}
                className={cx(
                  "w-11 h-6 rounded-full transition-colors relative shrink-0",
                  pushNotif ? "bg-accent" : "bg-line"
                )}
              >
                <span className={cx(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  pushNotif ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

          </div>
        </Panel>

        {/* Save Button Area */}
        <Panel>
          <div className="flex items-center gap-4">
            <Button type="submit">Save changes</Button>
            {saved && (
              <span role="status" className="text-sm font-medium text-up transition-opacity">
                Changes saved successfully
              </span>
            )}
          </div>
        </Panel>

      </form>
    </div>
  );
}