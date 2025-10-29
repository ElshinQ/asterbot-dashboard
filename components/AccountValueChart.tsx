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
      className="relative w-full h-[350px] md:h-[450px] border-2"
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        borderColor: isDarkMode ? '#00ff00' : '#1f2937',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 50, right: 60, left: 10, bottom: 80 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke={isDarkMode ? '#003300' : '#e5e7eb'}
            strokeWidth={0.5}
            horizontal={true}
            vertical={false}
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
              fontWeight: 500, 
              fill: isDarkMode ? '#00ff00' : '#3b82f6' 
            }}
            tickLine={false}
            axisLine={{ stroke: isDarkMode ? '#00ff00' : '#3b82f6', strokeWidth: 1 }}
            tickFormatter={(value) => {
              if (chartMode === 'percent') return `${value.toFixed(1)}%`;
              if (valueType === 'usdt') return `$${Math.round(value).toLocaleString()}`;
              return Math.round(value).toLocaleString();
            }}
            domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => Math.max(0, Math.floor(dataMin * 0.9)), (dataMax: number) => Math.ceil(dataMax * 1.1)]}
          />
          
          {/* Right Y-Axis for Price */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
            style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-ibm-plex-mono)', 
              fontWeight: 500, 
              fill: isDarkMode ? '#ff9500' : '#f59e0b' 
            }}
            tickLine={false}
            axisLine={{ stroke: isDarkMode ? '#ff9500' : '#f59e0b', strokeWidth: 1 }}
            tickFormatter={(value) => {
              if (chartMode === 'percent') return `${value.toFixed(1)}%`;
              return `$${value.toFixed(6)}`;
            }}
            domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => dataMin * 0.995, (dataMax: number) => dataMax * 1.005]}
            width={70}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#000000' : '#1f2937',
              border: `2px solid ${isDarkMode ? '#00ff00' : '#374151'}`,
              borderRadius: '4px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              color: isDarkMode ? '#00ff00' : '#f3f4f6',
              padding: '8px 12px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'balance') {
                const label = chartMode === 'percent' 
                  ? 'Balance Change' 
                  : (valueType === 'usdt' ? 'USDT Balance' : 'ASTER Quantity');
                
                let formattedValue;
                if (chartMode === 'percent') {
                  formattedValue = `${value.toFixed(2)}%`;
                } else if (valueType === 'usdt') {
                  formattedValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                } else {
                  formattedValue = `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ASTER`;
                }
                
                return [formattedValue, label];
              } else if (name === 'price') {
                const label = chartMode === 'percent' ? 'Price Change' : 'ASTER Price';
                const formattedValue = chartMode === 'percent' 
                  ? `${value.toFixed(2)}%`
                  : `$${value.toFixed(6)}`;
                return [formattedValue, label];
              }
              return [value, name];
            }}
            labelStyle={{ 
              color: isDarkMode ? '#00aa00' : '#9ca3af', 
              marginBottom: '4px',
            }}
          />
          
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
            formatter={(value) => {
              if (value === 'balance') {
                return valueType === 'usdt' ? 'USDT BALANCE' : 'ASTER QUANTITY';
              } else if (value === 'price') {
                return 'ASTER PRICE';
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
            strokeWidth={2.5}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
          />
          
          {/* Price Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="price"
            name="price"
            stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Current value indicators - dual display */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 flex flex-col gap-2">
        <div 
          className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold"
          style={{
            backgroundColor: isDarkMode ? '#00ff00' : '#3b82f6',
            color: isDarkMode ? '#000000' : '#ffffff',
          }}
        >
          <div className="text-[8px] md:text-[9px] opacity-80 mb-0.5 uppercase">
            {valueType === 'usdt' ? 'USDT' : 'ASTER'}
          </div>
          {valueType === 'usdt' 
            ? `${currentUsdtValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
            : `${currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
          }
        </div>
        <div 
          className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold"
          style={{
            backgroundColor: isDarkMode ? '#ff9500' : '#f59e0b',
            color: isDarkMode ? '#000000' : '#ffffff',
          }}
        >
          <div className="text-[8px] md:text-[9px] opacity-80 mb-0.5 uppercase">PRICE</div>
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

