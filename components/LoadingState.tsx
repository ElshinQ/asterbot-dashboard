'use client';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/ichigo-logo.png" 
          alt="ICHIGO Crypto Bot" 
          className="h-32 w-auto mx-auto mb-8"
        />
        
        {/* Box loading animation */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-3 h-3 bg-gray-900 animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-gray-900 animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-gray-900 animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-3 h-3 bg-gray-900 animate-pulse" style={{ animationDelay: '450ms' }}></div>
          <div className="w-3 h-3 bg-gray-900 animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
        
        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest font-bold">
          CONNECTING TO SERVER...
        </div>
      </div>
    </div>
  );
}

