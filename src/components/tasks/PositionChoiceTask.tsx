import { useMemo, useState } from "react";
import type { PositionChoiceTask as PositionChoiceTaskType, Position } from "../../types";
import { TaskActions } from "./TaskActions";

const BASE_OPTIONS: Position[] = ["басында", "ортасында", "соңында"];

export function PositionChoiceTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: PositionChoiceTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, Position>>({});
  const [checked, setChecked] = useState(false);

  const rows = useMemo(
    () =>
      task.words.map((w) => ({
        ...w,
        options: BASE_OPTIONS.includes(w.correct) ? BASE_OPTIONS : [...BASE_OPTIONS, w.correct],
      })),
    [task]
  );

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = rows.filter((r, i) => answers[i] === r.correct).length;
    return Math.round((correctCount / rows.length) * 100);
  }, [checked, rows, answers]);

  const allAnswered = rows.every((_, i) => answers[i]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <div className="flex flex-col gap-4 lg:gap-5">
        {rows.map((row, i) => {
          const picked = answers[i];
          const isRowCorrect = checked && picked === row.correct;
          const isRowWrong = checked && picked !== row.correct;
          return (
            <div
              key={i}
              className={`rounded-2xl border-2 p-3 transition lg:p-5 ${
                checked ? (isRowCorrect ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-slate-200 bg-white"
              }`}
            >
              <p className="mb-2 text-center font-[var(--font-display)] text-xl font-extrabold text-slate-800 lg:mb-3 lg:text-3xl">
                {row.word} {checked && (isRowCorrect ? "✅" : "❌")}
              </p>
              <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                {row.options.map((opt) => {
                  const selected = picked === opt;
                  let cls = "border-slate-200 bg-white text-slate-600";
                  if (checked && opt === row.correct) cls = "border-emerald-400 bg-emerald-100 text-emerald-700";
                  else if (checked && selected) cls = "border-rose-400 bg-rose-100 text-rose-600";
                  else if (selected) cls = "border-teal-400 bg-teal-100 text-teal-700";
                  return (
                    <button
                      key={opt}
                      disabled={checked}
                      onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt }))}
                      className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition lg:px-5 lg:py-2.5 lg:text-lg ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {isRowWrong && (
                <p className="mt-2 text-center text-xs font-semibold text-rose-500 lg:text-sm">Дұрысы: {row.correct}</p>
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
