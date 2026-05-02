interface TechTagsProps {
  tags: string[];
  color: string;
  max?: number;
}

export function TechTags({ tags, color, max = 3 }: TechTagsProps) {
  const visible = tags.slice(0, max);
  const extra = tags.length - max;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {visible.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '3px',
            border: `1px solid ${color}44`,
            color: color,
            background: `${color}0d`,
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '3px',
            border: '1px solid #2a2a3e',
            color: '#4a4a6a',
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
