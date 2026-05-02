import type { QuestTask } from '../../types/quest';

interface TaskChecklistProps {
  tasks: QuestTask[];
  completedTasks: string[];
  accentColor: string;
  onToggle: (taskId: string) => void;
}

export function TaskChecklist({ tasks, completedTasks, accentColor, onToggle }: TaskChecklistProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {tasks.map((task) => {
        const done = completedTasks.includes(task.id);
        return (
          <label
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              padding: '8px 10px',
              borderRadius: '4px',
              background: done ? `${accentColor}0d` : 'transparent',
              border: `1px solid ${done ? accentColor + '33' : '#1a1a2e'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <div
              onClick={() => onToggle(task.id)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '3px',
                border: `1.5px solid ${done ? accentColor : '#2a2a3e'}`,
                background: done ? accentColor : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1px',
                boxShadow: done ? `0 0 8px ${accentColor}66` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#05050f" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: done ? '#4a4a6a' : '#c0c0d0',
                textDecoration: done ? 'line-through' : 'none',
                lineHeight: 1.5,
                transition: 'all 0.2s ease',
              }}
            >
              {task.description}
            </span>
          </label>
        );
      })}
    </div>
  );
}
