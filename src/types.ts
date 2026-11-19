export type ZoneId =
  | 'dashboard'
  | 'zona1'
  | 'zona2'
  | 'zona3'
  | 'zona4'
  | 'zona5'
  | 'zona6'
  | 'zona7'
  | 'guru';

export type LabToolId =
  | 'penggaris'
  | 'jangka_sorong'
  | 'mikrometer'
  | 'timbangan'
  | 'stopwatch'
  | 'gelas_ukur';

export type UnitCategory = 'panjang' | 'massa' | 'waktu' | 'volume' | 'suhu';

export type DerivedQuantityType =
  | 'luas'
  | 'volume'
  | 'kecepatan'
  | 'percepatan'
  | 'gaya'
  | 'massa_jenis'
  | 'tekanan';

export interface MissionResult {
  missionId: string;
  title: string;
  completed: boolean;
  bestScore: number;
  maxScore: number;
  stars: number; // 0 to 3
  attempts: number;
  lastPlayedAt: string;
}

export interface QuizAttempt {
  score: number; // 0 to 100
  correctCount: number;
  totalQuestions: number;
  category: 'Ahli Pengukuran' | 'Peneliti Muda' | 'Penjelajah Sains' | 'Perlu Berlatih Lagi';
  timeSpentSeconds: number;
  completedAt: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
  iconName: 'compass' | 'atom' | 'ruler' | 'calculator' | 'trophy' | 'award';
}

export interface StudentProgress {
  studentName: string;
  xp: number;
  soundEnabled: boolean;
  visitedZones: ZoneId[];
  zona1DiscoveredObjects: string[];
  zona1CompletedExperiment: boolean;
  zona2ExploredQuantities: string[];
  zona3CompletedTools: LabToolId[];
  zona4CalculatedTypes: DerivedQuantityType[];
  zona5CompletedConversions: number;
  missions: Record<string, MissionResult>;
  quizHistory: QuizAttempt[];
  unlockedBadges: string[];
  awardedMilestones: string[];
}
