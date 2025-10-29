'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;

    const duration = 600; // ms
    const steps = 30;
    const stepValue = (value - prevValueRef.current) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(prevValueRef.current + stepValue * currentStep);
      }
    }, stepDuration);

    prevValueRef.current = value;

    return () => clearInterval(interval);
  }, [value]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {formattedValue.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="inline-block transition-all duration-300"
          style={{
            transitionDelay: `${index * 20}ms`,
          }}
        >
          {char}
        </span>
      ))}
      {suffix}
    </span>
  );
}

