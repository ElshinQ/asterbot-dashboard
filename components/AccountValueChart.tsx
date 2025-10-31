'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';
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
      className="relative w-full h-full flex flex-col"
    >
      {/* Chart container - ASTER tag positioned absolutely on right */}
      <div 
        className="relative w-full flex-1 h-full border-2 flex flex-col"
        style={{
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderColor: isDarkMode ? '#16a34a' : '#1f2937',
        }}
      >
        {/* Current value indicator - positioned absolutely to right */}
        <div className="absolute -top-10 right-0 z-10">
          <div 
            className="px-3 md:px-4 py-1.5 text-[10px] md:text-[11px] font-mono font-bold border-2"
            style={{
              backgroundColor: isDarkMode ? '#16a34a' : '#3b82f6',
              color: isDarkMode ? '#000000' : '#ffffff',
              borderColor: isDarkMode ? '#16a34a' : '#3b82f6',
            }}
          >
            <span className="opacity-70 mr-1.5">{valueType === 'usdt' ? 'USDT:' : 'ASTER:'}</span>
            {valueType === 'usdt' 
              ? `$${currentUsdtValue?.toFixed(2) || '0.00'}`
              : `${currentValue?.toFixed(2) || '0.00'}`
            }
          </div>
        </div>

        {/* Inner chart wrapper - centered */}
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 75, left: 75, bottom: 15 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? '#16a34a' : '#3b82f6'} stopOpacity={isDarkMode ? 0.3 : 0.2}/>
                  <stop offset="95%" stopColor={isDarkMode ? '#16a34a' : '#3b82f6'} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? '#ff9500' : '#f59e0b'} stopOpacity={isDarkMode ? 0.2 : 0.15}/>
                  <stop offset="95%" stopColor={isDarkMode ? '#ff9500' : '#f59e0b'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                stroke="transparent"
                horizontal={false}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke={isDarkMode ? '#16a34a' : '#374151'}
                style={{ 
                  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '8px' : '9px', 
                  fontFamily: 'var(--font-ibm-plex-mono)', 
                  fontWeight: 400, 
                  fill: isDarkMode ? '#15803d' : '#6b7280' 
                }}
                tickLine={false}
                axisLine={{ stroke: isDarkMode ? '#16a34a' : '#d1d5db', strokeWidth: 1 }}
                angle={-40}
                textAnchor="end"
                height={70}
                interval="preserveStartEnd"
                minTickGap={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 80}
              />
              
              {/* Left Y-Axis for Balance */}
              <YAxis
                yAxisId="left"
                stroke={isDarkMode ? '#16a34a' : '#3b82f6'}
                style={{ 
                  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '9px' : '10px', 
                  fontFamily: 'var(--font-ibm-plex-mono)', 
                  fontWeight: 600, 
                  fill: isDarkMode ? '#16a34a' : '#3b82f6' 
                }}
                tickLine={false}
                axisLine={{ stroke: isDarkMode ? '#16a34a' : '#3b82f6', strokeWidth: 1.5 }}
                tickFormatter={(value) => {
                  if (chartMode === 'percent') return `${value.toFixed(1)}%`;
                  if (valueType === 'usdt') return `$${Math.round(value)}`;
                  return `${Math.round(value)}`;
                }}
                domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => Math.max(0, Math.floor(dataMin * 0.85)), (dataMax: number) => Math.ceil(dataMax * 1.15)]}
              />
              
              {/* Right Y-Axis for Price */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
                style={{ 
                  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '8px' : '10px', 
                  fontFamily: 'var(--font-ibm-plex-mono)', 
                  fontWeight: 600, 
                  fill: isDarkMode ? '#ff9500' : '#f59e0b' 
                }}
                tickLine={false}
                axisLine={{ stroke: isDarkMode ? '#ff9500' : '#f59e0b', strokeWidth: 1.5 }}
                tickFormatter={(value) => {
                  if (chartMode === 'percent') return `${value.toFixed(1)}%`;
                  return `$${value.toFixed(5)}`;
                }}
                domain={chartMode === 'percent' ? ['auto', 'auto'] : [(dataMin: number) => dataMin * 0.99, (dataMax: number) => dataMax * 1.01]}
                width={typeof window !== 'undefined' && window.innerWidth < 768 ? 65 : 90}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#16a34a' : '#d1d5db'}`,
                  borderRadius: '2px',
                  fontFamily: 'var(--font-ibm-plex-mono)',
                  fontSize: '10px',
                  color: isDarkMode ? '#16a34a' : '#1f2937',
                  padding: '6px 10px',
                  boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                }}
                content={({ active, payload, label }: any) => {
                  if (!active || !payload || !payload.length) return null;
                  
                  // Filter out duplicate dataKeys - only show Line components, not Area fills
                  const uniquePayload = payload.reduce((acc: any[], item: any) => {
                    const exists = acc.find(entry => entry.dataKey === item.dataKey);
                    if (!exists) {
                      acc.push(item);
                    }
                    return acc;
                  }, []);
                  
                  return (
                    <div style={{
                      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#16a34a' : '#d1d5db'}`,
                      borderRadius: '2px',
                      padding: '6px 10px',
                    }}>
                      <div style={{ 
                        color: isDarkMode ? '#15803d' : '#6b7280', 
                        fontSize: '9px',
                        marginBottom: '4px',
                      }}>
                        {label}
                      </div>
                      {uniquePayload.map((entry: any, index: number) => {
                        let displayValue = '';
                        let displayLabel = '';
                        
                        if (entry.dataKey === 'balance') {
                          displayLabel = valueType === 'usdt' ? 'USDT' : 'ASTER';
                          if (chartMode === 'percent') {
                            displayValue = `${entry.value.toFixed(2)}%`;
                          } else if (valueType === 'usdt') {
                            displayValue = `$${entry.value.toFixed(2)}`;
                          } else {
                            displayValue = `${entry.value.toFixed(2)}`;
                          }
                        } else if (entry.dataKey === 'price') {
                          displayLabel = 'Price';
                          displayValue = chartMode === 'percent' 
                            ? `${entry.value.toFixed(2)}%`
                            : `$${entry.value.toFixed(6)}`;
                        }
                        
                        return (
                          <div key={index} style={{ 
                            color: isDarkMode ? '#16a34a' : '#1f2937',
                            fontSize: '10px',
                            fontWeight: 600,
                          }}>
                            {displayLabel}: {displayValue}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
                labelStyle={{ 
                  color: isDarkMode ? '#15803d' : '#6b7280', 
                  fontSize: '9px',
                  marginBottom: '2px',
                }}
              />
              
              
              {/* Area fill for Balance - gradient cloud under line */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="balance"
                fill="url(#balanceGradient)"
                stroke="none"
                legendType="none"
                hide={false}
              />
              
              {/* Area fill for Price - gradient cloud under line */}
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="price"
                fill="url(#priceGradient)"
                stroke="none"
                legendType="none"
                hide={false}
              />
              
              {/* Balance Line - Smooth style like trading charts */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="balance"
                name="balance"
                stroke={isDarkMode ? '#16a34a' : '#3b82f6'}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                legendType="none"
              />
              
              {/* Price Line - Smooth style like trading charts */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                name="price"
                stroke={isDarkMode ? '#ff9500' : '#f59e0b'}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

