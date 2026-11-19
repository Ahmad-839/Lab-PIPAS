import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Hand, Info, Ruler } from 'lucide-react';
import { ZONA1_CONCEPTS, ZONA1_OBJECTS, type Zona1ObjectInfo } from '../data/curriculum';
import type { StudentProgress, ZoneId } from '../types';

interface Zona1Props {
  progress: StudentProgress;
  onDiscoverObject: (objectId: string) => void;
  onCompleteExperiment: () => void;
  onNavigate: (zone: ZoneId) => void;
}

export function Zona1KenaliBesaran({
  progress,
  onDiscoverObject,
  onCompleteExperiment,
  onNavigate,
}: Zona1Props) {
  const [selectedObj, setSelectedObj] = useState<Zona1ObjectInfo>(ZONA1_OBJECTS[0]);
  const [activeConceptId, setActiveConceptId] = useState<string>(ZONA1_CONCEPTS[0].id);

  // Interactive Satuan Baku vs Tidak Baku Experiment State
  const [tableLengthCm] = useState(120); // Meja bengkel = 120 cm
  const [selectedPerson, setSelectedPerson] = useState<'budi' | 'sari' | 'pak_eko'>('budi');
  const [measuredByJengkal, setMeasuredByJengkal] = useState<Record<string, boolean>>({});
  const [measuredByRuler, setMeasuredByRuler] = useState(false);

  const personSpanCm: Record<'budi' | 'sari' | 'pak_eko', { name: string; spanCm: number }> = {
    budi: { name: 'Tangan Budi (Kelas X)', spanCm: 20 },
    sari: { name: 'Tangan Sari (Kelas X)', spanCm: 16 },
    pak_eko: { name: 'Tangan Pak Eko (Guru)', spanCm: 24 },
  };

  const handleSelectObj = (obj: Zona1ObjectInfo) => {
    setSelectedObj(obj);
    onDiscoverObject(obj.id);
  };

  const handleMeasureJengkal = () => {
    const next = { ...measuredByJengkal, [selectedPerson]: true };
    setMeasuredByJengkal(next);
    if (Object.keys(next).length >= 2 && measuredByRuler) {
      onCompleteExperiment();
    }
  };

  const handleMeasureRuler = () => {
    setMeasuredByRuler(true);
    if (Object.keys(measuredByJengkal).length >= 2) {
      onCompleteExperiment();
    }
  };

  const currentConcept =
    ZONA1_CONCEPTS.find((c) => c.id === activeConceptId) ?? ZONA1_CONCEPTS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold text-sky-700">
          Zona 1 · Tujuan Pembelajaran: Membedakan Besaran, Satuan, Pengukuran & Standar SI
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
          Kenali Besaran & Alat Ukur di Sekitarmu
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Klik setiap objek alat laboratorium pada meja praktikum di bawah ini untuk menemukan besaran
          apa yang dapat diukur, satuan standarnya, dan penerapannya di lingkungan SMK.
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <span className="font-mono font-semibold text-[#0F1E3D] tabular-nums">
            Temuan Alat: {progress.zona1DiscoveredObjects.length} / 5
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {progress.zona1CompletedExperiment
              ? 'Eksperimen Satuan Baku: Tuntas (+25 XP)'
              : 'Lakukan eksperimen jengkal vs penggaris di bagian bawah'}
          </span>
        </div>
      </div>

      {/* Interactive Workbench Stage + Detail Deck */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Interactive SVG Lab Bench (7 cols) */}
        <section
          aria-label="Meja praktikum interaktif"
          className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#0F1E3D]">
              Meja Eksplorasi Alat Ukur
            </h2>
            <span className="text-xs text-slate-500">Klik salah satu objek untuk menginspeksi</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ZONA1_OBJECTS.map((obj) => {
              const isSelected = selectedObj.id === obj.id;
              const isFound = progress.zona1DiscoveredObjects.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => handleSelectObj(obj)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-between rounded-xl border p-4 text-center transition-all focus-visible:outline-2 focus-visible:outline-sky-600 ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-slate-50/70 hover:border-sky-300 hover:bg-white'
                  }`}
                >
                  {/* Custom Interactive SVG Instrument */}
                  <div className="flex h-24 w-full items-center justify-center">
                    {obj.id === 'penggaris' && (
                      <svg viewBox="0 0 140 60" className="h-20 w-32" aria-hidden="true">
                        <rect x="8" y="16" width="124" height="28" rx="3" fill="#FBBF24" stroke="#0F1E3D" strokeWidth="2" />
                        {Array.from({ length: 21 }).map((_, idx) => (
                          <line
                            key={idx}
                            x1={14 + idx * 5.6}
                            y1="16"
                            x2={14 + idx * 5.6}
                            y2={idx % 5 === 0 ? 30 : 24}
                            stroke="#0F1E3D"
                            strokeWidth={idx % 5 === 0 ? '1.8' : '1'}
                          />
                        ))}
                        <text x="14" y="39" fontSize="7" fill="#0F1E3D" fontWeight="bold">0</text>
                        <text x="68" y="39" fontSize="7" fill="#0F1E3D" fontWeight="bold">15</text>
                        <text x="118" y="39" fontSize="7" fill="#0F1E3D" fontWeight="bold">30 cm</text>
                      </svg>
                    )}

                    {obj.id === 'timbangan' && (
                      <svg viewBox="0 0 120 80" className="h-20 w-28" aria-hidden="true">
                        <rect x="26" y="20" width="68" height="7" rx="3" fill="#94A3B8" stroke="#0F1E3D" strokeWidth="2" />
                        <rect x="55" y="27" width="10" height="10" fill="#475569" />
                        <path d="M16 40 L104 40 L110 70 L10 70 Z" fill="#E2E8F0" stroke="#0F1E3D" strokeWidth="2" />
                        <rect x="34" y="47" width="52" height="16" rx="2" fill="#0F1E3D" />
                        <text x="60" y="58" textAnchor="middle" fontSize="9" fill="#38BDF8" fontFamily="monospace" fontWeight="bold">
                          1.25 kg
                        </text>
                      </svg>
                    )}

                    {obj.id === 'stopwatch' && (
                      <svg viewBox="0 0 100 90" className="h-20 w-24" aria-hidden="true">
                        <rect x="44" y="6" width="12" height="10" rx="2" fill="#0F1E3D" />
                        <rect x="66" y="14" width="8" height="10" rx="2" transform="rotate(35 70 19)" fill="#F59E0B" />
                        <circle cx="50" cy="48" r="30" fill="#FFFFFF" stroke="#0F1E3D" strokeWidth="3" />
                        <circle cx="50" cy="48" r="24" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                        <line x1="50" y1="48" x2="50" y2="28" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="50" y1="48" x2="64" y2="54" stroke="#0F1E3D" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="48" r="3" fill="#F59E0B" />
                      </svg>
                    )}

                    {obj.id === 'termometer' && (
                      <svg viewBox="0 0 80 90" className="h-20 w-20" aria-hidden="true">
                        <rect x="34" y="8" width="12" height="58" rx="6" fill="#FFFFFF" stroke="#0F1E3D" strokeWidth="2" />
                        <circle cx="40" cy="72" r="11" fill="#EF4444" stroke="#0F1E3D" strokeWidth="2" />
                        <rect x="38" y="26" width="4" height="44" fill="#EF4444" />
                        {[18, 26, 34, 42, 50, 58].map((y) => (
                          <line key={y} x1="48" y1={y} x2="55" y2={y} stroke="#0F1E3D" strokeWidth="1.5" />
                        ))}
                      </svg>
                    )}

                    {obj.id === 'gelas_ukur' && (
                      <svg viewBox="0 0 90 90" className="h-20 w-24" aria-hidden="true">
                        <path d="M24 78 L66 78 L62 84 L28 84 Z" fill="#CBD5E1" stroke="#0F1E3D" strokeWidth="2" />
                        <rect x="30" y="12" width="30" height="66" rx="2" fill="#F8FAFC" stroke="#0F1E3D" strokeWidth="2" />
                        <rect x="31.5" y="38" width="27" height="38.5" fill="#38BDF8" fillOpacity="0.55" />
                        <path d="M31.5 38 Q45 42 58.5 38" fill="none" stroke="#0284C7" strokeWidth="2" />
                        {[22, 32, 42, 52, 62].map((y) => (
                          <line key={y} x1="30" y1={y} x2="40" y2={y} stroke="#0F1E3D" strokeWidth="1.5" />
                        ))}
                      </svg>
                    )}
                  </div>

                  <div className="mt-2 w-full">
                    <p className="text-sm font-bold text-[#0F1E3D]">{obj.name}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {isFound ? `Besaran: ${obj.quantityName}` : 'Klik untuk inspeksi'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right: Inspection Readout Deck (5 cols) */}
        <motion.section
          key={selectedObj.id}
          initial={{ opacity: 0.7, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          aria-live="polite"
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5"
        >
          <div>
            <p className="text-xs font-semibold text-sky-700">Hasil Inspeksi Objek Lab</p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-[#0F1E3D]">
              {selectedObj.name}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Besaran yang Diukur</p>
                <p className="mt-0.5 font-display text-lg font-bold text-[#0F1E3D]">
                  {selectedObj.quantityName}
                </p>
                <p className="font-mono text-xs text-slate-600">
                  Simbol: {selectedObj.quantitySymbol}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Satuan SI</p>
                <p className="mt-0.5 font-display text-lg font-bold text-sky-700">
                  {selectedObj.siUnit} ({selectedObj.unitSymbol})
                </p>
                <p className="text-xs text-slate-600">Lainnya: {selectedObj.commonUnit}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <p>{selectedObj.explanation}</p>
              <div className="rounded-xl bg-amber-50 p-3.5 text-slate-800">
                <p className="text-xs font-bold text-amber-800">Contoh Nyata Siswa SMK</p>
                <p className="mt-1 text-sm">{selectedObj.realLifeExample}</p>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>Tips Akurasi: {selectedObj.measurementTip}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Objek telah dipelajari
            </span>
            <button
              type="button"
              onClick={() => onNavigate('zona2')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900"
            >
              Lanjut ke Besaran Pokok
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.section>
      </div>

      {/* Interactive Concept Explorer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-[#0F1E3D]">
          Pahami Konsep Dasar Secara Interaktif
        </h2>
        <div
          role="tablist"
          aria-label="Tab materi dasar besaran dan satuan"
          className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5"
        >
          {ZONA1_CONCEPTS.map((concept) => {
            const active = concept.id === activeConceptId;
            return (
              <button
                key={concept.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveConceptId(concept.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#0F1E3D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {concept.title}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-sm leading-relaxed text-slate-700">{currentConcept.summary}</p>
          <ul className="space-y-2">
            {currentConcept.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-1 font-mono text-xs font-bold text-sky-700">0{i + 1}.</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          {currentConcept.comparisonRows && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Konteks Pengukuran</th>
                    <th className="px-4 py-3">{currentConcept.leftHeader}</th>
                    <th className="px-4 py-3">{currentConcept.rightHeader}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentConcept.comparisonRows.map((row) => (
                    <tr key={row.aspek} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.aspek}</td>
                      <td className="px-4 py-3 text-sky-800">{row.left}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.right}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Experiment: Satuan Baku vs Tidak Baku */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-amber-700">
              Eksperimen Mini · Mengapa Kita Butuh Satuan Baku?
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-[#0F1E3D]">
              Uji Coba Mengukur Meja Bengkel (Panjang Asli: 120 cm)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Bandingkan hasil pengukuran meja oleh minimal 2 orang berbeda memakai jengkal tangan vs
              memakai penggaris meteran baku.
            </p>
          </div>
          {progress.zona1CompletedExperiment && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Eksperimen Selesai
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {/* Tidak Baku: Jengkal */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F1E3D]">
              <Hand className="h-4 w-4 text-amber-600" />
              1. Mengukur dengan Satuan Tidak Baku (Jengkal)
            </h3>
            <div className="mt-3">
              <label htmlFor="person-select" className="block text-xs font-medium text-slate-600">
                Pilih orang yang mengukur:
              </label>
              <select
                id="person-select"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value as 'budi' | 'sari' | 'pak_eko')}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="budi">Budi (1 jengkal = 20 cm)</option>
                <option value="sari">Sari (1 jengkal = 16 cm)</option>
                <option value="pak_eko">Pak Eko (1 jengkal = 24 cm)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleMeasureJengkal}
              className="mt-3 w-full rounded-lg bg-[#0F1E3D] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1a3264]"
            >
              Ukur Meja Pakai {personSpanCm[selectedPerson].name}
            </button>

            <div className="mt-4 space-y-1.5 text-xs text-slate-700">
              {(['budi', 'sari', 'pak_eko'] as const).map((key) =>
                measuredByJengkal[key] ? (
                  <p key={key} className="font-mono tabular-nums">
                    • {personSpanCm[key].name}:{' '}
                    <strong className="text-amber-700">
                      {(tableLengthCm / personSpanCm[key].spanCm).toFixed(1).replace('.', ',')} jengkal
                    </strong>
                  </p>
                ) : null
              )}
              {Object.keys(measuredByJengkal).length >= 2 && (
                <p className="mt-2 font-medium text-amber-800">
                  Lihat! Meja yang sama menghasilkan angka jengkal berbeda karena ukuran tangan
                  berbeda.
                </p>
              )}
            </div>
          </div>

          {/* Baku: Penggaris / Meteran */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F1E3D]">
              <Ruler className="h-4 w-4 text-sky-600" />
              2. Mengukur dengan Satuan Baku (Meter / Centimeter)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Siapa pun yang mengukur—Budi, Sari, maupun Pak Eko—jika menggunakan alat ukur baku
              berstandar SI, hasilnya akan selalu konsisten.
            </p>
            <button
              type="button"
              onClick={handleMeasureRuler}
              className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-700"
            >
              Ukur Meja dengan Meteran Standar SI
            </button>

            {measuredByRuler && (
              <div className="mt-4 space-y-1 text-xs text-slate-700">
                <p className="font-mono tabular-nums">
                  • Budi: <strong className="text-sky-700">120 cm (1,2 m)</strong>
                </p>
                <p className="font-mono tabular-nums">
                  • Sari: <strong className="text-sky-700">120 cm (1,2 m)</strong>
                </p>
                <p className="font-mono tabular-nums">
                  • Pak Eko: <strong className="text-sky-700">120 cm (1,2 m)</strong>
                </p>
                <p className="mt-2 font-medium text-emerald-700">
                  Hasil tetap 1,2 meter untuk semua pengamat. Inilah keunggulan Satuan Baku SI!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
