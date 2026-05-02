export type QuestStatus = 'locked' | 'active' | 'completed';

export interface QuestTask {
  id: string;
  description: string;
}

export type DemoLineType = 'cmd' | 'output' | 'comment' | 'blank' | 'success' | 'error';

export interface DemoLine {
  type: DemoLineType;
  text: string;
  delay?: number; // extra pause before this line (ms)
}

export interface Quest {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  techPoints: string[];
  description: string;
  tasks: QuestTask[];
  outputArtifacts: string[];
  accentColor: string;
  demoLines: DemoLine[]; // terminal demo script
  videoUrl?: string;     // replace placeholder later
}

export interface QuestProgress {
  status: QuestStatus;
  completedTasks: string[];
  startedAt?: number;
  completedAt?: number;
}

export interface AppState {
  questProgresses: Record<number, QuestProgress>;
  lastUpdated: number;
}

export interface PlayerProfile {
  jobRole: string;
  gameRole: string;
  gameRoleId: string;
}
