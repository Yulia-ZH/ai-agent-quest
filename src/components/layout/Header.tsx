import type { PlayerProfile } from '../../types/quest';

interface HeaderProps {
  completed: number;
  total: number;
  onReset: () => void;
  profile?: PlayerProfile | null;
  onChangeProfile?: () => void;
}

export function Header({ completed, total, onReset, profile, onChangeProfile }: HeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5,5,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a2e',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#00d4ff',
          letterSpacing: '0.1em',
          textShadow: '0 0 10px rgba(0,212,255,0.5)',
          flexShrink: 0,
        }}
      >
        AI AGENT 闯关
      </div>

      {profile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.72rem',
        }}>
          <span style={{ color: '#2a2a4e' }}>|</span>
          <span style={{ color: '#4a4a6a' }}>{profile.jobRole}</span>
          <span style={{ color: '#2a2a4e' }}>·</span>
          <span style={{ color: '#00d4ff88' }}>{profile.gameRole}</span>
          {onChangeProfile && (
            <button
              onClick={onChangeProfile}
              style={{
                background: 'transparent', border: 'none',
                color: '#2a2a4e', fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.65rem', cursor: 'pointer', padding: '0 4px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#4a4a6a'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2a2a4e'; }}
              title="切换角色"
            >
              ✎
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.8rem',
            color: '#00ff88',
          }}
        >
          {completed}/{total} LEVELS
        </div>

        <button
          onClick={() => {
            if (window.confirm('确定重置所有进度吗？此操作不可撤销。')) onReset();
          }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            color: '#4a4a6a',
            background: 'transparent',
            border: '1px solid #1a1a2e',
            borderRadius: '3px',
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ff3ea5';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3ea544';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#4a4a6a';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1a2e';
          }}
        >
          RESET
        </button>
      </div>
    </header>
  );
}
