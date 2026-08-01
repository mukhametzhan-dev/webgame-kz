import { useMemo, useState } from "react";
import type { PositionDetectTask as PositionDetectTaskType, SoundPosition } from "../../types";
import { useTTS } from "../../state/useTTS";
import { TaskActions } from "./TaskActions";

const HAND_OPTIONS: { value: SoundPosition; emoji: string; label: string }[] = [
  { value: "start", emoji: "✋", label: "Оң қол — басында" },
  { value: "middle", emoji: "🤚", label: "Сол қол — ортасында" },
  { value: "end", emoji: "🙌", label: "Екі қол — соңында" },
];

const NOTEBOOK_OPTIONS: { value: SoundPosition; emoji: string; label: string }[] = [
  { value: "start", emoji: "📗", label: "Сол жақ төменгі бұрыш" },
  { value: "middle", emoji: "📘", label: "Дәптердің ортасы" },
];

const FACE_OPTIONS: { value: SoundPosition; emoji: string; label: string }[] = [
  { value: "start", emoji: "🙁", label: "Басында" },
  { value: "middle", emoji: "😄", label: "Ортасында" },
];

const CLAP_OPTIONS: { value: SoundPosition; emoji: string; label: string }[] = [
  { value: "start", emoji: "👏", label: "Басында — 1 рет соқ" },
  { value: "middle", emoji: "👏🏻👏🏻", label: "Ортасында — 2 рет соқ" },
  { value: "end", emoji: "🔍", label: "Соңында — тап" },
];

const CLAP_COUNT_OPTIONS: { value: SoundPosition; emoji: string; label: string }[] = [
  { value: "start", emoji: "👏", label: "1 рет шапалақта" },
  { value: "middle", emoji: "👏🏻👏🏻", label: "2 рет шапалақта" },
  { value: "end", emoji: "👏🏻👏🏻👏🏻", label: "3 рет шапалақта" },
];

const OPTIONS_BY_VARIANT = {
  hands: HAND_OPTIONS,
  notebook: NOTEBOOK_OPTIONS,
  face: FACE_OPTIONS,
  clap: CLAP_OPTIONS,
  "clap-count": CLAP_COUNT_OPTIONS,
} as const;

const POSITION_LABEL: Record<SoundPosition, string> = {
  start: "басында",
  middle: "ортасында",
  end: "соңында",
};

function splitWord(word: string): [string, string, string] {
  const n = word.length;
  const third = Math.max(1, Math.round(n / 3));
  const start = word.slice(0, third);
  const end = word.slice(Math.max(third, n - third));
  const middle = word.slice(start.length, n - end.length);
  return [start, middle, end];
}

export function PositionDetectTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: PositionDetectTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const [answers, setAnswers] = useState<Record<number, SoundPosition>>({});
  const [checked, setChecked] = useState(false);

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = task.words.filter((w, i) => answers[i] === w.correct).length;
    return Math.round((correctCount / task.words.length) * 100);
  }, [checked, task.words, answers]);

  const allAnswered = task.words.every((_, i) => answers[i]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <div className="flex flex-col gap-4 lg:gap-5">
        {task.words.map((row, i) => {
          const picked = answers[i];
          const isRowCorrect = checked && picked === row.correct;
          const isRowWrong = checked && picked !== row.correct;
          const [segStart, segMiddle, segEnd] = splitWord(row.word);

          return (
            <div
              key={i}
              className={`rounded-2xl border-2 p-3 transition lg:p-5 ${
                checked ? (isRowCorrect ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-3 flex items-center justify-center gap-2 lg:mb-4 lg:gap-3">
                <button
                  onClick={() => speak(row.word)}
                  aria-label="Тыңда"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-base text-teal-600 transition active:scale-90 lg:h-11 lg:w-11 lg:text-xl"
                >
                  🔊
                </button>

                {task.variant === "segments" ? (
                  <div className="flex overflow-hidden rounded-xl font-[var(--font-display)] text-2xl font-extrabold lg:text-4xl">
                    {(["start", "middle", "end"] as const).map((zone) => {
                      const text = zone === "start" ? segStart : zone === "middle" ? segMiddle : segEnd;
                      if (!text) return null;
                      const selected = picked === zone;
                      let cls = "text-slate-800 hover:bg-slate-100";
                      if (checked && zone === row.correct) cls = "bg-emerald-200 text-emerald-800";
                      else if (checked && selected) cls = "bg-rose-200 text-rose-700";
                      else if (selected) cls = "bg-teal-200 text-teal-800";
                      return (
                        <button
                          key={zone}
                          disabled={checked}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: zone }))}
                          className={`px-1 py-1 transition ${cls}`}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-[var(--font-display)] text-2xl font-extrabold text-slate-800 lg:text-4xl">{row.word}</p>
                )}

                {checked && <span className="text-xl lg:text-3xl">{isRowCorrect ? "✅" : "❌"}</span>}
              </div>

              {(task.variant === "hands" ||
                task.variant === "notebook" ||
                task.variant === "face" ||
                task.variant === "clap" ||
                task.variant === "clap-count") && (
                <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                  {OPTIONS_BY_VARIANT[task.variant].map((opt) => {
                    const selected = picked === opt.value;
                    let cls = "border-slate-200 bg-white text-slate-600";
                    if (checked && opt.value === row.correct) cls = "border-emerald-400 bg-emerald-100 text-emerald-700";
                    else if (checked && selected) cls = "border-rose-400 bg-rose-100 text-rose-600";
                    else if (selected) cls = "border-teal-400 bg-teal-100 text-teal-700";
                    return (
                      <button
                        key={opt.value}
                        disabled={checked}
                        onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt.value }))}
                        className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-3 py-2 text-xs font-bold transition lg:gap-1 lg:px-5 lg:py-3 lg:text-base ${cls}`}
                      >
                        <span className="text-xl lg:text-3xl">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {isRowWrong && (
                <p className="mt-2 text-center text-xs font-semibold text-rose-500 lg:text-sm">Дұрысы: {POSITION_LABEL[row.correct]}</p>
              )}
            </div>
          );
        })}
      </div>

      <TaskActions
        checked={checked}
        percent={percent}
        canCheck={allAnswered}
        onCheck={() => setChecked(true)}
        onRetry={() => setChecked(false)}
        onNext={() => onAdvance(percent)}
        onFeedback={onFeedback}
        isLast={isLast}
      />
    </div>
  );
}
