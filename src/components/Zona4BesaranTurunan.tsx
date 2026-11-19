import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { DERIVED_QUANTITIES_META, type DerivedQuantityMeta } from '../data/curriculum';
import type { DerivedQuantityType, StudentProgress, ZoneId } from '../types';
import { calculateDerivedQuantity, formatCleanNumber } from '../utils/physicsMath';

interface Zona4Props {
  progress: StudentProgress;
  onCalculated: (type: DerivedQuantityType) => void;
  onNavigate: (zone: ZoneId) => void;
}

export function Zona4BesaranTurunan({ progress, onCalculated, onNavigate }: Zona4Props) {
  const [selectedMeta, setSelectedMeta] = useState<DerivedQuantityMeta>(DERIVED_QUANTITIES_META[0]);
  const [valA, setValA] = useState<number>(DERIVED_QUANTITIES_META[0].defaultA);
  const [valB, setValB] = useState<number>(DERIVED_QUANTITIES_META[0].defaultB);
  const [valC, setValC] = useState<number>(1);

  const handleSelectType = (meta: DerivedQuantityMeta) => {
    setSelectedMeta(meta);
    setValA(meta.defaultA);
    setValB(meta.defaultB);
    setValC(meta.defaultC ?? 1);
    onCalculated(meta.type);
  };

  useEffect(() => {
    onCalculated(selectedMeta.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = calculateDerivedQuantity(selectedMeta.type, {
    a: valA,
    b: valB,
    c: valC,
  });

  const handleInputChange = (setter: (n: number) => void, raw: string) => {
    const parsed = Number(raw.replace(',', '.'));
    if (Number.isFinite(parsed)) {
      setter(parsed);
      onCalculated(selectedMeta.type);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold text-sky-700">
          Zona 4 · Tujuan Pembelajaran: Memahami Penurunan Besaran Turunan dari Besaran Pokok
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
          Kalkulator & Visualisasi Besaran Turunan
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Besaran turunan dibentuk dari kombinasi perkalian atau pembagian besaran pokok. Pilih
          besaran turunan di bawah ini, ubah nilainya, dan amati perubahan visual serta langkah
          penurunan satuannya secara langsung.
        </p>
        <p className="mt-3 font-mono text-xs font-semibold text-[#0F1E3D] tabular-nums">
          Rumus Dieksplorasi: {progress.zona4CalculatedTypes.length} / 7
        </p>
      </div>

      {/* 7 Derived Quantity Selector */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {DERIVED_QUANTITIES_META.map((meta) => {
          const active = meta.type === selectedMeta.type;
          const explored = progress.zona4CalculatedTypes.includes(meta.type);
          return (
            <button
              key={meta.type}
              type="button"
              onClick={() => handleSelectType(meta)}
              aria-pressed={active}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                active
                  ? 'border-sky-600 bg-[#0F1E3D] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-sky-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono font-bold ${active ? 'text-amber-300' : 'text-sky-700'}`}>
                  {meta.symbol}
                </span>
                {explored && (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${active ? 'text-amber-300' : 'text-emerald-600'}`}
                  />
                )}
              </div>
              <p className="mt-2 font-display text-xs font-bold leading-snug">{meta.name}</p>
              <p className={`mt-1 font-mono text-[11px] ${active ? 'text-sky-200' : 'text-slate-500'}`}>
                [{meta.unit}]
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Split Console: Controls + Live Visualizer */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Input Controls & Step-by-Step Result (6 cols) */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div>
            <p className="text-xs font-semibold text-sky-700">Rumus Fisika</p>
            <h2 className="mt-0.5 font-display text-xl font-extrabold text-[#0F1E3D]">
              {selectedMeta.name} — <span className="font-mono text-sky-700">{selectedMeta.formula}</span>
            </h2>
            <p className="mt-1 text-xs text-slate-600">{selectedMeta.realExample}</p>
          </div>

          {/* Input A */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="derived-input-a" className="text-xs font-bold text-slate-700">
                {selectedMeta.inputALabel} ({selectedMeta.inputAUnit})
              </label>
              <input
                id="derived-input-a"
                type="number"
                step="any"
                value={valA}
                onChange={(e) => handleInputChange(setValA, e.target.value)}
                className="w-28 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-sm font-bold text-[#0F1E3D]"
              />
            </div>
            <input
              type="range"
              aria-label={`Slider ${selectedMeta.inputALabel}`}
              min={selectedMeta.minA}
              max={selectedMeta.maxA}
              step={selectedMeta.stepA}
              value={Math.min(selectedMeta.maxA, Math.max(selectedMeta.minA, valA))}
              onChange={(e) => {
                setValA(Number(e.target.value));
                onCalculated(selectedMeta.type);
              }}
              className="h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>

          {/* Input B */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="derived-input-b" className="text-xs font-bold text-slate-700">
                {selectedMeta.inputBLabel} ({selectedMeta.inputBUnit})
              </label>
              <input
                id="derived-input-b"
                type="number"
                step="any"
                value={valB}
                onChange={(e) => handleInputChange(setValB, e.target.value)}
                className="w-28 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-sm font-bold text-[#0F1E3D]"
              />
            </div>
            <input
              type="range"
              aria-label={`Slider ${selectedMeta.inputBLabel}`}
              min={selectedMeta.minB}
              max={selectedMeta.maxB}
              step={selectedMeta.stepB}
              value={Math.min(selectedMeta.maxB, Math.max(selectedMeta.minB, valB))}
              onChange={(e) => {
                setValB(Number(e.target.value));
                onCalculated(selectedMeta.type);
              }}
              className="h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>

          {/* Optional Input C (Volume Tinggi) */}
          {selectedMeta.inputCLabel && (
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="derived-input-c" className="text-xs font-bold text-slate-700">
                  {selectedMeta.inputCLabel} ({selectedMeta.inputCUnit})
                </label>
                <input
                  id="derived-input-c"
                  type="number"
                  step="any"
                  value={valC}
                  onChange={(e) => handleInputChange(setValC, e.target.value)}
                  className="w-28 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-sm font-bold text-[#0F1E3D]"
                />
              </div>
              <input
                type="range"
                aria-label={`Slider ${selectedMeta.inputCLabel}`}
                min={selectedMeta.minC ?? 0.5}
                max={selectedMeta.maxC ?? 10}
                step={selectedMeta.stepC ?? 0.5}
                value={Math.min(selectedMeta.maxC ?? 10, Math.max(selectedMeta.minC ?? 0.5, valC))}
                onChange={(e) => {
                  setValC(Number(e.target.value));
                  onCalculated(selectedMeta.type);
                }}
                className="h-2 w-full cursor-pointer accent-sky-600"
              />
            </div>
          )}

          {/* Calculation Output */}
          {result.valid ? (
            <div className="rounded-xl bg-[#0F1E3D] p-5 text-white">
              <p className="text-xs text-sky-200">Hasil Perhitungan Otomatis</p>
              <p
                data-testid="derived-result"
                className="mt-1 font-mono text-3xl font-extrabold text-amber-300 tabular-nums"
              >
                {result.formattedValue} <span className="text-lg text-white">{result.unit}</span>
              </p>
              <div className="mt-3 space-y-1 border-t border-white/15 pt-3 text-xs text-sky-100">
                {result.steps.map((s, idx) => (
                  <p key={idx} className="font-mono">
                    {s}
                  </p>
                ))}
                <p className="mt-2 font-semibold text-amber-200">
                  Asal Besaran Pokok: {result.baseDerivation}
                </p>
              </div>
            </div>
          ) : (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
              {result.error}
            </div>
          )}
        </div>

        {/* Right: Dynamic Visual Simulation (6 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div>
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-[#0F1E3D]">
              <FlaskConical className="h-4 w-4 text-sky-600" />
              Visualisasi Perubahan Nilai Secara Langsung
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Ubah slider atau input di samping untuk melihat respons fisik/geometrisnya.
            </p>

            <div className="mt-5 flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
              {/* LUAS */}
              {selectedMeta.type === 'luas' && (
                <svg viewBox="0 0 320 220" className="h-full w-full" aria-label="Visualisasi luas bidang">
                  {(() => {
                    const w = Math.min(240, Math.max(30, (valA / 20) * 230));
                    const h = Math.min(150, Math.max(25, (valB / 20) * 140));
                    const x = 160 - w / 2;
                    const y = 110 - h / 2;
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          fill="#38BDF8"
                          fillOpacity="0.4"
                          stroke="#0F1E3D"
                          strokeWidth="2.5"
                        />
                        <text x="160" y={y - 8} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          p = {formatCleanNumber(valA)} m
                        </text>
                        <text x={x + w + 10} y="114" fontSize="11" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          l = {formatCleanNumber(valB)} m
                        </text>
                        <text x="160" y="114" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          {result.formattedValue} m²
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              )}

              {/* VOLUME */}
              {selectedMeta.type === 'volume' && (
                <svg viewBox="0 0 320 220" className="h-full w-full" aria-label="Visualisasi volume balok">
                  {(() => {
                    const w = Math.min(170, Math.max(35, (valA / 10) * 150));
                    const d = Math.min(55, Math.max(15, (valB / 10) * 50));
                    const h = Math.min(115, Math.max(25, (valC / 10) * 105));
                    const x = 90;
                    const y = 175 - h;
                    return (
                      <g>
                        {/* Front face */}
                        <rect x={x} y={y} width={w} height={h} fill="#0284C7" fillOpacity="0.65" stroke="#0F1E3D" strokeWidth="2" />
                        {/* Top face */}
                        <polygon
                          points={`${x},${y} ${x + d},${y - d * 0.6} ${x + w + d},${y - d * 0.6} ${x + w},${y}`}
                          fill="#7DD3FC"
                          stroke="#0F1E3D"
                          strokeWidth="2"
                        />
                        {/* Side face */}
                        <polygon
                          points={`${x + w},${y} ${x + w + d},${y - d * 0.6} ${x + w + d},${y + h - d * 0.6} ${x + w},${y + h}`}
                          fill="#0369A1"
                          stroke="#0F1E3D"
                          strokeWidth="2"
                        />
                        <text x="160" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          Volume = {result.formattedValue} m³
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              )}

              {/* KECEPATAN & PERCEPATAN */}
              {(selectedMeta.type === 'kecepatan' || selectedMeta.type === 'percepatan') && (
                <svg viewBox="0 0 320 200" className="h-full w-full" aria-label="Visualisasi gerak dan kecepatan">
                  <line x1="25" y1="135" x2="295" y2="135" stroke="#0F1E3D" strokeWidth="3" />
                  <line x1="25" y1="135" x2="295" y2="135" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="8 6" />
                  <motion.g
                    animate={{ x: [0, 210, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: Math.max(0.8, Math.min(8, 25 / Math.max(1, result.value))),
                      ease: 'linear',
                    }}
                  >
                    <rect x="30" y="98" width="52" height="28" rx="6" fill="#0284C7" stroke="#0F1E3D" strokeWidth="2" />
                    <circle cx="42" cy="128" r="7" fill="#0F1E3D" />
                    <circle cx="70" cy="128" r="7" fill="#0F1E3D" />
                    <rect x="40" y="103" width="18" height="10" rx="2" fill="#BAE6FD" />
                  </motion.g>
                  <text x="160" y="50" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    {selectedMeta.symbol} = {result.formattedValue} {result.unit}
                  </text>
                  <text x="160" y="70" textAnchor="middle" fontSize="11" fill="#475569">
                    Semakin besar nilai, semakin cepat kendaraan bergerak!
                  </text>
                </svg>
              )}

              {/* GAYA */}
              {selectedMeta.type === 'gaya' && (
                <svg viewBox="0 0 320 200" className="h-full w-full" aria-label="Visualisasi gaya dorong">
                  <line x1="20" y1="145" x2="300" y2="145" stroke="#0F1E3D" strokeWidth="3" />
                  {/* Force Arrow */}
                  {(() => {
                    const arrowLen = Math.min(115, Math.max(25, (result.value / 500) * 110));
                    return (
                      <g>
                        <line
                          x1={150 - arrowLen}
                          y1="115"
                          x2="150"
                          y2="115"
                          stroke="#F59E0B"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <polygon points="160,115 144,104 144,126" fill="#F59E0B" />
                      </g>
                    );
                  })()}
                  {/* Block scaled by mass */}
                  <rect
                    x="164"
                    y={145 - Math.min(85, Math.max(35, 35 + (valA / 100) * 50))}
                    width={Math.min(95, Math.max(45, 45 + (valA / 100) * 50))}
                    height={Math.min(85, Math.max(35, 35 + (valA / 100) * 50))}
                    rx="4"
                    fill="#0284C7"
                    stroke="#0F1E3D"
                    strokeWidth="2"
                  />
                  <text x="160" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    F = {result.formattedValue} N
                  </text>
                </svg>
              )}

              {/* MASSA JENIS */}
              {selectedMeta.type === 'massa_jenis' && (
                <svg viewBox="0 0 320 210" className="h-full w-full" aria-label="Visualisasi massa jenis dalam air">
                  {/* Water tank (ρ air = 1000 kg/m³) */}
                  <rect x="85" y="45" width="150" height="135" rx="4" fill="#FFFFFF" stroke="#0F1E3D" strokeWidth="2.5" />
                  <rect x="87" y="82" width="146" height="96" fill="#7DD3FC" fillOpacity="0.55" />
                  {/* Block position depends on density vs 1000 kg/m³ */}
                  {(() => {
                    const sinks = result.value > 1000;
                    const yPos = sinks ? 132 : result.value === 1000 ? 105 : 64;
                    return (
                      <g>
                        <rect
                          x="136"
                          y={yPos}
                          width="48"
                          height="42"
                          rx="4"
                          fill={sinks ? '#334155' : '#F59E0B'}
                          stroke="#0F1E3D"
                          strokeWidth="2"
                        />
                        <text x="160" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          ρ = {result.formattedValue} kg/m³ ({sinks ? 'Tenggelam di air' : 'Mengapung di air'})
                        </text>
                      </g>
                    );
                  })()}
                  <text x="160" y="198" textAnchor="middle" fontSize="10" fill="#475569">
                    Patokan massa jenis air = 1.000 kg/m³
                  </text>
                </svg>
              )}

              {/* TEKANAN */}
              {selectedMeta.type === 'tekanan' && (
                <svg viewBox="0 0 320 210" className="h-full w-full" aria-label="Visualisasi tekanan pada luas bidang">
                  <line x1="30" y1="165" x2="290" y2="165" stroke="#0F1E3D" strokeWidth="3" />
                  {(() => {
                    const contactW = Math.min(180, Math.max(24, (valB / 10) * 170));
                    const x = 160 - contactW / 2;
                    return (
                      <g>
                        <rect x={x} y="110" width={contactW} height="52" rx="3" fill="#0284C7" stroke="#0F1E3D" strokeWidth="2" />
                        <line x1="160" y1="55" x2="160" y2="100" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                        <polygon points="160,108 150,94 170,94" fill="#F59E0B" />
                        <text x="160" y="42" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                          P = {result.formattedValue} Pa (A = {formatCleanNumber(valB)} m²)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Setiap besaran turunan dapat diturunkan kembali ke 7 besaran pokok SI.
            </span>
            <button
              type="button"
              onClick={() => onNavigate('zona5')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 whitespace-nowrap"
            >
              Lanjut ke Konversi Satuan
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
