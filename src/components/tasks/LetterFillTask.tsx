import { useMemo, useState } from "react";
import type { LetterFillTask as LetterFillTaskType } from "../../types";
import { TaskActions } from "./TaskActions";

export function LetterFillTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: LetterFillTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = task.items.filter((it, i) => answers[i] === it.correct).length;
    return Math.round((correctCount / task.items.length) * 100);
  }, [checked, task.items, answers]);

  const allAnswered = task.items.every((_, i) => answers[i]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700">{task.prompt}</p>
      <div className="flex flex-col gap-4">
        {task.items.map((it, i) => {
          const picked = answers[i];
          const isCorrect = checked && picked === it.correct;
          const isWrong = checked && picked !== it.correct;
          return (
            <div
              key={i}
              className={`rounded-2xl border-2 p-3 transition ${
                checked ? (isCorrect ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-slate-200 bg-white"
              }`}
            >
              <p className="mb-2 text-center font-[var(--font-display)] text-xl font-extrabold text-slate-800">
                {checked && isCorrect ? it.result : it.stem} {checked && (isCorrect ? "✅" : "❌")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {it.options.map((opt) => {
                  const selected = picked === opt;
                  let cls = "border-slate-200 bg-white text-slate-600";
                  if (checked && opt === it.correct) cls = "border-emerald-400 bg-emerald-100 text-emerald-700";
                  else if (checked && selected) cls = "border-rose-400 bg-rose-100 text-rose-600";
                  else if (selected) cls = "border-teal-400 bg-teal-100 text-teal-700";
                  return (
                    <button
                      key={opt}
                      disabled={checked}
                      onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt }))}
                      className={`rounded-full border-2 px-4 py-1.5 text-lg font-extrabold transition ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {isWrong && <p className="mt-2 text-center text-xs font-semibold text-rose-500">Дұрысы: {it.result}</p>}
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
