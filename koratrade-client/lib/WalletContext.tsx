"use client";
import React, { createContext, useContext, useState } from "react";

export interface InvestmentRecord { id: string; name: string; amount: number; date: string; yield?: string; }
export interface PaymentMethod { id: string; name: string; type: "crypto" | "fiat"; isActive: boolean; }
export interface Transaction { id: string; type: "Deposit" | "Withdrawal" | "Transfer" | "Investment"; title: string; desc: string; amount: number; date: string; status: "COMPLETED" | "PENDING"; }

interface WalletContextType {
  usdBalance: number; setUsdBalance: React.Dispatch<React.SetStateAction<number>>;
  coinBalances: Record<string, number>; setCoinBalances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  investments: InvestmentRecord[]; setInvestments: React.Dispatch<React.SetStateAction<InvestmentRecord[]>>;
  paymentMethods: PaymentMethod[]; setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  transactions: Transaction[]; setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [usdBalance, setUsdBalance] = useState(448589.98);
  const [coinBalances, setCoinBalances] = useState<Record<string, number>>({ BTC: 1.3347, ETH: 2.5, SOL: 45.0, USDT: 0.0 });
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  
  // Admin-controlled payment gateways
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "btc", name: "Bitcoin (BTC)", type: "crypto", isActive: true },
    { id: "eth", name: "Ethereum (ETH)", type: "crypto", isActive: true },
    { id: "wire", name: "Bank Wire Transfer", type: "fiat", isActive: true },
    { id: "paypal", name: "PayPal", type: "fiat", isActive: false },
  ]);

  // Global Transaction Ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx-1", type: "Transfer", title: "Money sent", desc: "Sent to Promise - Withdraw To Saudi Arabia Bank", amount: -2000.00, date: "25 Oct 2026, 00:07", status: "COMPLETED" },
    { id: "tx-2", type: "Deposit", title: "Deposit", desc: "Bitcoin (BTC) - DEP24ECB4B4", amount: 2000.00, date: "25 Oct 2026, 21:19", status: "PENDING" },
    { id: "tx-3", type: "Investment", title: "Investment", desc: "Invested in Cocoa Estate Note using 250.00 USD", amount: -250.00, date: "25 Oct 2026, 21:20", status: "COMPLETED" },
  ]);

  return (
    <WalletContext.Provider value={{ usdBalance, setUsdBalance, coinBalances, setCoinBalances, investments, setInvestments, paymentMethods, setPaymentMethods, transactions, setTransactions }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
}