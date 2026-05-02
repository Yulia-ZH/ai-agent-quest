import { useEffect, useState, useRef } from 'react';

// ── Rank system ──────────────────────────────────────────────
const RANKS = [
  { level: 1,  title: '菜鸟程序员',   emoji: '🐣', color: '#00d4ff', sub: '万里长征，第一步' },
  { level: 2,  title: 'LLM 调用侠',   emoji: '⚡', color: '#00ff88', sub: '敢和大模型对话，就是英雄' },
  { level: 3,  title: 'Prompt 炼金师', emoji: '🔮', color: '#b44eff', sub: '提示词即魔法，你已入门' },
  { level: 4,  title: '武器锻造师',    emoji: '⚔️', color: '#ff6b35', sub: '工具在手，天下我有' },
  { level: 5,  title: '记忆魔法师',    emoji: '🧠', color: '#ff3ea5', sub: '让 AI 记住你，你记住世界' },
  { level: 6,  title: 'Agent 指挥官',  emoji: '🤖', color: '#ffe500', sub: 'Agent 已组装完毕，开炮！' },
  { level: 7,  title: '质量守护者',    emoji: '🛡️', color: '#00d4ff', sub: '没有测试的代码是定时炸弹' },
  { level: 8,  title: 'Agent 架构师',  emoji: '🚀', color: '#00ff88', sub: '全链路贯通，正式出道！' },
];

function getRank(completedCount: number) {
  return RANKS[Math.min(completedCount - 1, RANKS.length - 1)];
}

// ── Confetti particle ─────────────────────────────────────────
interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'rect' | 'circle';
}

function Confetti({ accentColor }: { accentColor: string }) {
  const pieces = useRef<Piece[]>(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: [accentColor, '#00d4ff', '#b44eff', '#ffe500', '#ff3ea5', '#fff'][Math.floor(Math.random() * 6)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))
  );

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.current.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.x}%`,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.4 : p.size,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            background: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Glow rings burst ──────────────────────────────────────────
function GlowRings({ color }: { color: string }) {
  return (
    <>
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            animation: `glowRing 1.2s ease-out ${delay}s forwards`,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

// ── Scan line ─────────────────────────────────────────────────
function ScanLine({ color }: { color: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 20px ${color}`,
          animation: 'scanline 0.6s ease-in forwards',
        }}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
interface UnlockAnimationProps {
  completedQuestId: number | null;
  completedCount: number;
  onDone: () => void;
}

type Phase = 'scan' | 'reveal' | 'idle';

export function UnlockAnimation({ completedQuestId, completedCount, onDone }: UnlockAnimationProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (completedQuestId === null) return;
    setVisible(true);
    setPhase('scan');
    const t1 = setTimeout(() => setPhase('reveal'), 500);
    return () => clearTimeout(t1);
  }, [completedQuestId]);

  const handleDismiss = () => {
    setVisible(false);
    setPhase('idle');
    setTimeout(onDone, 350);
  };

  if (!visible) return null;

  const rank = getRank(completedCount);
  const isMaxLevel = completedCount >= RANKS.length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(10,5,30,0.97) 0%, rgba(5,5,15,0.99) 100%)',
        animation: 'overlayFadeIn 0.3s ease forwards',
      }}
    >
      {/* Confetti */}
      {phase === 'reveal' && <Confetti accentColor={rank.color} />}

      {/* Scanline on entry */}
      {phase === 'scan' && <ScanLine color={rank.color} />}

      {/* Grid overlay texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${rank.color}08 1px, transparent 1px),
                            linear-gradient(90deg, ${rank.color}08 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {/* Glow rings behind badge */}
        {phase === 'reveal' && <GlowRings color={rank.color} />}

        {/* QUEST COMPLETE label */}
        {phase === 'reveal' && (
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
              letterSpacing: '0.4em',
              color: rank.color,
              textTransform: 'uppercase',
              marginBottom: '20px',
              animation: 'subtitleFadeIn 0.4s ease 0.1s both',
              textShadow: `0 0 12px ${rank.color}`,
            }}
          >
            ── QUEST {completedQuestId} COMPLETE ──
          </div>
        )}

        {/* Rank emoji badge */}
        {phase === 'reveal' && (
          <div
            style={{
              fontSize: 'clamp(4rem, 10vw, 7rem)',
              lineHeight: 1,
              marginBottom: '16px',
              animation: 'rankBadgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
              filter: `drop-shadow(0 0 24px ${rank.color}aa)`,
            }}
          >
            {rank.emoji}
          </div>
        )}

        {/* LEVEL UP text */}
        {phase === 'reveal' && (
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              letterSpacing: '0.08em',
              color: '#ffffff',
              textShadow: `0 0 20px ${rank.color}, 0 0 60px ${rank.color}66`,
              lineHeight: 1,
              marginBottom: '12px',
              animation: 'titleSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both',
            }}
          >
            LEVEL UP!
          </div>
        )}

        {/* Horizontal streaks */}
        {phase === 'reveal' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '2px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              animation: 'subtitleFadeIn 0.4s ease 0.5s both',
            }}
          >
            <div style={{
              flex: 1, height: '1px', maxWidth: '120px',
              background: `linear-gradient(to left, ${rank.color}, transparent)`,
            }} />
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: rank.color,
              boxShadow: `0 0 8px ${rank.color}`,
            }} />
            <div style={{
              flex: 1, height: '1px', maxWidth: '120px',
              background: `linear-gradient(to right, ${rank.color}, transparent)`,
            }} />
          </div>
        )}

        {/* Rank title */}
        {phase === 'reveal' && (
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              fontWeight: 700,
              color: rank.color,
              textShadow: `0 0 16px ${rank.color}88`,
              letterSpacing: '0.1em',
              marginBottom: '8px',
              animation: 'subtitleFadeIn 0.5s ease 0.55s both',
            }}
          >
            {rank.title}
          </div>
        )}

        {/* Rank subtitle */}
        {phase === 'reveal' && (
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: '#8888aa',
              marginBottom: '32px',
              animation: 'subtitleFadeIn 0.5s ease 0.65s both',
            }}
          >
            {rank.sub}
          </div>
        )}

        {/* Level progress bar */}
        {phase === 'reveal' && (
          <div
            style={{
              width: 'clamp(240px, 50vw, 360px)',
              marginBottom: '32px',
              animation: 'subtitleFadeIn 0.5s ease 0.75s both',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.7rem', color: '#4a4a6a',
              marginBottom: '6px',
            }}>
              <span>PROGRESS</span>
              <span style={{ color: rank.color }}>{completedCount} / {RANKS.length} LEVELS</span>
            </div>
            <div style={{
              height: '6px', background: '#1a1a2e', borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(completedCount / RANKS.length) * 100}%`,
                background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`,
                boxShadow: `0 0 10px ${rank.color}`,
                borderRadius: '3px',
                transition: 'width 1s ease 0.8s',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: '4px',
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#2a2a3e',
            }}>
              {RANKS.map((_, i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i < completedCount ? rank.color : '#2a2a3e',
                  boxShadow: i < completedCount ? `0 0 6px ${rank.color}` : 'none',
                  transition: `background 0.3s ease ${0.8 + i * 0.08}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        {phase === 'reveal' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            animation: 'subtitleFadeIn 0.5s ease 0.9s both',
          }}>
            {isMaxLevel ? (
              <>
                <div style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                  color: '#ffe500',
                  textShadow: '0 0 12px #ffe50088',
                  letterSpacing: '0.1em',
                  padding: '10px 20px',
                  border: '1px solid #ffe50044',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}>
                  🏆 全部关卡已通关！你是真正的 Agent 架构师
                </div>
                <button onClick={handleDismiss} style={btnStyle('#ffe500')}>
                  返回总览 →
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDismiss}
                  style={{
                    ...btnStyle(rank.color),
                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                    padding: '14px 36px',
                    letterSpacing: '0.12em',
                  }}
                >
                  进入第 {(completedQuestId ?? 0) + 1} 关 →
                </button>
                <button onClick={handleDismiss} style={{ ...btnStyle('#4a4a6a'), fontSize: '0.72rem', padding: '8px 20px' }}>
                  返回总览
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    padding: '11px 28px',
    borderRadius: '4px',
    border: `1px solid ${color}`,
    background: color === '#4a4a6a' ? 'transparent' : `${color}18`,
    color: color,
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    boxShadow: color === '#4a4a6a' ? 'none' : `0 0 16px ${color}44`,
    transition: 'all 0.2s ease',
  };
}
