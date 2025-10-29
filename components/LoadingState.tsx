'use client';

import { useEffect, useState } from 'react';

export default function LoadingState() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference from document
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDarkMode(hasDarkClass);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}
    >
      <div className="text-center">
        <img 
          src="/ichigo-logo.png" 
          alt="ICHIGO Crypto Bot" 
          className="h-32 w-auto mx-auto mb-6 animate-pulse"
        />
        <div 
          className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mb-4"
          style={{ borderColor: isDarkMode ? '#00ff00' : '#1f2937' }}
        ></div>
        <div 
          className="text-xs font-mono uppercase tracking-widest font-bold"
          style={{ color: isDarkMode ? '#00ff00' : '#4b5563' }}
        >
          CONNECTING TO SERVER...
        </div>
      </div>
    </div>
  );
}

