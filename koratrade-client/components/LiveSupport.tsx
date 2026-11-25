"use client";
import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/components/ui";

export function LiveSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{from: 'user'|'agent', text: string}[]>([
    { from: 'agent', text: 'Hello! How can we assist you with your VaultX account today?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'agent', text: 'An agent will be with you shortly. This is a simulated demo response.' }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-panel border border-line rounded-[16px] overflow-hidden shadow-2xl mb-4 flex flex-col h-96"
          >
            <div className="bg-accent p-4 flex items-center justify-between text-white">
              <span className="font-semibold text-sm">Live Support</span>
              <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-void flex flex-col">
              {messages.map((m, i) => (
                <div key={i} className={cx("max-w-[85%] p-2.5 rounded-[10px] text-sm", m.from === 'user' ? "bg-accent text-white self-end rounded-tr-sm" : "bg-panel border border-line text-ink self-start rounded-tl-sm")}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-line bg-panel flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-void border border-line rounded-[8px] px-3 py-2 text-sm text-ink outline-none focus:border-accent" />
              <button type="submit" className="bg-accent text-white p-2 rounded-[8px]"><Send className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,92,255,0.4)] hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}