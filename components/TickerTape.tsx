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
    <div className="border-b border-gray-200 bg-gray-50 py-3">
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-8 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{symbol}</span>
            <span className="text-gray-900 font-semibold text-base">${formattedPrice}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">72H HIGHEST:</span>
            <span className="text-green-600 font-semibold">${formattedHighest}</span>
            <span className="text-gray-500">({changeFromHigh}%)</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">72H LOWEST:</span>
            <span className="text-red-600 font-semibold">${formattedLowest}</span>
            <span className="text-gray-500">(+{changeFromLow}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
