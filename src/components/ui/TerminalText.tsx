import { useState, useEffect } from 'react';

const LINES = [
  'pip install langchain langchain-openai',
  'from langchain_openai import ChatOpenAI',
  'chain = prompt | model | StrOutputParser()',
  '@tool def search_web(query: str) -> str:',
  'agent = create_tool_calling_agent(llm, tools)',
  'graph = StateGraph(MessagesState)',
  'docker build -t my-agent . && docker run ...',
  'git commit -m "feat: add ai agent" && gh pr create',
];

export function TerminalText() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursor = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(cursor);
  }, []);

  useEffect(() => {
    const current = LINES[lineIndex];
    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIndex((i) => (i + 1) % LINES.length);
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex]);

  return (
    <div
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: '#a8ff78',
        fontSize: '0.875rem',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #1a1a2e',
        borderRadius: '6px',
        padding: '12px 16px',
        minWidth: '360px',
      }}
    >
      <span style={{ color: '#00d4ff' }}>$ </span>
      <span>{LINES[lineIndex].slice(0, charIndex)}</span>
      <span style={{ opacity: showCursor ? 1 : 0, color: '#00ff88' }}>▋</span>
    </div>
  );
}
