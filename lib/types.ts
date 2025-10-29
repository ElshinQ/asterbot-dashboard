// TypeScript interfaces for Astro Bot dashboard data

export interface CurrentPosition {
  baseFree: number;
  quoteFree: number;
  markPrice: number;
  totalValueUsdt: number;
  lastUpdate: string;
  openCount: number;
  qtyInTpOrders: number;
  openOrderIds: string[];
  entryAt: string;
  entryDecisionUid: string;
  entryPrice: number;
  unrealizedPnlPct: number;
}

export interface RecentTrade {
  entryOrderId: number;
  exitOrderId: number;
  entryDecisionUid: string;
  exitDecisionUid: string;
  orderGroupUid: string;
  entryTime: string;
  entryPrice: number;
  entryQuantity: number;
  entryCostUsdt: number;
  exitTime: string;
  exitPrice: number;
  exitQuantity: number;
  exitProceedsUsdt: number;
  pnlPct: number;
  pnlUsdt: number;
  holdTimeMinutes: number;
  regimeKey: string;
}

export interface CommissionSummary {
  date: string;
  usdtFees: number;
  asterFees: number;
  executions: number;
}

export interface BotStats {
  totalDecisions: number;
  firstDecision: string;
  lastDecision: string;
  buyCount: number;
  sellCount: number;
  holdCount: number;
  lastAction: string;
  lastPrice: number;
  hasPosition: boolean;
  baseQty: number;
  usdtFree: number;
}

export interface HistoricalDataPoint {
  timestamp: string;
  accountValue: number;
  usdtBalance: number;
}

export interface RecentDecision {
  decisionUid: string;
  decidedAt: string;
  action: string;
  note: string;
  regimeKey: string;
  lastClose: number;
  rsi14_3m: number;
  adx14_3m: number;
  hasPosition: boolean;
}

export interface OpenOrder {
  orderId: number;
  exchangeOrderId: string;
  clientOrderId: string;
  symbol: string;
  side: string;
  type: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  ageMinutes: number;
}

export interface FilledOrder {
  orderId: number;
  exchangeOrderId: string;
  clientOrderId: string;
  symbol: string;
  side: string;
  type: string;
  price: number | null;
  quantity: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanceledOrder {
  orderId: number;
  exchangeOrderId: string;
  clientOrderId: string;
  symbol: string;
  side: string;
  type: string;
  price: number | null;
  quantity: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  accountValue: number;
  asterBalance: number;
  usdtBalance: number;
  currentPrice: number;
  highestPrice: number;
  lowestPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
  totalDecisions: number;
  buyCount: number;
  sellCount: number;
  holdCount: number;
  openTPOrders: number;
  qtyInTpOrders: number;
  lastDecision: {
    timestamp: string;
    action: string;
  };
  runtime: {
    firstDecision: string;
    lastDecision: string;
    daysSinceStart: number;
    totalRuntime: string;
  };
  position: {
    hasPosition: boolean;
    entryPrice: number;
    entryTime: string;
    currentQty: number;
  };
  historicalData: HistoricalDataPoint[];
  recentDecisions: RecentDecision[];
  openOrders: OpenOrder[];
  filledOrders: FilledOrder[];
  canceledOrders: CanceledOrder[];
}

