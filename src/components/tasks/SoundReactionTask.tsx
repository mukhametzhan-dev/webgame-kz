import { useEffect, useMemo, useState } from "react";
import type { SoundReactionTask as SoundReactionTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";
import { TaskActions } from "./TaskActions";

const WINDOW_BY_KIND: Record<string, { min: number; max: number }> = {
  sound: { min: 1100, max: 2200 },
  syllable: { min: 1300, max: 2400 },
  word: { min: 1500, max: 2700 },
};

export function SoundReactionTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: SoundReactionTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [cursor, setCursor] = useState(-1);
  const [hits, setHits] = useState<boolean[]>(() => task.items.map(() => false));
  const [pulse, setPulse] = useState(false);

  const targets = useMemo(() => task.items.map((item, i) => task.isTarget(item, i)), [task]);
  const window_ = WINDOW_BY_KIND[task.itemKind] ?? WINDOW_BY_KIND.word;

  useEffect(() => {
    if (phase !== "playing" || cursor < 0 || cursor >= task.items.length) return;
    let advanced = false;
    let audioDone = false;
    let minDone = false;

    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (cursor === task.items.length - 1) setPhase("done");
      else setCursor((c) => c + 1);
    };
    const tryAdvance = () => {
      if (audioDone && minDone) advance();
    };

    setPulse(true);
    const pulseTimer = setTimeout(() => setPulse(false), 350);

    speak(task.items[cursor], () => {
      audioDone = true;
      tryAdvance();
    });
    const minTimer = setTimeout(() => {
      minDone = true;
      tryAdvance();
    }, window_.min);
    const maxTimer = setTimeout(advance, window_.max);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [phase, cursor, task.items, speak, window_.min, window_.max]);

  const percent = useMemo(() => {
    if (phase !== "done") return 0;
    let correct = 0;
    targets.forEach((isTarget, i) => {
      if (isTarget === hits[i]) correct++;
    });
    return Math.round((correct / targets.length) * 100);
  }, [phase, hits, targets]);

  const react = () => {
    if (phase !== "playing" || cursor < 0) return;
    setHits((prev) => {
      if (prev[cursor]) return prev;
      const next = [...prev];
      next[cursor] = true;
      return next;
    });
  };

  const start = () => {
    setHits(task.items.map(() => false));
    setCursor(0);
    setPhase("playing");
  };

  const judgedCount = phase === "done" ? task.items.length : Math.max(cursor, 0);
  const judgedCorrect = task.items.slice(0, judgedCount).filter((_, i) => targets[i] === hits[i]).length;

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      {phase === "idle" && (
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center lg:max-w-lg lg:gap-4 lg:py-12">
          <span className="text-4xl lg:text-6xl">{task.reactionEmoji}</span>
          <p className="text-sm font-semibold text-slate-500 lg:text-lg">
            Дыбыстарды тыңда, керегін естігенде «{task.reactionLabel}» батырмасын бас.
          </p>
        </div>
      )}

      {phase !== "idle" && (
        <>
          <div className="mb-3 flex items-center justify-center gap-1.5 lg:mb-5 lg:gap-2">
            {task.items.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all lg:h-2.5 lg:w-2.5 ${
                  i === cursor && phase === "playing"
                    ? "w-5 bg-teal-500 lg:w-7"
                    : i < judgedCount
                      ? targets[i] === hits[i]
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                      : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {phase === "playing" && cursor >= 0 && (
            <div
              className={`mx-auto mb-5 flex max-w-sm items-center justify-center rounded-3xl border-4 bg-white py-8 shadow-inner transition-transform lg:mb-8 lg:max-w-lg lg:py-14 ${
                pulse ? "scale-105 border-teal-300" : "border-slate-200"
              }`}
            >
              {/* Balalar әріпті оқи алмайды, сондықтан мәтін орнына дыбыс ойналып жатқанын білдіретін анимацияланған ноталар белгісі көрсетіледі. */}
              {/* <span className="font-[var(--font-display)] text-5xl font-extrabold text-slate-800 lg:text-8xl">
                {task.items[cursor]}
              </span> */}
              <span
                className={`inline-block text-6xl transition-transform duration-300 lg:text-9xl ${
                  pulse ? "scale-125 -rotate-6" : "scale-100 rotate-0"
                } animate-pulse`}
              >
                🎵
              </span>
            </div>
          )}

          {phase === "done" && (
            <p className="mb-5 text-center text-sm font-bold text-slate-500 lg:mb-8 lg:text-lg">
              Дұрыс: {judgedCorrect}/{task.items.length}
            </p>
          )}

          <button
            onClick={react}
            disabled={phase !== "playing"}
            aria-label={task.reactionLabel}
            className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-3xl border-4 border-teal-300 bg-teal-100 py-6 shadow-md transition active:scale-90 disabled:opacity-40 lg:max-w-sm lg:py-9"
          >
            <span className="inline-block animate-bounce text-5xl lg:text-7xl">{task.reactionEmoji}</span>
          </button>
        </>
      )}

      {phase !== "playing" && (
        <TaskActions
          checked={phase === "done"}
          percent={percent}
          canCheck={phase === "idle"}
          checkLabel="▶ Бастау"
          onCheck={start}
          onRetry={start}
          onNext={() => onAdvance(percent)}
          onFeedback={onFeedback}
          isLast={isLast}
        />
      )}
    </div>
  );
}
