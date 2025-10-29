'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { HistoricalDataPoint } from '@/lib/types';

interface AccountValueChartProps {
  data: HistoricalDataPoint[];
  currentValue: number;
  currentUsdtValue: number;
  chartMode?: 'value' | 'percent';
  valueType?: 'total' | 'usdt';
  isDarkMode?: boolean;
}

export default function AccountValueChart({ 
  data, 
  currentValue, 
  currentUsdtValue,
  chartMode = 'value',
  valueType = 'total',
  isDarkMode = false
}: AccountValueChartProps) {
  // Get the actual value based on valueType
  // ASTER shows token quantity, USDT shows balance in dollars
  const rawValue = (point: HistoricalDataPoint) => 
    valueType === 'usdt' ? point.usdtBalance : point.asterQty;
  
  // Calculate baseline for percentage mode (first value)
  const baseValue = data.length > 0 ? rawValue(data[0]) : (valueType === 'usdt' ? currentUsdtValue : currentValue);
  const basePriceValue = data.length > 0 ? data[0].asterPrice : 0;
  
  // Format data for Recharts - cleaner time format with dual lines
  const chartData = data.map((point, index) => {
    const pointValue = rawValue(point);
    const priceValue = point.asterPrice;
    
    return {
      time: new Date(point.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      balance: chartMode === 'percent' 
        ? ((pointValue - baseValue) / baseValue) * 100 
        : pointValue,
      price: chartMode === 'percent'
        ? ((priceValue - basePriceValue) / basePriceValue) * 100
        : priceValue,
      index,
    };
  });

  // Get current price from latest data point
  const currentPrice = data.length > 0 ? data[data.length - 1].asterPrice : 0;

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] border rounded"
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        borderColor: isDarkMode ? '#00ff00' : '#e5e7eb',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 40, right: 70, left: 20, bottom: 80 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? '#003300' : '#e5e7eb'}
            strokeWidth={0.5}
            horizontal={true}
            vertical={true}
          />
          <XAxis
            dataKey="time"
            stroke={isDarkMode ? '#00aa00' : '#374151'}
            style={{ 
              fontSize: '10px', 
              fontFamily: 'var(--font-ibm-plex-mono)', 
              fontWeight: 500, 
              fill: isDarkMode ? '#00aa00' : '#374151' 
            }}
            tickLine={false}
            axisLine={{ stroke: isDarkMode ? '#00aa00' : '#374151', strokeWidth: 1 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          
          {/* Left Y-Axis for Balance */}
          <YAxis
            yAxisId="left"
            stroke={isDarkMode ? '#00ff00' : '#3b82f6'}
            style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-ibm-plex-mono)', 
              fontWeight: 600, 
              fill: isDarkMode ? '#00ff00' : '#3b82f6' 
            }}
            tickLine={false}
            axisLine={{ stroke: isDarkMode ? '#00ff00' : '#3b82f6', strokeWidth: 2 }}
            tickFormatter={(value) => {
              if (chartMode === 'percent') return `${value.toFixed(1)}%`;
              if (valueType === 'usdt') return `$${Math.round(value).toLocaleString()}`;
              return Math.round(value).toLocaleString();
            }}
            domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => Math.max(0, Math.floor(dataMin * 0.95)), (dataMax: number) => Math.ceil(dataMax * 1.05)]}
          />
          
          {/* Right Y-Axis for Price */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
            style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-ibm-plex-mono)', 
              fontWeight: 600, 
              fill: isDarkMode ? '#ff9500' : '#f59e0b' 
            }}
            tickLine={false}
            axisLine={{ stroke: isDarkMode ? '#ff9500' : '#f59e0b', strokeWidth: 2 }}
            tickFormatter={(value) => {
              if (chartMode === 'percent') return `${value.toFixed(2)}%`;
              return `$${value.toFixed(6)}`;
            }}
            domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => dataMin * 0.998, (dataMax: number) => dataMax * 1.002]}
            width={80}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#000000' : '#ffffff',
              border: `2px solid ${isDarkMode ? '#00ff00' : '#1f2937'}`,
              borderRadius: '8px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              padding: '12px 16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'balance') {
                const label = chartMode === 'percent' 
                  ? 'Balance Change' 
                  : (valueType === 'usdt' ? 'USDT Balance' : 'ASTER Quantity');
                
                let formattedValue;
                if (chartMode === 'percent') {
                  formattedValue = `${value.toFixed(3)}%`;
                } else if (valueType === 'usdt') {
                  formattedValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                } else {
                  formattedValue = `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ASTER`;
                }
                
                return [formattedValue, label];
              } else if (name === 'price') {
                const label = chartMode === 'percent' ? 'Price Change' : 'ASTER Price';
                const formattedValue = chartMode === 'percent' 
                  ? `${value.toFixed(3)}%`
                  : `$${value.toFixed(6)}`;
                return [formattedValue, label];
              }
              return [value, name];
            }}
            labelStyle={{ 
              color: isDarkMode ? '#00ff00' : '#1f2937', 
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            separator=": "
          />
          
          <Legend
            wrapperStyle={{
              paddingTop: '15px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            iconType="line"
            iconSize={20}
            formatter={(value) => {
              if (value === 'balance') {
                return valueType === 'usdt' ? '● USDT BALANCE' : '● ASTER QUANTITY';
              } else if (value === 'price') {
                return '◆ ASTER PRICE';
              }
              return value;
            }}
          />
          
          {/* Balance Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="balance"
            name="balance"
            stroke={isDarkMode ? '#00ff00' : '#3b82f6'}
            strokeWidth={3}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
            strokeLinecap="round"
          />
          
          {/* Price Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="price"
            name="price"
            stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
            strokeWidth={2.5}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
            strokeDasharray="8 4"
            strokeLinecap="round"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Current value indicators - dual display */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col gap-2">
        <div 
          className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[11px] md:text-sm font-mono font-bold shadow-lg border-2"
          style={{
            backgroundColor: isDarkMode ? '#00ff00' : '#3b82f6',
            borderColor: isDarkMode ? '#00ff00' : '#3b82f6',
            color: isDarkMode ? '#000000' : '#ffffff',
          }}
        >
          <div className="text-[8px] md:text-[9px] opacity-90 mb-0.5">
            {valueType === 'usdt' ? 'USDT' : 'ASTER'}
          </div>
          {valueType === 'usdt' 
            ? `$${currentUsdtValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
            : `${currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
          }
        </div>
        <div 
          className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[11px] md:text-sm font-mono font-bold shadow-lg border-2"
          style={{
            backgroundColor: isDarkMode ? '#ff9500' : '#f59e0b',
            borderColor: isDarkMode ? '#ff9500' : '#f59e0b',
            color: isDarkMode ? '#000000' : '#ffffff',
          }}
        >
          <div className="text-[8px] md:text-[9px] opacity-90 mb-0.5">PRICE</div>
          ${currentPrice.toFixed(6)}
        </div>
      </div>
      
      {/* aster.bot watermark */}
      <div 
        className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-[10px] md:text-xs font-mono"
        style={{ color: isDarkMode ? '#003300' : '#9ca3af' }}
      >
        aster.bot
      </div>
    </div>
  );
}

