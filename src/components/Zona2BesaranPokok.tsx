import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Wrench } from 'lucide-react';
import { BASE_QUANTITIES, type BaseQuantityInfo } from '../data/curriculum';
import type { StudentProgress, ZoneId } from '../types';

interface Zona2Props {
  progress: StudentProgress;
  onExploreQuantity: (id: string) => void;
  onNavigate: (zone: ZoneId) => void;
}

export function Zona2BesaranPokok({
  progress,
  onExploreQuantity,
  onNavigate,
}: Zona2Props) {
  const [selected, setSelected] = useState<BaseQuantityInfo>(BASE_QUANTITIES[0]);
  const [simParam, setSimParam] = useState<number>(50); // interactive slider parameter 0..100 for live animation

  const handleSelectCard = (q: BaseQuantityInfo) => {
    setSelected(q);
    onExploreQuantity(q.id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold text-sky-700">
          Zona 2 · Tujuan Pembelajaran: Menguasai 7 Besaran Pokok Sistem Internasional (SI)
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
          Laboratorium Besaran Pokok SI
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Ada tujuh besaran pokok yang menjadi fondasi seluruh pengukuran fisika dan teknik. Klik
          ketujuh kartu di bawah ini untuk melihat simulasi animasi, simbol, satuan SI, alat ukur,
          dan penerapannya.
        </p>
        <p className="mt-3 font-mono text-xs font-semibold text-[#0F1E3D] tabular-nums">
          Besaran Pokok Dijelajahi: {progress.zona2ExploredQuantities.length} / 7
        </p>
      </div>

      {/* 7 Interactive SI Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {BASE_QUANTITIES.map((q, index) => {
          const isSelected = selected.id === q.id;
          const isExplored = progress.zona2ExploredQuantities.includes(q.id);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => handleSelectCard(q)}
              aria-pressed={isSelected}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-sky-600 ${
                isSelected
                  ? 'border-sky-600 bg-[#0F1E3D] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-sky-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-mono font-bold ${
                      isSelected ? 'text-amber-300' : 'text-sky-700'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  {isExplored && (
                    <CheckCircle2
                      className={`h-4 w-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}
                      aria-label="Sudah dipelajari"
                    />
                  )}
                </div>
                <h2 className="mt-2 font-display text-sm font-bold leading-snug">{q.name}</h2>
              </div>
              <div className="mt-4 border-t border-current/10 pt-2.5">
                <p className={`text-xs ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                  Satuan SI
                </p>
                <p className="font-mono text-sm font-bold">
                  {q.siUnit} ({q.unitSymbol})
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Base Quantity Interactive Stage & Details */}
      <motion.section
        key={selected.id}
        initial={{ opacity: 0.75, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:grid-cols-12"
      >
        {/* Left: Live Animated Visualizer (6 cols) */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#0F1E3D]">
                Visualisasi Interaktif: {selected.name}
              </h3>
              <span className="font-mono text-xs font-bold text-sky-700">
                Simbol: {selected.symbol} · [{selected.unitSymbol}]
              </span>
            </div>

            {/* Dynamic SVG Animation per Base Quantity */}
            <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-slate-200 bg-white p-4">
              {selected.animType === 'length' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi besaran panjang">
                  <rect x="20" y="75" width="280" height="32" rx="4" fill="#FDE68A" stroke="#0F1E3D" strokeWidth="2" />
                  {Array.from({ length: 21 }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={30 + idx * 13}
                      y1="75"
                      x2={30 + idx * 13}
                      y2={idx % 5 === 0 ? 94 : 85}
                      stroke="#0F1E3D"
                      strokeWidth="1.5"
                    />
                  ))}
                  <rect
                    x="30"
                    y="38"
                    width={26 + (simParam / 100) * 234}
                    height="24"
                    rx="4"
                    fill="#0284C7"
                  />
                  <text x="160" y="25" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    l = {(0.1 + (simParam / 100) * 1.9).toFixed(2).replace('.', ',')} m
                  </text>
                </svg>
              )}

              {selected.animType === 'mass' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi besaran massa">
                  <polygon points="160,122 145,102 175,102" fill="#0F1E3D" />
                  <rect x="120" y="122" width="80" height="8" rx="3" fill="#0F1E3D" />
                  <g transform={`rotate(${(simParam - 50) * 0.25} 160 72)`}>
                    <line x1="70" y1="72" x2="250" y2="72" stroke="#0F1E3D" strokeWidth="4" strokeLinecap="round" />
                    <rect x="52" y="46" width="36" height="24" rx="4" fill="#0284C7" />
                    <text x="70" y="62" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Benda</text>
                    <rect x="232" y={72 - (14 + (simParam / 100) * 24)} width="36" height={14 + (simParam / 100) * 24} rx="4" fill="#F59E0B" />
                  </g>
                  <text x="160" y="24" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    m = {(0.5 + (simParam / 100) * 9.5).toFixed(1).replace('.', ',')} kg
                  </text>
                </svg>
              )}

              {selected.animType === 'time' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi besaran waktu">
                  <circle cx="160" cy="76" r="46" fill="#F8FAFC" stroke="#0F1E3D" strokeWidth="3" />
                  <motion.line
                    x1="160"
                    y1="76"
                    x2="160"
                    y2="38"
                    stroke="#0284C7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      ease: 'linear',
                      duration: Math.max(1, 10 - (simParam / 100) * 8),
                    }}
                    style={{ originX: '160px', originY: '76px' }}
                  />
                  <circle cx="160" cy="76" r="4" fill="#F59E0B" />
                  <text x="160" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    Laju Putaran Jarum Sekon (s)
                  </text>
                </svg>
              )}

              {selected.animType === 'temp' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi besaran suhu">
                  <rect x="148" y="22" width="24" height="82" rx="12" fill="#F1F5F9" stroke="#0F1E3D" strokeWidth="2.5" />
                  <circle cx="160" cy="110" r="17" fill="#EF4444" stroke="#0F1E3D" strokeWidth="2.5" />
                  <rect
                    x="154"
                    y={92 - (simParam / 100) * 60}
                    width="12"
                    height={18 + (simParam / 100) * 60}
                    fill="#EF4444"
                  />
                  <text x="230" y="65" fontSize="14" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    {Math.round(273.15 + (simParam / 100) * 100)} K
                  </text>
                  <text x="230" y="85" fontSize="11" fill="#64748B" fontFamily="monospace">
                    ({Math.round((simParam / 100) * 100)} °C)
                  </text>
                </svg>
              )}

              {selected.animType === 'current' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi kuat arus listrik">
                  <rect x="45" y="42" width="230" height="62" rx="12" fill="none" stroke="#0F1E3D" strokeWidth="4" />
                  <circle cx="160" cy="42" r="16" fill="#FEF08A" stroke="#0F1E3D" strokeWidth="2" />
                  <text x="160" y="46" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F1E3D">A</text>
                  {[0, 1, 2, 3].map((dot) => (
                    <motion.circle
                      key={dot}
                      cy="104"
                      r="5"
                      fill="#0284C7"
                      animate={{ cx: [65, 255] }}
                      transition={{
                        repeat: Infinity,
                        duration: Math.max(0.5, 3 - (simParam / 100) * 2.4),
                        delay: dot * 0.4,
                        ease: 'linear',
                      }}
                    />
                  ))}
                  <text x="160" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    I = {(0.5 + (simParam / 100) * 9.5).toFixed(1).replace('.', ',')} A
                  </text>
                </svg>
              )}

              {selected.animType === 'mole' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi jumlah zat">
                  <rect x="95" y="28" width="130" height="92" rx="8" fill="#F8FAFC" stroke="#0F1E3D" strokeWidth="2.5" />
                  {Array.from({ length: Math.max(3, Math.round((simParam / 100) * 18)) }).map((_, idx) => {
                    const col = idx % 6;
                    const row = Math.floor(idx / 6);
                    return (
                      <motion.circle
                        key={idx}
                        cx={114 + col * 18}
                        cy={52 + row * 24}
                        r="6"
                        fill={idx % 2 === 0 ? '#0284C7' : '#F59E0B'}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: idx * 0.08 }}
                      />
                    );
                  })}
                  <text x="160" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    n = {(0.5 + (simParam / 100) * 4.5).toFixed(1).replace('.', ',')} mol
                  </text>
                </svg>
              )}

              {selected.animType === 'light' && (
                <svg viewBox="0 0 320 140" className="h-full w-full" aria-label="Animasi intensitas cahaya">
                  <circle
                    cx="160"
                    cy="74"
                    r={22 + (simParam / 100) * 32}
                    fill="#FDE047"
                    fillOpacity={0.25 + (simParam / 100) * 0.45}
                  />
                  <circle cx="160" cy="74" r="16" fill="#FACC15" stroke="#0F1E3D" strokeWidth="2.5" />
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const angle = (idx * 45 * Math.PI) / 180;
                    const len = 24 + (simParam / 100) * 26;
                    return (
                      <line
                        key={idx}
                        x1={160 + Math.cos(angle) * 20}
                        y1={74 + Math.sin(angle) * 20}
                        x2={160 + Math.cos(angle) * len}
                        y2={74 + Math.sin(angle) * len}
                        stroke="#D97706"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <text x="160" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F1E3D" fontFamily="monospace">
                    Iv = {Math.round(10 + (simParam / 100) * 190)} cd
                  </text>
                </svg>
              )}
            </div>
          </div>

          {/* Interactive Parameter Slider */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <label htmlFor="zona2-sim-slider">Ubah Intensitas Simulasi ({selected.name})</label>
              <span className="font-mono font-semibold text-sky-700 tabular-nums">{simParam}%</span>
            </div>
            <input
              id="zona2-sim-slider"
              type="range"
              min={5}
              max={100}
              value={simParam}
              onChange={(e) => setSimParam(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-sky-600"
            />
          </div>
        </div>

        {/* Right: Structured Specifications (6 cols) */}
        <div className="flex flex-col justify-between lg:col-span-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-sky-700">Spesifikasi Besaran Pokok SI</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
                {selected.name} ({selected.symbol})
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.definition}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Simbol Besaran</p>
                <p className="mt-1 font-mono text-xl font-bold text-[#0F1E3D]">{selected.symbol}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Satuan SI & Simbol</p>
                <p className="mt-1 font-mono text-xl font-bold text-sky-700">
                  {selected.siUnit} ({selected.unitSymbol})
                </p>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Wrench className="h-3.5 w-3.5 text-sky-600" />
                Alat Ukur yang Digunakan
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {selected.tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-xs font-bold text-amber-900">Contoh dalam Kehidupan Sehari-hari</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{selected.dailyExample}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Klik semua 7 kartu untuk membuka badge Ahli Satuan SI
            </span>
            <button
              type="button"
              onClick={() => onNavigate('zona3')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 whitespace-nowrap"
            >
              Praktik di Lab Pengukuran
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
