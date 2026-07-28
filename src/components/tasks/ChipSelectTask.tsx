import { useMemo, useState } from "react";
import type { ChipSelectTask as ChipSelectTaskType } from "../../types";
import { TaskActions } from "./TaskActions";

export function ChipSelectTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: ChipSelectTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);

  const targets = useMemo(
    () => task.items.map((item, i) => task.isTarget(item, i)),
    [task]
  );
  const targetCount = targets.filter(Boolean).length;

  const percent = useMemo(() => {
    if (!checked) return 0;
    let correct = 0;
    targets.forEach((isTarget, i) => {
      const picked = selected.has(i);
      if (isTarget && picked) correct++;
      if (!isTarget && picked) correct--;
    });
    correct = Math.max(0, correct);
    return targetCount === 0 ? 100 : Math.round((correct / targetCount) * 100);
  }, [checked, selected, targets, targetCount]);

  const toggle = (i: number) => {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700">{task.prompt}</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {task.items.map((item, i) => {
          const picked = selected.has(i);
          const isTarget = targets[i];
          let cls = "border-slate-200 bg-white text-slate-700 hover:border-teal-300";
          if (checked) {
            if (isTarget && picked) cls = "border-emerald-400 bg-emerald-100 text-emerald-700";
            else if (isTarget && !picked) cls = "border-amber-400 bg-amber-50 text-amber-700";
            else if (!isTarget && picked) cls = "border-rose-400 bg-rose-100 text-rose-600";
            else cls = "border-slate-100 bg-slate-50 text-slate-400";
          } else if (picked) {
            cls = "border-teal-400 bg-teal-100 text-teal-700";
          }
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={checked}
              className={`min-w-12 rounded-2xl border-2 px-4 py-2.5 text-lg font-extrabold shadow-sm transition ${cls} ${!checked ? "active:scale-95" : ""}`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <TaskActions
        checked={checked}
        percent={percent}
        canCheck={selected.size > 0}
        checkLabel={`${task.actionEmoji} ${task.actionLabel}`}
        onCheck={() => setChecked(true)}
        onRetry={() => {
          setChecked(false);
        }}
        onNext={() => onAdvance(percent)}
        onFeedback={onFeedback}
        isLast={isLast}
      />
    </div>
  );
}
