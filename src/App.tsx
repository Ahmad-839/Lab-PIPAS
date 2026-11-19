import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { Zona1KenaliBesaran } from './components/Zona1KenaliBesaran';
import { Zona2BesaranPokok } from './components/Zona2BesaranPokok';
import { Zona3LabVirtual } from './components/Zona3LabVirtual';
import { Zona4BesaranTurunan } from './components/Zona4BesaranTurunan';
import { Zona5KonversiSatuan } from './components/Zona5KonversiSatuan';
import { Zona6TantanganMisi } from './components/Zona6TantanganMisi';
import { Zona7KuisFinal } from './components/Zona7KuisFinal';
import { ModeGuru } from './components/ModeGuru';
import type {
  DerivedQuantityType,
  LabToolId,
  QuizAttempt,
  StudentProgress,
  ZoneId,
} from './types';
import {
  BADGE_DEFINITIONS,
  calculateLevelInfo,
  calculateStars,
  createInitialProgress,
  evaluateUnlockedBadges,
  loadProgressFromStorage,
  saveProgressToStorage,
} from './utils/gamification';
import { playSound, type SoundType } from './utils/sound';

function getInitialZone(): ZoneId {
  if (typeof window === 'undefined') return 'dashboard';
  const params = new URLSearchParams(window.location.search);
  const zoneParam = params.get('zone') as ZoneId | null;
  const validZones: ZoneId[] = [
    'dashboard',
    'zona1',
    'zona2',
    'zona3',
    'zona4',
    'zona5',
    'zona6',
    'zona7',
    'guru',
  ];
  if (zoneParam && validZones.includes(zoneParam)) {
    return zoneParam;
  }
  if (params.get('autostart') === '1') {
    return 'zona1';
  }
  return 'dashboard';
}

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgressFromStorage());
  const [activeZone, setActiveZone] = useState<ZoneId>(() => getInitialZone());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; title: string; subtitle: string } | null>(null);

  useEffect(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  const showToast = useCallback((title: string, subtitle: string) => {
    const id = Date.now();
    setToast({ id, title, subtitle });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3400);
  }, []);

  const triggerSound = useCallback(
    (type: SoundType) => {
      playSound(type, progress.soundEnabled);
    },
    [progress.soundEnabled]
  );

  const applyProgressUpdate = useCallback(
    (updater: (prev: StudentProgress) => { next: StudentProgress; xpGained?: number; reason?: string }) => {
      setProgress((prev) => {
        const prevLevel = calculateLevelInfo(prev.xp).level;
        const { next, xpGained = 0, reason } = updater(prev);
        let updatedXp = next.xp + xpGained;

        // Check newly unlocked badges
        const evaluatedBadges = evaluateUnlockedBadges({ ...next, xp: updatedXp });
        const newlyUnlocked = evaluatedBadges.filter((b) => !prev.unlockedBadges.includes(b));

        let badgeBonusTotal = 0;
        for (const badgeId of newlyUnlocked) {
          const def = BADGE_DEFINITIONS.find((d) => d.id === badgeId);
          if (def) badgeBonusTotal += def.xpBonus;
        }
        updatedXp += badgeBonusTotal;

        const finalState: StudentProgress = {
          ...next,
          xp: updatedXp,
          unlockedBadges: evaluatedBadges,
        };

        const newLevel = calculateLevelInfo(updatedXp).level;
        if (newlyUnlocked.length > 0) {
          const firstBadge = BADGE_DEFINITIONS.find((d) => d.id === newlyUnlocked[0]);
          playSound('levelup', prev.soundEnabled);
          showToast(
            `Lencana Baru: ${firstBadge?.title ?? 'Pencapaian'}!`,
            `+${xpGained + badgeBonusTotal} XP diperoleh`
          );
        } else if (newLevel > prevLevel) {
          playSound('levelup', prev.soundEnabled);
          showToast(`Naik ke Level ${newLevel}!`, `+${xpGained} XP · ${reason ?? 'Terus eksplorasi'}`);
        } else if (xpGained > 0 && reason) {
          showToast(`+${xpGained} XP`, reason);
        }

        return finalState;
      });
    },
    [showToast]
  );

  const handleSelectZone = useCallback(
    (zone: ZoneId) => {
      triggerSound('click');
      setActiveZone(zone);
      setProgress((prev) =>
        prev.visitedZones.includes(zone)
          ? prev
          : { ...prev, visitedZones: [...prev.visitedZones, zone] }
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [triggerSound]
  );

  const handleDiscoverObject = useCallback(
    (objectId: string) => {
      triggerSound('click');
      applyProgressUpdate((prev) => {
        if (prev.zona1DiscoveredObjects.includes(objectId)) {
          return { next: prev };
        }
        return {
          next: {
            ...prev,
            zona1DiscoveredObjects: [...prev.zona1DiscoveredObjects, objectId],
          },
          xpGained: 15,
          reason: 'Menemukan alat ukur baru di Zona 1',
        };
      });
    },
    [applyProgressUpdate, triggerSound]
  );

  const handleCompleteZona1Experiment = useCallback(() => {
    triggerSound('success');
    applyProgressUpdate((prev) => {
      if (prev.zona1CompletedExperiment) return { next: prev };
      return {
        next: { ...prev, zona1CompletedExperiment: true },
        xpGained: 25,
        reason: 'Menuntaskan eksperimen Satuan Baku vs Tidak Baku',
      };
    });
  }, [applyProgressUpdate, triggerSound]);

  const handleExploreQuantity = useCallback(
    (id: string) => {
      triggerSound('click');
      applyProgressUpdate((prev) => {
        if (prev.zona2ExploredQuantities.includes(id)) return { next: prev };
        return {
          next: {
            ...prev,
            zona2ExploredQuantities: [...prev.zona2ExploredQuantities, id],
          },
          xpGained: 15,
          reason: 'Mempelajari Besaran Pokok SI',
        };
      });
    },
    [applyProgressUpdate, triggerSound]
  );

  const handleCompleteTool = useCallback(
    (tool: LabToolId) => {
      applyProgressUpdate((prev) => {
        const already = prev.zona3CompletedTools.includes(tool);
        return {
          next: already
            ? prev
            : { ...prev, zona3CompletedTools: [...prev.zona3CompletedTools, tool] },
          xpGained: already ? 10 : 30,
          reason: already ? 'Latihan kalibrasi alat ukur berhasil' : 'Menuntaskan praktikum alat ukur baru!',
        };
      });
    },
    [applyProgressUpdate]
  );

  const handleCalculatedDerived = useCallback((type: DerivedQuantityType) => {
    setProgress((prev) => {
      if (prev.zona4CalculatedTypes.includes(type)) return prev;
      const updated: StudentProgress = {
        ...prev,
        xp: prev.xp + 15,
        zona4CalculatedTypes: [...prev.zona4CalculatedTypes, type],
      };
      updated.unlockedBadges = evaluateUnlockedBadges(updated);
      return updated;
    });
  }, []);

  const handleConversionPerformed = useCallback(() => {
    setProgress((prev) => {
      const nextCount = prev.zona5CompletedConversions + 1;
      const grantXp = nextCount <= 5 ? 10 : 0;
      const updated: StudentProgress = {
        ...prev,
        xp: prev.xp + grantXp,
        zona5CompletedConversions: nextCount,
      };
      updated.unlockedBadges = evaluateUnlockedBadges(updated);
      return updated;
    });
  }, []);

  const handleMissionComplete = useCallback(
    (missionId: string, score: number, maxScore: number) => {
      const stars = calculateStars(score, maxScore);
      applyProgressUpdate((prev) => {
        const existing = prev.missions[missionId];
        const firstCompletion = !existing?.completed;
        const bestScore = Math.max(existing?.bestScore ?? 0, score);
        const bestStars = Math.max(existing?.stars ?? 0, stars);

        return {
          next: {
            ...prev,
            missions: {
              ...prev.missions,
              [missionId]: {
                missionId,
                title: existing?.title ?? missionId,
                completed: true,
                bestScore,
                maxScore,
                stars: bestStars,
                attempts: (existing?.attempts ?? 0) + 1,
                lastPlayedAt: new Date().toISOString(),
              },
            },
          },
          xpGained: firstCompletion ? 45 : 15,
          reason: `Menyelesaikan ${existing?.title ?? 'Misi Sains'} (${bestStars} Bintang)`,
        };
      });
    },
    [applyProgressUpdate]
  );

  const handleQuizComplete = useCallback(
    (attempt: QuizAttempt) => {
      applyProgressUpdate((prev) => ({
        next: {
          ...prev,
          quizHistory: [attempt, ...prev.quizHistory],
        },
        xpGained: attempt.score >= 70 ? 60 : 25,
        reason: `Kuis Final selesai dengan nilai ${attempt.score}/100`,
      }));
    },
    [applyProgressUpdate]
  );

  const handleResetProgress = useCallback(() => {
    const fresh = createInitialProgress();
    setProgress(fresh);
    saveProgressToStorage(fresh);
    showToast('Progres Direset', 'Semua data siswa di perangkat ini telah dikembalikan ke awal.');
  }, [showToast]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activeZone={activeZone}
        onSelectZone={handleSelectZone}
        progress={progress}
        onToggleSound={() =>
          setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Container */}
      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div key={activeZone}>
            {activeZone === 'dashboard' && (
              <DashboardView
                progress={progress}
                onNavigate={handleSelectZone}
                onUpdateStudentName={(name) =>
                  setProgress((prev) => ({ ...prev, studentName: name }))
                }
              />
            )}

            {activeZone === 'zona1' && (
              <Zona1KenaliBesaran
                progress={progress}
                onDiscoverObject={handleDiscoverObject}
                onCompleteExperiment={handleCompleteZona1Experiment}
                onNavigate={handleSelectZone}
              />
            )}

            {activeZone === 'zona2' && (
              <Zona2BesaranPokok
                progress={progress}
                onExploreQuantity={handleExploreQuantity}
                onNavigate={handleSelectZone}
              />
            )}

            {activeZone === 'zona3' && (
              <Zona3LabVirtual
                progress={progress}
                onCompleteTool={handleCompleteTool}
                onSound={triggerSound}
              />
            )}

            {activeZone === 'zona4' && (
              <Zona4BesaranTurunan
                progress={progress}
                onCalculated={handleCalculatedDerived}
                onNavigate={handleSelectZone}
              />
            )}

            {activeZone === 'zona5' && (
              <Zona5KonversiSatuan
                onConversionPerformed={handleConversionPerformed}
                onNavigate={handleSelectZone}
                onSound={triggerSound}
              />
            )}

            {activeZone === 'zona6' && (
              <Zona6TantanganMisi
                progress={progress}
                onMissionComplete={handleMissionComplete}
                onSound={triggerSound}
              />
            )}

            {activeZone === 'zona7' && (
              <Zona7KuisFinal onQuizComplete={handleQuizComplete} onSound={triggerSound} />
            )}

            {activeZone === 'guru' && (
              <ModeGuru
                progress={progress}
                onResetProgress={handleResetProgress}
                onSound={triggerSound}
              />
            )}
          </div>
        </div>
      </main>

      {/* XP & Badge Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-amber-300 bg-[#0F1E3D] px-4 py-3 text-white shadow-lg"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#0F1E3D]">
              {toast.title.includes('Lencana') ? (
                <Award className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-amber-300">{toast.title}</p>
              <p className="truncate text-xs text-sky-100">{toast.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
