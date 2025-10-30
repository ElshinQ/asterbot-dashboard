'use client';

import type { MarketIntelligence } from '@/lib/types';

interface MarketIntelligenceCardProps {
  intelligence: MarketIntelligence;
  currentPrice: number;
  isDarkMode?: boolean;
}

export default function MarketIntelligenceCard({ intelligence, currentPrice, isDarkMode = false }: MarketIntelligenceCardProps) {
  if (!intelligence) return null;

  const { orderbook, support_resistance, decision_quality, insights, flags } = intelligence;

  const getOrderbookEmoji = (signal: string) => {
    if (signal === 'strong_buy_pressure') return '🟢';
    if (signal === 'buy_pressure') return '🟢';
    if (signal === 'strong_sell_pressure') return '🔴';
    if (signal === 'sell_pressure') return '🔴';
    return '⚖️';
  };

  const getQualityColor = (score: number) => {
    if (score >= 75) return '#16a34a';
    if (score >= 60) return '#16a34a';
    if (score >= 40) return '#d97706';
    return '#dc2626';
  };

  const getPriorityStyle = (priority: string) => {
    if (isDarkMode) {
      if (priority === 'high') return { bg: '#220000', color: '#dc2626', border: '#dc2626' };
      if (priority === 'medium') return { bg: '#1a1a00', color: '#facc15', border: '#facc15' };
      return { bg: '#001100', color: '#16a34a', border: '#16a34a' };
    }
    if (priority === 'high') return { bg: '#fef2f2', color: '#dc2626', border: '#dc2626' };
    if (priority === 'medium') return { bg: '#fffbeb', color: '#d97706', border: '#d97706' };
    return { bg: '#f0fdf4', color: '#16a34a', border: '#16a34a' };
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Header */}
      <div 
        className="px-3 py-2"
        style={{ 
          border: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', 
          backgroundColor: 'transparent' 
        }}
      >
        <h3 className="text-sm font-bold uppercase" style={{ color: isDarkMode ? '#16a34a' : '#000000' }}>
          📊 Market Intelligence
        </h3>
      </div>

      {/* Order Book Section */}
      <div 
        className="p-3"
        style={{ border: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', backgroundColor: 'transparent' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase" style={{ color: isDarkMode ? '#16a34a' : '#000000' }}>
            {getOrderbookEmoji(orderbook.signal)} Order Book
          </span>
          <span className="text-xs font-bold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {orderbook.signal.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span style={{ color: isDarkMode ? '#15803d' : '#4b5563', fontWeight: 600 }}>Signal:</span>
            <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="font-bold">
              {orderbook.signal.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: isDarkMode ? '#15803d' : '#4b5563', fontWeight: 600 }}>Bid/Ask Ratio:</span>
            <span 
              className="font-bold"
              style={{ 
                color: orderbook.ba_ratio > 1.2 ? '#16a34a' : orderbook.ba_ratio < 0.8 ? '#dc2626' : (isDarkMode ? '#ffffff' : '#000000') 
              }}
            >
              {orderbook.ba_ratio.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: isDarkMode ? '#15803d' : '#4b5563', fontWeight: 600 }}>Liquidity:</span>
            <span 
              className="font-bold"
              style={{ 
                color: orderbook.liquidity_score >= 60 ? '#16a34a' : orderbook.liquidity_score >= 40 ? (isDarkMode ? '#facc15' : '#d97706') : '#dc2626' 
              }}
            >
              {orderbook.liquidity_score}/100
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: isDarkMode ? '#15803d' : '#4b5563', fontWeight: 600 }}>Spread:</span>
            <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="font-bold">
              {(orderbook.spread_pct * 100).toFixed(3)}%
            </span>
          </div>

          {orderbook.insight && (
            <div className="pt-2 mt-2" style={{ borderTop: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000' }}>
              <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }} className="text-[10px]">
                {orderbook.insight}
              </span>
            </div>
          )}
        </div>

        {/* Walls */}
        {(orderbook.walls.has_bid_wall || orderbook.walls.has_ask_wall) && (
          <div className="mt-3 pt-2 space-y-1" style={{ borderTop: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000' }}>
            {orderbook.walls.has_bid_wall && orderbook.walls.bid_wall && (
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: '#16a34a' }} className="font-bold">
                  🛡️ Bid Wall:
                </span>
                <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }}>
                  ${orderbook.walls.bid_wall.price.toFixed(3)} ({orderbook.walls.bid_wall.size.toLocaleString()} ASTER)
                </span>
              </div>
            )}
            {orderbook.walls.has_ask_wall && orderbook.walls.ask_wall && (
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: '#dc2626' }} className="font-bold">
                  🚧 Ask Wall:
                </span>
                <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }}>
                  ${orderbook.walls.ask_wall.price.toFixed(3)} ({orderbook.walls.ask_wall.size.toLocaleString()} ASTER)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Support & Resistance Section */}
      <div 
        className="p-3"
        style={{ border: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', backgroundColor: 'transparent' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase" style={{ color: isDarkMode ? '#16a34a' : '#000000' }}>
            🎯 Support & Resistance
          </span>
          <span className="text-xs font-bold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {support_resistance.price_position}%
          </span>
        </div>

        <div className="space-y-1 text-xs">
          {support_resistance.nearest_support && (
            <div className="flex justify-between">
              <span style={{ color: '#16a34a' }} className="font-bold">Nearest Support:</span>
              <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }}>
                ${support_resistance.nearest_support.price.toFixed(3)} ({support_resistance.nearest_support.label})
                <span style={{ color: isDarkMode ? '#15803d' : '#4b5563' }} className="ml-1">
                  -{support_resistance.nearest_support.distance_pct}%
                </span>
              </span>
            </div>
          )}

          {support_resistance.nearest_resistance && (
            <div className="flex justify-between">
              <span style={{ color: '#dc2626' }} className="font-bold">Nearest Resistance:</span>
              <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }}>
                ${support_resistance.nearest_resistance.price.toFixed(3)} ({support_resistance.nearest_resistance.label})
                <span style={{ color: isDarkMode ? '#15803d' : '#4b5563' }} className="ml-1">
                  +{support_resistance.nearest_resistance.distance_pct}%
                </span>
              </span>
            </div>
          )}

          <div className="flex justify-between pt-2 mt-2" style={{ borderTop: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', color: isDarkMode ? '#15803d' : '#4b5563' }}>
            <span className="text-[10px] font-semibold">{support_resistance.support_count} supports</span>
            <span className="text-[10px] font-semibold">{support_resistance.resistance_count} resistances</span>
          </div>
        </div>
      </div>

      {/* Decision Quality Section */}
      <div 
        className="p-3"
        style={{ border: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', backgroundColor: 'transparent' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase" style={{ color: isDarkMode ? '#16a34a' : '#000000' }}>
            ✅ Decision Quality
          </span>
          <span 
            className="text-lg font-bold"
            style={{ color: getQualityColor(decision_quality.score) }}
          >
            {decision_quality.score}/100
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span style={{ color: isDarkMode ? '#15803d' : '#4b5563', fontWeight: 600 }}>Assessment:</span>
            <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }} className="font-bold uppercase">
              {decision_quality.label}
            </span>
          </div>

          {decision_quality.factors.length > 0 && (
            <div className="mt-2 pt-2 space-y-1" style={{ borderTop: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000' }}>
              {decision_quality.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px]">
                  <span style={{ color: factor.impact > 0 ? '#16a34a' : '#dc2626' }} className="font-bold">
                    {factor.impact > 0 ? '↑' : '↓'}
                  </span>
                  <span style={{ color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 600 }} className="flex-1">
                    {factor.note}
                  </span>
                  <span style={{ color: factor.impact > 0 ? '#16a34a' : '#dc2626' }} className="font-bold">
                    {factor.impact > 0 ? '+' : ''}{factor.impact}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div 
          className="p-3"
          style={{ border: isDarkMode ? '2px dashed #16a34a' : '2px dashed #000000', backgroundColor: 'transparent' }}
        >
          <div className="mb-2">
            <span className="text-xs font-bold uppercase" style={{ color: isDarkMode ? '#16a34a' : '#000000' }}>
              💡 Insights
            </span>
          </div>

          <div className="space-y-2">
            {insights.map((insight, idx) => {
              const priorityStyle = getPriorityStyle(insight.priority);
              return (
                <div
                  key={idx}
                  className="p-2 text-[10px]"
                  style={{
                    border: '2px dashed ' + priorityStyle.border,
                    backgroundColor: priorityStyle.bg,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold uppercase" style={{ color: priorityStyle.color }}>{insight.priority}</span>
                    <span className="flex-1 font-semibold" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {insight.message}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flags Section */}
      <div className="flex flex-wrap gap-2">
        {flags.strong_buy_setup && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #16a34a', 
              backgroundColor: isDarkMode ? '#001100' : '#f0fdf4', 
              color: '#16a34a' 
            }}
          >
            🎯 Strong Setup
          </span>
        )}
        {flags.near_support && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #16a34a', 
              backgroundColor: isDarkMode ? '#001100' : '#f0fdf4', 
              color: '#16a34a' 
            }}
          >
            🛡️ Near Support
          </span>
        )}
        {flags.near_resistance && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: isDarkMode ? '2px dashed #facc15' : '2px dashed #d97706', 
              backgroundColor: isDarkMode ? '#1a1a00' : '#fffbeb', 
              color: isDarkMode ? '#facc15' : '#d97706'
            }}
          >
            🚧 Near Resistance
          </span>
        )}
        {flags.low_liquidity_risk && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #dc2626', 
              backgroundColor: isDarkMode ? '#220000' : '#fef2f2', 
              color: '#dc2626' 
            }}
          >
            ⚠️ Low Liquidity
          </span>
        )}
        {flags.orderbook_bullish && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #16a34a', 
              backgroundColor: isDarkMode ? '#001100' : '#f0fdf4', 
              color: '#16a34a' 
            }}
          >
            🟢 Bullish OB
          </span>
        )}
        {flags.orderbook_bearish && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #dc2626', 
              backgroundColor: isDarkMode ? '#220000' : '#fef2f2', 
              color: '#dc2626' 
            }}
          >
            🔴 Bearish OB
          </span>
        )}
        {flags.quality_decision && (
          <span 
            className="text-[10px] px-2 py-1 font-bold"
            style={{ 
              border: '2px dashed #16a34a', 
              backgroundColor: isDarkMode ? '#001100' : '#f0fdf4', 
              color: '#16a34a' 
            }}
          >
            ✅ Quality
          </span>
        )}
      </div>
    </div>
  );
}
