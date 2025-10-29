'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HistoricalDataPoint } from '@/lib/types';

interface AccountValueChartProps {
  data: HistoricalDataPoint[];
  currentValue: number;
}

export default function AccountValueChart({ data, currentValue }: AccountValueChartProps) {
  // Format data for Recharts - cleaner time format
  const chartData = data.map((point, index) => ({
    time: new Date(point.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: point.accountValue,
    index,
  }));

  // Custom tick formatter to show fewer labels (every 6 hours = every ~6 data points)
  const customTickFormatter = (value: string, index: number) => {
    // Show every 6th tick to avoid cramping
    if (index % 6 === 0) {
      return value;
    }
    return '';
  };

  return (
    <div className="relative w-full h-[300px] md:h-[450px] bg-white border border-gray-200 rounded">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 40, right: 20, left: 40, bottom: 40 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="#000000"
            strokeWidth={0.5}
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="#1f2937"
            style={{ fontSize: '11px', fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
            interval="preserveStartEnd"
            minTickGap={80}
          />
          <YAxis
            stroke="#1f2937"
            style={{ fontSize: '11px', fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#000000', strokeWidth: 1 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              color: '#f3f4f6',
              padding: '8px 12px',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Account Value']}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Current value indicator - positioned like nof1.ai */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-blue-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-mono font-semibold shadow-lg">
        ${currentValue.toFixed(2)}
      </div>
      
      {/* aster.bot watermark */}
      <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-gray-400 text-[10px] md:text-xs font-mono">
        aster.bot
      </div>
    </div>
  );
}

