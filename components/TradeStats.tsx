'use client';

interface TradeStatsProps {
  totalDecisions: number;
  buyCount: number;
  sellCount: number;
  holdCount: number;
}

export default function TradeStats({
  totalDecisions,
  buyCount,
  sellCount,
  holdCount,
}: TradeStatsProps) {
  const buyRate = totalDecisions > 0 ? (buyCount / totalDecisions) * 100 : 0;
  const sellRate = totalDecisions > 0 ? (sellCount / totalDecisions) * 100 : 0;

  return (
    <div className="bg-[#0f0f0f] border border-green-500/20 p-6 rounded-lg">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
        TRADES
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">TOTAL DECISIONS</span>
          <span className="text-sm font-mono text-green-400 font-bold">
            {totalDecisions.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">BUYS</span>
          <span className="text-sm font-mono text-green-400">
            {buyCount} ({buyRate.toFixed(1)}%)
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">SELLS</span>
          <span className="text-sm font-mono text-red-400">
            {sellCount} ({sellRate.toFixed(1)}%)
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">HOLDS</span>
          <span className="text-sm font-mono text-gray-400">{holdCount}</span>
        </div>
      </div>
    </div>
  );
}

