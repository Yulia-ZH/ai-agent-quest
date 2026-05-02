import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlowButton({
  children,
  onClick,
  color = '#00ff88',
  disabled = false,
  variant = 'solid',
  size = 'md',
  className = '',
}: GlowButtonProps) {
  const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' }[size];

  const baseStyle: React.CSSProperties = {
    color: variant === 'solid' ? '#05050f' : color,
    backgroundColor: variant === 'solid' ? color : 'transparent',
    border: `1px solid ${color}`,
    boxShadow: disabled ? 'none' : `0 0 10px ${color}55, 0 0 20px ${color}22`,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.05em',
    borderRadius: '4px',
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={baseStyle}
      className={`${sizeClasses} uppercase tracking-widest ${className}`}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${color}88, 0 0 40px ${color}44`;
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 10px ${color}55, 0 0 20px ${color}22`;
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}
