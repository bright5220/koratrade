export type TransactionStatus = 'Pending' | 'Completed' | 'Rejected';
export type TransactionType = 'Deposit' | 'Withdrawal' | 'Investment' | 'Swap In' | 'Swap Out' | 'Money sent' | 'Payout';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  method: string;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  reference: string;
  details?: string;
}

export interface UserState {
  name: string;
  accountId: string;
  kycStatus: 'Verified' | 'Not verified' | 'In review' | 'Rejected';
  balances: {
    usd: number;
    btc: number;
    eth: number;
  };
  portfolio: {
    invested: number;
    currentValue: number;
    profit: number;
  };
}