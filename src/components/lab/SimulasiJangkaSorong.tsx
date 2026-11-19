import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, HelpCircle, Minus, Plus, Shuffle } from 'lucide-react';
import { computeVernierReading, isNumericAnswerCorrect } from '../../utils/physicsMath';

interface SimulasiJangkaSorongProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

export function SimulasiJangkaSorong({ onSuccess, onSound }: SimulasiJangkaSorongProps) {
  const [mmValue, setMmValue] = useState<number>(24.7);
  const [showLiveReading, setShowLiveReading] = useState<boolean>(true);
  const [studentCmInput, setStudentCmInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const reading = computeVernierReading(mmValue);

  const adjustTenths = (delta: number) => {
    onSound('click');
    const next = Math.max(0, Math.min(800, reading.tenthsMm + delta)) / 10;
    setMmValue(next);
  };

  const handleRandomChallenge = () => {
    onSound('click');
    const randomTenths = Math.floor(Math.random() * 580) + 45; // 4.5 mm .. 62.5 mm
    setMmValue(randomTenths / 10);
    setShowLiveReading(false);
    setStudentCmInput('');
    setFeedback(null);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCmInput.trim()) {
      setFeedback({ ok: false, msg: 'Masukkan hasil bacaan jangka sorong dalam satuan cm (contoh: 2,47).' });
      onSound('error');
      return;
    }
    if (isNumericAnswerCorrect(studentCmInput, reading.totalCm, 0.006)) {
      onSound('success');
      setFeedback({
        ok: true,
        msg: `Sempurna! Skala utama = ${(reading.mainScaleMm / 10)
          .toFixed(1)
          .replace('.', ',')} cm + nonius ke-${reading.vernierTick} × 0,01 cm = ${reading.formattedCm} cm (${reading.formattedMm} mm).`,
      });
      onSuccess();
    } else {
      onSound('error');
      setFeedback({
        ok: false,
        msg: 'Belum tepat. Perhatikan garis skala utama tepat di sebelah kiri angka 0 nonius, lalu cari garis nonius yang paling sejajar lurus!',
      });
    }
  };

  // Main Caliper Geometry:
  // 1 mm = 6 px -> 0..80 mm = 480 px
  const pxPerMm = 6;
  const xZero = 80;
  const jawShiftPx = reading.totalMm * pxPerMm;

  // Magnified Loupe Geometry: centered around the vernier zero & scale
  const zoomScale = 2.6;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
            Simulasi Jangka Sorong (Ketelitian 0,1 mm / 0,01 cm)
          </h3>
          <p className="text-sm text-slate-600">
            Geser rahang sorong untuk mengukur benda, amati rahang luar, rahang dalam, dan tangkai
            kedalaman, lalu periksa hasil pembacaan Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLiveReading(!showLiveReading)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {showLiveReading ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showLiveReading ? 'Sembunyikan Nilai (Mode Uji)' : 'Tampilkan Nilai'}
          </button>
          <button
            type="button"
            onClick={handleRandomChallenge}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-bold text-[#0F1E3D] hover:bg-amber-300"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Uji Baca Skala
          </button>
        </div>
      </div>

      {/* Caliper Main Interactive Diagram */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <svg
          viewBox="0 0 720 265"
          className="min-w-[640px] w-full"
          aria-label="Diagram interaktif jangka sorong"
        >
          {/* Part labels */}
          <text x="55" y="18" fontSize="10" fontWeight="bold" fill="#475569">Rahang Dalam</text>
          <text x="340" y="72" fontSize="10" fontWeight="bold" fill="#475569">Skala Utama (cm / mm)</text>
          <text x="55" y="248" fontSize="10" fontWeight="bold" fill="#475569">Rahang Luar</text>
          <text x="708" y="132" fontSize="10" fontWeight="bold" fill="#475569" textAnchor="end">
            Batang Kedalaman
          </text>

          {/* Depth Probe (extends to the right by jawShiftPx) */}
          <rect
            x={160 + jawShiftPx}
            y="108"
            width="470"
            height="7"
            fill="#64748B"
            stroke="#0F1E3D"
            strokeWidth="1"
          />

          {/* Fixed Main Beam + Fixed Jaws */}
          <g>
            {/* Upper fixed inner jaw */}
            <path d="M80 86 L80 28 L66 44 L66 86 Z" fill="#CBD5E1" stroke="#0F1E3D" strokeWidth="1.8" />
            {/* Lower fixed outer jaw */}
            <path d="M80 132 L80 228 L56 196 L56 132 Z" fill="#CBD5E1" stroke="#0F1E3D" strokeWidth="1.8" />
            {/* Main scale ruler bar */}
            <rect x="56" y="86" width="560" height="46" fill="#E2E8F0" stroke="#0F1E3D" strokeWidth="1.8" />

            {/* Main Scale Ticks 0..85 mm */}
            {Array.from({ length: 86 }).map((_, mm) => {
              const x = xZero + mm * pxPerMm;
              const isCm = mm % 10 === 0;
              const isHalf = mm % 5 === 0 && !isCm;
              const tickH = isCm ? 15 : isHalf ? 11 : 7;
              return (
                <g key={mm}>
                  <line
                    x1={x}
                    y1="132"
                    x2={x}
                    y2={132 - tickH}
                    stroke="#0F1E3D"
                    strokeWidth={isCm ? '1.6' : '0.9'}
                  />
                  {isCm && (
                    <text
                      x={x}
                      y="109"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#0F1E3D"
                    >
                      {mm / 10}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Measured Object between Outer Jaws */}
          {jawShiftPx > 2 && (
            <rect
              x={xZero}
              y="156"
              width={jawShiftPx}
              height="42"
              rx="2"
              fill="#0284C7"
              fillOpacity="0.85"
              stroke="#0F1E3D"
              strokeWidth="1.5"
            />
          )}

          {/* Sliding Vernier Jaw Assembly */}
          <g transform={`translate(${jawShiftPx}, 0)`}>
            {/* Upper sliding inner jaw */}
            <path d="M80 86 L80 28 L94 44 L94 86 Z" fill="#94A3B8" stroke="#0F1E3D" strokeWidth="1.8" />
            {/* Lower sliding outer jaw */}
            <path d="M80 132 L80 228 L104 196 L104 132 Z" fill="#94A3B8" stroke="#0F1E3D" strokeWidth="1.8" />
            {/* Vernier slider plate */}
            <rect
              x="76"
              y="132"
              width="74"
              height="36"
              rx="2"
              fill="#FEF3C7"
              stroke="#0F1E3D"
              strokeWidth="1.8"
            />
            <text x="113" y="163" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400E">
              Skala Nonius
            </text>

            {/* 10 Vernier divisions (each = 5.4 px = 0.9 mm) */}
            {Array.from({ length: 11 }).map((_, k) => {
              const vx = xZero + k * 5.4;
              const isAligned = k === reading.vernierTick;
              return (
                <g key={k}>
                  <line
                    x1={vx}
                    y1="132"
                    x2={vx}
                    y2={k === 0 || k === 5 || k === 10 ? 147 : 143}
                    stroke={isAligned ? '#DC2626' : '#0F1E3D'}
                    strokeWidth={isAligned ? '1.8' : '1'}
                  />
                  {(k === 0 || k === 5 || k === 10) && (
                    <text
                      x={vx}
                      y="154"
                      textAnchor="middle"
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#0F1E3D"
                    >
                      {k}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Zoom Loupe on Scale Alignment */}
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F1E3D]">
              Kaca Pembesar Skala (Zoom 2,6×) — Amati Garis Berimpit
            </span>
            <span className="font-mono text-rose-700 font-semibold">
              Garis nonius sejajar: ke-{reading.vernierTick}
            </span>
          </div>
          <svg viewBox="0 0 640 105" className="h-24 w-full" aria-label="Pembesaran skala utama dan skala nonius">
            {/* Render centered around the vernier zero */}
            <g transform={`translate(${120 - reading.totalMm * pxPerMm * zoomScale}, 0)`}>
              {/* Main scale strip */}
              <rect x="-50" y="10" width="1600" height="40" fill="#F1F5F9" stroke="#CBD5E1" />
              {Array.from({ length: 95 }).map((_, mm) => {
                const x = mm * pxPerMm * zoomScale;
                const isCm = mm % 10 === 0;
                const isHalf = mm % 5 === 0 && !isCm;
                return (
                  <g key={mm}>
                    <line
                      x1={x}
                      y1="50"
                      x2={x}
                      y2={50 - (isCm ? 24 : isHalf ? 17 : 11)}
                      stroke="#0F1E3D"
                      strokeWidth={isCm ? '2' : '1.2'}
                    />
                    {isCm && (
                      <text
                        x={x}
                        y="22"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#0F1E3D"
                      >
                        {mm / 10} cm
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Sliding Vernier zoomed */}
            <g transform="translate(120, 0)">
              <rect x="-15" y="51" width={62 * zoomScale + 30} height="44" fill="#FEF3C7" stroke="#0F1E3D" strokeWidth="1.5" />
              {Array.from({ length: 11 }).map((_, k) => {
                const vx = k * 5.4 * zoomScale;
                const isAligned = k === reading.vernierTick;
                return (
                  <g key={k}>
                    <line
                      x1={vx}
                      y1="51"
                      x2={vx}
                      y2="73"
                      stroke={isAligned ? '#DC2626' : '#0F1E3D'}
                      strokeWidth={isAligned ? '2.5' : '1.3'}
                    />
                    {isAligned && (
                      <line
                        x1={vx}
                        y1="10"
                        x2={vx}
                        y2="95"
                        stroke="#DC2626"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                    )}
                    <text
                      x={vx}
                      y="88"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={isAligned ? '#DC2626' : '#0F1E3D'}
                    >
                      {k}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Controls & Check Panel */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="caliper-slider">Geser Rahang Jangka Sorong</label>
              <span className="font-mono text-sky-700 tabular-nums">
                {showLiveReading ? `${reading.formattedCm} cm (${reading.formattedMm} mm)` : 'Mode Uji Aktif'}
              </span>
            </div>
            <input
              id="caliper-slider"
              type="range"
              min={0}
              max={80}
              step={0.1}
              value={reading.totalMm}
              onChange={(e) => setMmValue(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Geser Halus:</span>
            <button
              type="button"
              onClick={() => adjustTenths(-1)}
              aria-label="Kurangi 0,1 mm"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
            >
              <Minus className="h-3.5 w-3.5" /> 0,1 mm
            </button>
            <button
              type="button"
              onClick={() => adjustTenths(1)}
              aria-label="Tambah 0,1 mm"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" /> 0,1 mm
            </button>
          </div>

          {showLiveReading && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-slate-800 space-y-1">
              <p className="font-bold text-sky-900">Rincian Pembacaan Real-Time:</p>
              <p className="font-mono">
                • Skala Utama (SU): {(reading.mainScaleMm / 10).toFixed(1).replace('.', ',')} cm (
                {reading.mainScaleMm} mm)
              </p>
              <p className="font-mono">
                • Skala Nonius (SN): garis ke-{reading.vernierTick} × 0,01 cm ={' '}
                {(reading.vernierTick * 0.01).toFixed(2).replace('.', ',')} cm
              </p>
              <p className="font-mono font-bold text-[#0F1E3D]">
                • Hasil Akhir: {reading.formattedCm} cm ({reading.formattedMm} mm)
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleCheckAnswer} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h4 className="text-sm font-bold text-[#0F1E3D]">Periksa Hasil Pembacaan Anda</h4>
            <p className="mt-1 text-xs text-slate-600">
              Tuliskan hasil pengukuran jangka sorong pada layar di atas dalam satuan{' '}
              <strong>centimeter (cm)</strong> dengan dua angka di belakang koma.
            </p>
            <label htmlFor="caliper-answer" className="mt-4 block text-xs font-semibold text-slate-700">
              Jawaban Anda (cm)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="caliper-answer"
                type="text"
                inputMode="decimal"
                placeholder="Contoh: 2,47"
                value={studentCmInput}
                onChange={(e) => setStudentCmInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264] whitespace-nowrap"
              >
                PERIKSA JAWABAN
              </button>
            </div>
          </div>

          {feedback && (
            <div
              role="status"
              className={`mt-4 flex items-start gap-2 rounded-lg p-3 text-xs font-medium ${
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
  );
}
