'use client';

interface PnLCardProps {
  realizedPnL: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export default function PnLCard({
  realizedPnL,
  unrealizedPnL,
  unrealizedPnLPercent,
}: PnLCardProps) {
  const totalPnL = realizedPnL + unrealizedPnL;
  const isPositive = totalPnL >= 0;

  return (
    <div className="bg-[#0f0f0f] border border-green-500/20 p-6 rounded-lg">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
        P&L
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-mono text-gray-500 mb-1">REALIZED</div>
          <div
            className={`text-2xl font-mono font-bold ${
              realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            ${realizedPnL.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-xs font-mono text-gray-500 mb-1">UNREALIZED</div>
          <div
            className={`text-2xl font-mono font-bold ${
              unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            ${unrealizedPnL.toFixed(2)}
            <span className="text-base ml-2">
              ({unrealizedPnLPercent >= 0 ? '+' : ''}
              {unrealizedPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-green-500/20">
          <div className="text-xs font-mono text-gray-500 mb-1">TOTAL</div>
          <div
            className={`text-3xl font-mono font-bold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}${totalPnL.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

