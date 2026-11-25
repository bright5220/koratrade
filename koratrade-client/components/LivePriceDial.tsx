"use client";
import { Dial } from "./Dial";
import { usePriceFeed } from "@/lib/use-price-feed";
import { fmt } from "@/lib/demo-data";

export function LivePriceDial({ size = 300 }: { size?: number }) {
  const { history, price, change } = usePriceFeed(40);
  const prices = history.map((p) => p.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const pos = hi === lo ? 0.5 : (price - lo) / (hi - lo);
  const up = change >= 0;

  return (
    <Dial size={size} needle={pos} label={`Simulated BTC price ${fmt(price)} US dollars`}>
      <p className="text-sm text-dim">BTC / USD</p>
      <p className="num mt-1 text-[28px] font-medium" aria-live="off">
        {fmt(price)}
      </p>
      <p className={`num mt-1 text-sm ${up ? "text-up" : "text-down"}`}>
        {up ? "+" : ""}
        {change.toFixed(2)}%
      </p>
      <p className="mt-3 text-xs text-faint">Simulated feed</p>
    </Dial>
  );
}
