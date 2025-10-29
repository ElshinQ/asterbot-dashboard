'use client';

import { useEffect, useState } from 'react';

interface AccountValueProps {
  value: number;
}

export default function AccountValue({ value }: AccountValueProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
        TOTAL ACCOUNT VALUE
      </div>
      <div className="text-6xl font-mono font-bold text-green-400">
        ${displayValue.toFixed(2)}
      </div>
      <div className="text-sm font-mono text-gray-500 mt-2">USDT</div>
    </div>
  );
}

