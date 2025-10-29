'use client';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/ichigo-logo.png" 
          alt="ICHIGO Crypto Bot" 
          className="h-32 w-auto mx-auto mb-6 animate-pulse"
        />
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <div className="text-xs font-mono text-gray-600 uppercase tracking-widest font-bold">
          CONNECTING TO SERVER...
        </div>
      </div>
    </div>
  );
}

