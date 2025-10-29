'use client';

import { ReactNode, useEffect, useState } from 'react';

interface FadeContentProps {
  children: ReactNode;
  trigger?: any; // Change this to trigger re-animation
  className?: string;
}

export default function FadeContent({ children, trigger, className = '' }: FadeContentProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset animation
    setIsVisible(false);
    
    // Trigger fade in after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      {children}
    </div>
  );
}

