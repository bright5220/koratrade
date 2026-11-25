"use client";
import React, { useState } from "react";
import { useWallet } from "@/lib/WalletContext";
import { PageHeader, Panel, cx } from "@/components/ui";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { PriceChart } from "@/components/PriceChart"; 

const MARKETS = [
  { symbol: "BTC", name: "Bitcoin", price: 94237.74, change: "+0.42%" },
  { symbol: "ETH", name: "Ethereum", price: 3450.21, change: "+1.15%" },
  { symbol: "SOL", name: "Solana", price: 145.60, change: "-0.80%" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: "0.00%" },
];

export default function TradePage() {
  const { usdBalance, setUsdBalance, coinBalances, setCoinBalances } = useWallet();

  const [activeCoin, setActiveCoin] = useState(MARKETS[0]);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amountStr, setAmountStr] = useState("");
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const parsedAmount = parseFloat(amountStr) || 0;
  const orderTotal = parsedAmount * activeCoin.price;
  const currentCoinBalance = coinBalances[activeCoin.symbol] || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value.replace(/[^0-9.]/g, ''));
  };

  const handlePercent = (pct: number) => {
    if (side === "buy") {
      setAmountStr(((usdBalance / activeCoin.price) * pct).toFixed(5));
    } else {
      setAmountStr((currentCoinBalance * pct).toFixed(5));
    }
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return showNotification("Enter an amount greater than 0.", "error");

    if (side === "buy") {
      if (orderTotal > usdBalance) return showNotification("Insufficient USD balance.", "error");
      setUsdBalance(prev => prev - orderTotal);
      setCoinBalances(prev => ({ ...prev, [activeCoin.symbol]: currentCoinBalance + parsedAmount }));
      showNotification(`Successfully bought ${parsedAmount} ${activeCoin.symbol}!`, "success");
    } else {
      if (parsedAmount > currentCoinBalance) return showNotification(`Insufficient ${activeCoin.symbol} balance.`, "error");
      setUsdBalance(prev => prev + orderTotal);
      setCoinBalances(prev => ({ ...prev, [activeCoin.symbol]: currentCoinBalance - parsedAmount }));
      showNotification(`Successfully sold ${parsedAmount} ${activeCoin.symbol}!`, "success");
    }
    setAmountStr("");
  };

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <PageHeader title="Trade" description="Execute simulated market and limit orders." />
        <div className="bg-panel border border-line rounded-[12px] px-4 py-2 flex items-center gap-4">
          <span className="text-dim text-sm">Select Market:</span>
          <select 
            className="bg-transparent text-ink font-semibold outline-none cursor-pointer"
            value={activeCoin.symbol}
            onChange={(e) => {
              const coin = MARKETS.find(m => m.symbol === e.target.value);
              if (coin) { setActiveCoin(coin); setAmountStr(""); }
            }}
          >
            {MARKETS.map(m => <option key={m.symbol} value={m.symbol} className="bg-void">{m.symbol}/USD</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel className="p-6 flex items-center justify-between">
            <div>
              <p className="text-dim text-sm font-medium mb-1">{activeCoin.name} Price</p>
              <h2 className="text-4xl font-semibold text-ink">{formatCurrency(activeCoin.price)}</h2>
            </div>
            <div className={cx("px-3 py-1.5 rounded-md text-sm font-bold", activeCoin.change.startsWith("+") ? "bg-up/10 text-up" : "bg-down/10 text-down")}>
              {activeCoin.change} this session
            </div>
          </Panel>

          <Panel title="Your Simulated Balances">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-[12px] border border-line bg-void/50">
                <p className="text-dim text-sm mb-1">Global USD</p>
                <p className="text-xl font-semibold text-ink">{formatCurrency(usdBalance)}</p>
              </div>
              <div className="p-4 rounded-[12px] border border-line bg-void/50">
                <p className="text-dim text-sm mb-1">Available {activeCoin.symbol}</p>
                <p className="text-xl font-semibold text-ink">{currentCoinBalance.toFixed(5)} {activeCoin.symbol}</p>
              </div>
            </div>
          </Panel>

          <div className="h-auto bg-panel border border-line rounded-[16px] overflow-hidden p-2">
             <PriceChart 
                data={[
                  { t: 1, price: activeCoin.price * 0.98 },
                  { t: 2, price: activeCoin.price * 1.02 },
                  { t: 3, price: activeCoin.price * 0.99 },
                  { t: 4, price: activeCoin.price }
                ]} 
              />
          </div>
        </div>

        <Panel className="p-0 flex flex-col h-full">
          <div className="p-6 border-b border-line">
            <h3 className="text-lg font-semibold text-ink mb-1">Execution Engine</h3>
            <p className="text-sm text-dim">Trade {activeCoin.symbol} instantly</p>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <div className="flex rounded-[10px] bg-void border border-line p-1 mb-6">
              <button onClick={() => setSide("buy")} className={cx("flex-1 py-2 text-sm font-medium rounded-[8px] transition-colors", side === "buy" ? "bg-up/20 text-up" : "text-dim hover:text-ink")}>Buy</button>
              <button onClick={() => setSide("sell")} className={cx("flex-1 py-2 text-sm font-medium rounded-[8px] transition-colors", side === "sell" ? "bg-down/20 text-down" : "text-dim hover:text-ink")}>Sell</button>
            </div>

            <div className="flex gap-4 mb-6 border-b border-line pb-2">
              <button onClick={() => setOrderType("market")} className={cx("text-sm font-semibold pb-2 border-b-2 transition-colors", orderType === "market" ? "border-accent text-ink" : "border-transparent text-dim hover:text-ink")}>Market</button>
              <button onClick={() => setOrderType("limit")} className={cx("text-sm font-semibold pb-2 border-b-2 transition-colors", orderType === "limit" ? "border-accent text-ink" : "border-transparent text-dim hover:text-ink")}>Limit</button>
            </div>

            <form onSubmit={handleExecute} className="flex-1 flex flex-col">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dim mb-1.5">Amount ({activeCoin.symbol})</label>
                <div className="relative">
                  <input type="text" value={amountStr} onChange={handleAmountChange} placeholder="0.00000" className="w-full rounded-[10px] border border-line bg-void px-4 py-3 text-lg font-medium text-ink outline-none focus:border-accent transition-colors" />
                  <span className="absolute right-4 top-3.5 text-dim font-medium">{activeCoin.symbol}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-8">
                {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                  <button key={pct} type="button" onClick={() => handlePercent(pct)} className="py-1.5 rounded bg-void border border-line text-xs font-medium text-dim hover:text-ink hover:border-accent transition-colors">
                    {pct === 1.0 ? "Max" : `${pct * 100}%`}
                  </button>
                ))}
              </div>

              {notification && (
                <div className={cx("mb-4 p-3 rounded-[8px] flex items-start gap-2 text-sm font-medium", notification.type === 'success' ? "bg-up/10 text-up" : "bg-down/10 text-down")}>
                  {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  {notification.text}
                </div>
              )}

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-dim">Total Cost</span>
                  <span className="text-ink font-semibold">{formatCurrency(orderTotal)}</span>
                </div>
                
                <button type="submit" className={cx("w-full py-4 rounded-[12px] font-bold text-lg text-white transition-opacity hover:opacity-90", side === "buy" ? "bg-up" : "bg-down")}>
                  {side === "buy" ? `Buy ${activeCoin.symbol}` : `Sell ${activeCoin.symbol}`}
                </button>
              </div>
            </form>
          </div>
        </Panel>
      </div>
    </div>
  );
}