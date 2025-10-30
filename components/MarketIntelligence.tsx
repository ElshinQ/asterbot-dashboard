'use client';

import type { MarketIntelligence } from '@/lib/types';

interface MarketIntelligenceCardProps {
  intelligence: MarketIntelligence;
  currentPrice: number;
}

export default function MarketIntelligenceCard({ intelligence, currentPrice }: MarketIntelligenceCardProps) {
  if (!intelligence) return null;

  const { orderbook, support_resistance, decision_quality, insights, flags } = intelligence;

  // Helper function to get emoji for orderbook signal
  const getOrderbookEmoji = (signal: string) => {
    if (signal === 'strong_buy_pressure') return '🟢';
    if (signal === 'buy_pressure') return '🟢';
    if (signal === 'strong_sell_pressure') return '🔴';
    if (signal === 'sell_pressure') return '🔴';
    return '⚖️';
  };

  // Helper function to get color for quality score
  const getQualityColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (priority === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        📊 Market Intelligence
      </h3>

      {/* Order Book Analysis */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          {getOrderbookEmoji(orderbook.signal)} Order Book
        </h4>
        <div className="bg-gray-900/50 rounded p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Signal:</span>
            <span className="text-white font-medium">{orderbook.signal.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Bid/Ask Ratio:</span>
            <span className={`font-medium ${orderbook.ba_ratio > 1.2 ? 'text-green-400' : orderbook.ba_ratio < 0.8 ? 'text-red-400' : 'text-gray-300'}`}>
              {orderbook.ba_ratio.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Liquidity:</span>
            <span className={`font-medium ${orderbook.liquidity_score >= 60 ? 'text-green-400' : orderbook.liquidity_score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {orderbook.liquidity_score}/100
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Spread:</span>
            <span className="text-gray-300">{(orderbook.spread_pct * 100).toFixed(3)}%</span>
          </div>
          {orderbook.insight && (
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
              {orderbook.insight}
            </div>
          )}
        </div>

        {/* Bid/Ask Walls */}
        {(orderbook.walls.has_bid_wall || orderbook.walls.has_ask_wall) && (
          <div className="bg-gray-900/50 rounded p-3 space-y-2">
            {orderbook.walls.has_bid_wall && orderbook.walls.bid_wall && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">🛡️ Bid Wall:</span>
                <span className="text-gray-300">
                  ${orderbook.walls.bid_wall.price.toFixed(3)} ({orderbook.walls.bid_wall.size.toLocaleString()} ASTER)
                </span>
              </div>
            )}
            {orderbook.walls.has_ask_wall && orderbook.walls.ask_wall && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-400">🚧 Ask Wall:</span>
                <span className="text-gray-300">
                  ${orderbook.walls.ask_wall.price.toFixed(3)} ({orderbook.walls.ask_wall.size.toLocaleString()} ASTER)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Support & Resistance */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">🎯 Support & Resistance</h4>
        <div className="bg-gray-900/50 rounded p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Price Position:</span>
            <span className="text-white font-medium">{support_resistance.price_position}%</span>
          </div>
          
          {support_resistance.nearest_support && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">Nearest Support:</span>
              <span className="text-gray-300">
                ${support_resistance.nearest_support.price.toFixed(3)} ({support_resistance.nearest_support.label})
                <span className="text-xs text-gray-500 ml-1">-{support_resistance.nearest_support.distance_pct}%</span>
              </span>
            </div>
          )}
          
          {support_resistance.nearest_resistance && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">Nearest Resistance:</span>
              <span className="text-gray-300">
                ${support_resistance.nearest_resistance.price.toFixed(3)} ({support_resistance.nearest_resistance.label})
                <span className="text-xs text-gray-500 ml-1">+{support_resistance.nearest_resistance.distance_pct}%</span>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
            <span>{support_resistance.support_count} supports</span>
            <span>{support_resistance.resistance_count} resistances</span>
          </div>
        </div>
      </div>

      {/* Decision Quality */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">✅ Decision Quality</h4>
        <div className="bg-gray-900/50 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Quality Score:</span>
            <span className={`font-bold text-lg ${getQualityColor(decision_quality.score)}`}>
              {decision_quality.score}/100
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Assessment:</span>
            <span className="text-white text-sm font-medium uppercase">{decision_quality.label}</span>
          </div>
          
          {decision_quality.factors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
              {decision_quality.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className={factor.impact > 0 ? 'text-green-400' : 'text-red-400'}>
                    {factor.impact > 0 ? '↑' : '↓'}
                  </span>
                  <span className="text-gray-400 flex-1">{factor.note}</span>
                  <span className={factor.impact > 0 ? 'text-green-400' : 'text-red-400'}>
                    {factor.impact > 0 ? '+' : ''}{factor.impact}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actionable Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">💡 Insights</h4>
          <div className="space-y-2">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`rounded p-2 text-xs border ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-medium uppercase text-[10px]">{insight.priority}</span>
                  <span className="flex-1">{insight.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {flags.strong_buy_setup && (
          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
            🎯 Strong Setup
          </span>
        )}
        {flags.near_support && (
          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            🛡️ Near Support
          </span>
        )}
        {flags.near_resistance && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            🚧 Near Resistance
          </span>
        )}
        {flags.low_liquidity_risk && (
          <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            ⚠️ Low Liquidity
          </span>
        )}
        {flags.orderbook_bullish && (
          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
            🟢 Bullish OB
          </span>
        )}
        {flags.orderbook_bearish && (
          <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            🔴 Bearish OB
          </span>
        )}
        {flags.quality_decision && (
          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            ✅ Quality
          </span>
        )}
      </div>
    </div>
  );
}

