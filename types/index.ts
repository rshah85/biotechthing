export interface Stock {
  ticker: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface PDUFAEntry {
  ticker: string;
  companyName: string;
  drugName: string;
  indication: string;
  pdufa_date: string;
  approvalType: string;
  notes?: string;
}

export interface WatchlistStock extends Stock {
  pdufa_date?: string;
  drugName?: string;
  indication?: string;
  daysUntilPDUFA?: number;
}

export interface PositionCalc {
  stockPrice: number;
  maxPosition: number;
  tradingFee: number;
  shares: number;
  totalCost: number;
  leftoverCash: number;
  meetsMinimum: boolean;
}
