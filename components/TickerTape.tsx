'use client';

interface TickerTapeProps {
  price: number;
  highestValue: number;
  lowestValue: number;
  symbol?: string;
}

export default function TickerTape({
  price,
  highestValue,
  lowestValue,
  symbol = 'ASTERUSDT',
}: TickerTapeProps) {
  const formattedPrice = price.toFixed(5);
  const formattedHighest = (highestValue || price).toFixed(5);
  const formattedLowest = (lowestValue || price).toFixed(5);

  // Calculate % change from highest and lowest
  const changeFromHigh = highestValue 
    ? (((price - highestValue) / highestValue) * 100).toFixed(2)
    : '0.00';
  const changeFromLow = lowestValue 
    ? (((price - lowestValue) / lowestValue) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="border-b-2 border-gray-900 bg-white py-3">
      <div className="px-4 md:px-6">
        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-gray-900">{symbol}</span>
              <span className="text-gray-900 font-semibold text-base">${formattedPrice}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1">
              <span className="text-gray-900">HIGH:</span>
              <span className="text-green-600 font-semibold">${formattedHighest}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-900">LOW:</span>
              <span className="text-red-600 font-semibold">${formattedLowest}</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-8 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-sm font-bold">{symbol}</span>
              <span className="text-gray-900 font-semibold text-lg">${formattedPrice}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-900">72H HIGHEST:</span>
              <span className="text-green-600 font-semibold">${formattedHighest}</span>
              <span className="text-gray-900">({changeFromHigh}%)</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">72H LOWEST:</span>
              <span className="text-red-600 font-semibold">${formattedLowest}</span>
              <span className="text-gray-900">(+{changeFromLow}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
