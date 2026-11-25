"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { fmt } from "@/lib/demo-data";

export function PriceChart({
  data,
  height = 240,
  up = true,
}: {
  data: { t: number; price: number }[];
  height?: number;
  up?: boolean;
}) {
  const color = up ? "var(--color-up)" : "var(--color-down)";
  const id = up ? "fill-up" : "fill-down";
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin - 8", "dataMax + 8"]} hide />
          <Tooltip
            cursor={{ stroke: "var(--color-line)" }}
            contentStyle={{
              background: "var(--color-raised)",
              border: "1px solid var(--color-line)",
              borderRadius: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
            labelFormatter={() => ""}
            formatter={(v) => [`$${fmt(Number(v))}`, "BTC"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
