import { query } from './db';
import type {
  CurrentPosition,
  RecentTrade,
  CommissionSummary,
  BotStats,
  DashboardStats,
  HistoricalDataPoint,
} from './types';

/**
 * Get current position from current_position_v view
 */
export async function getCurrentPosition(): Promise<CurrentPosition | null> {
  const result = await query<{
    base_free: string;
    quote_free: string;
    mark_price: string;
    total_value_usdt: string;
    last_update: string;
    open_count: number;
    qty_in_tp_orders: string;
    open_order_ids: string[];
    entry_at: string;
    entry_decision_uid: string;
    entry_price: string;
    unrealized_pnl_pct: string;
  }>(`
    SELECT 
      base_free,
      quote_free,
      mark_price,
      total_value_usdt,
      last_update,
      open_count,
      qty_in_tp_orders,
      open_order_ids,
      entry_at,
      entry_decision_uid,
      entry_price,
      unrealized_pnl_pct
    FROM ichigo.current_position_v
    LIMIT 1
  `);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    baseFree: parseFloat(row.base_free),
    quoteFree: parseFloat(row.quote_free),
    markPrice: parseFloat(row.mark_price),
    totalValueUsdt: parseFloat(row.total_value_usdt),
    lastUpdate: row.last_update,
    openCount: row.open_count,
    qtyInTpOrders: parseFloat(row.qty_in_tp_orders),
    openOrderIds: row.open_order_ids,
    entryAt: row.entry_at,
    entryDecisionUid: row.entry_decision_uid,
    entryPrice: parseFloat(row.entry_price),
    unrealizedPnlPct: parseFloat(row.unrealized_pnl_pct),
  };
}

/**
 * Get recent trades from recent_trades_pnl_v view
 */
export async function getRecentTrades(limit = 10): Promise<RecentTrade[]> {
  const result = await query<{
    entry_order_id: number;
    exit_order_id: number;
    entry_decision_uid: string;
    exit_decision_uid: string;
    order_group_uid: string;
    entry_time: string;
    entry_price: string;
    entry_quantity: string;
    entry_cost_usdt: string;
    exit_time: string;
    exit_price: string;
    exit_quantity: string;
    exit_proceeds_usdt: string;
    pnl_pct: string;
    pnl_usdt: string;
    hold_time_minutes: string;
    regime_key: string;
  }>(
    `
    SELECT 
      entry_order_id,
      exit_order_id,
      entry_decision_uid,
      exit_decision_uid,
      order_group_uid,
      entry_time,
      entry_price,
      entry_quantity,
      entry_cost_usdt,
      exit_time,
      exit_price,
      exit_quantity,
      exit_proceeds_usdt,
      pnl_pct,
      pnl_usdt,
      hold_time_minutes,
      regime_key
    FROM ichigo.recent_trades_pnl_v
    WHERE pnl_usdt IS NOT NULL
    ORDER BY exit_time DESC
    LIMIT $1
  `,
    [limit]
  );

  return result.map((row) => ({
    entryOrderId: row.entry_order_id,
    exitOrderId: row.exit_order_id,
    entryDecisionUid: row.entry_decision_uid,
    exitDecisionUid: row.exit_decision_uid,
    orderGroupUid: row.order_group_uid,
    entryTime: row.entry_time,
    entryPrice: parseFloat(row.entry_price || '0'),
    entryQuantity: parseFloat(row.entry_quantity),
    entryCostUsdt: parseFloat(row.entry_cost_usdt),
    exitTime: row.exit_time,
    exitPrice: parseFloat(row.exit_price || '0'),
    exitQuantity: parseFloat(row.exit_quantity),
    exitProceedsUsdt: parseFloat(row.exit_proceeds_usdt),
    pnlPct: parseFloat(row.pnl_pct || '0'),
    pnlUsdt: parseFloat(row.pnl_usdt),
    holdTimeMinutes: parseFloat(row.hold_time_minutes),
    regimeKey: row.regime_key,
  }));
}

/**
 * Get commission summary from commission_summary_v view
 */
export async function getCommissions(): Promise<CommissionSummary | null> {
  const result = await query<{
    date: string;
    usdt_fees: string;
    aster_fees: string;
    executions: number;
  }>(`
    SELECT 
      date,
      usdt_fees,
      aster_fees,
      executions
    FROM ichigo.commission_summary_v
    ORDER BY date DESC
    LIMIT 1
  `);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    date: row.date,
    usdtFees: parseFloat(row.usdt_fees),
    asterFees: parseFloat(row.aster_fees),
    executions: row.executions,
  };
}

/**
 * Get bot statistics from decisions table
 */
export async function getBotStats(): Promise<BotStats> {
  const result = await query<{
    total_decisions: string;
    first_decision: string;
    last_decision: string;
    buy_count: string;
    sell_count: string;
    hold_count: string;
    last_action: string;
    last_price: string;
    has_position: boolean;
    base_qty: string;
    usdt_free: string;
  }>(`
    SELECT 
      COUNT(*) as total_decisions,
      MIN(decided_at) as first_decision,
      MAX(decided_at) as last_decision,
      COUNT(*) FILTER (WHERE action = 'buy') as buy_count,
      COUNT(*) FILTER (WHERE action = 'sell') as sell_count,
      COUNT(*) FILTER (WHERE action = 'hold') as hold_count,
      (SELECT action FROM ichigo.decisions ORDER BY decided_at DESC LIMIT 1) as last_action,
      (SELECT last_close FROM ichigo.decisions ORDER BY decided_at DESC LIMIT 1) as last_price,
      (SELECT has_position FROM ichigo.decisions ORDER BY decided_at DESC LIMIT 1) as has_position,
      (SELECT base_qty FROM ichigo.decisions ORDER BY decided_at DESC LIMIT 1) as base_qty,
      (SELECT usdt_free FROM ichigo.decisions ORDER BY decided_at DESC LIMIT 1) as usdt_free
    FROM ichigo.decisions
  `);

  const row = result[0];
  return {
    totalDecisions: parseInt(row.total_decisions),
    firstDecision: row.first_decision,
    lastDecision: row.last_decision,
    buyCount: parseInt(row.buy_count),
    sellCount: parseInt(row.sell_count),
    holdCount: parseInt(row.hold_count),
    lastAction: row.last_action,
    lastPrice: parseFloat(row.last_price),
    hasPosition: row.has_position,
    baseQty: parseFloat(row.base_qty),
    usdtFree: parseFloat(row.usdt_free),
  };
}

/**
 * Get open TP orders
 */
export async function getOpenOrders() {
  const result = await query<{
    order_id: number;
    exchange_order_id: string;
    client_order_id: string;
    symbol: string;
    side: string;
    type: string;
    price: string;
    quantity: string;
    status: string;
    created_at: string;
    age_minutes: string;
  }>(
    `
    SELECT 
      order_id,
      exchange_order_id,
      client_order_id,
      symbol,
      side,
      type,
      price,
      quantity,
      status,
      created_at,
      age_minutes
    FROM ichigo.open_tp_orders_enhanced_v
    ORDER BY price ASC
  `
  );

  return result.map((row) => ({
    orderId: row.order_id,
    exchangeOrderId: row.exchange_order_id,
    clientOrderId: row.client_order_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    price: parseFloat(row.price),
    quantity: parseFloat(row.quantity),
    status: row.status,
    createdAt: row.created_at,
    ageMinutes: parseFloat(row.age_minutes),
  }));
}

/**
 * Get filled orders (recent 50)
 */
export async function getFilledOrders() {
  const result = await query<{
    order_id: number;
    exchange_order_id: string;
    client_order_id: string;
    symbol: string;
    side: string;
    type: string;
    price: string;
    quantity: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT 
      order_id,
      exchange_order_id,
      client_order_id,
      symbol,
      side,
      type,
      price,
      quantity,
      status,
      created_at,
      COALESCE(updated_at, created_at) as updated_at
    FROM ichigo.orders
    WHERE status = 'FILLED'
    ORDER BY COALESCE(updated_at, created_at) DESC
    LIMIT 50
  `
  );

  return result.map((row) => ({
    orderId: row.order_id,
    exchangeOrderId: row.exchange_order_id,
    clientOrderId: row.client_order_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    price: row.price && parseFloat(row.price) > 0 ? parseFloat(row.price) : null,
    quantity: row.quantity && parseFloat(row.quantity) > 0 ? parseFloat(row.quantity) : null,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Get canceled orders (recent 50) - handles both CANCELED and CANCELLED spellings
 */
export async function getCanceledOrders() {
  const result = await query<{
    order_id: number;
    exchange_order_id: string;
    client_order_id: string;
    symbol: string;
    side: string;
    type: string;
    price: string;
    quantity: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT 
      order_id,
      exchange_order_id,
      client_order_id,
      symbol,
      side,
      type,
      price,
      quantity,
      status,
      created_at,
      COALESCE(updated_at, created_at) as updated_at
    FROM ichigo.orders
    WHERE status IN ('CANCELED', 'CANCELLED', 'EXPIRED', 'REJECTED')
    ORDER BY COALESCE(updated_at, created_at) DESC
    LIMIT 50
  `
  );

  return result.map((row) => ({
    orderId: row.order_id,
    exchangeOrderId: row.exchange_order_id,
    clientOrderId: row.client_order_id,
    symbol: row.symbol,
    side: row.side,
    type: row.type,
    price: row.price && parseFloat(row.price) > 0 ? parseFloat(row.price) : null,
    quantity: row.quantity && parseFloat(row.quantity) > 0 ? parseFloat(row.quantity) : null,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Get recent decisions with details and market intelligence
 */
export async function getRecentDecisions(limit = 20) {
  const result = await query<{
    decision_uid: string;
    decided_at: string;
    action: string;
    note: string;
    regime_key: string;
    last_close: string;
    rsi14_3m: string;
    adx14_3m: string;
    has_position: boolean;
    market_intelligence: any;
  }>(
    `
    SELECT 
      decision_uid,
      decided_at,
      action,
      note,
      regime_key,
      last_close,
      rsi14_3m,
      adx14_3m,
      has_position,
      feature_snapshot->'market_intelligence' as market_intelligence
    FROM ichigo.decisions
    ORDER BY decided_at DESC
    LIMIT $1
  `,
    [limit]
  );

  return result.map((row) => ({
    decisionUid: row.decision_uid,
    decidedAt: row.decided_at,
    action: row.action,
    note: row.note,
    regimeKey: row.regime_key,
    lastClose: parseFloat(row.last_close),
    rsi14_3m: parseFloat(row.rsi14_3m),
    adx14_3m: parseFloat(row.adx14_3m),
    hasPosition: row.has_position,
    marketIntelligence: row.market_intelligence || null,
  }));
}

/**
 * Get highest and lowest prices from decisions in the last X hours
 */
export async function getPriceHighLow(hours = 72) {
  const result = await query<{
    max_price: string;
    min_price: string;
  }>(
    `
    SELECT 
      MAX(last_close) as max_price,
      MIN(last_close) as min_price
    FROM ichigo.decisions
    WHERE decided_at >= NOW() - INTERVAL '${hours} hours'
  `
  );

  return {
    highestPrice: result[0] ? parseFloat(result[0].max_price) : 0,
    lowestPrice: result[0] ? parseFloat(result[0].min_price) : 0,
  };
}

/**
 * Get historical account values from decisions table - aggregated hourly for cleaner graph
 */
export async function getHistoricalData(hours = 72): Promise<HistoricalDataPoint[]> {
  const result = await query<{
    hour_timestamp: string;
    account_value: string;
    usdt_balance: string;
    aster_qty: string;
    aster_price: string;
  }>(
    `
    SELECT 
      date_trunc('hour', decided_at) as hour_timestamp,
      AVG((base_qty * last_close) + usdt_free) as account_value,
      AVG(usdt_free) as usdt_balance,
      AVG(base_qty) as aster_qty,
      AVG(last_close) as aster_price
    FROM ichigo.decisions
    WHERE decided_at >= NOW() - INTERVAL '${hours} hours'
    GROUP BY date_trunc('hour', decided_at)
    ORDER BY hour_timestamp ASC
  `
  );

  return result.map((row) => ({
    timestamp: row.hour_timestamp,
    accountValue: parseFloat(row.account_value),
    usdtBalance: parseFloat(row.usdt_balance),
    asterQty: parseFloat(row.aster_qty),
    asterPrice: parseFloat(row.aster_price),
  }));
}

/**
 * Aggregate all dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [position, trades, botStats, historicalData, recentDecisions, priceHighLow, openOrders, filledOrders, canceledOrders] = await Promise.all([
    getCurrentPosition(),
    getRecentTrades(50),
    getBotStats(),
    getHistoricalData(72),
    getRecentDecisions(50),
    getPriceHighLow(72),
    getOpenOrders(),
    getFilledOrders(),
    getCanceledOrders(),
  ]);

  // Calculate realized P&L from trades
  const realizedPnL = trades.reduce((sum, trade) => sum + trade.pnlUsdt, 0);

  // ALWAYS use latest price from decisions table (updates every 3 minutes)
  const currentPrice = botStats.lastPrice;
  
  // Calculate current balances - prioritize decisions table over stale snapshots
  const qtyInOrders = position && position.qtyInTpOrders ? position.qtyInTpOrders : 0;
  
  // Use decisions table balance (most accurate, updated every 3 minutes)
  const currentAsterBalance = botStats.baseQty;
  const currentUsdtBalance = botStats.usdtFree;
  
  // Total ASTER = current balance (not the stale snapshot)
  // Note: qtyInOrders is already included in baseQty from Binance
  const totalAsterBalance = currentAsterBalance;
  const usdtBalance = currentUsdtBalance;
  
  // Calculate account value with CURRENT price (including ASTER in orders)
  const accountValue = totalAsterBalance * currentPrice + usdtBalance;

  // Calculate unrealized P&L properly
  const hasActivePosition = totalAsterBalance > 0;
  const entryPrice = position && position.entryPrice > 0 ? position.entryPrice : 0;
  const unrealizedPnL = hasActivePosition && entryPrice > 0 ? (currentPrice - entryPrice) * totalAsterBalance : 0;
  const unrealizedPnLPercent = hasActivePosition && entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

  // Calculate runtime
  const firstDecisionDate = new Date(botStats.firstDecision);
  const lastDecisionDate = new Date(botStats.lastDecision);
  const daysSinceStart = Math.floor(
    (lastDecisionDate.getTime() - firstDecisionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate total runtime string
  const runtimeMs = lastDecisionDate.getTime() - firstDecisionDate.getTime();
  const days = Math.floor(runtimeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((runtimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const totalRuntime = `${days}d ${hours}h`;

  return {
    accountValue,
    asterBalance: totalAsterBalance,
    usdtBalance,
    currentPrice,
    highestPrice: priceHighLow.highestPrice,
    lowestPrice: priceHighLow.lowestPrice,
    unrealizedPnL,
    unrealizedPnLPercent,
    realizedPnL,
    totalDecisions: botStats.totalDecisions,
    buyCount: botStats.buyCount,
    sellCount: botStats.sellCount,
    holdCount: botStats.holdCount,
    openTPOrders: position ? position.openCount : 0,
    qtyInTpOrders: position ? position.qtyInTpOrders : 0,
    lastDecision: {
      timestamp: botStats.lastDecision,
      action: botStats.lastAction,
    },
    runtime: {
      firstDecision: botStats.firstDecision,
      lastDecision: botStats.lastDecision,
      daysSinceStart,
      totalRuntime,
    },
    position: {
      hasPosition: hasActivePosition,
      entryPrice: entryPrice,
      entryTime: position && position.entryAt ? position.entryAt : '',
      currentQty: totalAsterBalance,
    },
    historicalData,
    recentDecisions,
    openOrders,
    filledOrders,
    canceledOrders,
  };
}

