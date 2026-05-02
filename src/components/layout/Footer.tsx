export function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid #1a1a2e',
        padding: '20px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.75rem',
          color: '#2a2a3e',
        }}
      >
        <span style={{ color: '#00ff8844' }}>// </span>
        AI Agent 闯关 · LangChain 1.x · 手把手实战 · 拿下 Agent 开发能力
        <span style={{ color: '#00ff8844' }}> //</span>
      </div>
    </footer>
  );
}
