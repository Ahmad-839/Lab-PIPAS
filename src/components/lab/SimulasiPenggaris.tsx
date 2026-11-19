import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, Shuffle } from 'lucide-react';
import { computeRulerReading, isNumericAnswerCorrect } from '../../utils/physicsMath';

interface SimulasiPenggarisProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

const OBJECT_OPTIONS = [
  { id: 'pensil', name: 'Pensil Gambar 2B', color: '#F59E0B' },
  { id: 'penghapus', name: 'Penghapus Karet', color: '#0284C7' },
  { id: 'kunci', name: 'Pelat Besi Praktik', color: '#475569' },
];

export function SimulasiPenggaris({ onSuccess, onSound }: SimulasiPenggarisProps) {
  const [startCm, setStartCm] = useState<number>(1.5);
  const [endCm, setEndCm] = useState<number>(8.2);
  const [selectedObjId, setSelectedObjId] = useState<string>('pensil');
  const [hideAnswer, setHideAnswer] = useState<boolean>(true);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const reading = computeRulerReading(startCm, endCm);
  const selectedObj = OBJECT_OPTIONS.find((o) => o.id === selectedObjId) ?? OBJECT_OPTIONS[0];

  const handleRandomChallenge = () => {
    onSound('click');
    const s = Math.round((Math.random() * 4 + 0.5) * 10) / 10;
    const len = Math.round((Math.random() * 6 + 2) * 10) / 10;
    setStartCm(s);
    setEndCm(Math.min(14.5, Math.round((s + len) * 10) / 10));
    setHideAnswer(true);
    setAnswerInput('');
    setFeedback(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) {
      setFeedback({ ok: false, msg: 'Masukkan angka panjang benda terlebih dahulu (dalam cm).' });
      onSound('error');
      return;
    }
    if (isNumericAnswerCorrect(answerInput, reading.lengthCm, 0.05)) {
      onSound('success');
      setFeedback({
        ok: true,
        msg: `Tepat! Panjang benda = ${reading.endCm.toFixed(1).replace('.', ',')} - ${reading.startCm
          .toFixed(1)
          .replace('.', ',')} = ${reading.formattedCm} cm (${reading.lengthMm} mm).`,
      });
      onSuccess();
    } else {
      onSound('error');
      setFeedback({
        ok: false,
        msg: 'Belum tepat. Ingat: Panjang benda = Posisi Akhir - Posisi Awal.',
      });
    }
  };

  // SVG ruler mapping: 0 cm -> x=30, 15 cm -> x=630 (40px per cm, 4px per mm)
  const pxPerCm = 40;
  const x0 = 30;
  const objLeftX = x0 + reading.startCm * pxPerCm;
  const objWidthPx = Math.max(8, reading.lengthCm * pxPerCm);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
            Simulasi Penggaris Virtual (Ketelitian 0,1 cm / 1 mm)
          </h3>
          <p className="text-sm text-slate-600">
            Atur posisi awal dan akhir benda di atas mistar, lalu hitung panjangnya dengan tepat.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHideAnswer(!hideAnswer)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {hideAnswer ? 'Tampilkan Nilai Asli' : 'Sembunyikan Nilai (Mode Uji)'}
          </button>
          <button
            type="button"
            onClick={handleRandomChallenge}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-bold text-[#0F1E3D] hover:bg-amber-300"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Soal Acak
          </button>
        </div>
      </div>

      {/* Interactive SVG Ruler Canvas */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <svg viewBox="0 0 660 190" className="min-w-[580px] w-full" aria-label="Penggaris virtual interaktif">
          {/* Object being measured */}
          <g>
            {/* Dashed alignment guide lines */}
            <line
              x1={objLeftX}
              y1="25"
              x2={objLeftX}
              y2="132"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <line
              x1={objLeftX + objWidthPx}
              y1="25"
              x2={objLeftX + objWidthPx}
              y2="132"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Object rectangle */}
            <rect
              x={objLeftX}
              y="38"
              width={objWidthPx}
              height="36"
              rx="4"
              fill={selectedObj.color}
              stroke="#0F1E3D"
              strokeWidth="2"
            />
            <text
              x={objLeftX + objWidthPx / 2}
              y="60"
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#FFFFFF"
            >
              {objWidthPx > 75 ? selectedObj.name : ''}
            </text>
          </g>

          {/* Ruler body */}
          <rect x="14" y="88" width="632" height="68" rx="4" fill="#FEF08A" stroke="#0F1E3D" strokeWidth="2" />

          {/* Millimeter & Centimeter ticks (0 to 15 cm) */}
          {Array.from({ length: 151 }).map((_, mm) => {
            const x = x0 + mm * (pxPerCm / 10);
            const isCm = mm % 10 === 0;
            const isHalfCm = mm % 5 === 0 && !isCm;
            const tickLen = isCm ? 26 : isHalfCm ? 18 : 11;
            return (
              <g key={mm}>
                <line
                  x1={x}
                  y1="88"
                  x2={x}
                  y2={88 + tickLen}
                  stroke="#0F1E3D"
                  strokeWidth={isCm ? '1.8' : '1'}
                />
                {isCm && (
                  <text
                    x={x}
                    y="130"
                    textAnchor="middle"
                    fontSize="12"
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

          <text x="615" y="147" fontSize="11" fontWeight="bold" fill="#0F1E3D">
            cm
          </text>

          {/* Start & End Labels */}
          <text x={objLeftX} y="176" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626" fontFamily="monospace">
            Awal: {reading.startCm.toFixed(1).replace('.', ',')} cm
          </text>
          <text
            x={objLeftX + objWidthPx}
            y="176"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#0284C7"
            fontFamily="monospace"
          >
            Akhir: {reading.endCm.toFixed(1).replace('.', ',')} cm
          </text>
        </svg>
      </div>

      {/* Controls & Student Check */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <label htmlFor="ruler-object-select" className="block text-xs font-bold text-slate-700">
              Pilih Benda yang Diukur
            </label>
            <select
              id="ruler-object-select"
              value={selectedObjId}
              onChange={(e) => setSelectedObjId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {OBJECT_OPTIONS.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="ruler-start">Posisi Awal Benda</label>
              <span className="font-mono text-rose-700 tabular-nums">
                {startCm.toFixed(1).replace('.', ',')} cm
              </span>
            </div>
            <input
              id="ruler-start"
              type="range"
              min={0}
              max={12}
              step={0.1}
              value={startCm}
              onChange={(e) => {
                const val = Number(e.target.value);
                setStartCm(val);
                if (val >= endCm) setEndCm(Math.min(15, Math.round((val + 0.5) * 10) / 10));
              }}
              className="mt-1.5 h-2 w-full cursor-pointer accent-rose-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="ruler-end">Posisi Akhir Benda</label>
              <span className="font-mono text-sky-700 tabular-nums">
                {endCm.toFixed(1).replace('.', ',')} cm
              </span>
            </div>
            <input
              id="ruler-end"
              type="range"
              min={0.5}
              max={15}
              step={0.1}
              value={endCm}
              onChange={(e) => {
                const val = Number(e.target.value);
                setEndCm(val);
                if (val <= startCm) setStartCm(Math.max(0, Math.round((val - 0.5) * 10) / 10));
              }}
              className="mt-1.5 h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>

          {!hideAnswer && (
            <div className="rounded-lg bg-sky-50 p-3 text-xs text-sky-900">
              Nilai Terukur Sistem:{' '}
              <strong className="font-mono text-sm">
                {reading.formattedCm} cm ({reading.lengthMm} mm)
              </strong>
            </div>
          )}
        </div>

        <form onSubmit={handleCheck} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h4 className="text-sm font-bold text-[#0F1E3D]">Uji Pembacaan Skala Penggaris</h4>
            <p className="mt-1 text-xs text-slate-600">
              Hitung selisih antara posisi akhir dan posisi awal benda, lalu masukkan hasilnya dalam
              satuan cm.
            </p>
            <label htmlFor="ruler-answer-input" className="mt-4 block text-xs font-semibold text-slate-700">
              Hasil Pengukuran (cm)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="ruler-answer-input"
                type="text"
                inputMode="decimal"
                placeholder="Contoh: 6,7"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264] whitespace-nowrap"
              >
                Periksa Jawaban
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

          <button
            type="button"
            onClick={() => {
              setStartCm(0);
              setEndCm(5.5);
              setAnswerInput('');
              setFeedback(null);
            }}
            className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset ke posisi nol
          </button>
        </form>
      </div>
    </div>
  );
}
