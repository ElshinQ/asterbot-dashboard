'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/useStats';
import { useTickerData } from '@/hooks/useTickerData';
import { useDatabase } from '@/contexts/DatabaseContext';
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
  const { data: tickerData } = useTickerData(); // Always from Ichigo
  const { database, setDatabase } = useDatabase();
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

  // Filter historical data based on time range and add live current price
  const getFilteredData = () => {
    if (!stats) return [];
    
    let filteredData = timeRange === 'all' 
      ? stats.historicalData 
      : stats.historicalData.filter(point => {
          const now = new Date();
          const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
          return new Date(point.timestamp) >= seventyTwoHoursAgo;
        });
    
    // Add current live data point to sync chart with ticker
    const currentDataPoint = {
      timestamp: new Date().toISOString(),
      accountValue: stats.accountValue,
      usdtBalance: stats.usdtBalance,
      asterQty: stats.asterBalance,
      asterPrice: stats.currentPrice, // Use live ticker price
    };
    
    return [...filteredData, currentDataPoint];
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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}
    >
      {/* Header */}
      <header 
        className="border-b-2 overflow-hidden"
        style={{
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderColor: isDarkMode ? '#16a34a' : '#1f2937',
        }}
      >
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2 md:gap-4"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Logo - slides off to left and disappears in dark mode (desktop only) */}
              <motion.div 
                className="h-12 w-12 md:h-16 md:w-16 overflow-hidden flex items-center justify-center rounded-lg"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: 1,
                  x: isDarkMode && typeof window !== 'undefined' && window.innerWidth >= 768 ? -200 : 0,
                  opacity: isDarkMode && typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <img 
                  src="/ichigo-logo.png" 
                  alt="ICHIGO" 
                  className="w-24 md:w-32 object-cover object-top scale-110"
                  style={{ marginTop: '-12px' }}
                />
              </motion.div>
              
              {/* Divider - hides in dark mode (desktop only) */}
              <motion.div 
                className="border-l-2 h-8 md:h-10 mx-1 md:mx-2"
                style={{ borderColor: isDarkMode ? '#16a34a' : '#1f2937' }}
                initial={{ scaleY: 1 }}
                animate={{ 
                  scaleY: isDarkMode && typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : 1,
                  opacity: isDarkMode && typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : 1,
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>
              
              {/* LIVE DASHBOARD - moves left when logo disappears (desktop only) */}
              <motion.nav 
                className="flex items-center gap-2 md:gap-6 text-xs md:text-sm font-mono"
                initial={{ x: 0, opacity: 0 }}
                animate={{ 
                  x: isDarkMode && typeof window !== 'undefined' && window.innerWidth >= 768 ? -110 : 0,
                  opacity: 1,
                }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span 
                  className="font-bold uppercase tracking-wider"
                  style={{ color: isDarkMode ? '#16a34a' : '#1f2937' }}
                >
                  LIVE DASHBOARD
                </span>
              </motion.nav>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 md:gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Database Switcher */}
              <button
                onClick={() => setDatabase(database === 'ichigo' ? 'asterdex' : 'ichigo')}
                className="relative flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 border-2 text-[10px] md:text-xs font-mono font-bold transition-all"
                style={{
                  backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                  borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                  color: isDarkMode ? '#16a34a' : '#1f2937',
                }}
                title={`Switch to ${database === 'ichigo' ? 'Asterdex' : 'Ichigo'}`}
              >
                <span className="uppercase tracking-wider">{database === 'ichigo' ? 'ICHIGO' : 'ASTERDEX'}</span>
                <div 
                  className="w-8 h-4 border-2 relative transition-all"
                  style={{
                    borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div 
                    className="absolute top-0 h-full w-3 transition-all"
                    style={{
                      backgroundColor: isDarkMode ? '#16a34a' : '#1f2937',
                      left: database === 'asterdex' ? 'calc(100% - 12px)' : '0',
                    }}
                  />
                </div>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 border-2 text-[10px] md:text-xs font-mono font-bold transition-all"
                style={{
                  backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                  borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                  color: isDarkMode ? '#16a34a' : '#1f2937',
                }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="uppercase tracking-wider">{isDarkMode ? 'DARK' : 'LIGHT'}</span>
                <div 
                  className="w-8 h-4 border-2 relative transition-all"
                  style={{
                    borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div 
                    className="absolute top-0 h-full w-3 transition-all"
                    style={{
                      backgroundColor: isDarkMode ? '#16a34a' : '#1f2937',
                      left: isDarkMode ? 'calc(100% - 12px)' : '0',
                    }}
                  />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Ticker Tape - Always shows Ichigo data */}
      <TickerTape
        price={tickerData?.currentPrice || stats.currentPrice}
        highestValue={tickerData?.highestPrice || stats.highestPrice}
        lowestValue={tickerData?.lowestPrice || stats.lowestPrice}
      />

      {/* Main Content - 2 Column Layout */}
      <main className="px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {/* LEFT SIDE - CHART (2/3) - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2">
            <div 
              className="border-2 p-4 md:p-6 h-full flex flex-col"
              style={{
                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                borderColor: isDarkMode ? '#16a34a' : '#1f2937',
              }}
            >
              {/* Chart Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3 mb-4 md:mb-6">
                {/* Time Range */}
                <div className="flex items-center gap-2 md:gap-3">
                  <button 
                    onClick={() => setTimeRange('all')}
                    className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: timeRange === 'all' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: timeRange === 'all' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    ALL
                  </button>
                  <button 
                    onClick={() => setTimeRange('72h')}
                    className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: timeRange === '72h' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: timeRange === '72h' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    72H
                  </button>
                </div>
                
                {/* Value Type Toggle */}
                <div className="flex items-center gap-2 md:gap-3">
                  <button 
                    onClick={() => setValueType('total')}
                    className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: valueType === 'total' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: valueType === 'total' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    ASTER
                  </button>
                  <button 
                    onClick={() => setValueType('usdt')}
                    className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: valueType === 'usdt' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: valueType === 'usdt' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    USDT
                  </button>
                </div>

                {/* Chart Mode */}
                <div className="flex items-center gap-1 md:gap-2">
                  <button 
                    onClick={() => setChartMode('value')}
                    className="px-2 md:px-3 py-1 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: chartMode === 'value' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: chartMode === 'value' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    $
                  </button>
                  <button 
                    onClick={() => setChartMode('percent')}
                    className="px-2 md:px-3 py-1 text-[10px] md:text-xs font-mono font-bold border-2"
                    style={{
                      backgroundColor: chartMode === 'percent' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                      color: chartMode === 'percent' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                      borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                    }}
                  >
                    %
                  </button>
                </div>
              </div>

              {/* Chart Title */}
              <h2 
                className="text-sm font-mono uppercase tracking-widest mb-3 font-bold"
                style={{ color: isDarkMode ? '#16a34a' : '#4b5563' }}
              >
                {valueType === 'usdt' ? 'USDT BALANCE' : 'ASTER QUANTITY'}
              </h2>

              {/* Chart Container - grows to fill remaining space */}
              <div className="relative flex-1 flex flex-col">
                <AccountValueChart
                  data={getFilteredData()}
                  currentValue={stats.asterBalance}
                  currentUsdtValue={stats.usdtBalance}
                  chartMode={chartMode}
                  valueType={valueType}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TABBED DATA PANEL (1/3) */}
          <div className="lg:col-span-1 flex flex-col">
            <div 
              className="border-2 lg:sticky lg:top-6 flex flex-col h-full"
              style={{
                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                borderColor: isDarkMode ? '#16a34a' : '#1f2937',
              }}
            >
              {/* Tab Navigation - Responsive Grid */}
              <div 
                className="border-b-2"
                style={{ borderColor: isDarkMode ? '#16a34a' : '#1f2937' }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4">
                  <button
                      onClick={() => setActiveTab('overview')}
                      className="w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: activeTab === 'overview' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                        color: activeTab === 'overview' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                        borderRight: '2px solid ' + (isDarkMode ? '#16a34a' : '#1f2937'),
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'overview') e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'overview') e.currentTarget.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
                      }}
                    >
                      OVERVIEW
                    </button>
                  <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: activeTab === 'orders' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                        color: activeTab === 'orders' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                        borderRight: window.innerWidth >= 768 ? '2px solid ' + (isDarkMode ? '#16a34a' : '#1f2937') : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'orders') e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'orders') e.currentTarget.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
                      }}
                    >
                      ORDERS
                    </button>
                  <button
                      onClick={() => setActiveTab('decisions')}
                      className="w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: activeTab === 'decisions' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                        color: activeTab === 'decisions' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                        borderRight: '2px solid ' + (isDarkMode ? '#16a34a' : '#1f2937'),
                        borderTop: window.innerWidth < 768 ? '2px solid ' + (isDarkMode ? '#16a34a' : '#1f2937') : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'decisions') e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'decisions') e.currentTarget.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
                      }}
                    >
                      DECISIONS
                    </button>
                  <button
                      onClick={() => setActiveTab('position')}
                      className="w-full py-2.5 md:py-3 px-2 text-[10px] md:text-[11px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: activeTab === 'position' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#000000' : '#ffffff'),
                        color: activeTab === 'position' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                        borderTop: window.innerWidth < 768 ? '2px solid ' + (isDarkMode ? '#16a34a' : '#1f2937') : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== 'position') e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== 'position') e.currentTarget.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
                      }}
                    >
                      POSITION
                    </button>
                </div>
              </div>

              {/* Tab Content */}
              <div 
                className="p-4 md:p-6 overflow-y-auto hide-scrollbar h-[500px] md:h-[580px]"
              >
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Account Value */}
                    <div className="pb-2">
                      <div className="text-xs font-mono text-gray-600 mb-2 uppercase font-bold">
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
                    <div className="flex items-center gap-2 pb-6 border-b-2 border-gray-900">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-green-600 uppercase">
                        ACTIVE
                      </span>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-3">
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
                    <div className="pt-6 border-t-2 border-gray-900 space-y-3">
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
                    <div className="pt-6 border-t-2 border-gray-900 space-y-3">
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

                  </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {/* Order Filter Buttons */}
                    <div className="flex items-center gap-2 mb-6">
                      <button 
                          onClick={() => setOrderFilter('open')}
                          className="w-full px-3 py-2 text-[10px] font-mono font-bold uppercase border-2"
                          style={{
                            backgroundColor: orderFilter === 'open' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#002200' : '#ffffff'),
                            color: orderFilter === 'open' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                            borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                          }}
                        >
                          OPEN
                        </button>
                      <button 
                          onClick={() => setOrderFilter('filled')}
                          className="w-full px-3 py-2 text-[10px] font-mono font-bold uppercase border-2"
                          style={{
                            backgroundColor: orderFilter === 'filled' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#002200' : '#ffffff'),
                            color: orderFilter === 'filled' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                            borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                          }}
                        >
                          FILLED
                        </button>
                      <button 
                          onClick={() => setOrderFilter('canceled')}
                          className="w-full px-3 py-2 text-[10px] font-mono font-bold uppercase border-2"
                          style={{
                            backgroundColor: orderFilter === 'canceled' ? (isDarkMode ? '#16a34a' : '#1f2937') : (isDarkMode ? '#002200' : '#ffffff'),
                            color: orderFilter === 'canceled' ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#15803d' : '#4b5563'),
                            borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                          }}
                        >
                          CANCEL
                        </button>
                    </div>

                    <h3 className="text-sm font-mono font-bold uppercase mb-5">
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
                                borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb'}
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
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Price:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>${order.price.toFixed(5)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Quantity:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{order.quantity.toFixed(2)} ASTER</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Value:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>${(order.price * order.quantity).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Age:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{Math.floor(order.ageMinutes / 60)}h {Math.floor(order.ageMinutes % 60)}m</span>
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
                                borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb'}
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
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Side:</span>
                                    <span 
                                      className="font-bold"
                                      style={{ color: order.side === 'BUY' ? '#16a34a' : '#dc2626' }}
                                    >
                                      {order.side || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Price:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                                      ${order.price ? order.price.toFixed(5) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Quantity:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                                      {order.quantity ? order.quantity.toFixed(2) : 'N/A'} ASTER
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Value:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                                      ${(order.price && order.quantity) ? (order.price * order.quantity).toFixed(2) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Filled:</span>
                                    <span className="font-bold text-[10px]" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
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
                                borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb'}
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
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Side:</span>
                                    <span 
                                      className="font-bold"
                                      style={{ color: order.side === 'BUY' ? '#16a34a' : '#dc2626' }}
                                    >
                                      {order.side || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Price:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                                      ${order.price ? order.price.toFixed(5) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Quantity:</span>
                                    <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                                      {order.quantity ? order.quantity.toFixed(2) : 'N/A'} ASTER
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Updated:</span>
                                    <span className="font-bold text-[10px]" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
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
                  <div className="space-y-5">
                    <h3 className="text-sm font-mono font-bold uppercase mb-5" style={{ color: isDarkMode ? '#16a34a' : '#4b5563' }}>
                      Current Position
                    </h3>
                    <div className="space-y-3 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Status:</span>
                        <span 
                          className="font-bold"
                          style={{ color: stats.position.hasPosition ? '#16a34a' : (isDarkMode ? '#ffffff' : '#9ca3af') }}
                        >
                          {stats.position.hasPosition ? 'ACTIVE POSITION' : 'NO POSITION'}
                        </span>
                      </div>
                      {stats.position.hasPosition && (
                        <>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Entry Price:</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>${stats.position.entryPrice.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Current Quantity:</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{stats.position.currentQty.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Open TP Orders:</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{stats.openTPOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Current Price:</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>${stats.currentPrice.toFixed(5)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Unrealized P&L:</span>
                            <span 
                              className="font-bold"
                              style={{ color: stats.unrealizedPnL >= 0 ? '#16a34a' : '#dc2626' }}
                            >
                              {stats.unrealizedPnL >= 0 ? '+' : ''}${stats.unrealizedPnL.toFixed(2)} ({stats.unrealizedPnLPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </>
                      )}
                      <div className="pt-5 mt-5 border-t-2 border-gray-900">
                        <div className="text-sm font-mono font-bold uppercase mb-4" style={{ color: isDarkMode ? '#16a34a' : '#4b5563' }}>STATISTICS</div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Total Decisions</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{stats.totalDecisions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Buys</span>
                            <span className="font-bold" style={{ color: '#16a34a' }}>
                              {stats.buyCount} ({((stats.buyCount / stats.totalDecisions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Sells</span>
                            <span className="font-bold" style={{ color: '#dc2626' }}>
                              {stats.sellCount} ({((stats.sellCount / stats.totalDecisions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold" style={{ color: isDarkMode ? '#15803d' : '#4b5563' }}>Holds</span>
                            <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>{stats.holdCount}</span>
                          </div>
                        </div>
                      </div>

                      {/* DeepSeek Attribution */}
                      <div className="pt-6 mt-6 border-t-2 border-gray-900">
                        <div className="text-xs font-mono text-gray-500 text-center">
                          Powered by DeepSeek AI
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
      <footer 
        className="border-t-2 mt-12 py-6"
        style={{
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderColor: isDarkMode ? '#16a34a' : '#1f2937',
        }}
      >
        <div className="px-6 text-center">
          <div 
            className="text-xs font-mono font-bold"
            style={{ color: isDarkMode ? '#15803d' : '#6b7280' }}
          >
            ICHIGO CRYPTO BOT | LIVE DATA | UPDATES EVERY 3 MINUTES
          </div>
        </div>
      </footer>
    </div>
  );
}
