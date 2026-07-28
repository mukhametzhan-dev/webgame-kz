import { useMemo, useState } from "react";
import type { ColorShapesTask as ColorShapesTaskType } from "../../types";
import { TaskActions } from "./TaskActions";

const EXTRA_COLORS = [
  { colorName: "қызғылт", colorHex: "#ec4899" },
  { colorName: "күлгін", colorHex: "#a855f7" },
];

const gridPosition: Record<string, string> = {
  "top-left": "col-start-1 row-start-1",
  "top-right": "col-start-2 row-start-1",
  "bottom-left": "col-start-1 row-start-2",
  "bottom-right": "col-start-2 row-start-2",
};

export function ColorShapesTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: ColorShapesTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const palette = useMemo(() => {
    const all = [...task.quadrants.map((q) => ({ colorName: q.colorName, colorHex: q.colorHex })), ...EXTRA_COLORS];
    // fixed pseudo-shuffle for visual variety, stable across renders
    return [all[2], all[0], all[4], all[1], all[5], all[3]].filter(Boolean);
  }, [task]);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = task.quadrants.filter((q) => fills[q.key] === q.colorHex).length;
    return Math.round((correctCount / task.quadrants.length) * 100);
  }, [checked, task.quadrants, fills]);

  const allFilled = task.quadrants.every((q) => fills[q.key]);

  return (
    <div>
      <p className="mb-4 text-center text-lg font-bold text-slate-700">{task.prompt}</p>

      <div className="mb-4 flex flex-col gap-1.5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
        {task.quadrants.map((q) => (
          <p key={q.key}>
            <b>{describe(q.key)}</b> — <span style={{ color: q.colorHex }}>{q.colorName}</span>
          </p>
        ))}
      </div>

      <p className="mb-2 text-center text-sm font-bold text-slate-500">1. Түсті таңда:</p>
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {palette.map((c) => (
          <button
            key={c.colorHex}
            onClick={() => setSelectedColor(c.colorHex)}
            disabled={checked}
            aria-label={c.colorName}
            className={`h-11 w-11 rounded-full border-4 shadow transition active:scale-90 ${
              selectedColor === c.colorHex ? "border-slate-700" : "border-white"
            }`}
            style={{ backgroundColor: c.colorHex }}
          />
        ))}
      </div>

      <p className="mb-2 text-center text-sm font-bold text-slate-500">2. Фигураны бас:</p>
      <div className="mx-auto grid w-56 grid-cols-2 grid-rows-2 gap-4">
        {task.quadrants.map((q) => {
          const fill = fills[q.key];
          const isCorrect = checked && fill === q.colorHex;
          const isWrong = checked && fill !== q.colorHex;
          return (
            <button
              key={q.key}
              onClick={() => selectedColor && !checked && setFills((prev) => ({ ...prev, [q.key]: selectedColor }))}
              disabled={checked}
              className={`${gridPosition[q.key]} flex aspect-square items-center justify-center rounded-3xl border-4 shadow-inner transition ${
                isCorrect ? "border-emerald-400" : isWrong ? "border-rose-400" : "border-slate-300"
              }`}
              style={{ backgroundColor: fill ?? "#f8fafc" }}
            >
              {checked && <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>}
            </button>
          );
        })}
      </div>

      <TaskActions
        checked={checked}
        percent={percent}
        canCheck={allFilled}
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

function describe(key: string) {
  switch (key) {
    case "top-left":
      return "Сол жақтағы жоғарғы фигура";
    case "top-right":
      return "Оң жақтағы жоғарғы фигура";
    case "bottom-left":
      return "Сол жақтағы төменгі фигура";
    default:
      return "Оң жақтағы төменгі фигура";
  }
}
