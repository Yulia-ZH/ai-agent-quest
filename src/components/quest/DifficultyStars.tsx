interface DifficultyStarsProps {
  difficulty: 1 | 2 | 3 | 4 | 5;
  color?: string;
}

export function DifficultyStars({ difficulty, color = '#ffe500' }: DifficultyStarsProps) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: '0.75rem',
            color: i <= difficulty ? color : '#2a2a3e',
            textShadow: i <= difficulty ? `0 0 6px ${color}88` : 'none',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
