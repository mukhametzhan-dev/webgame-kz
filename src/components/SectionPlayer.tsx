import { useState } from "react";
import type { Section } from "../types";
import { TaskRenderer } from "./tasks/TaskRenderer";

export function SectionPlayer({
  section,
  onFinish,
  onFeedback,
}: {
  section: Section;
  onFinish: (percent: number) => void;
  onFeedback: (percent: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>(() => Array(section.tasks.length).fill(-1));

  const task = section.tasks[index];
  const isLast = index === section.tasks.length - 1;

  const handleAdvance = (percent: number) => {
    const nextScores = [...scores];
    nextScores[index] = percent;
    setScores(nextScores);
    if (isLast) {
      const answered = nextScores.filter((s) => s >= 0);
      const average = answered.length ? Math.round(answered.reduce((a, b) => a + b, 0) / answered.length) : 0;
      onFinish(average);
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:max-w-3xl lg:py-10 xl:max-w-4xl">
      <div className="mb-5 flex items-center justify-center gap-1.5 lg:mb-8 lg:gap-2">
        {section.tasks.map((t, i) => (
          <span
            key={t.id}
            className={`h-2.5 rounded-full transition-all lg:h-3.5 ${
              i === index ? "w-7 bg-white lg:w-10" : scores[i] >= 0 ? "w-2.5 bg-white/80 lg:w-3.5" : "w-2.5 bg-white/30 lg:w-3.5"
            }`}
          />
        ))}
      </div>

      <div className="animate-pop-in rounded-3xl bg-white p-5 shadow-xl sm:p-7 lg:p-10">
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-wide text-slate-400 lg:mb-2 lg:text-sm">
          {section.title} · {index + 1}/{section.tasks.length}
        </p>
        <TaskRenderer key={task.id} task={task} isLast={isLast} onAdvance={handleAdvance} onFeedback={onFeedback} />
      </div>
    </div>
  );
}
