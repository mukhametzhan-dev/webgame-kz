import { useState } from "react";
import type { ImageWordTask as ImageWordTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";

const TAGS: { value: "start" | "middle" | "end"; label: string }[] = [
  { value: "start", label: "Басында" },
  { value: "middle", label: "Ортасында" },
  { value: "end", label: "Соңында" },
];

export function ImageWordTask({
  task,
  isLast,
  onAdvance,
}: {
  task: ImageWordTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [imageOk, setImageOk] = useState<Record<number, boolean>>({});

  const allPicked = task.items.every((_, i) => picked[i]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <p className="mb-4 text-center text-xs text-slate-400 lg:mb-6 lg:text-base">
        Суретті ата, «{task.letter}» дыбысы қай жерде тұрғанын тап, содан кейін сөйлем құра.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        {task.items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-3 lg:gap-3 lg:p-4"
          >
            {imageOk[i] !== false ? (
              <img
                src={item.image}
                alt={item.word}
                onError={() => setImageOk((prev) => ({ ...prev, [i]: false }))}
                className="aspect-square w-full rounded-2xl object-cover shadow-inner"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <span className="text-5xl lg:text-7xl">🐾</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => speak(item.word)}
                aria-label="Тыңда"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-base text-teal-600 transition active:scale-90 lg:h-10 lg:w-10 lg:text-lg"
              >
                🔊
              </button>
              <p className="font-[var(--font-display)] text-lg font-extrabold text-slate-800 lg:text-2xl">{item.word}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 lg:gap-2">
              {TAGS.map((tag) => {
                const selected = picked[i] === tag.value;
                return (
                  <button
                    key={tag.value}
                    onClick={() => setPicked((prev) => ({ ...prev, [i]: tag.value }))}
                    className={`rounded-xl border-2 px-2.5 py-1 text-xs font-bold transition lg:px-3 lg:py-1.5 lg:text-sm ${
                      selected ? "border-teal-400 bg-teal-100 text-teal-700" : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAdvance(100)}
        disabled={!allPicked}
        className="mt-6 w-full rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition enabled:hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40 lg:mt-8 lg:py-4 lg:text-lg"
      >
        {isLast ? "Аяқтау" : "Келесі →"}
      </button>
    </div>
  );
}
