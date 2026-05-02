import type { AppState, Quest, QuestStatus } from '../types/quest';
import { getQuestProgress } from './storage';

export function getQuestStatus(state: AppState, questId: number): QuestStatus {
  return getQuestProgress(state, questId).status;
}

export function getCompletedCount(state: AppState, totalQuests: number): number {
  let count = 0;
  for (let i = 1; i <= totalQuests; i++) {
    if (getQuestStatus(state, i) === 'completed') count++;
  }
  return count;
}

export function getTotalProgress(state: AppState, totalQuests: number): number {
  return Math.round((getCompletedCount(state, totalQuests) / totalQuests) * 100);
}

export function getTotalEstimatedMinutes(quests: Quest[]): number {
  return quests.reduce((sum, q) => sum + q.estimatedMinutes, 0);
}

export function getCompletedMinutes(state: AppState, quests: Quest[]): number {
  return quests
    .filter((q) => getQuestStatus(state, q.id) === 'completed')
    .reduce((sum, q) => sum + q.estimatedMinutes, 0);
}
