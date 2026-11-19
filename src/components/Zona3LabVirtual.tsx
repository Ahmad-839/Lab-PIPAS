import React, { useState } from 'react';
import { CheckCircle2, Clock, Droplets, Gauge, Ruler, Scale, SlidersHorizontal } from 'lucide-react';
import type { LabToolId, StudentProgress } from '../types';
import { SimulasiPenggaris } from './lab/SimulasiPenggaris';
import { SimulasiJangkaSorong } from './lab/SimulasiJangkaSorong';
import { SimulasiMikrometer } from './lab/SimulasiMikrometer';
import { SimulasiTimbangan } from './lab/SimulasiTimbangan';
import { SimulasiStopwatch } from './lab/SimulasiStopwatch';
import { SimulasiGelasUkur } from './lab/SimulasiGelasUkur';

interface Zona3Props {
  progress: StudentProgress;
  onCompleteTool: (tool: LabToolId) => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

const LAB_TOOLS: {
  id: LabToolId;
  name: string;
  precision: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'penggaris', name: 'Penggaris', precision: '0,1 cm', icon: Ruler },
  { id: 'jangka_sorong', name: 'Jangka Sorong', precision: '0,01 cm', icon: SlidersHorizontal },
  { id: 'mikrometer', name: 'Mikrometer Sekrup', precision: '0,01 mm', icon: Gauge },
  { id: 'timbangan', name: 'Timbangan Digital', precision: '1 g', icon: Scale },
  { id: 'stopwatch', name: 'Stopwatch', precision: '0,001 s', icon: Clock },
  { id: 'gelas_ukur', name: 'Gelas Ukur', precision: '10 mL', icon: Droplets },
];

export function Zona3LabVirtual({ progress, onCompleteTool, onSound }: Zona3Props) {
  const [activeTool, setActiveTool] = useState<LabToolId>('jangka_sorong');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold text-sky-700">
          Zona 3 · Laboratorium Pengukuran Virtual Interaktif
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
          Praktikum Alat Ukur Fisika & Teknik SMK
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Operasikan keenam instrumen laboratorium secara langsung. Selesaikan latihan verifikasi
          pada minimal 4 alat ukur untuk meraih lencana Detektif Pengukuran.
        </p>
        <p className="mt-3 font-mono text-xs font-semibold text-[#0F1E3D] tabular-nums">
          Alat Ukur Diselesaikan: {progress.zona3CompletedTools.length} / 6
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div
        role="tablist"
        aria-label="Pilih alat ukur virtual"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6"
      >
        {LAB_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const isDone = progress.zona3CompletedTools.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                onSound('click');
                setActiveTool(tool.id);
              }}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-sky-600 ${
                isActive
                  ? 'border-sky-600 bg-[#0F1E3D] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-sky-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-300' : 'text-sky-600'}`} />
                {isDone && (
                  <CheckCircle2
                    className={`h-4 w-4 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`}
                    aria-label="Selesai"
                  />
                )}
              </div>
              <div className="mt-2.5">
                <p className="text-xs font-bold leading-snug">{tool.name}</p>
                <p
                  className={`mt-0.5 font-mono text-[11px] ${
                    isActive ? 'text-sky-200' : 'text-slate-500'
                  }`}
                >
                  Ketelitian {tool.precision}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Instrument Stage */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {activeTool === 'penggaris' && (
          <SimulasiPenggaris onSuccess={() => onCompleteTool('penggaris')} onSound={onSound} />
        )}
        {activeTool === 'jangka_sorong' && (
          <SimulasiJangkaSorong
            onSuccess={() => onCompleteTool('jangka_sorong')}
            onSound={onSound}
          />
        )}
        {activeTool === 'mikrometer' && (
          <SimulasiMikrometer onSuccess={() => onCompleteTool('mikrometer')} onSound={onSound} />
        )}
        {activeTool === 'timbangan' && (
          <SimulasiTimbangan onSuccess={() => onCompleteTool('timbangan')} onSound={onSound} />
        )}
        {activeTool === 'stopwatch' && (
          <SimulasiStopwatch onSuccess={() => onCompleteTool('stopwatch')} onSound={onSound} />
        )}
        {activeTool === 'gelas_ukur' && (
          <SimulasiGelasUkur onSuccess={() => onCompleteTool('gelas_ukur')} onSound={onSound} />
        )}
      </div>
    </div>
  );
}
