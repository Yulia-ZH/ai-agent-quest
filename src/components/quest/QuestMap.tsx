import { useState, useRef, useEffect } from 'react';
import type { Quest, AppState } from '../../types/quest';
import { getQuestProgress } from '../../utils/storage';
import { DifficultyStars } from './DifficultyStars';
import { TechTags } from './TechTags';

// ── Types ─────────────────────────────────────────────────────

interface QuestMapProps {
  quests: Quest[];
  state: AppState;
  onSelectQuest: (questId: number) => void;
}

type EdgeState = 'completed' | 'active-edge' | 'locked';

// ── Constants ─────────────────────────────────────────────────

// Logical canvas dimensions — nodes + SVG are expressed in these pixels.
// The outer wrapper scrolls horizontally if the viewport is narrower.
const CW = 1400;
const CH = 360;
const R  = 42; // node circle radius

// Snake path: odd IDs sit near top (y≈105), even IDs near bottom (y≈255)
const NODE_COORDS: { id: number; x: number; y: number }[] = [
  { id: 1, x:  98, y: 105 },
  { id: 2, x: 280, y: 255 },
  { id: 3, x: 462, y: 105 },
  { id: 4, x: 644, y: 255 },
  { id: 5, x: 826, y: 105 },
  { id: 6, x: 1008, y: 255 },
  { id: 7, x: 1176, y: 105 },
  { id: 8, x: 1302, y: 255 },
];

// Vertical zone bands expressed as pixel x ranges
const ZONES = [
  { label: 'ZONE 01 · 入门', x1: 0,   x2: 378,  color: '#00d4ff' },
  { label: 'ZONE 02 · 进阶', x1: 378, x2: 924,  color: '#b44eff' },
  { label: 'ZONE 03 · 实战', x1: 924, x2: CW,   color: '#ffe500' },
];

const QUEST_ICONS: Record<number, string> = {
  1: '🚀', 2: '💬', 3: '🔮', 4: '⚔️',
  5: '🧠', 6: '🤖', 7: '🛡️', 8: '🌐',
};

// ── Helpers ───────────────────────────────────────────────────

// Horizontal S-curve bezier between two nodes
function bezier(ax: number, ay: number, bx: number, by: number): string {
  const dx = (bx - ax) * 0.5;
  return `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`;
}

function getEdgeState(idA: number, idB: number, state: AppState): EdgeState {
  const pa = getQuestProgress(state, idA);
  const pb = getQuestProgress(state, idB);
  if (pa.status === 'completed' && pb.status === 'completed') return 'completed';
  if (pa.status === 'completed' && pb.status === 'active')    return 'active-edge';
  return 'locked';
}

// ── Main ──────────────────────────────────────────────────────

export function QuestMap({ quests, state, onSelectQuest }: QuestMapProps) {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Pre-compute per-node data
  const nodes = NODE_COORDS.map(({ id, x, y }) => ({
    id, x, y,
    quest:    quests.find(q => q.id === id)!,
    progress: getQuestProgress(state, id),
  }));

  const activeNode  = nodes.find(n => n.progress.status === 'active');
  const activeColor = activeNode?.quest.accentColor ?? '#00d4ff';

  // Scroll the active node into the center of the viewport on first render
  useEffect(() => {
    if (!activeNode || !scrollRef.current) return;
    const el = scrollRef.current;
    const target = activeNode.x - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNode?.id]);

  return (
    <section style={{ position: 'relative', zIndex: 1 }}>
      {/* Keyframe animations injected inline so we can use dynamic colors */}
      <style>{`
        @keyframes nodePulse {
          0%,100% { box-shadow: 0 0 0 4px ${activeColor}22, 0 0 24px ${activeColor}66; }
          50%      { box-shadow: 0 0 0 9px ${activeColor}11, 0 0 44px ${activeColor}99; }
        }
        @keyframes ringOut {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.4); opacity: 0;    }
        }
        @keyframes bobDown {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes flowAlong {
          to { stroke-dashoffset: -100; }
        }
        .qn { transition: transform 0.18s ease, filter 0.18s ease; }
        .qn:not([data-locked="true"]):hover { transform: scale(1.07); filter: brightness(1.15); }
      `}</style>

      {/* ── Horizontal scroll wrapper ── */}
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1a1a2e #05050f',
        }}
      >
        {/* ── Logical canvas ── */}
        <div style={{ position: 'relative', width: CW, height: CH, flexShrink: 0 }}>

          {/* Zone bands */}
          {ZONES.map(z => (
            <div key={z.label} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: z.x1, width: z.x2 - z.x1,
              background: `${z.color}07`,
              borderRight: z.x2 < CW ? `1px dashed ${z.color}25` : undefined,
              pointerEvents: 'none',
            }}>
              <span style={{
                position: 'absolute', bottom: 10, left: 14,
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.55rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: `${z.color}40`,
              }}>{z.label}</span>
            </div>
          ))}

          {/* ── SVG layer: connection lines ── */}
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: CW, height: CH,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {nodes.slice(0, -1).map((a, i) => {
              const b     = nodes[i + 1];
              const state_ = getEdgeState(a.id, b.id, state);
              const d     = bezier(a.x, a.y, b.x, b.y);

              const stroke = state_ === 'completed'   ? '#00ff88'
                           : state_ === 'active-edge' ? b.quest.accentColor
                           :                            '#252538';

              const glowFilter = state_ === 'completed'
                ? 'drop-shadow(0 0 5px #00ff8877)'
                : state_ === 'active-edge'
                ? `drop-shadow(0 0 7px ${b.quest.accentColor}99)`
                : undefined;

              return (
                <g key={`e${a.id}`}>
                  {/* Base path */}
                  <path
                    d={d} fill="none"
                    stroke={stroke}
                    strokeWidth={state_ === 'locked' ? 1.5 : 2.5}
                    strokeDasharray={state_ === 'locked' ? '7 7' : undefined}
                    opacity={state_ === 'locked' ? 0.4 : 0.85}
                    style={{ filter: glowFilter }}
                  />

                  {/* Animated flow particle (completed + active-edge only) */}
                  {state_ !== 'locked' && (
                    <path
                      d={d} fill="none"
                      stroke={state_ === 'completed' ? '#00ff88' : b.quest.accentColor}
                      strokeWidth={2}
                      strokeDasharray="18 82"
                      strokeDashoffset="0"
                      opacity={0.7}
                      style={{
                        animation: `flowAlong ${state_ === 'completed' ? '2.8s' : '1.8s'} linear infinite`,
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* ── Player position indicator ── */}
          {activeNode && (
            <div style={{
              position: 'absolute',
              left:  activeNode.x - 40,
              top:   activeNode.y - R - 52,
              width: 80,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              pointerEvents: 'none', zIndex: 10,
            }}>
              <span style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.25rem', lineHeight: 1,
                color: activeColor,
                textShadow: `0 0 14px ${activeColor}`,
                animation: 'bobDown 1.3s ease-in-out infinite',
              } as React.CSSProperties}>▼</span>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.5rem', letterSpacing: '0.12em',
                color: activeColor,
                border: `1px solid ${activeColor}55`,
                borderRadius: 3, padding: '1px 5px',
                background: '#05050f', whiteSpace: 'nowrap',
              }}>● 当前位置</span>
            </div>
          )}

          {/* ── Quest nodes ── */}
          {nodes.map(({ id, x, y, quest, progress }) => {
            if (!quest) return null;
            const isLocked    = progress.status === 'locked';
            const isCompleted = progress.status === 'completed';
            const isActive    = progress.status === 'active';
            const c = quest.accentColor;

            return (
              <div
                key={id}
                className="qn"
                data-locked={isLocked ? 'true' : undefined}
                onClick={() => !isLocked && onSelectQuest(id)}
                onMouseEnter={() => !isLocked && setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'absolute',
                  left: x - 60, top: y - R,
                  width: 120,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  cursor: isLocked ? 'default' : 'pointer',
                  zIndex: 2, userSelect: 'none',
                }}
              >
                {/* Expanding pulse ring */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: '50%',
                    marginLeft: -R, width: R * 2, height: R * 2,
                    borderRadius: '50%', border: `2px solid ${c}`,
                    animation: 'ringOut 2s ease-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Circle */}
                <div style={{
                  width: R * 2, height: R * 2, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  border: isLocked    ? '2px solid #1e1e30'
                        : isCompleted ? `2px solid ${c}88`
                        :               `2px solid ${c}`,
                  background: isLocked
                    ? '#0a0a14'
                    : `radial-gradient(circle at 38% 32%, ${c}${isCompleted ? '1a' : '28'}, #080812 68%)`,
                  boxShadow: isLocked    ? 'none'
                           : isCompleted ? `0 0 14px ${c}44`
                           :               `0 0 0 4px ${c}20, 0 0 26px ${c}66`,
                  animation: isActive ? 'nodePulse 2.5s ease-in-out infinite' : undefined,
                  transition: 'box-shadow 0.3s',
                }}>
                  {/* Number badge */}
                  <div style={{
                    position: 'absolute', top: -4, left: -4,
                    width: 20, height: 20, borderRadius: '50%',
                    background: isLocked ? '#1e1e30' : c,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.52rem', fontWeight: 700,
                    color: isLocked ? '#3a3a5a' : '#05050f',
                    boxShadow: isLocked ? 'none' : `0 0 8px ${c}99`,
                  }}>{id}</div>

                  {/* Emoji / status icon */}
                  <span style={{
                    fontSize: '1.5rem', lineHeight: 1,
                    opacity: isLocked ? 0.15 : 1,
                    filter: isLocked ? 'none' : `drop-shadow(0 0 6px ${c}77)`,
                  }}>
                    {isCompleted ? '✓' : isLocked ? '🔒' : (QUEST_ICONS[id] ?? '⭐')}
                  </span>
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
                  fontSize: '0.58rem', letterSpacing: '0.05em', lineHeight: 1.3,
                  color: isLocked ? '#252538' : isCompleted ? '#00ff88' : '#eeeeff',
                  textAlign: 'center', maxWidth: 110,
                  textShadow: isCompleted ? '0 0 8px #00ff8855'
                            : isActive    ? `0 0 8px ${c}66` : 'none',
                }}>{quest.title}</div>

                {/* Difficulty */}
                <DifficultyStars difficulty={quest.difficulty} color={isLocked ? '#252538' : c} />
              </div>
            );
          })}

          {/* ── Hover tooltip ── */}
          {hoveredId !== null && (() => {
            const n = nodes.find(nd => nd.id === hoveredId);
            if (!n) return null;
            const { x, y, quest, progress } = n;
            const c = quest.accentColor;
            const above = y > CH / 2;  // node in bottom half → tooltip above
            const tooltipTop = above ? y - R - 178 : y + R + 12;
            const rawLeft = x - 110;
            const tooltipLeft = Math.min(Math.max(rawLeft, 8), CW - 232);

            return (
              <div style={{
                position: 'absolute',
                left: tooltipLeft, top: tooltipTop,
                width: 220,
                background: 'rgba(5,5,15,0.97)',
                border: `1px solid ${c}44`,
                borderRadius: 8,
                padding: '14px 16px',
                boxShadow: `0 0 22px ${c}22, 0 12px 36px rgba(0,0,0,0.75)`,
                backdropFilter: 'blur(14px)',
                zIndex: 20, pointerEvents: 'none',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 6,
                }}>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.58rem', letterSpacing: '0.25em', color: c,
                  }}>LEVEL {quest.id}</span>
                  {progress.status === 'completed' && (
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.58rem', color: '#00ff88',
                    }}>✓ 已完成</span>
                  )}
                </div>

                <div style={{
                  fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
                  fontSize: '0.85rem', color: '#f0f0ff', marginBottom: 5,
                }}>{quest.title}</div>

                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.74rem',
                  color: '#8888aa', lineHeight: 1.55, marginBottom: 10,
                }}>{quest.subtitle}</div>

                <div style={{
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${c}33, transparent)`,
                  marginBottom: 10,
                }} />

                <div style={{ marginBottom: 10 }}>
                  <TechTags tags={quest.techPoints} color={c} max={3} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.68rem', color: '#4a4a6a',
                  }}>⏱ {quest.estimatedMinutes}min</span>
                  <DifficultyStars difficulty={quest.difficulty} color={c} />
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </section>
  );
}
