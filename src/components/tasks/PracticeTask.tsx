import type { PracticeTask as PracticeTaskType } from "../../types";

export function PracticeTask({
  task,
  isLast,
  onAdvance,
}: {
  task: PracticeTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <div className="mx-auto flex max-w-sm flex-col gap-2.5 lg:max-w-lg lg:gap-4">
        {task.items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-center font-[var(--font-display)] text-xl font-extrabold text-slate-700 lg:px-6 lg:py-4 lg:text-3xl"
          >
            {item}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-slate-400 lg:mt-6 lg:text-lg">Мұны дауыстап немесе қолыңмен орында, дайын болғанда батырманы бас.</p>
      <button
        onClick={() => onAdvance(100)}
        className="mt-5 w-full rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition hover:bg-teal-600 lg:mt-8 lg:py-4 lg:text-lg"
      >
        {task.actionLabel} {isLast ? "→ Аяқтау" : "→ Келесі"}
      </button>
    </div>
  );
}
