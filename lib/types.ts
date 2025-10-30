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
  asterQty: number;
  asterPrice: number;
}

export interface SupportResistanceZone {
  price: number;
  type: string;
  label: string;
  distance_pct: number;
  strength: number;
  size?: number;
}

export interface OrderbookAnalysis {
  signal: string;
  bias: string;
  strength: number;
  insight: string;
  ba_ratio: number;
  liquidity_score: number;
  liquidity_risk: string;
  liquidity_note: string;
  spread_pct: number;
  spread_impact: string;
  walls: {
    has_bid_wall: boolean;
    has_ask_wall: boolean;
    bid_wall: { price: number; size: number; distance_pct: number } | null;
    ask_wall: { price: number; size: number; distance_pct: number } | null;
  };
  total_liquidity_usd: number;
}

export interface DecisionQuality {
  score: number;
  label: string;
  factors: Array<{
    factor: string;
    impact: number;
    note: string;
  }>;
}

export interface ActionableInsight {
  type: string;
  priority: string;
  message: string;
  condition: string;
}

export interface MarketIntelligence {
  timestamp: string;
  decision_uid: string;
  orderbook: OrderbookAnalysis;
  support_resistance: {
    price_position: number;
    nearest_support: SupportResistanceZone | null;
    nearest_resistance: SupportResistanceZone | null;
    support_zones: SupportResistanceZone[];
    resistance_zones: SupportResistanceZone[];
    support_count: number;
    resistance_count: number;
  };
  decision_quality: DecisionQuality;
  insights: ActionableInsight[];
  flags: {
    strong_buy_setup: boolean;
    near_support: boolean;
    near_resistance: boolean;
    low_liquidity_risk: boolean;
    orderbook_bullish: boolean;
    orderbook_bearish: boolean;
    quality_decision: boolean;
  };
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
  marketIntelligence?: MarketIntelligence | null;
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

