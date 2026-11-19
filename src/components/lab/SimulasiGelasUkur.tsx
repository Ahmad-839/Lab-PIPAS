import React, { useState } from 'react';
import { CheckCircle2, Droplets, Eye, EyeOff, HelpCircle, Shuffle } from 'lucide-react';
import { isNumericAnswerCorrect } from '../../utils/physicsMath';

interface SimulasiGelasUkurProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

export function SimulasiGelasUkur({ onSuccess, onSound }: SimulasiGelasUkurProps) {
  const [volumeMl, setVolumeMl] = useState<number>(250);
  const [showLiveVolume, setShowLiveVolume] = useState<boolean>(true);
  const [answerMlInput, setAnswerMlInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const volumeL = volumeMl / 1000;

  const handleRandomChallenge = () => {
    onSound('click');
    // Pick clean multiples of 10 between 40 and 480 mL
    const randMl = (Math.floor(Math.random() * 45) + 4) * 10;
    setVolumeMl(randMl);
    setShowLiveVolume(false);
    setAnswerMlInput('');
    setFeedback(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerMlInput.trim()) {
      setFeedback({ ok: false, msg: 'Masukkan hasil pembacaan volume air dalam mL.' });
      onSound('error');
      return;
    }
    if (isNumericAnswerCorrect(answerMlInput, volumeMl, 5)) {
      onSound('success');
      setFeedback({
        ok: true,
        msg: `Tepat! Permukaan bawah meniskus sejajar dengan ${volumeMl} mL (${volumeL
          .toFixed(3)
          .replace('.', ',')
          .replace(/,?0+$/, '')} L).`,
      });
      onSuccess();
    } else {
      onSound('error');
      setFeedback({
        ok: false,
        msg: 'Belum tepat. Amati lengkungan bawah air (meniskus cekung) dan bandingkan dengan garis skala mL di sisi gelas.',
      });
    }
  };

  // Cylinder SVG geometry: 0 mL -> y=270, 500 mL -> y=40 (height = 230 px)
  const bottomY = 270;
  const maxH = 230;
  const liquidH = (volumeMl / 500) * maxH;
  const liquidTopY = bottomY - liquidH;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
            Simulasi Gelas Ukur (0 – 500 mL)
          </h3>
          <p className="text-sm text-slate-600">
            Atur penambahan air menggunakan slider atau tombol tuang, amati ketinggian meniskus
            cairan, dan baca skalanya dalam mL dan Liter.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLiveVolume(!showLiveVolume)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {showLiveVolume ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showLiveVolume ? 'Sembunyikan Nilai (Mode Uji)' : 'Tampilkan Nilai'}
          </button>
          <button
            type="button"
            onClick={handleRandomChallenge}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-bold text-[#0F1E3D] hover:bg-amber-300"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Tantangan Baca Skala
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Graduated Cylinder SVG */}
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:col-span-5">
          <svg viewBox="0 0 220 310" className="h-72 w-52" aria-label="Gelas ukur virtual">
            {/* Cylinder Base */}
            <path d="M55 275 L165 275 L175 292 L45 292 Z" fill="#CBD5E1" stroke="#0F1E3D" strokeWidth="2" />
            {/* Glass body */}
            <rect x="70" y="25" width="80" height="250" rx="3" fill="#FFFFFF" stroke="#0F1E3D" strokeWidth="2.5" />

            {/* Liquid fill with concave meniscus */}
            {volumeMl > 0 && (
              <g>
                <rect
                  x="72"
                  y={liquidTopY}
                  width="76"
                  height={Math.max(0, 273 - liquidTopY)}
                  fill="#38BDF8"
                  fillOpacity="0.6"
                />
                {/* Meniscus curve */}
                <path
                  d={`M 72 ${liquidTopY - 4} Q 110 ${liquidTopY + 5} 148 ${liquidTopY - 4}`}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                />
                {/* Dashed eye level guide */}
                <line
                  x1="40"
                  y1={liquidTopY}
                  x2="180"
                  y2={liquidTopY}
                  stroke="#DC2626"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              </g>
            )}

            {/* Graduated Scale Ticks: every 10 mL, major every 50 mL */}
            {Array.from({ length: 51 }).map((_, idx) => {
              const ml = idx * 10;
              if (ml === 0) return null;
              const y = bottomY - (ml / 500) * maxH;
              const isMajor = ml % 50 === 0;
              const isMid = ml % 100 === 0;
              return (
                <g key={ml}>
                  <line
                    x1="70"
                    y1={y}
                    x2={isMajor ? 92 : 80}
                    y2={y}
                    stroke="#0F1E3D"
                    strokeWidth={isMid ? '1.8' : isMajor ? '1.3' : '0.9'}
                  />
                  {isMajor && (
                    <text
                      x="97"
                      y={y + 3.5}
                      fontSize="9.5"
                      fontWeight={isMid ? 'bold' : 'normal'}
                      fontFamily="monospace"
                      fill="#0F1E3D"
                    >
                      {ml}
                    </text>
                  )}
                </g>
              );
            })}

            <text x="138" y="42" textAnchor="end" fontSize="9" fontWeight="bold" fill="#0F1E3D">
              mL
            </text>
          </svg>
        </div>

        {/* Controls & Reading Check */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <label htmlFor="cylinder-slider">Atur Volume Air (0 – 500 mL)</label>
                <span className="font-mono text-sky-700 tabular-nums">
                  {showLiveVolume ? `${volumeMl} mL (${volumeL.toFixed(3).replace('.', ',')} L)` : 'Mode Uji Aktif'}
                </span>
              </div>
              <input
                id="cylinder-slider"
                type="range"
                min={0}
                max={500}
                step={5}
                value={volumeMl}
                onChange={(e) => setVolumeMl(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-sky-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[10, 25, 50].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => {
                    onSound('click');
                    setVolumeMl((v) => Math.min(500, v + inc));
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100"
                >
                  <Droplets className="h-3.5 w-3.5" />+{inc} mL
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onSound('click');
                  setVolumeMl(0);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kosongkan
              </button>
            </div>

            {showLiveVolume && (
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
                <div>
                  <p className="text-xs text-slate-500">Volume dalam mililiter</p>
                  <p className="font-mono text-xl font-bold text-[#0F1E3D] tabular-nums">
                    {volumeMl} mL
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Volume dalam Liter</p>
                  <p className="font-mono text-xl font-bold text-sky-700 tabular-nums">
                    {volumeL.toFixed(3).replace('.', ',')} L
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleCheck} className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-[#0F1E3D]">Tantangan Membaca Skala Gelas Ukur</h4>
            <p className="mt-1 text-xs text-slate-600">
              Garis merah putus-putus menunjukkan dasar cekungan meniskus air. Tuliskan volume air
              terukur dalam satuan <strong>mL</strong>.
            </p>
            <div className="mt-3 flex gap-2">
              <label htmlFor="cylinder-answer" className="sr-only">
                Volume dalam mL
              </label>
              <input
                id="cylinder-answer"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 250"
                value={answerMlInput}
                onChange={(e) => setAnswerMlInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264] whitespace-nowrap"
              >
                Periksa Skala
              </button>
            </div>

            {feedback && (
              <div
                role="status"
                className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-xs font-medium ${
                  feedback.ok
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                {feedback.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
