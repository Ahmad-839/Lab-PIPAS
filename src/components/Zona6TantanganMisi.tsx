import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Star,
  Trophy,
  XCircle,
} from 'lucide-react';
import type { StudentProgress } from '../types';
import { calculateStars } from '../utils/gamification';
import { computeMicrometerReading, computeVernierReading, isNumericAnswerCorrect } from '../utils/physicsMath';

interface Zona6Props {
  progress: StudentProgress;
  onMissionComplete: (missionId: string, score: number, maxScore: number) => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

type ActiveMissionId = 'misi1' | 'misi2' | 'misi3' | 'misi4' | 'misi5' | null;

const MISI1_QUESTIONS = [
  {
    objectName: 'Meja Kerja Bengkel diukur dengan Mistar',
    clue: 'Diukur jarak dari ujung kiri ke ujung kanan meja.',
    options: ['Panjang', 'Massa', 'Suhu', 'Waktu'],
    correct: 'Panjang',
    explanation: 'Jarak antara dua ujung benda merupakan besaran Panjang (satuan SI: meter).',
  },
  {
    objectName: 'Sekarung Beras 5 kg di atas Neraca Digital',
    clue: 'Jarum/layar menunjukkan banyaknya materi benda.',
    options: ['Volume', 'Massa', 'Kuat Arus', 'Kecepatan'],
    correct: 'Massa',
    explanation: 'Timbangan atau neraca mengukur besaran Massa (satuan SI: kilogram).',
  },
  {
    objectName: 'Pelari Lari Sprint 100 m dengan Stopwatch',
    clue: 'Mencatat durasi dari garis start hingga garis finis.',
    options: ['Kecepatan', 'Panjang', 'Waktu', 'Percepatan'],
    correct: 'Waktu',
    explanation: 'Stopwatch mengukur selang berlangsungnya kejadian, yaitu besaran Waktu (sekon).',
  },
  {
    objectName: 'Air Mendidih di Gelas Beaker dengan Termometer',
    clue: 'Menunjukkan derajat panas air saat dipanaskan.',
    options: ['Intensitas Cahaya', 'Suhu', 'Jumlah Zat', 'Tekanan'],
    correct: 'Suhu',
    explanation: 'Termometer mengukur derajat panas atau dingin, yaitu besaran Suhu (kelvin).',
  },
  {
    objectName: 'Oli Mesin Dituang ke dalam Gelas Ukur 500 mL',
    clue: 'Mengetahui banyaknya ruang yang ditempati cairan.',
    options: ['Massa Jenis', 'Luas', 'Volume', 'Massa'],
    correct: 'Volume',
    explanation: 'Gelas ukur digunakan untuk mengukur Volume zat cair (m³ atau liter/mL).',
  },
];

const MISI2_PAIRS = [
  { id: 'p1', quantity: 'Panjang', unit: 'meter (m)' },
  { id: 'p2', quantity: 'Massa', unit: 'kilogram (kg)' },
  { id: 'p3', quantity: 'Waktu', unit: 'sekon (s)' },
  { id: 'p4', quantity: 'Suhu', unit: 'kelvin (K)' },
  { id: 'p5', quantity: 'Kuat Arus Listrik', unit: 'ampere (A)' },
  { id: 'p6', quantity: 'Jumlah Zat', unit: 'mol (mol)' },
  { id: 'p7', quantity: 'Intensitas Cahaya', unit: 'kandela (cd)' },
];

const SHUFFLED_UNITS = [
  'kelvin (K)',
  'meter (m)',
  'ampere (A)',
  'kandela (cd)',
  'kilogram (kg)',
  'mol (mol)',
  'sekon (s)',
];

const MISI4_QUESTIONS = [
  { q: '2,5 km = ... m', expected: 2500, unit: 'm', exp: 'km ke m turun 3 tangga: 2,5 × 1.000 = 2.500 m.' },
  { q: '750 g = ... kg', expected: 0.75, unit: 'kg', exp: 'g ke kg naik 3 tangga: 750 ÷ 1.000 = 0,75 kg.' },
  { q: '3 menit = ... sekon', expected: 180, unit: 's', exp: '1 menit = 60 s, maka 3 × 60 = 180 sekon.' },
  { q: '2,4 liter = ... mL', expected: 2400, unit: 'mL', exp: '1 liter = 1.000 mL, maka 2,4 × 1.000 = 2.400 mL.' },
  { q: '27 °C = ... K', expected: 300.15, unit: 'K', exp: 'T(K) = °C + 273,15 = 27 + 273,15 = 300,15 K.' },
];

const MISI5_QUESTIONS = [
  {
    title: 'Luas Meja Bengkel',
    prompt: 'Meja kerja berbentuk persegi panjang memiliki panjang 3 m dan lebar 1,5 m. Hitung luasnya dalam m²!',
    expected: 4.5,
    unit: 'm²',
    exp: 'Luas = p × l = 3 m × 1,5 m = 4,5 m².',
  },
  {
    title: 'Volume Bak Air',
    prompt: 'Bak penampung berukuran panjang 2 m, lebar 1 m, dan tinggi 0,8 m. Hitung volumenya dalam m³!',
    expected: 1.6,
    unit: 'm³',
    exp: 'Volume = p × l × t = 2 × 1 × 0,8 = 1,6 m³.',
  },
  {
    title: 'Kecepatan Sepeda Motor',
    prompt: 'Sepeda motor melaju sejauh 360 m dalam waktu 20 sekon. Hitung kecepatannya dalam m/s!',
    expected: 18,
    unit: 'm/s',
    exp: 'Kecepatan = s ÷ t = 360 m ÷ 20 s = 18 m/s.',
  },
  {
    title: 'Massa Jenis Logam',
    prompt: 'Sebuah balok logam bermassa 1.200 kg memiliki volume 0,5 m³. Hitung massa jenisnya dalam kg/m³!',
    expected: 2400,
    unit: 'kg/m³',
    exp: 'Massa jenis ρ = m ÷ V = 1.200 ÷ 0,5 = 2.400 kg/m³.',
  },
];

export function Zona6TantanganMisi({ progress, onMissionComplete, onSound }: Zona6Props) {
  const [activeMission, setActiveMission] = useState<ActiveMissionId>(null);

  // Mission 1 state
  const [m1Idx, setM1Idx] = useState(0);
  const [m1Score, setM1Score] = useState(0);
  const [m1Selected, setM1Selected] = useState<string | null>(null);
  const [m1Done, setM1Done] = useState(false);

  // Mission 2 state (Drag & Drop + tap-to-assign)
  const [m2Assignments, setM2Assignments] = useState<Record<string, string>>({});
  const [m2PickedUnit, setM2PickedUnit] = useState<string | null>(null);
  const [m2Checked, setM2Checked] = useState(false);

  // Mission 3 state (Detective Pengukuran: Ruler 6.4 cm, Vernier 2.36 cm, Micrometer 4.72 mm)
  const [m3Ans1, setM3Ans1] = useState('');
  const [m3Ans2, setM3Ans2] = useState('');
  const [m3Ans3, setM3Ans3] = useState('');
  const [m3Checked, setM3Checked] = useState(false);

  // Mission 4 state (Timed Konversi Kilat - 60s)
  const [m4Idx, setM4Idx] = useState(0);
  const [m4Input, setM4Input] = useState('');
  const [m4Score, setM4Score] = useState(0);
  const [m4Logs, setM4Logs] = useState<{ q: string; ok: boolean; exp: string }[]>([]);
  const [m4TimeLeft, setM4TimeLeft] = useState(60);
  const [m4Done, setM4Done] = useState(false);

  // Mission 5 state
  const [m5Answers, setM5Answers] = useState<string[]>(['', '', '', '']);
  const [m5Checked, setM5Checked] = useState(false);

  useEffect(() => {
    if (activeMission !== 'misi4' || m4Done) return;
    if (m4TimeLeft <= 0) {
      setM4Done(true);
      onMissionComplete('misi4', m4Score, MISI4_QUESTIONS.length);
      return;
    }
    const timer = setTimeout(() => setM4TimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [activeMission, m4Done, m4TimeLeft, m4Score, onMissionComplete]);

  const startMission = (id: Exclude<ActiveMissionId, null>) => {
    onSound('click');
    setActiveMission(id);
    if (id === 'misi1') {
      setM1Idx(0);
      setM1Score(0);
      setM1Selected(null);
      setM1Done(false);
    } else if (id === 'misi2') {
      setM2Assignments({});
      setM2PickedUnit(null);
      setM2Checked(false);
    } else if (id === 'misi3') {
      setM3Ans1('');
      setM3Ans2('');
      setM3Ans3('');
      setM3Checked(false);
    } else if (id === 'misi4') {
      setM4Idx(0);
      setM4Input('');
      setM4Score(0);
      setM4Logs([]);
      setM4TimeLeft(60);
      setM4Done(false);
    } else if (id === 'misi5') {
      setM5Answers(['', '', '', '']);
      setM5Checked(false);
    }
  };

  const missionMetaList: {
    id: Exclude<ActiveMissionId, null>;
    num: string;
    title: string;
    desc: string;
    xpHint: string;
  }[] = [
    {
      id: 'misi1',
      num: 'Misi 1',
      title: 'Tebak Besaran',
      desc: 'Amati objek dan kejadian praktikum lalu tentukan besaran yang diukur.',
      xpHint: '+40 XP',
    },
    {
      id: 'misi2',
      num: 'Misi 2',
      title: 'Pasangkan Satuan (Drag & Drop)',
      desc: 'Seret atau pasangkan ketujuh besaran pokok dengan satuan SI yang tepat.',
      xpHint: '+50 XP',
    },
    {
      id: 'misi3',
      num: 'Misi 3',
      title: 'Detektif Pengukuran',
      desc: 'Baca skala mistar, jangka sorong, dan mikrometer sekrup secara langsung.',
      xpHint: '+60 XP',
    },
    {
      id: 'misi4',
      num: 'Misi 4',
      title: 'Konversi Kilat (Berbatas Waktu)',
      desc: 'Selesaikan 5 tantangan konversi satuan dalam 60 detik.',
      xpHint: '+50 XP',
    },
    {
      id: 'misi5',
      num: 'Misi 5',
      title: 'Hitung Besaran Turunan',
      desc: 'Hitung luas, volume, kecepatan, dan massa jenis dari kasus bengkel SMK.',
      xpHint: '+50 XP',
    },
  ];

  // Vernier & Micrometer helper readings for Mission 3
  const m3Vernier = computeVernierReading(23.6); // 2.36 cm
  const m3Micro = computeMicrometerReading(4.72); // 4.72 mm

  if (!activeMission) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold text-sky-700">
            Zona 6 · Game Edukasi & Uji Ketangkasan Sains
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
            Tantangan Misi Sains (5 Misi Interaktif)
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Kumpulkan bintang dan poin XP dengan menyelesaikan kelima misi tantangan berikut. Setiap
            misi memberikan skor otomatis dan pembahasan lengkap.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missionMetaList.map((m) => {
            const res = progress.missions[m.id];
            return (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-sky-700">{m.num}</span>
                    <span className="font-mono font-semibold text-amber-700">{m.xpHint}</span>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-bold text-[#0F1E3D]">{m.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.desc}</p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1" aria-label={`${res?.stars ?? 0} dari 3 bintang`}>
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            (res?.stars ?? 0) >= s
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      Skor terbaik: {res?.bestScore ?? 0}/{res?.maxScore ?? 0}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => startMission(m.id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F1E3D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1a3264]"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {res?.completed ? 'Mainkan Ulang' : 'Mulai Misi'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveMission(null)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Misi
        </button>
        <span className="font-mono text-xs font-bold text-sky-700">
          {missionMetaList.find((m) => m.id === activeMission)?.num} ·{' '}
          {missionMetaList.find((m) => m.id === activeMission)?.title}
        </span>
      </div>

      {/* MISI 1: TEBAK BESARAN */}
      {activeMission === 'misi1' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {!m1Done ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>
                  Soal {m1Idx + 1} dari {MISI1_QUESTIONS.length}
                </span>
                <span>Skor sementara: {m1Score}</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#0F1E3D]">
                {MISI1_QUESTIONS[m1Idx].objectName}
              </h2>
              <p className="text-sm text-slate-600">{MISI1_QUESTIONS[m1Idx].clue}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {MISI1_QUESTIONS[m1Idx].options.map((opt) => {
                  const chosen = m1Selected === opt;
                  const isCorrect = opt === MISI1_QUESTIONS[m1Idx].correct;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={m1Selected !== null}
                      onClick={() => {
                        setM1Selected(opt);
                        if (isCorrect) {
                          onSound('success');
                          setM1Score((s) => s + 1);
                        } else {
                          onSound('error');
                        }
                      }}
                      className={`rounded-xl border p-4 text-left text-sm font-bold transition-colors ${
                        m1Selected === null
                          ? 'border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50'
                          : isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : chosen
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-slate-200 bg-white opacity-60'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {m1Selected !== null && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-[#0F1E3D]">Pembahasan:</p>
                  <p className="text-sm text-slate-700">{MISI1_QUESTIONS[m1Idx].explanation}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (m1Idx + 1 < MISI1_QUESTIONS.length) {
                        setM1Idx((i) => i + 1);
                        setM1Selected(null);
                      } else {
                        setM1Done(true);
                        onMissionComplete('misi1', m1Score, MISI1_QUESTIONS.length);
                      }
                    }}
                    className="rounded-lg bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264]"
                  >
                    {m1Idx + 1 < MISI1_QUESTIONS.length ? 'Soal Berikutnya' : 'Lihat Hasil Misi'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <MissionSummary
              score={m1Score}
              maxScore={MISI1_QUESTIONS.length}
              onReplay={() => startMission('misi1')}
              onBack={() => setActiveMission(null)}
            />
          )}
        </div>
      )}

      {/* MISI 2: PASANGKAN SATUAN DRAG & DROP */}
      {activeMission === 'misi2' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
              Pasangkan Besaran Pokok dengan Satuan SI (Drag & Drop)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Seret kotak satuan SI di sebelah kanan ke kotak target di sebelah kiri—atau klik satuan
              lalu klik target besaran untuk memasangkan dengan cepat.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Target quantities */}
            <div className="space-y-2.5 lg:col-span-7">
              {MISI2_PAIRS.map((pair) => {
                const assigned = m2Assignments[pair.id];
                const isRight = m2Checked && assigned === pair.unit;
                const isWrong = m2Checked && assigned !== pair.unit;
                return (
                  <div
                    key={pair.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (m2Checked) return;
                      const droppedUnit = e.dataTransfer.getData('text/plain');
                      if (droppedUnit) {
                        onSound('click');
                        setM2Assignments((prev) => ({ ...prev, [pair.id]: droppedUnit }));
                      }
                    }}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                      isRight
                        ? 'border-emerald-400 bg-emerald-50'
                        : isWrong
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold text-[#0F1E3D]">{pair.quantity}</span>
                    <button
                      type="button"
                      disabled={m2Checked}
                      onClick={() => {
                        if (m2PickedUnit) {
                          onSound('click');
                          setM2Assignments((prev) => ({ ...prev, [pair.id]: m2PickedUnit }));
                          setM2PickedUnit(null);
                        } else if (assigned) {
                          setM2Assignments((prev) => {
                            const copy = { ...prev };
                            delete copy[pair.id];
                            return copy;
                          });
                        }
                      }}
                      className={`min-w-[155px] rounded-lg border-2 border-dashed px-3 py-2 text-center font-mono text-xs font-bold transition-colors ${
                        assigned
                          ? 'border-sky-600 bg-white text-sky-900 border-solid'
                          : m2PickedUnit
                          ? 'border-amber-400 bg-amber-50 text-amber-900'
                          : 'border-slate-300 text-slate-400'
                      }`}
                    >
                      {assigned ?? (m2PickedUnit ? 'Klik untuk taruh di sini' : 'Taruh satuan SI')}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Draggable SI units pool */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:col-span-5">
              <p className="text-xs font-bold text-slate-700">Pilihan Satuan SI:</p>
              <div className="flex flex-wrap gap-2">
                {SHUFFLED_UNITS.map((unitLabel) => {
                  const used = Object.values(m2Assignments).includes(unitLabel);
                  const picked = m2PickedUnit === unitLabel;
                  return (
                    <button
                      key={unitLabel}
                      type="button"
                      draggable={!m2Checked}
                      disabled={m2Checked}
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', unitLabel)}
                      onClick={() => {
                        onSound('click');
                        setM2PickedUnit(picked ? null : unitLabel);
                      }}
                      className={`rounded-lg border px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                        picked
                          ? 'border-amber-500 bg-amber-400 text-[#0F1E3D]'
                          : used
                          ? 'border-slate-200 bg-slate-200 text-slate-500'
                          : 'border-sky-300 bg-white text-[#0F1E3D] hover:border-sky-600'
                      }`}
                    >
                      {unitLabel}
                    </button>
                  );
                })}
              </div>

              {!m2Checked ? (
                <button
                  type="button"
                  onClick={() => {
                    const correctCount = MISI2_PAIRS.filter(
                      (p) => m2Assignments[p.id] === p.unit
                    ).length;
                    setM2Checked(true);
                    onSound(correctCount >= 5 ? 'success' : 'error');
                    onMissionComplete('misi2', correctCount, MISI2_PAIRS.length);
                  }}
                  className="mt-4 w-full rounded-xl bg-[#0F1E3D] px-4 py-3 text-xs font-bold text-white hover:bg-[#1a3264]"
                >
                  Periksa Semua Pasangan
                </button>
              ) : (
                <div className="space-y-3 border-t border-slate-200 pt-3">
                  <p className="font-mono text-sm font-bold text-[#0F1E3D]">
                    Skor: {MISI2_PAIRS.filter((p) => m2Assignments[p.id] === p.unit).length} /{' '}
                    {MISI2_PAIRS.length} benar
                  </p>
                  <button
                    type="button"
                    onClick={() => startMission('misi2')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-bold text-[#0F1E3D]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Ulangi Misi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MISI 3: DETEKTIF PENGUKURAN */}
      {activeMission === 'misi3' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
              Detektif Pengukuran — Baca Skala Alat Ukur Virtual
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Baca ketiga instrumen di bawah ini dengan teliti lalu tuliskan angkanya.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Case 1: Ruler 6.4 cm (from 1.0 to 7.4 cm) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <p className="text-xs font-bold text-[#0F1E3D]">1. Penggaris (dalam cm)</p>
              <svg viewBox="0 0 260 95" className="w-full rounded bg-white border border-slate-200">
                <rect x="44" y="14" width="128" height="22" rx="2" fill="#0284C7" />
                <rect x="10" y="42" width="240" height="40" fill="#FEF08A" stroke="#0F1E3D" strokeWidth="1.5" />
                {Array.from({ length: 101 }).map((_, mm) => {
                  const x = 24 + mm * 2;
                  const isCm = mm % 10 === 0;
                  return (
                    <g key={mm}>
                      <line x1={x} y1="42" x2={x} y2={42 + (isCm ? 14 : 7)} stroke="#0F1E3D" strokeWidth="1" />
                      {isCm && (
                        <text x={x} y="70" textAnchor="middle" fontSize="8" fontFamily="monospace">
                          {mm / 10}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              <p className="text-[11px] text-slate-600">Ujung kiri di 1,0 cm, ujung kanan di 7,4 cm.</p>
              <label htmlFor="m3-q1" className="sr-only">Panjang penggaris (cm)</label>
              <input
                id="m3-q1"
                type="text"
                inputMode="decimal"
                placeholder="Panjang (cm)"
                value={m3Ans1}
                onChange={(e) => setM3Ans1(e.target.value)}
                disabled={m3Checked}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
              />
              {m3Checked && (
                <p className={`text-xs font-semibold ${isNumericAnswerCorrect(m3Ans1, 6.4, 0.05) ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Kunci: 6,4 cm (7,4 - 1,0)
                </p>
              )}
            </div>

            {/* Case 2: Vernier Caliper 2.36 cm */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <p className="text-xs font-bold text-[#0F1E3D]">2. Jangka Sorong (dalam cm)</p>
              <svg viewBox="0 0 260 95" className="w-full rounded bg-white border border-slate-200">
                <g transform="translate(-80, 0)">
                  <rect x="80" y="14" width="240" height="32" fill="#E2E8F0" stroke="#0F1E3D" />
                  {Array.from({ length: 40 }).map((_, mm) => {
                    const x = 90 + mm * 8;
                    const isCm = mm % 10 === 0;
                    return (
                      <g key={mm}>
                        <line x1={x} y1="46" x2={x} y2={46 - (isCm ? 15 : 8)} stroke="#0F1E3D" strokeWidth="1.2" />
                        {isCm && <text x={x} y="27" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="monospace">{mm / 10}</text>}
                      </g>
                    );
                  })}
                  <g transform={`translate(${m3Vernier.totalMm * 8}, 0)`}>
                    <rect x="86" y="47" width="84" height="34" fill="#FEF3C7" stroke="#0F1E3D" />
                    {Array.from({ length: 11 }).map((_, k) => (
                      <g key={k}>
                        <line
                          x1={90 + k * 7.2}
                          y1="47"
                          x2={90 + k * 7.2}
                          y2="64"
                          stroke={k === 6 ? '#DC2626' : '#0F1E3D'}
                          strokeWidth={k === 6 ? '2' : '1'}
                        />
                        {(k === 0 || k === 6 || k === 10) && (
                          <text x={90 + k * 7.2} y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={k === 6 ? '#DC2626' : '#0F1E3D'}>
                            {k}
                          </text>
                        )}
                      </g>
                    ))}
                  </g>
                </g>
              </svg>
              <p className="text-[11px] text-slate-600">SU = 2,3 cm · garis ke-6 nonius sejajar lurus.</p>
              <label htmlFor="m3-q2" className="sr-only">Hasil jangka sorong (cm)</label>
              <input
                id="m3-q2"
                type="text"
                inputMode="decimal"
                placeholder="Hasil (cm)"
                value={m3Ans2}
                onChange={(e) => setM3Ans2(e.target.value)}
                disabled={m3Checked}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
              />
              {m3Checked && (
                <p className={`text-xs font-semibold ${isNumericAnswerCorrect(m3Ans2, 2.36, 0.01) ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Kunci: 2,36 cm (2,3 + 6×0,01)
                </p>
              )}
            </div>

            {/* Case 3: Micrometer 4.72 mm */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <p className="text-xs font-bold text-[#0F1E3D]">3. Mikrometer Sekrup (dalam mm)</p>
              <svg viewBox="0 0 260 95" className="w-full rounded bg-white border border-slate-200">
                <rect x="20" y="25" width="130" height="44" fill="#F8FAFC" stroke="#0F1E3D" />
                <line x1="25" y1="47" x2="150" y2="47" stroke="#0F1E3D" strokeWidth="1.5" />
                {Array.from({ length: 10 }).map((_, h) => {
                  const x = 30 + h * 11;
                  const isInt = h % 2 === 0;
                  return (
                    <g key={h}>
                      {isInt ? (
                        <>
                          <line x1={x} y1="47" x2={x} y2="33" stroke="#0F1E3D" strokeWidth="1.3" />
                          <text x={x} y="29" textAnchor="middle" fontSize="8" fontFamily="monospace">{h / 2}</text>
                        </>
                      ) : (
                        <line x1={x} y1="47" x2={x} y2="59" stroke="#DC2626" strokeWidth="1.2" />
                      )}
                    </g>
                  );
                })}
                <rect x="132" y="16" width="98" height="62" fill="#FEF3C7" stroke="#0F1E3D" />
                {[20, 21, 22, 23, 24].map((tick, i) => {
                  const y = 63 - i * 8;
                  return (
                    <g key={tick}>
                      <line x1="132" y1={y} x2="148" y2={y} stroke={tick === m3Micro.thimbleTick ? '#DC2626' : '#0F1E3D'} strokeWidth={tick === m3Micro.thimbleTick ? '2' : '1'} />
                      <text x="155" y={y + 3} fontSize="8.5" fontFamily="monospace" fontWeight="bold" fill={tick === m3Micro.thimbleTick ? '#DC2626' : '#0F1E3D'}>{tick}</text>
                    </g>
                  );
                })}
              </svg>
              <p className="text-[11px] text-slate-600">SU terlihat 4,5 mm · skala putar tepat di angka 22.</p>
              <label htmlFor="m3-q3" className="sr-only">Hasil mikrometer (mm)</label>
              <input
                id="m3-q3"
                type="text"
                inputMode="decimal"
                placeholder="Hasil (mm)"
                value={m3Ans3}
                onChange={(e) => setM3Ans3(e.target.value)}
                disabled={m3Checked}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
              />
              {m3Checked && (
                <p className={`text-xs font-semibold ${isNumericAnswerCorrect(m3Ans3, 4.72, 0.01) ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Kunci: 4,72 mm (4,5 + 22×0,01)
                </p>
              )}
            </div>
          </div>

          {!m3Checked ? (
            <button
              type="button"
              onClick={() => {
                const s1 = isNumericAnswerCorrect(m3Ans1, 6.4, 0.05) ? 1 : 0;
                const s2 = isNumericAnswerCorrect(m3Ans2, 2.36, 0.01) ? 1 : 0;
                const s3 = isNumericAnswerCorrect(m3Ans3, 4.72, 0.01) ? 1 : 0;
                const total = s1 + s2 + s3;
                setM3Checked(true);
                onSound(total >= 2 ? 'success' : 'error');
                onMissionComplete('misi3', total, 3);
              }}
              className="rounded-xl bg-[#0F1E3D] px-5 py-3 text-xs font-bold text-white hover:bg-[#1a3264]"
            >
              Periksa Semua Pembacaan
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startMission('misi3')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-[#0F1E3D]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ulangi Detektif Pengukuran
            </button>
          )}
        </div>
      )}

      {/* MISI 4: KONVERSI KILAT */}
      {activeMission === 'misi4' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {!m4Done ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-500">
                  Soal {m4Idx + 1} dari {MISI4_QUESTIONS.length}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-amber-700 tabular-nums">
                  <Clock className="h-4 w-4" />
                  Sisa waktu: {m4TimeLeft} detik
                </span>
              </div>

              <h2 className="font-mono text-2xl font-extrabold text-[#0F1E3D]">
                {MISI4_QUESTIONS[m4Idx].q}
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const currentQ = MISI4_QUESTIONS[m4Idx];
                  const ok = isNumericAnswerCorrect(m4Input, currentQ.expected, 0.05);
                  onSound(ok ? 'success' : 'error');
                  const nextScore = ok ? m4Score + 1 : m4Score;
                  setM4Score(nextScore);
                  setM4Logs((prev) => [...prev, { q: currentQ.q, ok, exp: currentQ.exp }]);
                  setM4Input('');
                  if (m4Idx + 1 < MISI4_QUESTIONS.length) {
                    setM4Idx((i) => i + 1);
                  } else {
                    setM4Done(true);
                    onMissionComplete('misi4', nextScore, MISI4_QUESTIONS.length);
                  }
                }}
                className="flex gap-2 max-w-md"
              >
                <label htmlFor="m4-answer" className="sr-only">Jawaban konversi</label>
                <input
                  id="m4-answer"
                  type="text"
                  inputMode="decimal"
                  autoFocus
                  placeholder={`Angka dalam ${MISI4_QUESTIONS[m4Idx].unit}`}
                  value={m4Input}
                  onChange={(e) => setM4Input(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-base font-bold"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F1E3D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1a3264]"
                >
                  Kirim
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              <MissionSummary
                score={m4Score}
                maxScore={MISI4_QUESTIONS.length}
                onReplay={() => startMission('misi4')}
                onBack={() => setActiveMission(null)}
              />
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-[#0F1E3D]">Pembahasan Konversi Kilat:</p>
                {m4Logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    {log.ok ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <span>
                      <strong>{log.q}</strong> — {log.exp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MISI 5: HITUNG BESARAN TURUNAN */}
      {activeMission === 'misi5' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
            Hitung Besaran Turunan (Kasus Kontekstual SMK)
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {MISI5_QUESTIONS.map((item, idx) => {
              const ok = isNumericAnswerCorrect(m5Answers[idx], item.expected, 0.05);
              return (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                  <p className="text-xs font-bold text-sky-700">{item.title}</p>
                  <p className="text-sm text-slate-800">{item.prompt}</p>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`m5-q-${idx}`} className="sr-only">{item.title}</label>
                    <input
                      id={`m5-q-${idx}`}
                      type="text"
                      inputMode="decimal"
                      placeholder={`Angka (${item.unit})`}
                      value={m5Answers[idx]}
                      onChange={(e) => {
                        const copy = [...m5Answers];
                        copy[idx] = e.target.value;
                        setM5Answers(copy);
                      }}
                      disabled={m5Checked}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
                    />
                    <span className="font-mono text-xs font-bold text-slate-600">{item.unit}</span>
                  </div>
                  {m5Checked && (
                    <p className={`text-xs font-medium ${ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {ok ? 'Benar! ' : 'Kurang tepat. '}
                      {item.exp}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!m5Checked ? (
            <button
              type="button"
              onClick={() => {
                const score = MISI5_QUESTIONS.filter((item, idx) =>
                  isNumericAnswerCorrect(m5Answers[idx], item.expected, 0.05)
                ).length;
                setM5Checked(true);
                onSound(score >= 3 ? 'success' : 'error');
                onMissionComplete('misi5', score, MISI5_QUESTIONS.length);
              }}
              className="rounded-xl bg-[#0F1E3D] px-5 py-3 text-xs font-bold text-white hover:bg-[#1a3264]"
            >
              Periksa & Simpan Skor
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startMission('misi5')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-[#0F1E3D]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Kerjakan Ulang
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MissionSummary({
  score,
  maxScore,
  onReplay,
  onBack,
}: {
  score: number;
  maxScore: number;
  onReplay: () => void;
  onBack: () => void;
}) {
  const stars = calculateStars(score, maxScore);
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Trophy className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl font-extrabold text-[#0F1E3D]">Misi Selesai!</h3>
      <p className="font-mono text-2xl font-bold text-sky-700 tabular-nums">
        Skor: {score} / {maxScore}
      </p>
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`h-6 w-6 ${stars >= s ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
          />
        ))}
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReplay}
          className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Mainkan Ulang
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264]"
        >
          Pilih Misi Lain
        </button>
      </div>
    </div>
  );
}
