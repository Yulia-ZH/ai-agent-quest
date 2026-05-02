import { useEffect, type ReactNode } from 'react';
import type { Quest, QuestProgress } from '../../types/quest';
import { QuestTerminalDemo } from './QuestTerminalDemo';
import { TaskChecklist } from './TaskChecklist';
import { TechTags } from './TechTags';
import { DifficultyStars } from './DifficultyStars';
import { GlowButton } from '../ui/GlowButton';

interface QuestPageProps {
  quest: Quest;
  progress: QuestProgress;
  totalQuests: number;
  onToggleTask: (taskId: string) => void;
  onComplete: () => void;
  onBack: () => void;
  onNextQuest?: () => void; // undefined when this is the last quest
}

export function QuestPage({ quest, progress, totalQuests, onToggleTask, onComplete, onBack, onNextQuest }: QuestPageProps) {
  const { status } = progress;
  const isCompleted = status === 'completed';
  const allDone = quest.tasks.every(t => progress.completedTasks.includes(t.id));
  const taskProgress = (progress.completedTasks.length / quest.tasks.length) * 100;

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 28px',
        borderBottom: `1px solid ${quest.accentColor}22`,
        background: 'rgba(5,5,15,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        {/* Back */}
        <button onClick={onBack} style={{
          background: 'transparent',
          border: `1px solid #2a2a3e`,
          borderRadius: '4px',
          color: '#6666aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.75rem', padding: '5px 12px',
          cursor: 'pointer', transition: 'all 0.2s',
          flexShrink: 0,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = quest.accentColor; (e.currentTarget as HTMLElement).style.color = quest.accentColor; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e'; (e.currentTarget as HTMLElement).style.color = '#6666aa'; }}
        >
          ← 返回地图
        </button>

        {/* Breadcrumb */}
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem',
          letterSpacing: '0.2em', color: '#2a2a4e',
        }}>
          LEVEL {quest.id} / {totalQuests}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: quest.accentColor,
          textShadow: `0 0 12px ${quest.accentColor}66`,
          letterSpacing: '0.06em',
          flex: 1, textAlign: 'center',
        }}>
          {quest.title}
        </div>

        {/* Progress pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        }}>
          <div style={{
            width: '80px', height: '4px',
            background: '#1a1a2e', borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${taskProgress}%`,
              background: quest.accentColor,
              boxShadow: `0 0 6px ${quest.accentColor}`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem', color: '#4a4a6a', whiteSpace: 'nowrap',
          }}>
            {progress.completedTasks.length}/{quest.tasks.length}
          </span>
        </div>
      </div>

      {/* ── Main: two-column ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        minHeight: 'calc(100vh - 57px)',
      }}
        className="quest-page-grid"
      >
        {/* ══ LEFT: Terminal Demo ══ */}
        <div style={{
          borderRight: `1px solid ${quest.accentColor}18`,
          padding: '28px 28px 28px 28px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {/* Quest header */}
          <div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
              letterSpacing: '0.25em', color: quest.accentColor,
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              Level {quest.id} · Demo
            </div>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              color: '#f0f0ff', margin: '0 0 6px',
              letterSpacing: '0.04em',
            }}>
              {quest.title}
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
              color: '#666688', lineHeight: 1.6, margin: 0,
            }}>
              {quest.subtitle}
            </p>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <DifficultyStars difficulty={quest.difficulty} />
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.75rem', color: '#4a4a6a',
            }}>⏱ {quest.estimatedMinutes} min</span>
          </div>

          {/* Terminal */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
              letterSpacing: '0.2em', color: quest.accentColor,
              textTransform: 'uppercase', marginBottom: '10px',
            }}>
              ⌨ 终端演示
            </div>
            <QuestTerminalDemo
              lines={quest.demoLines}
              accentColor={quest.accentColor}
              isVisible={true}
            />
          </div>

          {/* Description */}
          <div style={{
            background: `${quest.accentColor}08`,
            border: `1px solid ${quest.accentColor}22`,
            borderRadius: '6px', padding: '14px 16px',
          }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.58rem',
              letterSpacing: '0.2em', color: quest.accentColor,
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              关卡说明
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.83rem',
              color: '#8888aa', lineHeight: 1.7, margin: 0,
            }}>
              {quest.description}
            </p>
          </div>
        </div>

        {/* ══ RIGHT: Tasks ══ */}
        <div style={{
          padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '24px',
          overflowY: 'auto',
        }}>
          {/* Tech tags */}
          <div>
            <SectionLabel color={quest.accentColor}>技术要点</SectionLabel>
            <div style={{ marginTop: '10px' }}>
              <TechTags tags={quest.techPoints} color={quest.accentColor} max={10} />
            </div>
          </div>

          {/* Task checklist */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '12px',
            }}>
              <SectionLabel color={quest.accentColor}>任务清单</SectionLabel>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.72rem', color: '#4a4a6a',
              }}>
                {progress.completedTasks.length} / {quest.tasks.length} 完成
              </span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: '3px', background: '#1a1a2e',
              borderRadius: '2px', overflow: 'hidden', marginBottom: '16px',
            }}>
              <div style={{
                height: '100%', width: `${taskProgress}%`,
                background: `linear-gradient(90deg, ${quest.accentColor}88, ${quest.accentColor})`,
                boxShadow: `0 0 8px ${quest.accentColor}`,
                borderRadius: '2px', transition: 'width 0.4s ease',
              }} />
            </div>

            <TaskChecklist
              tasks={quest.tasks}
              completedTasks={progress.completedTasks}
              accentColor={quest.accentColor}
              onToggle={onToggleTask}
            />
          </div>

          {/* Output artifacts */}
          <div>
            <SectionLabel color={quest.accentColor}>产出物</SectionLabel>
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quest.outputArtifacts.map(a => (
                <span key={a} style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.78rem', padding: '4px 12px',
                  borderRadius: '4px', background: '#0a0a1a',
                  border: '1px solid #1a1a2e', color: '#a8ff78',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Complete / done */}
          <div style={{ paddingTop: '8px', borderTop: `1px solid ${quest.accentColor}18` }}>
            {isCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Completed badge row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.82rem', color: '#00ff88',
                  textShadow: '0 0 10px rgba(0,255,136,0.3)',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#00ff88', flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L3.5 6.5L10 1" stroke="#05050f" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  本关已完成
                  {progress.completedAt && (
                    <span style={{ color: '#3a3a5a', fontSize: '0.7rem' }}>
                      · {new Date(progress.completedAt).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>

                {/* Next quest button */}
                {onNextQuest ? (
                  <GlowButton onClick={onNextQuest} color={quest.accentColor} size="lg">
                    进入第 {quest.id + 1} 关 →
                  </GlowButton>
                ) : (
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.8rem', letterSpacing: '0.1em',
                    color: '#ffe500', textShadow: '0 0 10px #ffe50066',
                    padding: '10px 0',
                  }}>
                    🏆 全部关卡已完成！
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!allDone && (
                  <div style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.72rem', color: '#4a4a6a',
                  }}>
                    还差 {quest.tasks.length - progress.completedTasks.length} 项任务
                  </div>
                )}
                <GlowButton
                  onClick={onComplete}
                  color={quest.accentColor}
                  disabled={!allDone}
                  size="lg"
                >
                  {allDone ? '✓ 完成本关，解锁下一关 →' : `勾选所有任务后解锁`}
                </GlowButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
      color, letterSpacing: '0.2em', textTransform: 'uppercase',
    }}>
      {children}
    </div>
  );
}
