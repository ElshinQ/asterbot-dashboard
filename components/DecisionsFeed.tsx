'use client';

import { useState } from 'react';
import type { RecentDecision } from '@/lib/types';

interface DecisionsFeedProps {
  decisions: RecentDecision[];
  isDarkMode?: boolean;
}

export default function DecisionsFeed({ decisions, isDarkMode = false }: DecisionsFeedProps) {
  const [expandedDecisions, setExpandedDecisions] = useState<Set<string>>(new Set());

  const toggleExpand = (uid: string) => {
    setExpandedDecisions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'buy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'sell':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'hold':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-3">
      {decisions.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm font-mono">
          No decisions available
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.map((decision) => {
            const isExpanded = expandedDecisions.has(decision.decisionUid);
            const notePreview = decision.note.substring(0, 120);
            const needsExpansion = decision.note.length > 120;

            return (
              <div
                key={decision.decisionUid}
                className="border-2 p-3 transition-colors"
                style={{
                  borderColor: isDarkMode ? '#00ff00' : '#1f2937',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 border-2 border-gray-900 text-xs font-bold uppercase ${getActionColor(decision.action)}`}
                    >
                      {decision.action}
                    </span>
                    <span 
                      className="text-xs font-mono font-bold"
                      style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}
                    >
                      {formatTime(decision.decidedAt)}
                    </span>
                  </div>
                  <span 
                    className="text-sm font-bold font-mono"
                    style={{ color: isDarkMode ? '#00ff00' : '#111827' }}
                  >
                    ${decision.lastClose.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2 text-xs font-mono" style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
                  <span 
                    className="px-2 py-1 font-bold text-[10px]"
                    style={{
                      backgroundColor: isDarkMode ? '#00ff00' : '#1f2937',
                      color: isDarkMode ? '#000000' : '#ffffff',
                    }}
                  >
                    {decision.regimeKey}
                  </span>
                  <span className="font-bold">RSI: {decision.rsi14_3m.toFixed(1)}</span>
                  <span className="font-bold">ADX: {decision.adx14_3m.toFixed(1)}</span>
                  <span
                    className={
                      decision.hasPosition ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-400 dark:text-gray-500 font-bold'
                    }
                  >
                    {decision.hasPosition ? '● POS' : '○ NO POS'}
                  </span>
                </div>

                <div 
                  className="text-xs leading-relaxed font-mono"
                  style={{ color: isDarkMode ? '#e5e7eb' : '#111827' }}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {isExpanded ? decision.note : notePreview}
                    {!isExpanded && needsExpansion && '...'}
                  </p>
                  {needsExpansion && (
                    <button
                      onClick={() => toggleExpand(decision.decisionUid)}
                      className="mt-2 font-bold uppercase text-xs"
                      style={{ 
                        color: isDarkMode ? '#00ff00' : '#2563eb',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = isDarkMode ? '#22c55e' : '#1e40af'}
                      onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? '#00ff00' : '#2563eb'}
                    >
                      {isExpanded ? '▲ Show Less' : '▼ Read Full Decision'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

