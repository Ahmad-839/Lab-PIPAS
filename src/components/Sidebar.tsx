import React from 'react';
import {
  Atom,
  Award,
  BookOpen,
  Calculator,
  Compass,
  FlaskConical,
  GraduationCap,
  Home,
  Lock,
  Menu,
  Ruler,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { StudentProgress, ZoneId } from '../types';
import { calculateLevelInfo, calculateOverallCompletion } from '../utils/gamification';

interface SidebarProps {
  activeZone: ZoneId;
  onSelectZone: (zone: ZoneId) => void;
  progress: StudentProgress;
  onToggleSound: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const NAV_ITEMS: {
  id: ZoneId;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Pusat Misi', shortDesc: 'Beranda & Progres', icon: Home },
  { id: 'zona1', label: 'Zona 1 · Kenali Besaran', shortDesc: 'Konsep & Objek Lab', icon: Compass },
  { id: 'zona2', label: 'Zona 2 · Besaran Pokok', shortDesc: '7 Besaran Pokok SI', icon: Atom },
  { id: 'zona3', label: 'Zona 3 · Lab Pengukuran', shortDesc: '6 Alat Ukur Virtual', icon: Ruler },
  { id: 'zona4', label: 'Zona 4 · Besaran Turunan', shortDesc: 'Kalkulator & Visual', icon: FlaskConical },
  { id: 'zona5', label: 'Zona 5 · Konversi Satuan', shortDesc: 'Tangga & Konverter', icon: Calculator },
  { id: 'zona6', label: 'Zona 6 · Tantangan Misi', shortDesc: '5 Misi Gamifikasi', icon: Trophy },
  { id: 'zona7', label: 'Zona 7 · Kuis Final', shortDesc: 'Evaluasi 20 Soal', icon: Award },
  { id: 'guru', label: 'Mode Guru', shortDesc: 'Rekap & Kontrol PIN', icon: Lock },
];

export function Sidebar({
  activeZone,
  onSelectZone,
  progress,
  onToggleSound,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const levelInfo = calculateLevelInfo(progress.xp);
  const completionPct = calculateOverallCompletion(progress);

  const navContent = (
    <div className="flex h-full flex-col bg-[#0F1E3D] text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#0F1E3D]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-tight text-white">
                PIPAS INTERACTIVE LAB
              </p>
              <p className="truncate text-xs text-sky-300">Kelas X SMK · Besaran & Satuan</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup menu navigasi"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Student Level & XP Card */}
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-sky-200">
            Level {levelInfo.level} · {levelInfo.title}
          </span>
          <span className="font-mono text-xs font-semibold text-amber-300 tabular-nums">
            {progress.xp} XP
          </span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={levelInfo.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres level XP"
        >
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-300"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
          <span>Progres Materi</span>
          <span className="font-mono tabular-nums">{completionPct}%</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Menu utama laboratorium" className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeZone === item.id;
            const isVisited = progress.visitedZones.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectZone(item.id);
                    setMobileOpen(false);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-amber-300' : isVisited ? 'text-sky-300' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{item.label}</p>
                    <p
                      className={`truncate text-[11px] leading-tight ${
                        isActive ? 'text-sky-100' : 'text-slate-400'
                      }`}
                    >
                      {item.shortDesc}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Controls */}
      <div className="border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={progress.soundEnabled}
          className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          <span className="flex items-center gap-2">
            {progress.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-300" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
            Efek Suara Lab
          </span>
          <span className="font-mono text-[11px] text-sky-300">
            {progress.soundEnabled ? 'Aktif' : 'Mati'}
          </span>
        </button>
        <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-slate-400">
          <BookOpen className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Kurikulum Merdeka · PIPAS SMK</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-[#0F1E3D] px-4 py-2.5 text-white lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu navigasi"
            className="rounded-lg p-2 text-slate-100 hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-bold tracking-tight whitespace-nowrap">
            PIPAS INTERACTIVE LAB
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-amber-300 tabular-nums">
            {progress.xp} XP
          </span>
        </div>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:block lg:w-72">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu Navigasi">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 w-72 max-w-[85vw]">{navContent}</div>
        </div>
      )}
    </>
  );
}
