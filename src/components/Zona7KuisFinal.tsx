import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Clock, Play, RotateCcw, XCircle } from 'lucide-react';
import { FINAL_QUIZ_QUESTIONS } from '../data/curriculum';
import type { QuizAttempt } from '../types';
import { gradeQuizScore } from '../utils/gamification';

interface Zona7Props {
  onQuizComplete: (attempt: QuizAttempt) => void;
  onSound: (type: 'click' | 'success' | 'error' | 'levelup') => void;
}

const QUIZ_DURATION_SECONDS = 900; // 15 minutes

export function Zona7KuisFinal({ onQuizComplete, onSound }: Zona7Props) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_DURATION_SECONDS);
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const totalQuestions = FINAL_QUIZ_QUESTIONS.length;
  const currentQ = FINAL_QUIZ_QUESTIONS[currentIndex];

  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) {
      finalizeQuiz();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished, secondsLeft]);

  const finalizeQuiz = () => {
    const correctCount = FINAL_QUIZ_QUESTIONS.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const { score, category } = gradeQuizScore(correctCount, totalQuestions);
    const attempt: QuizAttempt = {
      score,
      correctCount,
      totalQuestions,
      category,
      timeSpentSeconds: QUIZ_DURATION_SECONDS - secondsLeft,
      completedAt: new Date().toISOString(),
    };
    setFinished(true);
    onSound(score >= 70 ? 'levelup' : 'click');
    onQuizComplete(attempt);
  };

  const handleStart = () => {
    onSound('click');
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsLeft(QUIZ_DURATION_SECONDS);
    setFinished(false);
    setShowReview(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            Zona 7 · Evaluasi Akhir Pembelajaran PIPAS Kelas X SMK
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-[#0F1E3D]">
            Kuis Final: Besaran dan Satuannya (20 Soal)
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Uji penguasaan Anda terhadap seluruh materi mulai dari konsep besaran, 7 besaran pokok
            SI, pembacaan jangka sorong & mikrometer sekrup, besaran turunan, hingga konversi
            satuan.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-xl font-bold text-[#0F1E3D]">10 Soal</p>
            <p className="text-xs text-slate-600">Pilihan Ganda</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-xl font-bold text-[#0F1E3D]">5 Soal</p>
            <p className="text-xs text-slate-600">Benar atau Salah</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-xl font-bold text-[#0F1E3D]">5 Soal</p>
            <p className="text-xs text-slate-600">Soal Hitungan</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
          <p className="font-bold">Kategori Penilaian Akhir (Skala 0 – 100):</p>
          <p className="mt-1">
            90–100: Ahli Pengukuran · 80–89: Peneliti Muda · 70–79: Penjelajah Sains · Di bawah 70:
            Perlu Berlatih Lagi
          </p>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-display text-sm font-bold text-[#0F1E3D] hover:bg-amber-300"
        >
          <Play className="h-4 w-4" />
          Mulai Kuis Final (15 Menit)
        </button>
      </div>
    );
  }

  if (finished) {
    const correctCount = FINAL_QUIZ_QUESTIONS.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const { score, category } = gradeQuizScore(correctCount, totalQuestions);

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <Award className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-sky-700">
            Hasil Evaluasi Akhir
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-[#0F1E3D]">{category}</h2>
          <p
            data-testid="quiz-final-score"
            className="mt-2 font-mono text-4xl font-extrabold text-amber-600 tabular-nums"
          >
            {score} / 100
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Menjawab benar {correctCount} dari {totalQuestions} soal dalam waktu{' '}
            {formatTimer(QUIZ_DURATION_SECONDS - secondsLeft)}.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
            >
              {showReview ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan 20 Soal'}
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F1E3D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1a3264]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Ulangi Kuis
            </button>
          </div>
        </div>

        {showReview && (
          <div className="space-y-4">
            {FINAL_QUIZ_QUESTIONS.map((q, idx) => {
              const userChoice = answers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-500">
                      Soal {idx + 1} · {q.topic}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Benar
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" /> Salah
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0F1E3D]">{q.question}</p>
                  <p className="text-xs text-slate-600">
                    Jawaban Anda:{' '}
                    <strong>
                      {userChoice !== undefined ? q.options[userChoice] : 'Tidak dijawab'}
                    </strong>{' '}
                    · Kunci: <strong className="text-emerald-700">{q.options[q.correctIndex]}</strong>
                  </p>
                  <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                    Pembahasan: {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const typeLabel =
    currentQ.type === 'pg'
      ? 'Pilihan Ganda'
      : currentQ.type === 'tf'
      ? 'Benar / Salah'
      : 'Soal Hitungan';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Progress & Timer Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-mono font-bold text-[#0F1E3D] tabular-nums">
            Soal {currentIndex + 1} dari {totalQuestions} · {typeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-700 tabular-nums">
            <Clock className="h-4 w-4" />
            {formatTimer(secondsLeft)}
          </span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-600 transition-all duration-200"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Terjawab: {answeredCount} / {totalQuestions} soal
        </p>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <p className="text-xs font-semibold text-sky-700">Topik: {currentQ.topic}</p>
        <h2 className="font-display text-lg font-bold leading-snug text-[#0F1E3D]">
          {currentQ.question}
        </h2>

        <div className="space-y-2.5">
          {currentQ.options.map((option, optIdx) => {
            const selected = answers[currentQ.id] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => {
                  onSound('click');
                  setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
                }}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                  selected
                    ? 'border-sky-600 bg-sky-50 font-bold text-[#0F1E3D] ring-2 ring-sky-200'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-sky-300'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    selected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Soal Sebelumnya
          </button>

          {currentIndex + 1 < totalQuestions ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
              className="rounded-xl bg-[#0F1E3D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1a3264]"
            >
              Soal Berikutnya
            </button>
          ) : (
            <button
              type="button"
              onClick={finalizeQuiz}
              className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-[#0F1E3D] hover:bg-amber-300"
            >
              Selesaikan & Nilai Kuis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
