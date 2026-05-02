import { ProgressRing } from './ProgressRing';
import { StatsBanner } from './StatsBanner';
import { TerminalText } from '../ui/TerminalText';

interface HeroSectionProps {
  progress: number;
  completed: number;
  total: number;
  completedMinutes: number;
}

export function HeroSection({ progress, completed, total, completedMinutes }: HeroSectionProps) {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: 'clamp(40px, 8vh, 80px) 20px clamp(30px, 6vh, 60px)',
      }}
    >
      {/* Main title */}
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '0.1em',
          lineHeight: 1.1,
          marginBottom: '8px',
        }}
      >
        <span style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>AI AGENT </span>
        <span
          style={{
            color: '#f0f0ff',
            textShadow: '0 0 30px rgba(180,78,255,0.3)',
          }}
        >
          闯关
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          color: '#8888aa',
          maxWidth: '600px',
          margin: '0 auto 24px',
          lineHeight: 1.6,
        }}
      >
        用 <span style={{ color: '#00d4ff', fontFamily: "'Share Tech Mono', monospace" }}>LangChain 1.x</span> 打通
        AI Agent 开发全链路
        <br />
        真实代码 · 真实 PR · 真实上线 —— 拿下就业市场的核心技能
      </p>

      {/* Terminal text */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
        <TerminalText />
      </div>

      {/* Progress ring + stats */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 48px)',
          flexWrap: 'wrap',
        }}
      >
        <ProgressRing progress={progress} size={130} />
        <StatsBanner completed={completed} total={total} completedMinutes={completedMinutes} />
      </div>
    </section>
  );
}
