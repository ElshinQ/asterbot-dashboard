'use client';

interface DarkVeilProps {
  isDarkMode?: boolean;
}

export default function DarkVeil({ isDarkMode = false }: DarkVeilProps) {
  if (!isDarkMode) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-green opacity-10" />
    </div>
  );
}

