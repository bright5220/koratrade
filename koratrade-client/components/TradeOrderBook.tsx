"use client";
import { useMemo } from "react";
import { cx } from "./ui";
import { fmt } from "@/lib/demo-data";

const SIZES = [0.145, 0.802, 1.25, 0.05, 2.4, 1.1, 0.45, 3.2, 0.125, 0.89];

export function TradeOrderBook({ price, up }: { price: number; up: boolean }) {
  const book = useMemo(() => {
    const asks = SIZES.slice(0, 5).map((s, i) => ({ price: price + (5 - i) * 2.5, size: s }));
    const bids = SIZES.slice(5).map((s, i) => ({ price: price - (i + 1) * 2.5, size: s }));
    const max = Math.max(...SIZES);
    return { asks, bids, max };
  }, [price]);

  return (
    <div className="py-2">
      <div className="num grid grid-cols-2 px-5 pb-2 text-xs text-faint">
        <span>Price</span>
        <span className="text-right">BTC</span>
      </div>
      {book.asks.map((l) => (
        <BookRow key={`a${l.size}`} price={l.price} size={l.size} max={book.max} tone="down" />
      ))}
      <div className="my-1.5 border-y border-line px-5 py-2.5">
        <span className={cx("num text-base font-medium", up ? "text-up" : "text-down")}>{fmt(price)}</span>
        <span className="ml-2 text-xs text-faint">spread 5.00</span>
      </div>
      {book.bids.map((l) => (
        <BookRow key={`b${l.size}`} price={l.price} size={l.size} max={book.max} tone="up" />
      ))}
    </div>
  );
}

function BookRow({ price, size, max, tone }: { price: number; size: number; max: number; tone: "up" | "down" }) {
  return (
    <div className="num relative grid grid-cols-2 px-5 py-1 text-xs">
      <span
        className={cx("absolute inset-y-0.5 right-0", tone === "up" ? "bg-up/10" : "bg-down/10")}
        style={{ width: `${(size / max) * 100}%` }}
        aria-hidden="true"
      />
      <span className={cx("relative", tone === "up" ? "text-up" : "text-down")}>{fmt(price)}</span>
      <span className="relative text-right text-dim">{fmt(size, 3)}</span>
    </div>
  );
}