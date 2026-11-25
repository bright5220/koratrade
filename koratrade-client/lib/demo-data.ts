// Single source of sample data for the whole demo, so every page agrees.

export const DEMO_USER = {
  name: "Demo Trader",
  email: "demo@vaultx.app",
  initials: "DT",
};

export const BASE_PRICES = {
  BTC: 94238.1,
  ETH: 3142.5,
  USDT: 1.00,
  USDC: 1.00,
} as const;

export type Asset = {
  symbol: "USD" | "BTC" | "ETH" | "USDT" | "USDC";
  name: string;
  amount: number;
  price: number; // USD per unit
  color: string;
};

// We set default values here. The Wallet and Dashboard will automatically override the USD amount with the user's real database balance.
export const HOLDINGS: Asset[] = [
  { symbol: "USD", name: "US dollar (cash)", amount: 1200, price: 1, color: "#8d93a0" },
  { symbol: "USDT", name: "Tether", amount: 1450.50, price: BASE_PRICES.USDT, color: "#26a17b" },
  { symbol: "USDC", name: "USD Coin", amount: 3200.00, price: BASE_PRICES.USDC, color: "#2775ca" },
  { symbol: "BTC", name: "Bitcoin", amount: 0.085, price: BASE_PRICES.BTC, color: "#cda766" },
  { symbol: "ETH", name: "Ether", amount: 1.2, price: BASE_PRICES.ETH, color: "#7f9cc9" },
];

export const holdingValue = (a: Asset) => a.amount * a.price;
export const portfolioValue = (assets: Asset[] = HOLDINGS) =>
  assets.reduce((sum, a) => sum + holdingValue(a), 0);

export type Transaction = {
  id: string;
  date: string;
  label: string;
  detail: string;
  amount: number; // signed USD
};

// Cash balance above = 16,000 − 7,820 − 3,600
export const TRANSACTIONS: Transaction[] = [
  { id: "t3", date: "Nov 23, 2026", label: "Bought ETH", detail: "1.2 ETH at $3,000.00", amount: -3600 },
  { id: "t2", date: "Nov 22, 2026", label: "Bought BTC", detail: "0.085 BTC at $92,000.00", amount: -7820 },
  { id: "t1", date: "Nov 22, 2026", label: "Demo credit", detail: "Sample funds added to the account", amount: 16000 },
];

export type DemoUser = {
  _id: string;
  email: string;
  balance: number;
  kycStatus: "Approved" | "Pending" | "Under Review";
  botActive: boolean;
  isAdmin?: boolean;
};

export const SAMPLE_USERS: DemoUser[] = [
  { _id: "1", email: "demo@vaultx.app", balance: 15981, kycStatus: "Approved", botActive: false, isAdmin: true },
  { _id: "2", email: "ada@example.com", balance: 2400, kycStatus: "Pending", botActive: true, isAdmin: false },
  { _id: "3", email: "tunde@example.com", balance: 8120, kycStatus: "Approved", botActive: false, isAdmin: false },
];

export const usd = (n: number, digits = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

// Deterministic starting history (same on server and client, so no hydration mismatch)
export function seedHistory(base: number, points = 40) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
  const out: { t: number; price: number }[] = [];
  let p = base - 40;
  for (let i = 0; i < points; i++) {
    p += rand() * 18 + (base - p) * 0.04 + 0.6;
    out.push({ t: i, price: +p.toFixed(2) });
  }
  return out;
}
