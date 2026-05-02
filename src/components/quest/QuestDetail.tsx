import type { ReactNode } from 'react';
import type { Quest, QuestProgress } from '../../types/quest';
import { TaskChecklist } from './TaskChecklist';
import { TechTags } from './TechTags';
import { GlowButton } from '../ui/GlowButton';
import { QuestTerminalDemo } from './QuestTerminalDemo';

interface QuestDetailProps {
  quest: Quest;
  progress: QuestProgress;
  isVisible: boolean;
  onToggleTask: (taskId: string) => void;
  onComplete: () => void;
}

export function QuestDetail({ quest, progress, isVisible, onToggleTask, onComplete }: QuestDetailProps) {
  const allDone = quest.tasks.every((t) => progress.completedTasks.includes(t.id));
  const isCompleted = progress.status === 'completed';

  return (
    <div style={{ borderTop: `1px solid ${quest.accentColor}22`, paddingTop: '20px' }}>
      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '20px',
        alignItems: 'start',
      }}
        className="quest-detail-grid"
      >
        {/* ── LEFT: Terminal Demo ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SectionLabel color={quest.accentColor}>
            {quest.videoUrl ? '🎬 视频教程' : '⌨ 终端演示'}
          </SectionLabel>

          {quest.videoUrl ? (
            <div style={{
              position: 'relative', paddingBottom: '56.25%', height: 0,
              borderRadius: '8px', overflow: 'hidden',
              border: `1px solid ${quest.accentColor}33`,
            }}>
              <iframe
                src={quest.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <div style={{
              border: `1px solid ${quest.accentColor}33`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <QuestTerminalDemo
                lines={quest.demoLines}
                accentColor={quest.accentColor}
                isVisible={isVisible}
              />
            </div>
          )}

          {/* Description below demo */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
            color: '#666688',
            lineHeight: 1.7, margin: 0,
          }}>
            {quest.description}
          </p>
        </div>

        {/* ── RIGHT: Tasks & Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Tech points */}
          <div>
            <SectionLabel color={quest.accentColor}>技术要点</SectionLabel>
            <div style={{ marginTop: '8px' }}>
              <TechTags tags={quest.techPoints} color={quest.accentColor} max={10} />
            </div>
          </div>

          {/* Task checklist */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <SectionLabel color={quest.accentColor}>任务清单</SectionLabel>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.7rem', color: '#4a4a6a',
              }}>
                {progress.completedTasks.length} / {quest.tasks.length}
              </span>
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
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quest.outputArtifacts.map((a) => (
                <span key={a} style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.75rem', padding: '3px 10px',
                  borderRadius: '3px', background: '#0a0a1a',
                  border: '1px solid #1a1a2e', color: '#a8ff78',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Complete / done */}
          {!isCompleted ? (
            <GlowButton
              onClick={onComplete}
              color={quest.accentColor}
              disabled={!allDone}
            >
              {allDone
                ? '✓ 标记本关完成'
                : `完成所有任务后解锁 (${progress.completedTasks.length}/${quest.tasks.length})`}
            </GlowButton>
          ) : (
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem', color: '#00ff8888',
            }}>
              {progress.completedAt
                ? `✓ 已完成 · ${new Date(progress.completedAt).toLocaleDateString('zh-CN')}`
                : '✓ 已完成'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Orbitron, sans-serif', fontSize: '0.62rem',
      color, letterSpacing: '0.15em', textTransform: 'uppercase',
    }}>
      {children}
    </div>
  );
}
