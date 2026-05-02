import { useState, useCallback } from 'react';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { UnlockAnimation } from './components/ui/UnlockAnimation';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { QuestMap } from './components/quest/QuestMap';
import { QuestPage } from './components/quest/QuestPage';
import { TechStackSection } from './components/techstack/TechStackSection';
import { CharacterSelect } from './components/onboarding/CharacterSelect';
import { useQuestProgress } from './hooks/useQuestProgress';
import { quests } from './data/quests';
import { getCompletedCount, getTotalProgress, getCompletedMinutes } from './utils/questUtils';
import { getQuestProgress, loadProfile, saveProfile, clearProfile } from './utils/storage';
import type { PlayerProfile } from './types/quest';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(() => loadProfile());
  const { state, toggleTask, markQuestComplete, reset } = useQuestProgress();

  const handleProfileComplete = useCallback((p: PlayerProfile) => {
    saveProfile(p);
    setProfile(p);
  }, []);

  const handleChangeProfile = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  // null = overview, number = quest detail page
  const [activeQuestId, setActiveQuestId] = useState<number | null>(null);

  // celebration overlay
  const [celebratingQuest, setCelebratingQuest] = useState<number | null>(null);
  const [celebratingCount, setCelebratingCount] = useState(0);

  const completed = getCompletedCount(state, quests.length);
  const progress = getTotalProgress(state, quests.length);
  const completedMinutes = getCompletedMinutes(state, quests);

  const handleComplete = useCallback((questId: number) => {
    markQuestComplete(questId);
    const newCount = getCompletedCount(state, quests.length) + 1;
    setCelebratingCount(newCount);
    setCelebratingQuest(questId);
  }, [markQuestComplete, state]);

  // After celebration: auto-navigate to next quest if it exists
  const handleCelebrationDone = useCallback(() => {
    setCelebratingQuest(prev => {
      if (prev !== null) {
        const nextId = prev + 1;
        const hasNext = quests.some(q => q.id === nextId);
        if (hasNext) setActiveQuestId(nextId);
        else setActiveQuestId(null); // all done, go back to overview
      }
      return null;
    });
  }, []);

  const activeQuest = activeQuestId !== null ? quests.find(q => q.id === activeQuestId) : null;
  const activeProgress = activeQuestId !== null ? getQuestProgress(state, activeQuestId) : null;

  if (!profile) {
    return <CharacterSelect onComplete={handleProfileComplete} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ParticleBackground />
      <UnlockAnimation
        completedQuestId={celebratingQuest}
        completedCount={celebratingCount}
        onDone={handleCelebrationDone}
      />

      {/* ── Quest detail page ── */}
      {activeQuest && activeProgress ? (
        <>
          <Header completed={completed} total={quests.length} onReset={reset} profile={profile} onChangeProfile={handleChangeProfile} />
          <QuestPage
            quest={activeQuest}
            progress={activeProgress}
            totalQuests={quests.length}
            onToggleTask={taskId => toggleTask(activeQuest.id, taskId)}
            onComplete={() => handleComplete(activeQuest.id)}
            onBack={() => setActiveQuestId(null)}
            onNextQuest={
              activeQuest.id < quests.length
                ? () => setActiveQuestId(activeQuest.id + 1)
                : undefined
            }
          />
        </>
      ) : (
        /* ── Overview ── */
        <>
          <Header completed={completed} total={quests.length} onReset={reset} profile={profile} onChangeProfile={handleChangeProfile} />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 5vh, 48px)' }}>
            <HeroSection
              progress={progress}
              completed={completed}
              total={quests.length}
              completedMinutes={completedMinutes}
            />

            <div style={{ position: 'relative', zIndex: 1, paddingBottom: 'clamp(24px, 5vh, 48px)' }}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.3em', color: '#4a4a6a',
                textTransform: 'uppercase', textAlign: 'center', marginBottom: '28px',
              }}>
                — 选择关卡 —
              </div>
              <QuestMap
                quests={quests}
                state={state}
                onSelectQuest={setActiveQuestId}
              />
            </div>

            <TechStackSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
