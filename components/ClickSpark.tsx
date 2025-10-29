'use client';

import { ReactNode, MouseEvent, useState, useCallback } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  sparkColor?: string;
}

export default function ClickSpark({ 
  children, 
  className = '', 
  sparkColor = '#3b82f6' 
}: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSpark: Spark = {
      id: Date.now(),
      x,
      y,
    };

    setSparks(prev => [...prev, newSpark]);

    // Remove spark after animation completes
    setTimeout(() => {
      setSparks(prev => prev.filter(s => s.id !== newSpark.id));
    }, 1000);
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {children}
      
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="pointer-events-none absolute"
          style={{
            left: spark.x,
            top: spark.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Create multiple spark particles */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const distance = 30;
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-spark"
                style={{
                  backgroundColor: sparkColor,
                  left: 0,
                  top: 0,
                  animation: `spark-${i} 0.6s ease-out forwards`,
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`,
                } as any}
              />
            );
          })}
          
          {/* Center pulse */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: sparkColor,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'pulse-center 0.6s ease-out forwards',
            }}
          />
        </div>
      ))}
    </div>
  );
}

