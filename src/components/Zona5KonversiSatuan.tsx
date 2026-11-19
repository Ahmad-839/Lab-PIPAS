import React, { useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpLeft, Repeat } from 'lucide-react';
import type { UnitCategory, ZoneId } from '../types';
import { convertUnit, parseLocaleNumber, UNIT_LISTS } from '../utils/physicsMath';

interface Zona5Props {
  onConversionPerformed: () => void;
  onNavigate: (zone: ZoneId) => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

const CATEGORIES: { id: UnitCategory; label: string; desc: string }[] = [
  { id: 'panjang', label: 'Panjang', desc: 'km, hm, dam, m, dm, cm, mm' },
  { id: 'massa', label: 'Massa', desc: 'kg, hg, dag, g, dg, cg, mg' },
  { id: 'waktu', label: 'Waktu', desc: 'jam, menit, sekon' },
  { id: 'volume', label: 'Volume', desc: 'm³, dm³, liter, cm³, mL' },
  { id: 'suhu', label: 'Suhu', desc: '°C, Kelvin (K), °F' },
];

export function Zona5KonversiSatuan({
  onConversionPerformed,
  onNavigate,
  onSound,
}: Zona5Props) {
  const [category, setCategory] = useState<UnitCategory>('panjang');
  const [rawInput, setRawInput] = useState<string>('2.5');
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('m');
  const [ladderPickMode, setLadderPickMode] = useState<'from' | 'to'>('to');

  const units = UNIT_LISTS[category];
  const parsedVal = parseLocaleNumber(rawInput);
  const output = convertUnit(parsedVal ?? NaN, category, fromUnit, toUnit);

  const handleCategoryChange = (nextCat: UnitCategory) => {
    onSound('click');
    setCategory(nextCat);
    const list = UNIT_LISTS[nextCat];
    setFromUnit(list[0]);
    setToUnit(list[Math.min(3, list.length - 1)]);
    setRawInput(nextCat === 'suhu' ? '27' : '2.5');
    onConversionPerformed();
  };

  const handleSwap = () => {
    onSound('click');
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
    onConversionPerformed();
  };

  const handleLadderClick = (u: string) => {
    onSound('click');
    if (ladderPickMode === 'from') {
      setFromUnit(u);
      setLadderPickMode('to');
    } else {
      setToUnit(u);
      setLadderPickMode('from');
    }
    onConversionPerformed();
  };

  const showStaircase = category === 'panjang' || category === 'massa';
  const fromIdx = units.indexOf(fromUnit);
  const toIdx = units.indexOf(toUnit);
  const stepDiff = toIdx - fromIdx;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold text-sky-700">
          Zona 5 · Tujuan Pembelajaran: Mengonversi Satuan Antar-Tingkat Secara Akurat
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
          Laboratorium Konversi Satuan & Tangga Satuan
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Pilih kategori besaran, masukkan nilai, lalu pilih satuan asal dan tujuan—atau klik
          langsung anak tangga pada visualisasi tangga satuan di sebelah kanan.
        </p>
      </div>

      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Kategori konversi satuan"
        className="flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1.5"
      >
        {CATEGORIES.map((cat) => {
          const active = cat.id === category;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#0F1E3D] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/70'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Converter & Visual Staircase */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Input + Output + Steps (6 cols) */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div>
            <label htmlFor="conv-value-input" className="block text-xs font-bold text-slate-700">
              Nilai yang Akan Dikonversi
            </label>
            <input
              id="conv-value-input"
              type="text"
              inputMode="decimal"
              value={rawInput}
              onChange={(e) => {
                setRawInput(e.target.value);
                onConversionPerformed();
              }}
              placeholder="Masukkan angka..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-lg font-bold text-[#0F1E3D] focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div>
              <label htmlFor="conv-from-unit" className="block text-xs font-bold text-slate-700">
                Satuan Asal
              </label>
              <select
                id="conv-from-unit"
                value={fromUnit}
                onChange={(e) => {
                  setFromUnit(e.target.value);
                  onConversionPerformed();
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm font-bold text-slate-900"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Tukar satuan asal dan tujuan"
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
            >
              <Repeat className="h-4 w-4" />
            </button>

            <div>
              <label htmlFor="conv-to-unit" className="block text-xs font-bold text-slate-700">
                Satuan Tujuan
              </label>
              <select
                id="conv-to-unit"
                value={toUnit}
                onChange={(e) => {
                  setToUnit(e.target.value);
                  onConversionPerformed();
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm font-bold text-slate-900"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Card */}
          {output.valid ? (
            <div className="rounded-xl bg-[#0F1E3D] p-5 text-white">
              <div className="flex items-center justify-between text-xs text-sky-200">
                <span>Hasil Konversi Otomatis</span>
                <span className="font-mono text-amber-300">{output.factorText}</span>
              </div>
              <p
                data-testid="conversion-result"
                className="mt-2 font-mono text-3xl font-extrabold text-amber-300 tabular-nums"
              >
                {output.formattedResult} <span className="text-lg text-white">{toUnit}</span>
              </p>

              <div className="mt-4 space-y-1.5 border-t border-white/15 pt-3 text-xs text-sky-100">
                <p className="font-bold text-white">Langkah Penyelesaian:</p>
                {output.steps.map((step, i) => (
                  <p key={i} className="leading-relaxed">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
              {output.error ?? 'Masukkan angka yang valid untuk mengonversi.'}
            </div>
          )}
        </div>

        {/* Right: Interactive Staircase / Conversion Reference (6 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-6">
          {showStaircase ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold text-[#0F1E3D]">
                    Tangga Satuan Interaktif ({category === 'panjang' ? 'Panjang' : 'Massa'})
                  </h2>
                  <p className="text-xs text-slate-600">
                    Klik anak tangga untuk memilih satuan{' '}
                    <strong className="text-sky-700">
                      {ladderPickMode === 'from' ? 'ASAL' : 'TUJUAN'}
                    </strong>
                    .
                  </p>
                </div>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLadderPickMode('from')}
                    className={`rounded-md px-2.5 py-1 font-bold ${
                      ladderPickMode === 'from' ? 'bg-white text-[#0F1E3D] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Pilih Asal
                  </button>
                  <button
                    type="button"
                    onClick={() => setLadderPickMode('to')}
                    className={`rounded-md px-2.5 py-1 font-bold ${
                      ladderPickMode === 'to' ? 'bg-white text-[#0F1E3D] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Pilih Tujuan
                  </button>
                </div>
              </div>

              {/* Staircase steps */}
              <div className="mt-5 space-y-1.5">
                {units.map((u, idx) => {
                  const isFrom = u === fromUnit;
                  const isTo = u === toUnit;
                  const inRange =
                    (idx >= fromIdx && idx <= toIdx) || (idx >= toIdx && idx <= fromIdx);
                  return (
                    <div
                      key={u}
                      style={{ paddingLeft: `${idx * 22}px` }}
                      className="transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => handleLadderClick(u)}
                        className={`flex w-full max-w-[230px] items-center justify-between rounded-lg border px-3.5 py-2 text-left font-mono text-xs font-bold transition-colors ${
                          isFrom
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : isTo
                            ? 'border-amber-500 bg-amber-400 text-[#0F1E3D]'
                            : inRange
                            ? 'border-sky-200 bg-sky-50 text-sky-900'
                            : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-sky-300'
                        }`}
                      >
                        <span>{u}</span>
                        <span className="text-[10px] font-sans">
                          {isFrom ? 'Asal' : isTo ? 'Tujuan' : 'Klik'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
                <span className="inline-flex items-center gap-1.5 font-semibold text-sky-800">
                  <ArrowDownRight className="h-4 w-4" />
                  Turun 1 tangga = × 10
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
                  <ArrowUpLeft className="h-4 w-4" />
                  Naik 1 tangga = ÷ 10
                </span>
                {stepDiff !== 0 && (
                  <span className="font-mono font-bold text-[#0F1E3D]">
                    Jarak: {stepDiff > 0 ? `Turun ${stepDiff}` : `Naik ${Math.abs(stepDiff)}`} tangga
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-base font-bold text-[#0F1E3D]">
                Panduan Cepat Konversi {CATEGORIES.find((c) => c.id === category)?.label}
              </h2>
              {category === 'waktu' && (
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• 1 jam = 60 menit = 3.600 sekon</li>
                  <li>• 1 menit = 60 sekon</li>
                  <li>• Dari satuan besar ke kecil dikali 60; sebaliknya dibagi 60.</li>
                </ul>
              )}
              {category === 'volume' && (
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• 1 m³ = 1.000 dm³ = 1.000 liter</li>
                  <li>• 1 dm³ = 1 liter = 1.000 cm³ = 1.000 mL</li>
                  <li>• 1 cm³ (1 cc) = 1 mL</li>
                </ul>
              )}
              {category === 'suhu' && (
                <ul className="space-y-2 font-mono text-xs text-slate-700 leading-relaxed">
                  <li>• Kelvin: K = °C + 273,15</li>
                  <li>• Fahrenheit: °F = (°C × 9/5) + 32</li>
                  <li>• Celsius dari °F: °C = (°F - 32) × 5/9</li>
                </ul>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">Siap menguji ketangkasan konversimu?</span>
            <button
              type="button"
              onClick={() => onNavigate('zona6')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 whitespace-nowrap"
            >
              Masuk ke Tantangan Misi
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
