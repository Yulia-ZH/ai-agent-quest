import { useState, useCallback } from 'react';
import type { Quest, QuestProgress } from '../../types/quest';
import { DifficultyStars } from './DifficultyStars';
import { TechTags } from './TechTags';
import { QuestDetail } from './QuestDetail';

interface QuestCardProps {
  quest: Quest;
  progress: QuestProgress;
  onToggleTask: (taskId: string) => void;
  onComplete: () => void;
}

export function QuestCard({ quest, progress, onToggleTask, onComplete }: QuestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { status } = progress;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const borderColor = isLocked ? '#1a1a2e' : isCompleted ? '#00ff88' : quest.accentColor;
  const bgColor = isCompleted ? 'rgba(0,26,13,0.6)' : isLocked ? '#0a0a14' : '#0d0d1f';
  const glowShadow = isLocked
    ? 'none'
    : isCompleted
    ? '0 0 12px rgba(0,255,136,0.2), 0 4px 24px rgba(0,0,0,0.4)'
    : `0 0 12px ${quest.accentColor}22, 0 4px 24px rgba(0,0,0,0.4)`;

  const handleToggleTask = useCallback(
    (taskId: string) => onToggleTask(taskId),
    [onToggleTask]
  );

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${isCompleted ? '#00ff88' : borderColor}`,
        borderStyle: isLocked ? 'dashed' : 'solid',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: glowShadow,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: isLocked ? 'default' : 'pointer',
        animation: status === 'active' ? 'neonPulse 3s ease-in-out infinite' : undefined,
      }}
      onMouseEnter={(e) => {
        if (isLocked) return;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = isCompleted
          ? '0 0 20px rgba(0,255,136,0.35), 0 8px 32px rgba(0,0,0,0.5)'
          : `0 0 20px ${quest.accentColor}44, 0 8px 32px rgba(0,0,0,0.5)`;
      }}
      onMouseLeave={(e) => {
        if (isLocked) return;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = glowShadow;
      }}
      onClick={() => !isLocked && setExpanded((v) => !v)}
    >
      {/* Quest number background */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '5rem',
          fontWeight: 900,
          color: isLocked ? '#0f0f1f' : `${quest.accentColor}0f`,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {String(quest.id).padStart(2, '0')}
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: isLocked ? '#2a2a3e' : quest.accentColor,
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}
          >
            LEVEL {quest.id}
          </div>
          <h3
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontWeight: 700,
              color: isLocked ? '#2a2a3e' : isCompleted ? '#00ff88' : '#f0f0ff',
              margin: 0,
              letterSpacing: '0.05em',
              textShadow: isCompleted ? '0 0 10px rgba(0,255,136,0.5)' : 'none',
            }}
          >
            {quest.title}
          </h3>
        </div>

        {/* Status badge */}
        <div style={{ marginLeft: '12px', flexShrink: 0 }}>
          {isLocked && (
            <span style={{ fontSize: '1.4rem', opacity: 0.3 }}>🔒</span>
          )}
          {isCompleted && (
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#00ff88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(0,255,136,0.6)',
              }}
            >
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1 5.5L5 9.5L13 1" stroke="#05050f" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {status === 'active' && !expanded && (
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.65rem',
                color: quest.accentColor,
                border: `1px solid ${quest.accentColor}66`,
                borderRadius: '3px',
                padding: '2px 6px',
              }}
            >
              ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8rem',
          color: isLocked ? '#2a2a3e' : '#888899',
          margin: '0 0 12px 0',
          lineHeight: 1.5,
        }}
      >
        {quest.subtitle}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <DifficultyStars difficulty={quest.difficulty} color={isLocked ? '#2a2a3e' : '#ffe500'} />
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.72rem',
            color: isLocked ? '#2a2a3e' : '#4a4a6a',
          }}
        >
          ⏱ {quest.estimatedMinutes}min
        </span>
        {isCompleted && (
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.72rem',
              color: '#00ff8866',
            }}
          >
            ✓ 已完成
          </span>
        )}
      </div>

      {/* Tech tags */}
      {!isLocked && <TechTags tags={quest.techPoints} color={quest.accentColor} max={3} />}

      {/* Progress bar for active */}
      {status === 'active' && (
        <div style={{ marginTop: '14px' }}>
          <div
            style={{
              height: '3px',
              background: '#1a1a2e',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: quest.accentColor,
                width: `${(progress.completedTasks.length / quest.tasks.length) * 100}%`,
                boxShadow: `0 0 8px ${quest.accentColor}88`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.65rem',
              color: '#4a4a6a',
              marginTop: '4px',
            }}
          >
            {progress.completedTasks.length}/{quest.tasks.length} 任务完成
          </div>
        </div>
      )}

      {/* Expand chevron */}
      {!isLocked && (
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '16px',
            color: isLocked ? '#1a1a2e' : `${quest.accentColor}88`,
            fontSize: '0.8rem',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </div>
      )}

      {/* Expandable detail */}
      <div
        style={{
          maxHeight: expanded ? '2000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
          marginTop: expanded ? '16px' : '0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {expanded && (
          <QuestDetail
            quest={quest}
            progress={progress}
            isVisible={expanded}
            onToggleTask={handleToggleTask}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
