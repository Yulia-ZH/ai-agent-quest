import { useEffect, useState } from 'react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface ProgressRingProps {
  progress: number;
  size?: number;
  stroke?: number;
}

export function ProgressRing({ progress, size = 120, stroke = 6 }: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);

  const animatedProgress = useAnimatedCounter(mounted ? progress : 0, 1000);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00ff88"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.05s linear',
            filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.6))',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#00ff88',
            textShadow: '0 0 12px rgba(0,255,136,0.6)',
            lineHeight: 1,
          }}
        >
          {animatedProgress}%
        </span>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.6rem',
            color: '#4a4a6a',
            letterSpacing: '0.1em',
            marginTop: '3px',
          }}
        >
          完成
        </span>
      </div>
    </div>
  );
}
