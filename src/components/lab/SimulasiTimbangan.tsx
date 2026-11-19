import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Scale, Trash2 } from 'lucide-react';
import { isNumericAnswerCorrect } from '../../utils/physicsMath';

interface SimulasiTimbanganProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

interface WeighItem {
  id: string;
  name: string;
  massG: number;
  color: string;
}

const WEIGH_ITEMS: WeighItem[] = [
  { id: 'buku', name: 'Buku Paket PIPAS', massG: 450, color: '#0284C7' },
  { id: 'pensil', name: 'Pensil Kayu', massG: 12, color: '#F59E0B' },
  { id: 'penghapus', name: 'Penghapus Karet', massG: 28, color: '#64748B' },
  { id: 'botol', name: 'Botol Air Mineral', massG: 620, color: '#0EA5E9' },
  { id: 'baut', name: 'Mur & Baut Baja', massG: 140, color: '#334155' },
  { id: 'beras', name: 'Kantong Beras Mini', massG: 1250, color: '#D97706' },
];

export function SimulasiTimbangan({ onSuccess, onSound }: SimulasiTimbanganProps) {
  const [placedItems, setPlacedItems] = useState<WeighItem[]>([WEIGH_ITEMS[0]]);
  const [unit, setUnit] = useState<'g' | 'kg'>('g');
  const [isDragOver, setIsDragOver] = useState(false);
  const [convInput, setConvInput] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const totalMassG = placedItems.reduce((sum, item) => sum + item.massG, 0);
  const totalMassKg = totalMassG / 1000;

  const addItem = (item: WeighItem) => {
    onSound('click');
    setPlacedItems((prev) => [...prev, item]);
    setFeedback(null);
  };

  const removeItemAt = (index: number) => {
    onSound('click');
    setPlacedItems((prev) => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    const found = WEIGH_ITEMS.find((i) => i.id === itemId);
    if (found) addItem(found);
  };

  const targetUnit = unit === 'g' ? 'kg' : 'g';
  const expectedTargetVal = unit === 'g' ? totalMassKg : totalMassG;

  const handleCheckConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (placedItems.length === 0) {
      setFeedback({ ok: false, msg: 'Letakkan minimal 1 benda di atas piringan timbangan terlebih dahulu.' });
      onSound('error');
      return;
    }
    if (!convInput.trim()) {
      setFeedback({ ok: false, msg: `Masukkan hasil konversi dalam satuan ${targetUnit}.` });
      onSound('error');
      return;
    }
    if (isNumericAnswerCorrect(convInput, expectedTargetVal, targetUnit === 'kg' ? 0.002 : 1)) {
      onSound('success');
      setFeedback({
        ok: true,
        msg: `Benar! ${totalMassG} g setara dengan ${totalMassKg.toFixed(3).replace('.', ',').replace(/,?0+$/, '')} kg.`,
      });
      onSuccess();
    } else {
      onSound('error');
      setFeedback({
        ok: false,
        msg: `Belum tepat. Ingat: 1 kg = 1.000 g (dari g ke kg dibagi 1.000, dari kg ke g dikali 1.000).`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
            Simulasi Timbangan Digital (Gram & Kilogram)
          </h3>
          <p className="text-sm text-slate-600">
            Seret (drag & drop) atau klik benda untuk menaruhnya di atas timbangan, lalu ubah
            satuan dan uji konversinya.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              onSound('click');
              setUnit('g');
              setFeedback(null);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
              unit === 'g' ? 'bg-white text-[#0F1E3D] shadow-xs' : 'text-slate-600'
            }`}
          >
            Gram (g)
          </button>
          <button
            type="button"
            onClick={() => {
              onSound('click');
              setUnit('kg');
              setFeedback(null);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
              unit === 'kg' ? 'bg-white text-[#0F1E3D] shadow-xs' : 'text-slate-600'
            }`}
          >
            Kilogram (kg)
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Item Shelf (5 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5">
          <h4 className="text-sm font-bold text-[#0F1E3D]">Rak Benda Praktikum</h4>
          <p className="mt-1 text-xs text-slate-500">
            Seret kartu benda ke area piringan timbangan, atau klik langsung untuk menambahkan.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {WEIGH_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                onClick={() => addItem(item)}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-all hover:border-sky-400 hover:bg-sky-50/50 active:scale-[0.98]"
              >
                <span
                  className="h-3 w-8 rounded-sm"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="mt-2 text-xs font-bold text-slate-900">{item.name}</span>
                <span className="mt-0.5 font-mono text-[11px] text-slate-500">+ Tambah ke timbangan</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Digital Scale Drop Zone + Conversion Check (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            data-testid="scale-drop-zone"
            className={`rounded-2xl border-2 border-dashed p-6 transition-colors ${
              isDragOver
                ? 'border-sky-500 bg-sky-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            {/* Placed items on pan */}
            <div className="min-h-[88px] flex flex-wrap items-end justify-center gap-2 border-b-4 border-slate-400 pb-3">
              {placedItems.length === 0 ? (
                <p className="py-4 text-xs text-slate-500">
                  Piringan timbangan kosong — seret atau klik benda dari rak di kiri
                </p>
              ) : (
                placedItems.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    type="button"
                    onClick={() => removeItemAt(idx)}
                    title="Klik untuk mengangkat benda dari timbangan"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-xs transition-transform hover:scale-95"
                    style={{ backgroundColor: item.color }}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] opacity-85">×</span>
                  </button>
                ))
              )}
            </div>

            {/* Scale neck & Digital LCD Body */}
            <div className="mx-auto h-3 w-12 bg-slate-500" />
            <div className="mx-auto max-w-sm rounded-xl border-2 border-[#0F1E3D] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5 text-sky-600" />
                  NERACA DIGITAL LAB
                </span>
                <span>{placedItems.length} benda</span>
              </div>
              <div className="mt-2 rounded-lg bg-[#0F1E3D] px-4 py-3 text-right">
                <p
                  data-testid="scale-readout"
                  className="font-mono text-3xl font-bold tracking-wider text-sky-300 tabular-nums"
                >
                  {unit === 'g'
                    ? `${totalMassG} g`
                    : `${totalMassKg.toFixed(3).replace('.', ',')} kg`}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onSound('click');
                    setPlacedItems([]);
                    setFeedback(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Kosongkan (Tare / Zero)
                </button>
                <span className="text-[11px] text-slate-500">Klik benda di atas untuk melepas</span>
              </div>
            </div>
          </div>

          {/* Interactive Unit Conversion Challenge */}
          <form onSubmit={handleCheckConversion} className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-[#0F1E3D]">
              Latihan Konversi Satuan Massa ({unit} → {targetUnit})
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              Jika timbangan membaca{' '}
              <strong className="font-mono">
                {unit === 'g'
                  ? `${totalMassG} g`
                  : `${totalMassKg.toFixed(3).replace('.', ',')} kg`}
              </strong>
              , berapakah massa total tersebut dalam satuan <strong>{targetUnit}</strong>?
            </p>
            <div className="mt-3 flex gap-2">
              <label htmlFor="scale-conv-input" className="sr-only">
                Nilai massa dalam {targetUnit}
              </label>
              <input
                id="scale-conv-input"
                type="text"
                inputMode="decimal"
                placeholder={`Nilai dalam ${targetUnit}`}
                value={convInput}
                onChange={(e) => setConvInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0F1E3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a3264] whitespace-nowrap"
              >
                Periksa Konversi
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
