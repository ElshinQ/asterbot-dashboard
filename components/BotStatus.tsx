'use client';

import { formatDistanceToNow } from '@/lib/utils';

interface BotStatusProps {
  lastDecision: {
    timestamp: string;
    action: string;
  };
  runtime: {
    firstDecision: string;
    lastDecision: string;
    daysSinceStart: number;
    totalRuntime: string;
  };
}

export default function BotStatus({ lastDecision, runtime }: BotStatusProps) {
  const timeAgo = formatDistanceToNow(lastDecision.timestamp);
  const isRecent = new Date().getTime() - new Date(lastDecision.timestamp).getTime() < 5 * 60 * 1000;

  return (
    <div className="bg-[#0f0f0f] border border-green-500/20 p-6 rounded-lg">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
        BOT STATUS
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-gray-500">STATUS</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isRecent ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
              }`}
            />
            <span className="text-xs font-mono text-green-400 font-bold">
              {isRecent ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">LAST ACTION</span>
          <span className="text-sm font-mono text-gray-300 uppercase">
            {lastDecision.action}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">LAST UPDATE</span>
          <span className="text-sm font-mono text-gray-300">{timeAgo}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">RUNTIME</span>
          <span className="text-sm font-mono text-green-400 font-bold">
            {runtime.totalRuntime}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs font-mono text-gray-500">STARTED</span>
          <span className="text-sm font-mono text-gray-300">
            {new Date(runtime.firstDecision).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

