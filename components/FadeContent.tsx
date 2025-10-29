'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface FadeContentProps {
  children: ReactNode;
  trigger?: any; // Change this to trigger re-animation
  className?: string;
}

export default function FadeContent({ children, trigger, className = '' }: FadeContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset animation
    setIsVisible(false);
    
    // Trigger fade in after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div
      ref={contentRef}
      className={`transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

