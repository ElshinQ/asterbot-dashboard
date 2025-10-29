'use client';

import { useState } from 'react';
import type { RecentDecision } from '@/lib/types';

interface DecisionsFeedProps {
  decisions: RecentDecision[];
  isDarkMode: boolean;
}

export default function DecisionsFeed({ decisions, isDarkMode }: DecisionsFeedProps) {
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
    if (isDarkMode) {
      switch (action.toLowerCase()) {
        case 'buy':
          return { bg: '#002200', text: '#16a34a', border: '#16a34a' };
        case 'sell':
          return { bg: '#220000', text: '#dc2626', border: '#dc2626' };
        case 'hold':
          return { bg: '#000000', text: '#ffffff', border: '#16a34a' };
        default:
          return { bg: '#000000', text: '#ffffff', border: '#16a34a' };
      }
    } else {
      switch (action.toLowerCase()) {
        case 'buy':
          return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
        case 'sell':
          return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
        case 'hold':
          return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
        default:
          return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
      }
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
        <div className="py-8 text-center text-sm font-mono" style={{ color: isDarkMode ? '#15803d' : '#6b7280' }}>
          No decisions available
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.map((decision) => {
            const isExpanded = expandedDecisions.has(decision.decisionUid);
            const notePreview = decision.note.substring(0, 120);
            const needsExpansion = decision.note.length > 120;
            const actionColors = getActionColor(decision.action);

            return (
              <div
                key={decision.decisionUid}
                className="border-2 p-3 transition-colors"
                style={{
                  borderColor: isDarkMode ? '#16a34a' : '#1f2937',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#001100' : '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 border-2 text-xs font-bold uppercase"
                      style={{
                        backgroundColor: actionColors.bg,
                        color: actionColors.text,
                        borderColor: actionColors.border,
                      }}
                    >
                      {decision.action}
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: isDarkMode ? '#15803d' : '#6b7280' }}>
                      {formatTime(decision.decidedAt)}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono" style={{ color: isDarkMode ? '#16a34a' : '#111827' }}>
                    ${decision.lastClose.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2 text-xs font-mono" style={{ color: isDarkMode ? '#ffffff' : '#4b5563' }}>
                  <span 
                    className="px-2 py-1 font-bold text-[10px]"
                    style={{
                      backgroundColor: isDarkMode ? '#16a34a' : '#1f2937',
                      color: isDarkMode ? '#000000' : '#ffffff',
                    }}
                  >
                    {decision.regimeKey}
                  </span>
                  <span className="font-bold">RSI: {decision.rsi14_3m.toFixed(1)}</span>
                  <span className="font-bold">ADX: {decision.adx14_3m.toFixed(1)}</span>
                  <span
                    className="font-bold"
                    style={{ color: decision.hasPosition ? '#16a34a' : (isDarkMode ? '#666666' : '#9ca3af') }}
                  >
                    {decision.hasPosition ? '● POS' : '○ NO POS'}
                  </span>
                </div>

                <div className="text-xs leading-relaxed font-mono" style={{ color: isDarkMode ? '#ffffff' : '#374151' }}>
                  <p className="whitespace-pre-wrap break-words">
                    {isExpanded ? decision.note : notePreview}
                    {!isExpanded && needsExpansion && '...'}
                  </p>
                  {needsExpansion && (
                    <button
                      onClick={() => toggleExpand(decision.decisionUid)}
                      className="mt-2 font-bold uppercase text-xs"
                      style={{ color: isDarkMode ? '#16a34a' : '#2563eb' }}
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

