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
          className="h-32 w-auto mx-auto mb-8 animate-pulse"
        />
        
        {/* Loading Boxes */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div 
            className="w-3 h-3 border-2 animate-pulse"
            style={{ 
              borderColor: isDarkMode ? '#00ff00' : '#1f2937',
              animationDelay: '0ms',
              animationDuration: '1s'
            }}
          ></div>
          <div 
            className="w-3 h-3 border-2 animate-pulse"
            style={{ 
              borderColor: isDarkMode ? '#00ff00' : '#1f2937',
              animationDelay: '200ms',
              animationDuration: '1s'
            }}
          ></div>
          <div 
            className="w-3 h-3 border-2 animate-pulse"
            style={{ 
              borderColor: isDarkMode ? '#00ff00' : '#1f2937',
              animationDelay: '400ms',
              animationDuration: '1s'
            }}
          ></div>
        </div>
        
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

