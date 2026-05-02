import { useEffect, useRef, useState } from 'react';
import type { DemoLine } from '../../types/quest';

interface Props {
  lines: DemoLine[];
  accentColor: string;
  isVisible: boolean;
}

const CHAR_SPEED = 32;   // ms per char for cmd lines
const LINE_PAUSE = 200;  // ms between non-cmd lines

const FIXED_COLOR: Record<string, string> = {
  cmd:     '#e0e0f0',
  output:  '#777799',
  comment: '#3a3a5a',
  blank:   'transparent',
  success: '#00ff88',
  error:   '#ff3ea5',
};

export function QuestTerminalDemo({ lines, accentColor, isVisible }: Props) {
  // Each entry: fully-rendered line shown on screen
  const [rows, setRows] = useState<{ text: string; type: string }[]>([]);
  const [blink, setBlink] = useState(true);
  // Increment to restart the animation
  const [playCount, setPlayCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Cursor blink — independent interval
  useEffect(() => {
    const id = setInterval(() => setBlink(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [rows]);

  // Main animation driver
  useEffect(() => {
    if (!isVisible) return;

    setRows([]);

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const delay = (ms: number) => new Promise<void>(resolve => {
      const t = setTimeout(() => { if (!cancelled) resolve(); }, ms);
      timers.push(t);
    });

    async function run() {
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) break;
        const line = lines[i];

        if (line.delay) await delay(line.delay);

        if (line.type === 'cmd') {
          // Push empty row first, then type chars one by one
          setRows(prev => [...prev, { text: '', type: 'cmd' }]);
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelled) break;
            await delay(CHAR_SPEED);
            const slice = line.text.slice(0, c);
            setRows(prev => {
              const next = [...prev];
              next[next.length - 1] = { text: slice, type: 'cmd' };
              return next;
            });
          }
          await delay(LINE_PAUSE);
        } else {
          await delay(line.type === 'blank' ? 60 : LINE_PAUSE);
          setRows(prev => [...prev, { text: line.text, type: line.type }]);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  // playCount triggers a fresh run; isVisible triggers on first expand
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, playCount]);

  const done = rows.length >= lines.length;
  const lastRow = rows[rows.length - 1];
  const showTrailingCursor = !done && lastRow && lastRow.type !== 'cmd';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 14px',
        background: '#111122',
        borderBottom: `1px solid ${accentColor}22`,
        borderRadius: '8px 8px 0 0',
        flexShrink: 0,
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.68rem', color: '#333355', marginLeft: '8px',
        }}>
          bash
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem' }}>
          {done
            ? <span style={{ color: '#00ff88' }}>✓ done</span>
            : <span style={{ color: accentColor, animation: 'continuePulse 1.2s ease-in-out infinite' }}>● running</span>
          }
        </span>
      </div>

      {/* Body */}
      <div style={{
        overflowY: 'auto',
        padding: '14px 16px',
        background: '#05050f',
        borderRadius: '0 0 8px 8px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.78rem',
        lineHeight: 1.75,
        minHeight: '300px',
        maxHeight: '380px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${accentColor}22 transparent`,
      }}>
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const isCmd = row.type === 'cmd';
          const color = FIXED_COLOR[row.type] ?? '#e0e0f0';
          const isTyping = isLast && !done && isCmd;

          return (
            <div key={i} style={{ display: 'flex', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {/* Prefix */}
              <span style={{
                color: isCmd ? accentColor : '#222244',
                userSelect: 'none', flexShrink: 0, marginRight: '2px',
              }}>
                {isCmd ? '$' : ' '}
              </span>
              <span style={{ color, marginLeft: isCmd ? '6px' : '0' }}>
                {row.text}
                {isTyping && (
                  <span style={{ opacity: blink ? 1 : 0, color: accentColor }}>▋</span>
                )}
              </span>
            </div>
          );
        })}

        {/* Cursor between non-cmd lines */}
        {showTrailingCursor && (
          <div style={{ display: 'flex' }}>
            <span style={{ color: accentColor, userSelect: 'none', marginRight: '6px' }}>$</span>
            <span style={{ opacity: blink ? 1 : 0, color: accentColor }}>▋</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Replay */}
      {done && (
        <button
          onClick={() => { setPlayCount(c => c + 1); }}
          style={{
            marginTop: '8px', alignSelf: 'flex-start',
            background: 'transparent',
            border: `1px solid ${accentColor}44`,
            borderRadius: '4px',
            color: accentColor,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            padding: '5px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.05em',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}18`;
            (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = `${accentColor}44`;
          }}
        >
          ↺ 重放演示
        </button>
      )}
    </div>
  );
}
