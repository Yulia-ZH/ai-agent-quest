import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { useEffect, useState } from 'react';

interface StatItem {
  value: number;
  label: string;
  unit?: string;
  color?: string;
}

function StatCard({ value, label, unit = '', color = '#00d4ff' }: StatItem) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);
  const animated = useAnimatedCounter(mounted ? value : 0, 900);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '16px 24px',
        background: 'rgba(13,13,31,0.8)',
        border: `1px solid ${color}22`,
        borderRadius: '8px',
        minWidth: '120px',
      }}
    >
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: color,
          textShadow: `0 0 12px ${color}66`,
          lineHeight: 1,
        }}
      >
        {animated}
        <span style={{ fontSize: '0.9rem', marginLeft: '2px' }}>{unit}</span>
      </div>
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.7rem',
          color: '#4a4a6a',
          marginTop: '6px',
          letterSpacing: '0.1em',
        }}
      >
        {label}
      </div>
    </div>
  );
}

interface StatsBannerProps {
  completed: number;
  total: number;
  completedMinutes: number;
}

export function StatsBanner({ completed, total, completedMinutes }: StatsBannerProps) {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <StatCard value={completed} label="已完成关卡" color="#00ff88" />
      <StatCard value={total} label="总关卡数" color="#00d4ff" />
      <StatCard value={completedMinutes} label="累计学习" unit="min" color="#b44eff" />
    </div>
  );
}
