import type { AppState, QuestProgress, PlayerProfile } from '../types/quest';

const STORAGE_KEY = 'ai-agent-quest-v1';

const defaultState = (): AppState => ({
  questProgresses: {
    1: { status: 'active', completedTasks: [] },
  },
  lastUpdated: Date.now(),
});

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }));
}

export function resetState(): AppState {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}

export function getQuestProgress(state: AppState, questId: number): QuestProgress {
  return state.questProgresses[questId] ?? { status: 'locked', completedTasks: [] };
}

const PROFILE_KEY = 'ai-agent-quest-profile-v1';

export function loadProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as PlayerProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}
