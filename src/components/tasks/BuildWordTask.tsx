import { useMemo, useState } from "react";
import type { BuildWordTask as BuildWordTaskType } from "../../types";
import { TaskActions } from "./TaskActions";

interface Tile {
  id: number;
  text: string;
}

export function BuildWordTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: BuildWordTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const initialBank = useMemo<Tile[]>(() => task.pool.map((text, i) => ({ id: i, text })), [task]);
  const [bank, setBank] = useState<Tile[]>(initialBank);
  const [slots, setSlots] = useState<Tile[][]>(() => task.words.map(() => []));
  const [checked, setChecked] = useState(false);

  const activeSlot = slots.findIndex((s, i) => s.length < task.words[i].tiles.length);

  const placeTile = (tile: Tile) => {
    if (checked) return;
    const idx = activeSlot === -1 ? slots.length - 1 : activeSlot;
    if (slots[idx].length >= task.words[idx].tiles.length) return;
    setBank((prev) => prev.filter((t) => t.id !== tile.id));
    setSlots((prev) => prev.map((s, i) => (i === idx ? [...s, tile] : s)));
  };

  const clearSlot = (slotIndex: number) => {
    if (checked) return;
    setBank((prev) => [...prev, ...slots[slotIndex]]);
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? [] : s)));
  };

  const reset = () => {
    setBank(initialBank);
    setSlots(task.words.map(() => []));
    setChecked(false);
  };

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = task.words.filter((w, i) => slots[i].map((t) => t.text).join("") === w.target).length;
    return Math.round((correctCount / task.words.length) * 100);
  }, [checked, task.words, slots]);

  const allFilled = slots.every((s, i) => s.length === task.words[i].tiles.length);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      <div className="mb-5 flex flex-col gap-3 lg:mb-8 lg:gap-4">
        {task.words.map((w, i) => {
          const built = slots[i].map((t) => t.text).join("");
          const isCorrect = checked && built === w.target;
          const isWrong = checked && built !== w.target;
          return (
            <button
              key={i}
              onClick={() => clearSlot(i)}
              disabled={checked}
              className={`flex min-h-14 items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-2 font-[var(--font-display)] text-2xl font-extrabold transition lg:min-h-20 lg:gap-2 lg:px-6 lg:py-3 lg:text-4xl ${
                isCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : isWrong
                    ? "border-rose-400 bg-rose-50 text-rose-600"
                    : activeSlot === i
                      ? "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {Array.from({ length: w.tiles.length }).map((_, slotPos) => (
                <span key={slotPos} className="inline-block min-w-8 border-b-2 border-slate-300 text-center lg:min-w-12">
                  {slots[i][slotPos]?.text ?? " "}
                </span>
              ))}
              {checked && <span className="ml-1 text-lg lg:text-2xl">{isCorrect ? "✅" : "❌"}</span>}
              {isWrong && <span className="ml-2 text-sm text-rose-500 lg:text-lg">({w.target})</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 lg:gap-4">
        {bank.map((tile) => (
          <button
            key={tile.id}
            onClick={() => placeTile(tile)}
            disabled={checked}
            className="min-w-12 rounded-2xl border-2 border-teal-300 bg-white px-4 py-2.5 text-lg font-extrabold text-teal-700 shadow-sm transition active:scale-95 disabled:opacity-40 lg:min-w-16 lg:px-6 lg:py-4 lg:text-2xl"
          >
            {tile.text}
          </button>
        ))}
      </div>

      <TaskActions
        checked={checked}
        percent={percent}
        canCheck={allFilled}
        onCheck={() => setChecked(true)}
        onRetry={reset}
        onNext={() => onAdvance(percent)}
        onFeedback={onFeedback}
        isLast={isLast}
      />
    </div>
  );
}
