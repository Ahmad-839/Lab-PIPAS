import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, HelpCircle, Minus, Plus, Shuffle } from 'lucide-react';
import { computeMicrometerReading, isNumericAnswerCorrect } from '../../utils/physicsMath';

interface SimulasiMikrometerProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

const TEST_OBJECTS = [
  { id: 'bebas', name: 'Mode Bebas (Atur Manual)', presetMm: 5.78, color: '#0284C7' },
  { id: 'kawat', name: 'Kawat Tembaga Instalasi', presetMm: 2.34, color: '#D97706' },
  { id: 'pelat', name: 'Pelat Baja Tipis', presetMm: 4.62, color: '#475569' },
  { id: 'kelereng', name: 'Kelereng Kaca Kecil', presetMm: 14.28, color: '#059669' },
  { id: 'karton', name: 'Karton Tebal', presetMm: 0.85, color: '#B45309' },
];

export function SimulasiMikrometer({ onSuccess, onSound }: SimulasiMikrometerProps) {
  const [mmValue, setMmValue] = useState<number>(5.78);
  const [selectedObjId, setSelectedObjId] = useState<string>('bebas');
  const [showLiveReading, setShowLiveReading] = useState<boolean>(true);
  const [studentMmInput, setStudentMmInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const reading = computeMicrometerReading(mmValue);
  const currentObj = TEST_OBJECTS.find((o) => o.id === selectedObjId) ?? TEST_OBJECTS[0];

  const handleSelectObject = (id: string) => {
    onSound('click');
    setSelectedObjId(id);
    const obj = TEST_OBJECTS.find((o) => o.id === id);
    if (obj) {
      setMmValue(obj.presetMm);
      setFeedback(null);
      setStudentMmInput('');
    }
  };

  const adjustHundredths = (delta: number) => {
    onSound('click');
    const next = Math.max(0, Math.min(2500, reading.hundredthsMm + delta)) / 100;
    setMmValue(next);
  };

  const handleRandomChallenge = () => {
    onSound('click');
    const rand = Math.floor(Math.random() * 1900) + 120; // 1.20 mm .. 20.20 mm
    setMmValue(rand / 100);
    setSelectedObjId('bebas');
    setShowLiveReading(false);
    setStudentMmInput('');
    setFeedback(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentMmInput.trim()) {
      setFeedback({ ok: false, msg: 'Masukkan hasil pengukuran mikrometer dalam satuan mm (contoh: 5,78).' });
      onSound('error');
      return;
    }
    if (isNumericAnswerCorrect(studentMmInput, reading.totalMm, 0.006)) {
      onSound('success');
      setFeedback({
        ok: true,
        msg: `Tepat! Skala Utama = ${reading.mainScaleMm.toFixed(1).replace('.', ',')} mm + Skala Putar (${reading.thimbleTick} × 0,01 mm) = ${reading.formattedMm} mm.`,
      });
      onSuccess();
    } else {
      onSound('error');
      setFeedback({
        ok: false,
        msg: 'Belum tepat. Cek apakah garis setengah milimeter (0,5 mm) di bagian bawah sudah terlihat di sebelah kiri tepi thimble.',
      });
    }
  };

  // Visual geometry:
  // Anvil ends at x=90. Spindle tip sits at 90 + totalMm * 3.5 px.
  // Sleeve starts at x=280, scale 1 mm = 8 px (0..25 mm = 200 px).
  const spindleWidthPx = reading.totalMm * 3.5;
  const sleeveStartX = 270;
  const pxPerMmSleeve = 8;
  const thimbleLeftX = sleeveStartX + reading.totalMm * pxPerMmSleeve;

  // Thimble visible divisions around reading.thimbleTick (-5..+5)
  const datumY = 105;
  const pxPerDiv = 7;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
            Simulasi Mikrometer Sekrup (Ketelitian 0,01 mm)
          </h3>
          <p className="text-sm text-slate-600">
            Putar thimble menggunakan slider atau pilih objek praktikum untuk mengukur ketebalan
            dengan ketelitian perseratus milimeter.
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

      {/* Micrometer Interactive SVG */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <svg viewBox="0 0 700 225" className="min-w-[620px] w-full" aria-label="Diagram interaktif mikrometer sekrup">
          {/* C-Frame */}
          <path
            d="M78 115 C78 195, 225 195, 232 120 L256 120 C250 222, 52 222, 52 115 L52 92 L78 92 Z"
            fill="#1E3A8A"
            stroke="#0F1E3D"
            strokeWidth="2"
          />
          {/* Anvil (Poros Tetap) */}
          <rect x="78" y="96" width="14" height="18" fill="#94A3B8" stroke="#0F1E3D" strokeWidth="1.5" />

          {/* Test Object */}
          {spindleWidthPx > 2 && (
            <rect
              x="92"
              y="88"
              width={spindleWidthPx}
              height="34"
              rx="2"
              fill={currentObj.color}
              stroke="#0F1E3D"
              strokeWidth="1.5"
            />
          )}

          {/* Spindle (Poros Geser) */}
          <rect
            x={92 + spindleWidthPx}
            y="97"
            width={Math.max(20, 270 - (92 + spindleWidthPx))}
            height="16"
            fill="#CBD5E1"
            stroke="#0F1E3D"
            strokeWidth="1.5"
          />

          {/* Sleeve (Skala Utama) */}
          <rect x={sleeveStartX - 18} y="74" width="232" height="62" rx="3" fill="#F8FAFC" stroke="#0F1E3D" strokeWidth="1.8" />
          {/* Horizontal datum line */}
          <line x1={sleeveStartX} y1={datumY} x2={thimbleLeftX} y2={datumY} stroke="#0F1E3D" strokeWidth="1.6" />

          {/* Sleeve Ticks: only visible to the left of the thimble edge (0..totalMm) */}
          {Array.from({ length: 51 }).map((_, halfIdx) => {
            const mm = halfIdx * 0.5;
            if (mm > reading.totalMm + 0.001) return null;
            const x = sleeveStartX + mm * pxPerMmSleeve;
            const isInteger = halfIdx % 2 === 0;
            const isFive = mm % 5 === 0;
            return (
              <g key={halfIdx}>
                {isInteger ? (
                  <>
                    <line
                      x1={x}
                      y1={datumY}
                      x2={x}
                      y2={datumY - (isFive ? 16 : 10)}
                      stroke="#0F1E3D"
                      strokeWidth={isFive ? '1.6' : '1'}
                    />
                    {isFive && (
                      <text
                        x={x}
                        y={datumY - 19}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#0F1E3D"
                      >
                        {mm}
                      </text>
                    )}
                  </>
                ) : (
                  <line
                    x1={x}
                    y1={datumY}
                    x2={x}
                    y2={datumY + 11}
                    stroke="#DC2626"
                    strokeWidth="1.2"
                  />
                )}
              </g>
            );
          })}

          {/* Rotating Thimble */}
          <g>
            <rect
              x={thimbleLeftX}
              y="62"
              width="124"
              height="86"
              rx="4"
              fill="#FEF3C7"
              stroke="#0F1E3D"
              strokeWidth="2"
            />
            {/* Thimble grip texture */}
            <rect x={thimbleLeftX + 70} y="62" width="54" height="86" rx="3" fill="#CBD5E1" stroke="#0F1E3D" strokeWidth="1.8" />
            {/* Ratchet knob */}
            <rect x={thimbleLeftX + 124} y="88" width="24" height="34" rx="4" fill="#475569" stroke="#0F1E3D" strokeWidth="1.8" />

            {/* Rotating scale ticks on thimble */}
            {Array.from({ length: 11 }).map((_, idx) => {
              const offset = idx - 5; // -5..+5 relative to active thimbleTick
              const tickNum = ((reading.thimbleTick + offset) % 50 + 50) % 50;
              const y = datumY - offset * pxPerDiv;
              if (y < 68 || y > 142) return null;
              const isAligned = offset === 0;
              const isMajor = tickNum % 5 === 0;
              return (
                <g key={idx}>
                  <line
                    x1={thimbleLeftX}
                    y1={y}
                    x2={thimbleLeftX + (isMajor ? 24 : 15)}
                    y2={y}
                    stroke={isAligned ? '#DC2626' : '#0F1E3D'}
                    strokeWidth={isAligned ? '2' : '1'}
                  />
                  {(isMajor || isAligned) && (
                    <text
                      x={thimbleLeftX + 30}
                      y={y + 3.5}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={isAligned ? '#DC2626' : '#0F1E3D'}
                    >
                      {tickNum}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Non-overlapping Labels */}
          <text x="85" y="72" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#475569">
            Poros Tetap
          </text>
          <text x="345" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">
            Skala Utama (0,5 mm)
          </text>
          <text x={thimbleLeftX + 62} y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">
            Skala Putar (Thimble)
          </text>
        </svg>
      </div>

      {/* Controls & Verification */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <label htmlFor="micro-obj-select" className="block text-xs font-bold text-slate-700">
              Pilih Objek Praktikum untuk Diukur
            </label>
            <select
              id="micro-obj-select"
              value={selectedObjId}
              onChange={(e) => handleSelectObject(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {TEST_OBJECTS.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="micro-slider">Putar Thimble (0,00 – 25,00 mm)</label>
              <span className="font-mono text-sky-700 tabular-nums">
                {showLiveReading ? `${reading.formattedMm} mm` : 'Mode Uji Aktif'}
              </span>
            </div>
            <input
              id="micro-slider"
              type="range"
              min={0}
              max={25}
              step={0.01}
              value={reading.totalMm}
              onChange={(e) => {
                setSelectedObjId('bebas');
                setMmValue(Number(e.target.value));
              }}
              className="mt-2 h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Putar Halus:</span>
            <button
              type="button"
              onClick={() => adjustHundredths(-1)}
              aria-label="Kurangi 0,01 mm"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Minus className="h-3.5 w-3.5" /> 0,01 mm
            </button>
            <button
              type="button"
              onClick={() => adjustHundredths(1)}
              aria-label="Tambah 0,01 mm"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" /> 0,01 mm
            </button>
          </div>

          {showLiveReading && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-slate-800 space-y-1">
              <p className="font-bold text-sky-900">Rincian Pembacaan Real-Time:</p>
              <p className="font-mono">
                • Skala Utama (SU): {reading.mainScaleMm.toFixed(1).replace('.', ',')} mm
              </p>
              <p className="font-mono">
                • Skala Putar (SP): garis ke-{reading.thimbleTick} × 0,01 mm ={' '}
                {(reading.thimbleTick * 0.01).toFixed(2).replace('.', ',')} mm
              </p>
              <p className="font-mono font-bold text-[#0F1E3D]">
                • Total Ketebalan: {reading.formattedMm} mm
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleCheck} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h4 className="text-sm font-bold text-[#0F1E3D]">Hitung Hasil Mikrometer Sekrup</h4>
            <p className="mt-1 text-xs text-slate-600">
              Jumlahkan Skala Utama (kelipatan 0,5 mm) dengan Skala Putar (garis sejajar sumbu × 0,01
              mm).
            </p>
            <label htmlFor="micro-answer" className="mt-4 block text-xs font-semibold text-slate-700">
              Hasil Pengukuran (mm)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="micro-answer"
                type="text"
                inputMode="decimal"
                placeholder="Contoh: 5,78"
                value={studentMmInput}
                onChange={(e) => setStudentMmInput(e.target.value)}
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
        </form>
      </div>
    </div>
  );
}
