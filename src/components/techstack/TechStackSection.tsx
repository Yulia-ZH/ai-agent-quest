const STACK = [
  { name: 'Python 3.11', desc: '开发语言', color: '#3776ab', icon: '🐍' },
  { name: 'LangChain 1.x', desc: 'Agent 框架', color: '#00d4ff', icon: '⛓️' },
  { name: 'LangGraph', desc: '状态机 Agent', color: '#b44eff', icon: '📊' },
  { name: 'LangSmith', desc: '链路追踪', color: '#ff6b35', icon: '🔍' },
  { name: 'FastAPI', desc: 'API 服务', color: '#009688', icon: '⚡' },
  { name: 'Docker', desc: '容器化部署', color: '#2496ed', icon: '🐳' },
  { name: 'GitHub Actions', desc: 'CI/CD 自动化', color: '#6e40c9', icon: '🤖' },
  { name: 'OpenAI API', desc: 'LLM 基座', color: '#00a67e', icon: '🧠' },
];

export function TechStackSection() {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        padding: 'clamp(40px, 6vh, 64px) 20px',
        borderTop: '1px solid #1a1a2e',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: '#4a4a6a',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          技术栈全景
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '12px',
          }}
        >
          {STACK.map((item) => (
            <div
              key={item.name}
              style={{
                background: '#0a0a14',
                border: `1px solid #1a1a2e`,
                borderRadius: '8px',
                padding: '16px 12px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = item.color + '55';
                el.style.boxShadow = `0 0 16px ${item.color}22`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#1a1a2e';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: '4px',
                  letterSpacing: '0.05em',
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.7rem',
                  color: '#4a4a6a',
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
