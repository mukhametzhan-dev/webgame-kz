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

type Shape = "square" | "triangle" | "circle" | "trapezoid" | "letter";

function ShapeIcon({ shape, fill, stroke, letterText }: { shape: Shape; fill: string; stroke: string; letterText?: string }) {
  const common = { fill, stroke, strokeWidth: 4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {shape === "circle" && <circle cx="50" cy="50" r="42" {...common} />}
      {shape === "triangle" && <polygon points="8,18 92,18 50,90" {...common} />}
      {shape === "trapezoid" && <polygon points="30,10 70,10 96,90 4,90" {...common} />}
      {shape === "square" && <rect x="8" y="8" width="84" height="84" rx="14" {...common} />}
      {shape === "letter" && (
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="80"
          fontWeight="800"
          fontFamily="'Segoe UI', sans-serif"
          {...common}
        >
          {letterText}
        </text>
      )}
    </svg>
  );
}

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
      <p className="mb-4 text-center text-lg font-bold text-slate-700 lg:mb-6 lg:text-2xl">{task.prompt}</p>

      <div className="mb-4 flex flex-col gap-1.5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 lg:mb-6 lg:gap-2 lg:p-5 lg:text-lg">
        {task.quadrants.map((q) => (
          <p key={q.key}>
            <b>{describe(q.key)}</b> — <span style={{ color: q.colorHex }}>{q.colorName}</span>
          </p>
        ))}
      </div>

      <p className="mb-2 text-center text-sm font-bold text-slate-500 lg:mb-3 lg:text-lg">1. Түсті таңда:</p>
      <div className="mb-5 flex flex-wrap justify-center gap-2 lg:mb-8 lg:gap-3">
        {palette.map((c) => (
          <button
            key={c.colorHex}
            onClick={() => setSelectedColor(c.colorHex)}
            disabled={checked}
            aria-label={c.colorName}
            className={`h-11 w-11 rounded-full border-4 shadow transition active:scale-90 lg:h-16 lg:w-16 ${
              selectedColor === c.colorHex ? "border-slate-700" : "border-white"
            }`}
            style={{ backgroundColor: c.colorHex }}
          />
        ))}
      </div>

      <p className="mb-2 text-center text-sm font-bold text-slate-500 lg:mb-3 lg:text-lg">2. Фигураны бас:</p>
      <div className="mx-auto grid w-56 grid-cols-2 grid-rows-2 gap-4 lg:w-80 lg:gap-6">
        {task.quadrants
          .filter((q) => q.key !== "extra")
          .map((q) => {
            const fill = fills[q.key];
            const isCorrect = checked && fill === q.colorHex;
            const isWrong = checked && fill !== q.colorHex;
            return (
              <button
                key={q.key}
                onClick={() => selectedColor && !checked && setFills((prev) => ({ ...prev, [q.key]: selectedColor }))}
                disabled={checked}
                className={`${gridPosition[q.key]} relative flex aspect-square items-center justify-center transition`}
              >
                <ShapeIcon
                  shape={q.shape ?? "square"}
                  fill={fill ?? "#f8fafc"}
                  stroke={isCorrect ? "#34d399" : isWrong ? "#fb7185" : "#cbd5e1"}
                  letterText={q.letterText}
                />
                {checked && (
                  <span className="absolute text-2xl drop-shadow lg:text-4xl">{isCorrect ? "✅" : "❌"}</span>
                )}
              </button>
            );
          })}
      </div>

      {task.quadrants.some((q) => q.key === "extra") && (
        <div className="mx-auto mt-4 flex w-56 justify-center lg:mt-6 lg:w-80">
          {task.quadrants
            .filter((q) => q.key === "extra")
            .map((q) => {
              const fill = fills[q.key];
              const isCorrect = checked && fill === q.colorHex;
              const isWrong = checked && fill !== q.colorHex;
              return (
                <button
                  key={q.key}
                  onClick={() => selectedColor && !checked && setFills((prev) => ({ ...prev, [q.key]: selectedColor }))}
                  disabled={checked}
                  className="relative flex aspect-square w-24 items-center justify-center transition lg:w-32"
                >
                  <ShapeIcon
                    shape={q.shape ?? "square"}
                    fill={fill ?? "#f8fafc"}
                    stroke={isCorrect ? "#34d399" : isWrong ? "#fb7185" : "#cbd5e1"}
                    letterText={q.letterText}
                  />
                  {checked && (
                    <span className="absolute text-2xl drop-shadow lg:text-4xl">{isCorrect ? "✅" : "❌"}</span>
                  )}
                </button>
              );
            })}
        </div>
      )}

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
    case "bottom-right":
      return "Оң жақтағы төменгі фигура";
    default:
      return "Төмендегі қосымша фигура";
  }
}
