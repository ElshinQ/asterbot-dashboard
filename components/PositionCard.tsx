'use client';

interface PositionCardProps {
  hasPosition: boolean;
  asterBalance: number;
  entryPrice: number;
  currentPrice: number;
  openTPOrders: number;
  qtyInTpOrders: number;
}

export default function PositionCard({
  hasPosition,
  asterBalance,
  entryPrice,
  currentPrice,
  openTPOrders,
  qtyInTpOrders,
}: PositionCardProps) {
  return (
    <div className="bg-[#0f0f0f] border border-green-500/20 p-6 rounded-lg">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
        POSITION
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">STATUS</span>
          <span
            className={`text-xs font-mono font-bold ${
              hasPosition ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            {hasPosition ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">ASTER BALANCE</span>
          <span className="text-sm font-mono text-green-400 font-bold">
            {asterBalance.toFixed(2)}
          </span>
        </div>

        {hasPosition && entryPrice > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-xs font-mono text-gray-500">ENTRY PRICE</span>
              <span className="text-sm font-mono text-gray-300">
                ${entryPrice.toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs font-mono text-gray-500">CURRENT PRICE</span>
              <span className="text-sm font-mono text-gray-300">
                ${currentPrice.toFixed(4)}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">OPEN TPS</span>
          <span className="text-sm font-mono text-green-400 font-bold">
            {openTPOrders}
          </span>
        </div>

        {qtyInTpOrders > 0 && (
          <div className="flex justify-between">
            <span className="text-xs font-mono text-gray-500">QTY IN TPS</span>
            <span className="text-sm font-mono text-gray-300">
              {qtyInTpOrders.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

