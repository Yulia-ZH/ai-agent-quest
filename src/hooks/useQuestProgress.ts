import { useState, useCallback, useRef } from 'react';
import type { AppState } from '../types/quest';
import { loadState, saveState, resetState, getQuestProgress } from '../utils/storage';
import { quests } from '../data/quests';

export function useQuestProgress() {
  const [state, setState] = useState<AppState>(() => loadState());
  // Keep a ref so callbacks always read the latest state without stale closures
  const stateRef = useRef(state);

  const update = useCallback((next: AppState) => {
    stateRef.current = next;
    saveState(next);
    setState(next);
  }, []);

  const toggleTask = useCallback(
    (questId: number, taskId: string) => {
      const current = stateRef.current;
      const progress = getQuestProgress(current, questId);
      const has = progress.completedTasks.includes(taskId);
      const completedTasks = has
        ? progress.completedTasks.filter((id) => id !== taskId)
        : [...progress.completedTasks, taskId];

      update({
        ...current,
        questProgresses: {
          ...current.questProgresses,
          [questId]: { ...progress, completedTasks },
        },
      });
    },
    [update]
  );

  const markQuestComplete = useCallback(
    (questId: number): boolean => {
      const current = stateRef.current;
      const progress = getQuestProgress(current, questId);
      const nextId = questId + 1;
      const hasNext = quests.some((q) => q.id === nextId);

      const nextProgresses: AppState['questProgresses'] = {
        ...current.questProgresses,
        [questId]: { ...progress, status: 'completed', completedAt: Date.now() },
      };

      if (hasNext && !current.questProgresses[nextId]) {
        nextProgresses[nextId] = { status: 'active', completedTasks: [], startedAt: Date.now() };
      } else if (hasNext && current.questProgresses[nextId]?.status === 'locked') {
        nextProgresses[nextId] = {
          ...current.questProgresses[nextId],
          status: 'active',
          startedAt: Date.now(),
        };
      }

      update({ ...current, questProgresses: nextProgresses });
      return hasNext;
    },
    [update]
  );

  const reset = useCallback(() => {
    const fresh = resetState();
    stateRef.current = fresh;
    setState(fresh);
  }, []);

  return { state, toggleTask, markQuestComplete, reset };
}
