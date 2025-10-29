'use client';

import { useState, useEffect } from 'react';
import { useStats } from '@/hooks/useStats';
import AccountValueChart from '@/components/AccountValueChart';
import TickerTape from '@/components/TickerTape';
import LoadingState from '@/components/LoadingState';
import DecisionsFeed from '@/components/DecisionsFeed';
import AnimatedNumber from '@/components/AnimatedNumber';

type TabType = 'overview' | 'orders' | 'decisions' | 'position';
type TimeRange = 'all' | '72h';
type ChartMode = 'value' | 'percent';
type ValueType = 'total' | 'usdt';
type OrderFilter = 'open' | 'filled' | 'canceled';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useStats();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [chartMode, setChartMode] = useState<ChartMode>('value');
  const [valueType, setValueType] = useState<ValueType>('total');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('open');

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Filter historical data based on time range
  const getFilteredData = () => {
    if (!stats) return [];
    if (timeRange === 'all') return stats.historicalData;
    
    // Filter last 72 hours
    const now = new Date();
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    return stats.historicalData.filter(point => 
      new Date(point.timestamp) >= seventyTwoHoursAgo
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="border-2 border-red-600 bg-red-50 p-8 text-center">
            <div className="text-red-600 font-mono text-2xl mb-4 font-bold">⚠️ ERROR</div>
            <div className="text-gray-900 font-mono text-lg mb-4 font-bold">
              Failed to connect to server
            </div>
            <div className="text-gray-600 font-mono text-sm mb-6">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
            
            <div className="bg-white border-2 border-gray-900 p-6 text-left mb-6">
              <div className="text-xs font-mono font-bold mb-4 uppercase">Troubleshooting Steps:</div>
              <ol className="text-xs font-mono space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Check if database environment variables are configured in Vercel</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Go to Vercel Dashboard → Settings → Environment Variables</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Add: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SCHEMA</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Redeploy the application after adding variables</span>
                </li>
              </ol>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gray-900 text-white font-mono text-sm font-bold uppercase hover:bg-gray-700"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-gray-900 bg-white">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="h-12 w-12 md:h-16 md:w-16 overflow-hidden flex items-center justify-center rounded-lg">
                <img 
                  src="/ichigo-logo.png" 
                  alt="ICHIGO" 
                  className="w-24 md:w-32 object-cover object-top scale-110"
                  style={{ marginTop: '-12px' }}
                />
              </div>
              <div className="border-l-2 border-gray-300 h-8 md:h-10 mx-1 md:mx-2"></div>
              <nav className="flex items-center gap-2 md:gap-6 text-xs md:text-sm font-mono">
                <span className="text-gray-900 font-bold uppercase tracking-wider">LIVE DASHBOARD</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-xs font-mono text-gray-500">
                POWERED BY DEEPSEEK | AUTO-REFRESH: 3MIN
              </div>
              <div className="md:hidden text-[10px] font-mono text-gray-500">
                LIVE
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-mono font-bold hover:bg-gray-700 rounded"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Tape */}
      <TickerTape
        price={stats.currentPrice}
        highestValue={stats.highestPrice}
        lowestValue={stats.lowestPrice}
      />

      {/* Main Content - 2 Column Layout */}
      <main className="px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* LEFT SIDE - CHART (2/3) */}
          <div className="lg:col-span-2">
            <div 
              className="border-2 p-4 md:p-6"
              style={{
                backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                borderColor: isDarkMode ? '#00ff00' : '#1f2937',
              }}
            >
              {/* Chart Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3 mb-4 md:mb-6">
                {/* Time Range */}
                <div className="flex items-center gap-2 md:gap-3">
                  <button 
                    onClick={() => setTimeRange('all')}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold ${
                      timeRange === 'all' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    ALL
                  </button>
                  <button 
                    onClick={() => setTimeRange('72h')}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold ${
                      timeRange === '72h' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    72H
                  </button>
                </div>
                
                {/* Value Type Toggle */}
                <div className="flex items-center gap-2 md:gap-3">
                  <button 
                    onClick={() => setValueType('total')}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold ${
                      valueType === 'total' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    ASTER
                  </button>
                  <button 
                    onClick={() => setValueType('usdt')}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold ${
                      valueType === 'usdt' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    USDT
                  </button>
                </div>

                {/* Chart Mode */}
                <div className="flex items-center gap-1 md:gap-2">
                  <button 
                    onClick={() => setChartMode('value')}
                    className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-mono font-bold ${
                      chartMode === 'value' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    $
                  </button>
                  <button 
                    onClick={() => setChartMode('percent')}
                    className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-mono font-bold ${
                      chartMode === 'percent' 
                        ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                        : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                    }`}
                  >
                    %
                  </button>
                </div>
              </div>

              {/* Chart Title */}
              <h2 className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4 font-bold">
                {valueType === 'usdt' ? 'USDT BALANCE' : 'ASTER VALUE'}
              </h2>

              {/* Chart */}
              <div className="relative">
                <AccountValueChart
                  data={getFilteredData()}
                  currentValue={stats.accountValue}
                  currentUsdtValue={stats.usdtBalance}
                  chartMode={chartMode}
                  valueType={valueType}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TABBED DATA PANEL (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-900 lg:sticky lg:top-6">
              {/* Tab Navigation - Responsive Grid */}
              <div className="border-b-2 border-gray-900">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase border-r-2 border-gray-900 ${
                        activeTab === 'overview'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      OVERVIEW
                    </button>
                  <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase md:border-r-2 border-gray-900 ${
                        activeTab === 'orders'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      ORDERS
                    </button>
                  <button
                      onClick={() => setActiveTab('decisions')}
                      className={`w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase border-r-2 border-gray-900 border-t-2 md:border-t-0 ${
                        activeTab === 'decisions'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      DECISIONS
                    </button>
                  <button
                      onClick={() => setActiveTab('position')}
                      className={`w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase border-t-2 md:border-t-0 ${
                        activeTab === 'position'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      POSITION
                    </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto hide-scrollbar">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Account Value */}
                    <div>
                      <div className="text-xs font-mono text-gray-600 mb-1 uppercase font-bold">
                        Account Value
                      </div>
                      <div className="text-3xl font-mono font-bold text-gray-900">
                        <AnimatedNumber
                          value={stats.accountValue}
                          decimals={2}
                          prefix="$"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 pb-4 border-b-2 border-gray-900">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-green-600 uppercase">
                        ACTIVE
                      </span>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">ASTER Balance:</span>
                        <span className="text-gray-900 font-bold">
                          <AnimatedNumber value={stats.asterBalance} decimals={2} />
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">USDT Balance:</span>
                        <span className="text-gray-900 font-bold">
                          <AnimatedNumber value={stats.usdtBalance} decimals={2} prefix="$" />
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Current Price:</span>
                        <span className="text-gray-900 font-bold">
                          <AnimatedNumber value={stats.currentPrice} decimals={5} prefix="$" />
                        </span>
                      </div>
                    </div>

                    {/* P&L Section */}
                    <div className="pt-4 border-t-2 border-gray-900 space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Realized P&L:</span>
                        <span className={`font-bold ${stats.realizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <AnimatedNumber
                            value={Math.abs(stats.realizedPnL)}
                            decimals={2}
                            prefix={stats.realizedPnL >= 0 ? '+$' : '-$'}
                          />
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Unrealized P&L:</span>
                        <span className={`font-bold ${stats.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <AnimatedNumber
                            value={Math.abs(stats.unrealizedPnL)}
                            decimals={2}
                            prefix={stats.unrealizedPnL >= 0 ? '+$' : '-$'}
                          />
                          <span className="text-xs ml-1">
                            ({stats.unrealizedPnLPercent.toFixed(2)}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Trading Stats */}
                    <div className="pt-4 border-t-2 border-gray-900 space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Open TPs:</span>
                        <span className="text-gray-900 font-bold">{stats.openTPOrders}</span>
                      </div>
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Last Action:</span>
                        <span className="text-gray-900 font-bold uppercase">{stats.lastDecision.action}</span>
                      </div>
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Runtime:</span>
                        <span className="text-gray-900 font-bold">{stats.runtime.totalRuntime}</span>
                      </div>
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-600 font-bold">Total Decisions:</span>
                        <span className="text-gray-900 font-bold">{stats.totalDecisions.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* DeepSeek Attribution */}
                    <div className="pt-4 border-t-2 border-gray-900">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                        <span>Powered by DeepSeek AI</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-3">
                    {/* Order Filter Buttons */}
                    <div className="flex items-center gap-2 mb-4">
                      <button 
                          onClick={() => setOrderFilter('open')}
                          className={`w-full px-3 py-2 text-[10px] font-mono font-bold uppercase ${
                            orderFilter === 'open' 
                              ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                              : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                          }`}
                        >
                          OPEN
                        </button>
                      <button 
                          onClick={() => setOrderFilter('filled')}
                          className={`w-full px-3 py-2 text-[10px] font-mono font-bold uppercase ${
                            orderFilter === 'filled' 
                              ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                              : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                          }`}
                        >
                          FILLED
                        </button>
                      <button 
                          onClick={() => setOrderFilter('canceled')}
                          className={`w-full px-3 py-2 text-[10px] font-mono font-bold uppercase ${
                            orderFilter === 'canceled' 
                              ? 'bg-gray-900 text-white dark:bg-green-500 dark:text-black' 
                              : 'bg-white text-gray-600 border-2 border-gray-900 dark:border-green-500 dark:text-green-500'
                          }`}
                        >
                          CANCEL
                        </button>
                    </div>

                    <h3 className="text-sm font-mono font-bold uppercase mb-4">
                      {orderFilter === 'open' ? 'Open TP Orders' : orderFilter === 'filled' ? 'Filled Orders' : 'Canceled Orders'}
                    </h3>
                    
                    {/* Open Orders */}
                    {orderFilter === 'open' && (
                      <>
                        {!stats.openOrders || stats.openOrders.length === 0 ? (
                          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            No open orders
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {stats.openOrders.map((order) => (
                              <div
                                key={order.orderId}
                                className="border-2 p-3 transition-colors"
                              style={{
                                borderColor: isDarkMode ? '#00ff00' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-xs font-mono font-bold">
                                    TP #{order.orderId}
                                  </div>
                                  <div className="text-xs font-mono font-bold bg-green-100 dark:bg-green-500 text-green-800 dark:text-black px-2 py-1">
                                    {order.status}
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs font-mono">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Price:</span>
                                    <span className="font-bold dark:text-gray-200">${order.price.toFixed(5)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Quantity:</span>
                                    <span className="font-bold dark:text-gray-200">{order.quantity.toFixed(2)} ASTER</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Value:</span>
                                    <span className="font-bold dark:text-gray-200">${(order.price * order.quantity).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Age:</span>
                                    <span className="font-bold dark:text-gray-200">{Math.floor(order.ageMinutes / 60)}h {Math.floor(order.ageMinutes % 60)}m</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Filled Orders */}
                    {orderFilter === 'filled' && (
                      <>
                        {!stats.filledOrders || stats.filledOrders.length === 0 ? (
                          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            No filled orders
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {stats.filledOrders.map((order) => (
                              <div
                                key={order.orderId}
                                className="border-2 p-3 transition-colors"
                              style={{
                                borderColor: isDarkMode ? '#00ff00' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-xs font-mono font-bold">
                                    #{order.orderId}
                                  </div>
                                  <div className="text-xs font-mono font-bold bg-green-100 dark:bg-green-500 text-green-800 dark:text-black px-2 py-1">
                                    FILLED
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs font-mono">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Side:</span>
                                    <span className={`font-bold ${order.side === 'BUY' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {order.side || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Price:</span>
                                    <span className="font-bold dark:text-gray-200">
                                      ${order.price ? order.price.toFixed(5) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Quantity:</span>
                                    <span className="font-bold dark:text-gray-200">
                                      {order.quantity ? order.quantity.toFixed(2) : 'N/A'} ASTER
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Value:</span>
                                    <span className="font-bold dark:text-gray-200">
                                      ${(order.price && order.quantity) ? (order.price * order.quantity).toFixed(2) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Filled:</span>
                                    <span className="font-bold dark:text-gray-200 text-[10px]">
                                      {new Date(order.updatedAt).toLocaleString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Canceled Orders */}
                    {orderFilter === 'canceled' && (
                      <>
                        {!stats.canceledOrders || stats.canceledOrders.length === 0 ? (
                          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            No canceled orders
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {stats.canceledOrders.map((order) => (
                              <div
                                key={order.orderId}
                                className="border-2 p-3 transition-colors"
                              style={{
                                borderColor: isDarkMode ? '#00ff00' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-xs font-mono font-bold">
                                    #{order.orderId}
                                  </div>
                                  <div className="text-xs font-mono font-bold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1">
                                    {order.status}
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs font-mono">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Side:</span>
                                    <span className={`font-bold ${order.side === 'BUY' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {order.side || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Price:</span>
                                    <span className="font-bold dark:text-gray-200">
                                      ${order.price ? order.price.toFixed(5) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Quantity:</span>
                                    <span className="font-bold dark:text-gray-200">
                                      {order.quantity ? order.quantity.toFixed(2) : 'N/A'} ASTER
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 font-bold">Updated:</span>
                                    <span className="font-bold dark:text-gray-200 text-[10px]">
                                      {new Date(order.updatedAt).toLocaleString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* DECISIONS TAB */}
                {activeTab === 'decisions' && (
                  <div>
                      <DecisionsFeed decisions={stats.recentDecisions} isDarkMode={isDarkMode} />
                    </div>
                )}

                {/* POSITION TAB */}
                {activeTab === 'position' && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono font-bold uppercase mb-4">
                      Current Position
                    </h3>
                    <div className="space-y-3 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-bold">Status:</span>
                        <span className={stats.position.hasPosition ? 'text-green-600 font-bold' : 'text-gray-400 font-bold'}>
                          {stats.position.hasPosition ? 'ACTIVE POSITION' : 'NO POSITION'}
                        </span>
                      </div>
                      {stats.position.hasPosition && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Entry Price:</span>
                            <span className="font-bold">${stats.position.entryPrice.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Current Quantity:</span>
                            <span className="font-bold">{stats.position.currentQty.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Open TP Orders:</span>
                            <span className="font-bold">{stats.openTPOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Current Price:</span>
                            <span className="font-bold">${stats.currentPrice.toFixed(5)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">Unrealized P&L:</span>
                            <span className={`font-bold ${stats.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stats.unrealizedPnL >= 0 ? '+' : ''}${stats.unrealizedPnL.toFixed(2)} ({stats.unrealizedPnLPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </>
                      )}
                      <div className="pt-3 border-t-2 border-gray-900">
                        <div className="text-xs font-mono text-gray-600 mb-2 font-bold">STATISTICS</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 font-bold">Total Decisions</span>
                            <span className="font-bold">{stats.totalDecisions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 font-bold">Buys</span>
                            <span className="text-green-600 font-bold">
                              {stats.buyCount} ({((stats.buyCount / stats.totalDecisions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 font-bold">Sells</span>
                            <span className="text-red-600 font-bold">
                              {stats.sellCount} ({((stats.sellCount / stats.totalDecisions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 font-bold">Holds</span>
                            <span className="font-bold">{stats.holdCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-900 mt-12 py-6 bg-white">
        <div className="px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/ichigo-logo.png" 
              alt="ICHIGO" 
              className="h-8 w-auto opacity-60"
            />
          </div>
          <div className="text-xs font-mono text-gray-500 font-bold">
            ICHIGO CRYPTO BOT | LIVE DATA | UPDATES EVERY 3 MINUTES
          </div>
        </div>
      </footer>
    </div>
  );
}
