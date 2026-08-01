import { useEffect, useState } from "react";
import type { InfoSlideTask as InfoSlideTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";

export function InfoSlideTask({
  task,
  isLast,
  onAdvance,
}: {
  task: InfoSlideTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    speak(task.prompt);
  }, [task.prompt, speak]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      <div className="mx-auto mb-5 flex max-w-md flex-col items-center gap-3 lg:mb-8 lg:max-w-lg lg:gap-4">
        {task.image && imageOk ? (
          <img
            src={task.image}
            alt={task.prompt}
            onError={() => setImageOk(false)}
            className="w-full rounded-3xl border-2 border-slate-200 object-contain shadow-inner"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50">
            <span className="font-[var(--font-display)] text-7xl font-extrabold text-slate-300 lg:text-9xl">👀</span>
          </div>
        )}

        <button
          onClick={() => speak(task.prompt)}
          aria-label="Тыңда"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-lg text-teal-600 transition active:scale-90 lg:h-14 lg:w-14 lg:text-2xl"
        >
          🔊
        </button>
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
