"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_PRICES, seedHistory } from "./demo-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type Point = { t: number; price: number };

/**
 * BTC/USD price for the demo. Uses the local server's socket feed when it is
 * running, and otherwise simulates a gentle random walk in the browser.
 */
export function usePriceFeed(points = 40) {
  const [history, setHistory] = useState<Point[]>(() => seedHistory(BASE_PRICES.BTC, points));
  const [source, setSource] = useState<"server" | "local">("local");

  useEffect(() => {
    let tick = points;
    const push = (price: number) =>
      setHistory((prev) => [...prev.slice(-(points - 1)), { t: tick++, price }]);

    const socket = io(API_URL, { reconnectionAttempts: 2, timeout: 2500 });
    socket.on("connect", () => setSource("server"));
    socket.on("disconnect", () => setSource("local"));
    socket.on("priceUpdate", (d: { price: string }) => push(parseFloat(d.price)));

    const local = setInterval(() => {
      if (socket.connected) return;
      setHistory((prev) => {
        const last = prev[prev.length - 1]?.price ?? BASE_PRICES.BTC;
        const drift = (BASE_PRICES.BTC - last) * 0.05;
        const next = +(last + drift + (Math.random() - 0.5) * 22).toFixed(2);
        return [...prev.slice(-(points - 1)), { t: tick++, price: next }];
      });
    }, 1500);

    return () => {
      clearInterval(local);
      socket.disconnect();
    };
  }, [points]);

  const price = history[history.length - 1].price;
  const open = history[0].price;
  const change = ((price - open) / open) * 100;
  return { history, price, change, source };
}
