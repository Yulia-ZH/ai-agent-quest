import { useState } from 'react';
import type { PlayerProfile } from '../../types/quest';
import { ParticleBackground } from '../ui/ParticleBackground';
import { GlowButton } from '../ui/GlowButton';

// ── Data ─────────────────────────────────────────────────────

const JOB_ROLES = [
  { id: 'frontend',  label: '前端工程师',   icon: '🖥️',  desc: 'React / Vue / 浏览器' },
  { id: 'backend',   label: '后端工程师',   icon: '⚙️',  desc: 'API / 数据库 / 服务' },
  { id: 'test',      label: '测试工程师',   icon: '🧪',  desc: '自动化 / 质量保障' },
  { id: 'fullstack', label: '全栈工程师',   icon: '🔀',  desc: '前后端通吃' },
  { id: 'mobile',    label: '移动端工程师', icon: '📱',  desc: 'iOS / Android / RN' },
  { id: 'data',      label: '数据工程师',   icon: '📊',  desc: '数据管道 / 分析 / ML' },
];

const GAME_ROLES = [
  {
    id: 'knight',
    name: '代码骑士',
    icon: '⚔️',
    color: '#00d4ff',
    tagline: '先 commit，再想清楚',
    skills: ['快速原型', '硬编码突破', '行动力MAX'],
    lore: '无论多复杂的需求，代码骑士永远第一个写出 demo。他们的信条是：跑起来的烂代码，胜过完美的草稿。',
  },
  {
    id: 'mage',
    name: '算法法师',
    icon: '🔮',
    color: '#b44eff',
    tagline: '一切皆可抽象',
    skills: ['数学建模', '复杂度优化', '优雅设计'],
    lore: '算法法师用数学和逻辑看穿一切问题的本质。他们在脑海中推演十遍再下笔，每一行代码都经过缜密推理。',
  },
  {
    id: 'hunter',
    name: 'Bug 猎手',
    icon: '🗡️',
    color: '#ff3ea5',
    tagline: '没有找不到的 bug',
    skills: ['边界探测', '压力测试', '漏洞嗅觉'],
    lore: 'Bug 猎手天生对异常状态敏感。他们的眼睛能在百万行日志中一眼锁定异常，让系统在上线前就无所遁形。',
  },
  {
    id: 'captain',
    name: '架构舰长',
    icon: '🛸',
    color: '#ffe500',
    tagline: '先搭骨架，再填血肉',
    skills: ['系统设计', '模块拆分', '技术选型'],
    lore: '架构舰长站在最高处俯瞰整个系统。他们规划服务边界、数据流向和扩展路径，让团队在正确的轨道上全速前进。',
  },
  {
    id: 'alchemist',
    name: '数据炼金师',
    icon: '🧬',
    color: '#ff6b35',
    tagline: '从噪音中炼出黄金',
    skills: ['特征工程', '数据清洗', '指标设计'],
    lore: '数据炼金师把杂乱的原始数据变成洞见。他们为 Agent 提供高质量的知识燃料，让 AI 的每一次推理都有据可依。',
  },
  {
    id: 'ninja',
    name: '全栈忍者',
    icon: '🥷',
    color: '#00ff88',
    tagline: '无处不在，无所不能',
    skills: ['快速切换', '端到端', '独立交付'],
    lore: '全栈忍者在前端和后端之间闪烁无影。他们能独立完成从数据库到 UI 的完整链路，是团队中最不可缺少的人。',
  },
];

// ── Sub-components ────────────────────────────────────────────

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
      {[1, 2].map(n => (
        <div key={n} style={{
          width: n === step ? '24px' : '8px',
          height: '8px', borderRadius: '4px',
          background: n === step ? '#00d4ff' : '#1a1a2e',
          boxShadow: n === step ? '0 0 8px #00d4ff88' : 'none',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

interface Props {
  onComplete: (profile: PlayerProfile) => void;
}

export function CharacterSelect({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const activeGame = GAME_ROLES.find(r => r.id === (hoveredGame ?? selectedGame));

  const handleConfirm = () => {
    if (!selectedJob || !selectedGame) return;
    const gameRole = GAME_ROLES.find(r => r.id === selectedGame)!;
    const jobRole  = JOB_ROLES.find(r => r.id === selectedJob)!;
    onComplete({
      jobRole: jobRole.label,
      gameRole: gameRole.name,
      gameRoleId: selectedGame,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#05050f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      overflowY: 'auto',
    }}>
      <ParticleBackground />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '900px',
        padding: 'clamp(32px, 6vh, 60px) 24px 60px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Header */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.3em',
          color: '#00d4ff', textTransform: 'uppercase',
          marginBottom: '12px',
          textShadow: '0 0 10px #00d4ff88',
        }}>
          AI AGENT 闯关 · 角色创建
        </div>

        <h1 style={{
          fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          color: '#f0f0ff', margin: '0 0 8px',
          letterSpacing: '0.06em', textAlign: 'center',
        }}>
          {step === 1 ? '选择你的职业' : '选择你的游戏角色'}
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
          color: '#555577', marginBottom: '28px', textAlign: 'center',
        }}>
          {step === 1
            ? '你的真实职业定位，帮助我们为你定制学习路径'
            : '你的战斗风格，影响你在闯关中的专属称号'}
        </p>

        <StepDots step={step} />

        {/* ── Step 1: Job roles ── */}
        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px', width: '100%', marginBottom: '32px',
          }}>
            {JOB_ROLES.map(role => {
              const active = selectedJob === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedJob(role.id)}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '8px',
                    border: `1px solid ${active ? '#00d4ff' : '#1a1a2e'}`,
                    background: active ? 'rgba(0,212,255,0.08)' : '#0a0a16',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? '0 0 16px rgba(0,212,255,0.25)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (active) return;
                    (e.currentTarget as HTMLElement).style.borderColor = '#00d4ff55';
                    (e.currentTarget as HTMLElement).style.background = '#0d0d20';
                  }}
                  onMouseLeave={e => {
                    if (active) return;
                    (e.currentTarget as HTMLElement).style.borderColor = '#1a1a2e';
                    (e.currentTarget as HTMLElement).style.background = '#0a0a16';
                  }}
                >
                  <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{role.icon}</span>
                  <div>
                    <div style={{
                      fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
                      fontSize: '0.88rem', color: active ? '#00d4ff' : '#c0c0d8',
                      letterSpacing: '0.04em', marginBottom: '3px',
                      textShadow: active ? '0 0 8px #00d4ff66' : 'none',
                    }}>
                      {role.label}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.7rem', color: active ? '#00d4ff88' : '#333355',
                    }}>
                      {role.desc}
                    </div>
                  </div>
                  {active && (
                    <div style={{
                      marginLeft: 'auto', width: 20, height: 20,
                      borderRadius: '50%', background: '#00d4ff', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 8px #00d4ffaa',
                    }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#05050f" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Step 2: Game roles ── */}
        {step === 2 && (
          <div style={{ width: '100%', display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}
            className="game-role-layout"
          >
            {/* Left: grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px', flex: '1 1 340px',
            }}>
              {GAME_ROLES.map(role => {
                const active = selectedGame === role.id;
                const hovered = hoveredGame === role.id;
                const highlight = active || hovered;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedGame(role.id)}
                    onMouseEnter={() => setHoveredGame(role.id)}
                    onMouseLeave={() => setHoveredGame(null)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `1px solid ${active ? role.color : highlight ? role.color + '55' : '#1a1a2e'}`,
                      background: active
                        ? `${role.color}10`
                        : highlight ? `${role.color}06` : '#0a0a16',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: active ? `0 0 20px ${role.color}33` : 'none',
                      display: 'flex', flexDirection: 'column', gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '1.6rem',
                        filter: active ? `drop-shadow(0 0 8px ${role.color}88)` : 'none',
                        transition: 'filter 0.2s',
                      }}>
                        {role.icon}
                      </span>
                      <div>
                        <div style={{
                          fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
                          fontSize: '0.82rem',
                          color: active ? role.color : highlight ? role.color + 'cc' : '#a0a0c0',
                          letterSpacing: '0.04em',
                          textShadow: active ? `0 0 8px ${role.color}66` : 'none',
                        }}>
                          {role.name}
                        </div>
                        <div style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: '0.65rem',
                          color: active ? role.color + '99' : '#2a2a44',
                        }}>
                          {role.tagline}
                        </div>
                      </div>
                      {active && (
                        <div style={{
                          marginLeft: 'auto', width: 18, height: 18,
                          borderRadius: '50%', background: role.color, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 0 8px ${role.color}aa`,
                        }}>
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3 5.5L8 1" stroke="#05050f" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {role.skills.map(s => (
                        <span key={s} style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: '0.6rem', padding: '2px 7px',
                          borderRadius: '3px',
                          border: `1px solid ${active ? role.color + '44' : '#1a1a2e'}`,
                          color: active ? role.color + 'cc' : '#2a2a44',
                          background: active ? role.color + '0a' : 'transparent',
                          transition: 'all 0.2s',
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: detail panel */}
            <div style={{
              flex: '0 0 220px',
              border: `1px solid ${activeGame ? activeGame.color + '33' : '#1a1a2e'}`,
              borderRadius: '10px',
              background: activeGame ? `${activeGame.color}06` : '#090912',
              padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: '16px',
              transition: 'border-color 0.3s, background 0.3s',
              alignSelf: 'flex-start',
            }}>
              {activeGame ? (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '3.5rem', lineHeight: 1, marginBottom: '12px',
                      filter: `drop-shadow(0 0 16px ${activeGame.color}88)`,
                    }}>
                      {activeGame.icon}
                    </div>
                    <div style={{
                      fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
                      fontSize: '1rem', color: activeGame.color,
                      textShadow: `0 0 12px ${activeGame.color}66`,
                      letterSpacing: '0.06em', marginBottom: '4px',
                    }}>
                      {activeGame.name}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.7rem', color: activeGame.color + '88',
                      fontStyle: 'italic',
                    }}>
                      「{activeGame.tagline}」
                    </div>
                  </div>

                  <div style={{
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${activeGame.color}44, transparent)`,
                  }} />

                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                    color: '#666688', lineHeight: 1.7, margin: 0,
                  }}>
                    {activeGame.lore}
                  </p>

                  <div>
                    <div style={{
                      fontFamily: 'Orbitron, sans-serif', fontSize: '0.58rem',
                      letterSpacing: '0.2em', color: activeGame.color,
                      textTransform: 'uppercase', marginBottom: '8px',
                    }}>
                      核心技能
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeGame.skills.map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: `${[85, 72, 90][i] ?? 80}%`,
                            height: '4px', background: '#1a1a2e',
                            borderRadius: '2px', overflow: 'hidden', flex: '0 0 auto',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${[85, 72, 90][i] ?? 80}%`,
                              background: activeGame.color,
                              boxShadow: `0 0 6px ${activeGame.color}`,
                              borderRadius: '2px',
                            }} />
                          </div>
                          <span style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '0.68rem', color: '#4a4a6a', whiteSpace: 'nowrap',
                          }}>
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '20px 0',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.75rem', color: '#2a2a3e',
                  lineHeight: 2,
                }}>
                  悬停或点击<br />选择角色<br />查看详情
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a3e',
                borderRadius: '4px',
                color: '#4a4a6a',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.78rem', padding: '10px 20px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#4a4a6a';
                (e.currentTarget as HTMLElement).style.color = '#8888aa';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2a2a3e';
                (e.currentTarget as HTMLElement).style.color = '#4a4a6a';
              }}
            >
              ← 上一步
            </button>
          )}

          {step === 1 ? (
            <GlowButton
              onClick={() => selectedJob && setStep(2)}
              color="#00d4ff"
              disabled={!selectedJob}
              size="lg"
            >
              下一步：选择游戏角色 →
            </GlowButton>
          ) : (
            <GlowButton
              onClick={handleConfirm}
              color={selectedGame ? (GAME_ROLES.find(r => r.id === selectedGame)?.color ?? '#00ff88') : '#00ff88'}
              disabled={!selectedGame}
              size="lg"
            >
              确认角色，开始闯关 ✓
            </GlowButton>
          )}
        </div>

        {/* Step hint */}
        <div style={{
          marginTop: '20px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.68rem', color: '#1e1e30',
        }}>
          步骤 {step} / 2
          {step === 1 && selectedJob && (
            <span style={{ color: '#2a2a4e' }}> · 已选：{JOB_ROLES.find(r => r.id === selectedJob)?.label}</span>
          )}
          {step === 2 && selectedGame && (
            <span style={{ color: '#2a2a4e' }}> · 已选：{GAME_ROLES.find(r => r.id === selectedGame)?.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
