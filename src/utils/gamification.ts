import type { BadgeDefinition, QuizAttempt, StudentProgress } from '../types';

export const STORAGE_KEY = 'pipas_interactive_lab_progress_v1';
export const TEACHER_PIN = '123456';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'master_besaran',
    title: 'Master Besaran',
    description: 'Menemukan seluruh 5 alat ukur di Zona 1 dan menyelesaikan eksperimen satuan baku.',
    xpBonus: 50,
    iconName: 'compass',
  },
  {
    id: 'ahli_satuan_si',
    title: 'Ahli Satuan SI',
    description: 'Mengeksplorasi ketujuh Besaran Pokok SI di Zona 2.',
    xpBonus: 60,
    iconName: 'atom',
  },
  {
    id: 'detektif_pengukuran',
    title: 'Detektif Pengukuran',
    description: 'Menyelesaikan latihan pada minimal 4 alat ukur virtual di Zona 3.',
    xpBonus: 80,
    iconName: 'ruler',
  },
  {
    id: 'raja_konversi',
    title: 'Raja Konversi',
    description: 'Melakukan minimal 5 konversi satuan di Zona 5 atau meraih 3 bintang di Misi Konversi Kilat.',
    xpBonus: 60,
    iconName: 'calculator',
  },
  {
    id: 'ilmuwan_muda',
    title: 'Ilmuwan Muda',
    description: 'Menyelesaikan seluruh 5 Tantangan Misi Sains di Zona 6.',
    xpBonus: 100,
    iconName: 'trophy',
  },
  {
    id: 'sang_juara_kuis',
    title: 'Ahli Evaluasi PIPAS',
    description: 'Meraih nilai minimal 80 pada Kuis Final 20 soal di Zona 7.',
    xpBonus: 100,
    iconName: 'award',
  },
];

export const LEVEL_TITLES = [
  'Kadet Laboratorium',
  'Asisten Praktikum',
  'Pengamat Besaran',
  'Teknisi Kalibrasi',
  'Analis Pengukuran',
  'Peneliti Muda SMK',
  'Spesialis Metrologi',
  'Inovator Sains',
  'Master PIPAS',
  'Ilmuwan Utama',
];

export function createInitialProgress(): StudentProgress {
  return {
    studentName: 'Siswa Kelas X SMK',
    xp: 0,
    soundEnabled: true,
    visitedZones: ['dashboard'],
    zona1DiscoveredObjects: [],
    zona1CompletedExperiment: false,
    zona2ExploredQuantities: [],
    zona3CompletedTools: [],
    zona4CalculatedTypes: [],
    zona5CompletedConversions: 0,
    missions: {
      misi1: { missionId: 'misi1', title: 'Tebak Besaran', completed: false, bestScore: 0, maxScore: 5, stars: 0, attempts: 0, lastPlayedAt: '' },
      misi2: { missionId: 'misi2', title: 'Pasangkan Satuan', completed: false, bestScore: 0, maxScore: 7, stars: 0, attempts: 0, lastPlayedAt: '' },
      misi3: { missionId: 'misi3', title: 'Detektif Pengukuran', completed: false, bestScore: 0, maxScore: 3, stars: 0, attempts: 0, lastPlayedAt: '' },
      misi4: { missionId: 'misi4', title: 'Konversi Kilat', completed: false, bestScore: 0, maxScore: 5, stars: 0, attempts: 0, lastPlayedAt: '' },
      misi5: { missionId: 'misi5', title: 'Hitung Besaran Turunan', completed: false, bestScore: 0, maxScore: 4, stars: 0, attempts: 0, lastPlayedAt: '' },
    },
    quizHistory: [],
    unlockedBadges: [],
    awardedMilestones: [],
  };
}

export function calculateLevelInfo(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeXp = Math.max(0, Math.floor(xp));
  const xpPerLevel = 150;
  const level = Math.min(LEVEL_TITLES.length, Math.floor(safeXp / xpPerLevel) + 1);
  const currentLevelMin = (level - 1) * xpPerLevel;
  const isMax = level === LEVEL_TITLES.length;
  const currentLevelXp = safeXp - currentLevelMin;
  const progressPercent = isMax ? 100 : Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));

  return {
    level,
    title: LEVEL_TITLES[level - 1],
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent,
  };
}

export function calculateStars(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  const ratio = score / maxScore;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.65) return 2;
  if (ratio >= 0.4) return 1;
  return 0;
}

export function gradeQuizScore(
  correctCount: number,
  totalQuestions: number
): {
  score: number;
  category: QuizAttempt['category'];
} {
  if (totalQuestions <= 0) {
    return { score: 0, category: 'Perlu Berlatih Lagi' };
  }
  const score = Math.round((correctCount / totalQuestions) * 100);
  let category: QuizAttempt['category'] = 'Perlu Berlatih Lagi';
  if (score >= 90) category = 'Ahli Pengukuran';
  else if (score >= 80) category = 'Peneliti Muda';
  else if (score >= 70) category = 'Penjelajah Sains';

  return { score, category };
}

export function evaluateUnlockedBadges(progress: StudentProgress): string[] {
  const badges = new Set(progress.unlockedBadges);

  if (progress.zona1DiscoveredObjects.length >= 5 && progress.zona1CompletedExperiment) {
    badges.add('master_besaran');
  }
  if (progress.zona2ExploredQuantities.length >= 7) {
    badges.add('ahli_satuan_si');
  }
  if (progress.zona3CompletedTools.length >= 4) {
    badges.add('detektif_pengukuran');
  }
  if (progress.zona5CompletedConversions >= 5 || progress.missions.misi4?.stars === 3) {
    badges.add('raja_konversi');
  }
  const allMissionsDone = Object.values(progress.missions).every((m) => m.completed);
  if (allMissionsDone) {
    badges.add('ilmuwan_muda');
  }
  if (progress.quizHistory.some((q) => q.score >= 80)) {
    badges.add('sang_juara_kuis');
  }

  return Array.from(badges);
}

export function calculateOverallCompletion(progress: StudentProgress): number {
  // 7 learning zones weighted evenly
  const z1 = Math.min(1, (progress.zona1DiscoveredObjects.length + (progress.zona1CompletedExperiment ? 1 : 0)) / 6);
  const z2 = Math.min(1, progress.zona2ExploredQuantities.length / 7);
  const z3 = Math.min(1, progress.zona3CompletedTools.length / 6);
  const z4 = Math.min(1, progress.zona4CalculatedTypes.length / 4);
  const z5 = Math.min(1, progress.zona5CompletedConversions / 3);
  const completedMissions = Object.values(progress.missions).filter((m) => m.completed).length;
  const z6 = Math.min(1, completedMissions / 5);
  const z7 = progress.quizHistory.length > 0 ? 1 : 0;

  const avg = (z1 + z2 + z3 + z4 + z5 + z6 + z7) / 7;
  return Math.round(avg * 100);
}

export function loadProgressFromStorage(): StudentProgress {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createInitialProgress();
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const base = createInitialProgress();
    return {
      ...base,
      ...parsed,
      missions: {
        ...base.missions,
        ...(parsed.missions ?? {}),
      },
    };
  } catch {
    return createInitialProgress();
  }
}

export function saveProgressToStorage(progress: StudentProgress): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch {
    // ignore quota errors
  }
}
