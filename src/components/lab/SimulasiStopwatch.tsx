import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Flag, Pause, Play, RotateCcw, Timer } from 'lucide-react';

interface SimulasiStopwatchProps {
  onSuccess: () => void;
  onSound: (type: 'click' | 'success' | 'error') => void;
}

const TARGET_CHALLENGES = [
  { id: 't3', label: 'Hentikan tepat pada 3,00 detik (±0,25 s)', targetMs: 3000, tolMs: 250 },
  { id: 't5', label: 'Hentikan tepat pada 5,00 detik (±0,25 s)', targetMs: 5000, tolMs: 250 },
  { id: 't10', label: 'Hitung 10 kali ketukan meja lalu hentikan!', targetMs: 0, tolMs: 0 },
];

export function SimulasiStopwatch({ onSuccess, onSound }: SimulasiStopwatchProps) {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [challengeStatus, setChallengeStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const startTimestampRef = useRef<number>(0);
  const baseElapsedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTimestampRef.current = performance.now();

    const tick = (now: number) => {
      const current = baseElapsedRef.current + (now - startTimestampRef.current);
      setElapsedMs(current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const handleStart = () => {
    onSound('click');
    setChallengeStatus(null);
    setRunning(true);
  };

  const handleStop = () => {
    onSound('click');
    const finalMs = running
      ? baseElapsedRef.current + (performance.now() - startTimestampRef.current)
      : elapsedMs;
    baseElapsedRef.current = finalMs;
    setElapsedMs(finalMs);
    setRunning(false);

    const ch = TARGET_CHALLENGES[challengeIdx];
    if (ch.targetMs > 0) {
      const diff = Math.abs(finalMs - ch.targetMs);
      if (diff <= ch.tolMs) {
        onSound('success');
        setChallengeStatus({
          ok: true,
          msg: `Hebat! Anda berhenti di ${(finalMs / 1000).toFixed(2).replace('.', ',')} sekon (selisih hanya ${(diff / 1000).toFixed(2).replace('.', ',')} s).`,
        });
        onSuccess();
      } else {
        onSound('error');
        setChallengeStatus({
          ok: false,
          msg: `Hasil Anda ${(finalMs / 1000).toFixed(2).replace('.', ',')} s. Coba reset dan bidik mendekati ${(ch.targetMs / 1000).toFixed(2).replace('.', ',')} s!`,
        });
      }
    } else if (finalMs > 500) {
      onSound('success');
      setChallengeStatus({
        ok: true,
        msg: `Durasi aktivitas tercatat: ${(finalMs / 1000).toFixed(2).replace('.', ',')} sekon.`,
      });
      onSuccess();
    }
  };

  const handleReset = () => {
    onSound('click');
    setRunning(false);
    baseElapsedRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
    setChallengeStatus(null);
  };

  const handleLap = () => {
    onSound('click');
    const current = running
      ? baseElapsedRef.current + (performance.now() - startTimestampRef.current)
      : elapsedMs;
    setLaps((prev) => [current, ...prev]);
  };

  const formatParts = (msInput: number) => {
    const totalMs = Math.max(0, Math.floor(msInput));
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const millis = totalMs % 1000;
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const pad3 = (n: number) => String(n).padStart(3, '0');
    return {
      hours: pad2(hours),
      minutes: pad2(minutes),
      seconds: pad2(seconds),
      millis: pad3(millis),
      formatted: `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad3(millis)}`,
    };
  };

  const parts = formatParts(elapsedMs);
  const secondAngle = ((elapsedMs % 60000) / 60000) * 360;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-[#0F1E3D]">
          Simulasi Stopwatch Digital & Analog
        </h3>
        <p className="text-sm text-slate-600">
          Gunakan stopwatch berketelitian milisekon (ms) untuk mengukur waktu dan menyelesaikan
          tantangan reaksi.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Stopwatch Instrument */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
          {/* Analog Second Dial + Digital LCD */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
            <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" aria-hidden="true">
              <circle cx="70" cy="70" r="62" fill="#F8FAFC" stroke="#0F1E3D" strokeWidth="4" />
              {Array.from({ length: 12 }).map((_, i) => {
                const rad = ((i * 30 - 90) * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={70 + Math.cos(rad) * 50}
                    y1={70 + Math.sin(rad) * 50}
                    x2={70 + Math.cos(rad) * 57}
                    y2={70 + Math.sin(rad) * 57}
                    stroke="#0F1E3D"
                    strokeWidth="2"
                  />
                );
              })}
              <g transform={`rotate(${secondAngle} 70 70)`}>
                <line x1="70" y1="76" x2="70" y2="22" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="70" cy="70" r="4.5" fill="#F59E0B" />
            </svg>

            <div className="text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Jam : Menit : Detik . Milisekon
              </p>
              <div className="mt-2 rounded-xl bg-[#0F1E3D] px-5 py-4 text-center">
                <p
                  data-testid="stopwatch-display"
                  className="font-mono text-2xl font-bold tracking-wider text-amber-300 tabular-nums sm:text-3xl"
                >
                  {parts.hours}:{parts.minutes}:{parts.seconds}
                  <span className="text-sky-300">.{parts.millis}</span>
                </p>
              </div>
              <p className="mt-2 font-mono text-xs text-slate-600 tabular-nums">
                Dalam satuan SI (sekon): {(elapsedMs / 1000).toFixed(3).replace('.', ',')} s
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!running ? (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
              >
                <Play className="h-4 w-4" />
                Mulai
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#0F1E3D] hover:bg-amber-300"
              >
                <Pause className="h-4 w-4" />
                Berhenti
              </button>
            )}

            <button
              type="button"
              onClick={handleLap}
              disabled={!running && elapsedMs === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Flag className="h-4 w-4" />
              Putaran (Lap)
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Challenge & Lap Panel */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#0F1E3D]">
              <Timer className="h-4 w-4 text-sky-600" />
              Tantangan Pengukuran Waktu
            </h4>
            <div className="mt-3 space-y-2">
              {TARGET_CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setChallengeIdx(idx);
                    handleReset();
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    challengeIdx === idx
                      ? 'border-sky-600 bg-sky-50 font-bold text-[#0F1E3D]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            {challengeStatus && (
              <div
                role="status"
                className={`mt-4 flex items-start gap-2 rounded-lg p-3 text-xs font-medium ${
                  challengeStatus.ok
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{challengeStatus.msg}</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Catatan Waktu Putaran ({laps.length})
            </h4>
            {laps.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">Belum ada catatan waktu putaran.</p>
            ) : (
              <ul className="mt-2 max-h-36 space-y-1.5 overflow-y-auto font-mono text-xs">
                {laps.map((lapMs, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded bg-slate-50 px-3 py-1.5"
                  >
                    <span className="text-slate-500">Putaran #{laps.length - i}</span>
                    <span className="font-bold text-[#0F1E3D] tabular-nums">
                      {formatParts(lapMs).formatted}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
