'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HistoricalDataPoint } from '@/lib/types';

interface AccountValueChartProps {
  data: HistoricalDataPoint[];
  currentValue: number;
  currentUsdtValue: number;
  chartMode?: 'value' | 'percent';
  valueType?: 'total' | 'usdt';
}

export default function AccountValueChart({ 
  data, 
  currentValue, 
  currentUsdtValue,
  chartMode = 'value',
  valueType = 'total'
}: AccountValueChartProps) {
  // Get the actual value based on valueType
  const rawValue = (point: HistoricalDataPoint) => 
    valueType === 'usdt' ? point.usdtBalance : point.accountValue;
  
  // Calculate baseline for percentage mode (first value)
  const baseValue = data.length > 0 ? rawValue(data[0]) : (valueType === 'usdt' ? currentUsdtValue : currentValue);
  
  // Format data for Recharts - cleaner time format
  const chartData = data.map((point, index) => {
    const pointValue = rawValue(point);
    return {
      time: new Date(point.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: chartMode === 'percent' 
        ? ((pointValue - baseValue) / baseValue) * 100 
        : pointValue,
      index,
    };
  });

  // Custom tick formatter to show fewer labels (every 6 hours = every ~6 data points)
  const customTickFormatter = (value: string, index: number) => {
    // Show every 6th tick to avoid cramping
    if (index % 6 === 0) {
      return value;
    }
    return '';
  };

  return (
    <div className="relative w-full h-[300px] md:h-[450px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 40, right: 30, left: 10, bottom: 80 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="currentColor"
            strokeWidth={0.5}
            horizontal={true}
            vertical={false}
            className="text-gray-300 dark:text-gray-700"
          />
          <XAxis
            dataKey="time"
            stroke="currentColor"
            className="text-gray-700 dark:text-gray-400"
            style={{ fontSize: '10px', fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          <YAxis
            stroke="currentColor"
            className="text-gray-700 dark:text-gray-400"
            style={{ fontSize: '11px', fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
            tickFormatter={(value) => 
              chartMode === 'percent' ? `${value.toFixed(1)}%` : `$${value.toLocaleString()}`
            }
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #1f2937)',
              border: '2px solid var(--tooltip-border, #00ff00)',
              borderRadius: '6px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              color: 'var(--tooltip-text, #f3f4f6)',
              padding: '8px 12px',
            }}
            formatter={(value: number) => {
              const label = chartMode === 'percent' 
                ? 'Change' 
                : (valueType === 'usdt' ? 'USDT Balance' : 'Total Value');
              return [
                chartMode === 'percent' ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`, 
                label
              ];
            }}
            labelStyle={{ color: 'var(--tooltip-label, #9ca3af)', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--line-color, #3b82f6)"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Current value indicator - positioned like nof1.ai */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-blue-500 dark:bg-green-500 text-white dark:text-black px-3 md:px-4 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-mono font-semibold shadow-lg">
        ${(valueType === 'usdt' ? currentUsdtValue : currentValue).toFixed(2)}
      </div>
      
      {/* aster.bot watermark */}
      <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-gray-400 dark:text-gray-600 text-[10px] md:text-xs font-mono">
        aster.bot
      </div>
    </div>
  );
}

