import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Atom,
  Award,
  Calculator,
  CheckCircle2,
  Compass,
  FlaskConical,
  Ruler,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import type { StudentProgress, ZoneId } from '../types';
import {
  BADGE_DEFINITIONS,
  calculateLevelInfo,
  calculateOverallCompletion,
} from '../utils/gamification';

interface DashboardViewProps {
  progress: StudentProgress;
  onNavigate: (zone: ZoneId) => void;
  onUpdateStudentName: (name: string) => void;
}

const BADGE_ICON_MAP = {
  compass: Compass,
  atom: Atom,
  ruler: Ruler,
  calculator: Calculator,
  trophy: Trophy,
  award: Award,
};

export function DashboardView({
  progress,
  onNavigate,
  onUpdateStudentName,
}: DashboardViewProps) {
  const [imgError, setImgError] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(progress.studentName);

  const levelInfo = calculateLevelInfo(progress.xp);
  const completionPct = calculateOverallCompletion(progress);
  const completedMissionsCount = Object.values(progress.missions).filter((m) => m.completed).length;
  const totalStars = Object.values(progress.missions).reduce((acc, m) => acc + m.stars, 0);
  const bestQuiz =
    progress.quizHistory.length > 0
      ? Math.max(...progress.quizHistory.map((q) => q.score))
      : null;

  const zoneCards: {
    id: ZoneId;
    num: string;
    title: string;
    desc: string;
    statusText: string;
    done: boolean;
  }[] = [
    {
      id: 'zona1',
      num: 'Zona 1',
      title: 'Kenali Besaran',
      desc: 'Eksplorasi alat ukur nyata, konsep besaran vs satuan, dan eksperimen satuan baku.',
      statusText: `${progress.zona1DiscoveredObjects.length}/5 alat ditemukan`,
      done: progress.zona1DiscoveredObjects.length >= 5 && progress.zona1CompletedExperiment,
    },
    {
      id: 'zona2',
      num: 'Zona 2',
      title: 'Lab Besaran Pokok',
      desc: 'Pelajari 7 Besaran Pokok SI lengkap dengan animasi fenomena fisika dan alat ukurnya.',
      statusText: `${progress.zona2ExploredQuantities.length}/7 besaran dijelajahi`,
      done: progress.zona2ExploredQuantities.length >= 7,
    },
    {
      id: 'zona3',
      num: 'Zona 3',
      title: 'Lab Pengukuran Virtual',
      desc: 'Praktikum langsung: Penggaris, Jangka Sorong, Mikrometer, Timbangan, Stopwatch, Gelas Ukur.',
      statusText: `${progress.zona3CompletedTools.length}/6 alat diselesaikan`,
      done: progress.zona3CompletedTools.length >= 6,
    },
    {
      id: 'zona4',
      num: 'Zona 4',
      title: 'Besaran Turunan',
      desc: 'Kalkulator interaktif Luas, Volume, Kecepatan, Percepatan, Gaya, Massa Jenis, dan Tekanan.',
      statusText: `${progress.zona4CalculatedTypes.length}/7 rumus dicoba`,
      done: progress.zona4CalculatedTypes.length >= 4,
    },
    {
      id: 'zona5',
      num: 'Zona 5',
      title: 'Konversi Satuan',
      desc: 'Konverter otomatis & tangga satuan interaktif untuk Panjang, Massa, Waktu, Volume, Suhu.',
      statusText: `${progress.zona5CompletedConversions} konversi dilakukan`,
      done: progress.zona5CompletedConversions >= 3,
    },
    {
      id: 'zona6',
      num: 'Zona 6',
      title: 'Tantangan Misi Sains',
      desc: '5 game edukasi: Tebak Besaran, Drag & Drop Satuan, Detektif Alat Ukur, Konversi Kilat.',
      statusText: `${completedMissionsCount}/5 misi · ${totalStars}/15 bintang`,
      done: completedMissionsCount >= 5,
    },
    {
      id: 'zona7',
      num: 'Zona 7',
      title: 'Kuis Final',
      desc: 'Evaluasi akhir 20 soal (Pilihan Ganda, Benar/Salah, Hitungan) berbatas waktu.',
      statusText: bestQuiz !== null ? `Nilai terbaik: ${bestQuiz}/100` : 'Belum dikerjakan',
      done: progress.quizHistory.length > 0,
    },
  ];

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameDraft.trim();
    if (trimmed) {
      onUpdateStudentName(trimmed);
    }
    setEditingName(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="grid items-stretch lg:grid-cols-12">
          {/* Left Hero Copy */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-[#0F1E3D] via-[#162B54] to-[#1D3E78] p-6 text-white sm:p-8 lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-wide text-amber-300">
                Mata Pelajaran PIPAS · Kelas X SMK · Laboratorium Virtual
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
                MISI SAINS: BESARAN DAN SATUANNYA
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-sky-100 sm:text-base">
                Jelajahi Dunia Pengukuran dan Temukan Rahasia Besaran Fisika. Ukur benda nyata
                dengan jangka sorong, mikrometer sekrup, timbangan digital, hingga selesaikan misi
                tantangan sains.
              </p>

              {/* Student Identity Quick Edit */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-sky-100">
                <span>Peneliti:</span>
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <label htmlFor="student-name-input" className="sr-only">
                      Nama Siswa
                    </label>
                    <input
                      id="student-name-input"
                      type="text"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      maxLength={40}
                      className="rounded-lg border border-sky-300/40 bg-white/10 px-3 py-1.5 text-sm text-white placeholder-sky-200 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-[#0F1E3D] hover:bg-amber-300"
                    >
                      Simpan
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setNameDraft(progress.studentName);
                      setEditingName(true);
                    }}
                    className="font-semibold text-white underline decoration-amber-400/60 underline-offset-4 hover:text-amber-300"
                  >
                    {progress.studentName} (Ubah)
                  </button>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('zona1')}
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-400 px-6 py-3.5 font-display text-sm font-bold text-[#0F1E3D] shadow-sm transition-transform hover:bg-amber-300 active:scale-[0.99] whitespace-nowrap"
              >
                MULAI PETUALANGAN
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('zona3')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 whitespace-nowrap"
              >
                <Ruler className="h-4 w-4 text-sky-300" />
                Langsung ke Lab Ukur
              </button>
            </div>
          </div>

          {/* Right Hero Lab Illustration */}
          <div className="relative min-h-[220px] bg-slate-100 lg:col-span-5">
            {!imgError ? (
              <img
                src="/src/assets/images/pipas_lab_hero_1795050383140.jpg"
                alt="Ilustrasi meja laboratorium sains berisi jangka sorong, mikrometer sekrup, gelas ukur, timbangan digital, termometer, dan stopwatch"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 p-6 text-center">
                <FlaskConical className="h-14 w-14 text-sky-600" />
                <p className="mt-3 font-display text-base font-bold text-slate-800">
                  Laboratorium Pengukuran Digital
                </p>
                <p className="mt-1 text-xs text-slate-500">PIPAS INTERACTIVE LAB</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 4-column Progress Metrics Strip */}
      <section aria-label="Ringkasan progres belajar" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Progres Pembelajaran</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-[#0F1E3D] tabular-nums">
            {completionPct}%
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Total XP & Level</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-sky-700 tabular-nums">
            {progress.xp} XP
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Level {levelInfo.level} · {levelInfo.title}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Pencapaian Misi Sains</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-amber-600 tabular-nums">
            {completedMissionsCount} / 5 Misi
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono tabular-nums">{totalStars} / 15</span> bintang terkumpul
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Badge & Evaluasi Akhir</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-[#0F1E3D] tabular-nums">
            {progress.unlockedBadges.length} / {BADGE_DEFINITIONS.length} Badge
          </p>
          <p className="mt-2 text-xs text-slate-600">
            {bestQuiz !== null ? `Skor Kuis Terbaik: ${bestQuiz}` : 'Kuis Final belum dikerjakan'}
          </p>
        </div>
      </section>

      {/* Badges Showcase */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
              Lencana Pencapaian Laboratorium
            </h2>
            <p className="text-sm text-slate-600">
              Selesaikan eksplorasi dan tantangan untuk membuka seluruh lencana dan bonus XP.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
            {progress.unlockedBadges.length} dari {BADGE_DEFINITIONS.length} terbuka
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_DEFINITIONS.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            const Icon = BADGE_ICON_MAP[badge.iconName];
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3.5 rounded-xl border p-4 transition-colors ${
                  unlocked
                    ? 'border-amber-300 bg-amber-50/60'
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    unlocked
                      ? 'bg-amber-400 text-[#0F1E3D]'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{badge.title}</h3>
                    <span className="font-mono text-[11px] font-semibold text-amber-700 tabular-nums">
                      +{badge.xpBonus} XP
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {badge.description}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-slate-500">
                    {unlocked ? 'Status: Terbuka' : 'Status: Belum terbuka'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning Roadmap Cards */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
              Peta Zona Pembelajaran Interaktif
            </h2>
            <p className="text-sm text-slate-600">
              Pilih zona mana saja untuk mulai bereksperimen atau ikuti alur dari Zona 1 hingga Zona 7.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {zoneCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.id)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold text-sky-700">{card.num}</span>
                  {card.done ? (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Tuntas
                    </span>
                  ) : (
                    <span className="text-slate-500">{card.statusText}</span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-[#0F1E3D] group-hover:text-sky-700">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{card.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-sky-700">
                <span>Buka Laboratorium</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
