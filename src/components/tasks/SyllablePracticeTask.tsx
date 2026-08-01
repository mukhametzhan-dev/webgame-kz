import { useState } from "react";
import type { SyllablePracticeTask as SyllablePracticeTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";

export function SyllablePracticeTask({
  task,
  isLast,
  onAdvance,
}: {
  task: SyllablePracticeTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const [reversed, setReversed] = useState<Record<number, boolean>>({});

  const orderFor = (i: number) => {
    const set = task.sets[i];
    return reversed[i] ? [...set].reverse() : set;
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      <div className="mb-6 flex flex-col gap-3 lg:mb-10 lg:gap-4">
        {task.sets.map((_, i) => {
          const order = orderFor(i);
          return (
            <div
              key={i}
              className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 lg:gap-3 lg:px-6 lg:py-4"
            >
              <button
                onClick={() => speak(order.join(" "))}
                aria-label="Тыңда"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-base text-teal-600 transition active:scale-90 lg:h-12 lg:w-12 lg:text-xl"
              >
                🔊
              </button>
              <p className="font-[var(--font-display)] text-xl font-extrabold text-slate-800 lg:text-3xl">
                {order.join(" — ")}
              </p>
              <button
                onClick={() => setReversed((prev) => ({ ...prev, [i]: !prev[i] }))}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition lg:px-4 lg:py-2 lg:text-sm ${
                  reversed[i] ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                ⇄ Керісінше
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onAdvance(100)}
        className="w-full rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition hover:bg-teal-600 lg:py-4 lg:text-lg"
      >
        {isLast ? "Аяқтау" : "Келесі →"}
      </button>
    </div>
  );
}
