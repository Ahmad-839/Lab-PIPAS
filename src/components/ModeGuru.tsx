import React, { useState } from 'react';
import { Info, Lock, LogOut, RotateCcw, Star, Trash2 } from 'lucide-react';
import type { StudentProgress } from '../types';
import {
  calculateLevelInfo,
  calculateOverallCompletion,
  TEACHER_PIN,
} from '../utils/gamification';

interface ModeGuruProps {
  progress: StudentProgress;
  onResetProgress: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

export function ModeGuru({ progress, onResetProgress, onSound }: ModeGuruProps) {
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === TEACHER_PIN) {
      onSound('success');
      setUnlocked(true);
      setPinError('');
    } else {
      onSound('error');
      setPinError('PIN tidak sesuai. Gunakan PIN standar guru (123456).');
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F1E3D] text-amber-300">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-xl font-extrabold text-[#0F1E3D]">
          Mode Guru PIPAS
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Masukkan PIN Guru untuk memantau rekap progres pembelajaran, skor misi, hasil kuis, atau
          melakukan reset data praktikum perangkat ini.
        </p>

        <form onSubmit={handleUnlock} className="mt-5 space-y-3">
          <div>
            <label htmlFor="teacher-pin-input" className="block text-xs font-bold text-slate-700">
              PIN Akses Guru (PIN awal: 123456)
            </label>
            <input
              id="teacher-pin-input"
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Masukkan 6 digit PIN"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-base tracking-widest text-[#0F1E3D] focus:border-sky-600 focus:outline-none"
            />
          </div>
          {pinError && (
            <p role="alert" className="text-xs font-semibold text-rose-700">
              {pinError}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0F1E3D] px-4 py-3 text-sm font-bold text-white hover:bg-[#1a3264]"
          >
            Masuk Mode Guru
          </button>
        </form>
      </div>
    );
  }

  const levelInfo = calculateLevelInfo(progress.xp);
  const completionPct = calculateOverallCompletion(progress);
  const missionList = Object.values(progress.missions);

  const zoneProgressBars = [
    { label: 'Zona 1 · Kenali Besaran', pct: Math.round(((progress.zona1DiscoveredObjects.length + (progress.zona1CompletedExperiment ? 1 : 0)) / 6) * 100) },
    { label: 'Zona 2 · Besaran Pokok SI', pct: Math.round((progress.zona2ExploredQuantities.length / 7) * 100) },
    { label: 'Zona 3 · Lab Virtual', pct: Math.round((progress.zona3CompletedTools.length / 6) * 100) },
    { label: 'Zona 4 · Besaran Turunan', pct: Math.round((Math.min(4, progress.zona4CalculatedTypes.length) / 4) * 100) },
    { label: 'Zona 5 · Konversi Satuan', pct: Math.round((Math.min(3, progress.zona5CompletedConversions) / 3) * 100) },
    { label: 'Zona 6 · Tantangan Misi', pct: Math.round((missionList.filter((m) => m.completed).length / 5) * 100) },
    { label: 'Zona 7 · Kuis Final', pct: progress.quizHistory.length > 0 ? 100 : 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <p className="text-xs font-semibold text-sky-700">Panel Evaluasi Guru PIPAS</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
            Rekap Hasil Belajar · {progress.studentName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Level {levelInfo.level} ({levelInfo.title}) · Total {progress.xp} XP · Ketuntasan{' '}
            {completionPct}%
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUnlocked(false);
            setPinInput('');
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Kunci Mode Guru
        </button>
      </div>

      {/* Local Storage Info Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs leading-relaxed text-sky-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
        <p>
          <strong>Catatan Penyimpanan Lokal:</strong> Aplikasi ini belum menggunakan server backend
          terpusat. Seluruh progres pembelajaran, skor misi, dan riwayat kuis disimpan secara lokal
          di browser/perangkat yang sedang digunakan (<code className="font-mono">localStorage</code>).
        </p>
      </div>

      {/* Zone Mastery Chart */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-bold text-[#0F1E3D]">
          Capaian Penguasaan Per Zona Pembelajaran
        </h2>
        <div className="mt-4 space-y-3">
          {zoneProgressBars.map((z) => (
            <div key={z.label} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>{z.label}</span>
                <span className="font-mono font-bold text-[#0F1E3D] tabular-nums">{z.pct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600 transition-all"
                  style={{ width: `${z.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Scores Recap Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-bold text-[#0F1E3D]">
          Rekap Skor Setiap Misi Tantangan
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-700">
              <tr>
                <th className="px-4 py-3">Nama Misi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Skor Terbaik</th>
                <th className="px-4 py-3">Bintang</th>
                <th className="px-4 py-3">Percobaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {missionList.map((m) => (
                <tr key={m.missionId} className="bg-white">
                  <td className="px-4 py-3 font-semibold text-[#0F1E3D]">{m.title}</td>
                  <td className="px-4 py-3 text-xs">
                    {m.completed ? (
                      <span className="font-bold text-emerald-700">Selesai</span>
                    ) : (
                      <span className="text-slate-500">Belum dikerjakan</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold tabular-nums">
                    {m.bestScore} / {m.maxScore}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            m.stars >= s ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">{m.attempts}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Final Quiz History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-bold text-[#0F1E3D]">
          Riwayat Hasil Kuis Final (20 Soal)
        </h2>
        {progress.quizHistory.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Siswa belum menyelesaikan Kuis Final di Zona 7.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Waktu Selesai</th>
                  <th className="px-4 py-3">Nilai Akhir</th>
                  <th className="px-4 py-3">Benar</th>
                  <th className="px-4 py-3">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {progress.quizHistory.map((q, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {new Date(q.completedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm font-bold text-[#0F1E3D] tabular-nums">
                      {q.score} / 100
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums">
                      {q.correctCount} / {q.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-sky-800">{q.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reset Progress Control */}
      <section className="rounded-2xl border border-rose-200 bg-white p-6">
        <h2 className="font-display text-base font-bold text-rose-900">
          Reset Progres Pembelajaran
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Gunakan fitur ini sebelum perangkat dipakai oleh siswa atau kelompok praktikum berikutnya.
        </p>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Reset Semua Progres Siswa
          </button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4">
            <span className="text-xs font-bold text-rose-900">
              Yakin hapus seluruh XP, badge, skor misi, dan riwayat kuis?
            </span>
            <button
              type="button"
              onClick={() => {
                onSound('click');
                onResetProgress();
                setConfirmReset(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ya, Reset Sekarang
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700"
            >
              Batal
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
