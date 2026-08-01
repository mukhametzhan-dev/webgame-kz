import { useMemo, useState } from "react";
import type { PhonemeSchemeTask as PhonemeSchemeTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";
import { useSound } from "../../state/useSound";
import { TaskActions } from "./TaskActions";

interface Tile {
  id: string;
  text: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scramble(sounds: string[]): string[] {
  if (sounds.length < 2) return sounds;
  let order = shuffle(sounds);
  for (let guard = 0; guard < 10 && order.join("") === sounds.join(""); guard++) {
    order = shuffle(sounds);
  }
  return order;
}

export function PhonemeSchemeTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: PhonemeSchemeTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const sound = useSound();

  const initialBanks = useMemo<Tile[][]>(
    () => task.words.map((w, wi) => scramble(w.sounds).map((text, i) => ({ id: `${wi}-${i}`, text }))),
    [task]
  );
  const [banks, setBanks] = useState<Tile[][]>(initialBanks);
  const [slots, setSlots] = useState<Tile[][]>(() => task.words.map(() => []));
  const [checked, setChecked] = useState(false);

  const allFilled = slots.every((s, i) => s.length === task.words[i].sounds.length);

  const placeTile = (wi: number, tile: Tile) => {
    if (checked || slots[wi].length >= task.words[wi].sounds.length) return;
    sound.play("click");
    setBanks((prev) => prev.map((b, i) => (i === wi ? b.filter((t) => t.id !== tile.id) : b)));
    setSlots((prev) => prev.map((s, i) => (i === wi ? [...s, tile] : s)));
  };

  const clearRow = (wi: number) => {
    if (checked || slots[wi].length === 0) return;
    setBanks((prev) => prev.map((b, i) => (i === wi ? [...b, ...slots[wi]] : b)));
    setSlots((prev) => prev.map((s, i) => (i === wi ? [] : s)));
  };

  const reset = () => {
    setBanks(initialBanks);
    setSlots(task.words.map(() => []));
    setChecked(false);
  };

  const percent = useMemo(() => {
    if (!checked) return 0;
    const correctCount = task.words.filter((w, i) => slots[i].map((t) => t.text).join("") === w.sounds.join("")).length;
    return Math.round((correctCount / task.words.length) * 100);
  }, [checked, task.words, slots]);

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      <div className="flex flex-col gap-4 lg:gap-6">
        {task.words.map((row, wi) => {
          const n = row.sounds.length;
          const built = slots[wi].map((t) => t.text).join("");
          const isCorrect = checked && built === row.sounds.join("");
          const isWrong = checked && built !== row.sounds.join("");
          return (
            <div
              key={row.word}
              className={`rounded-2xl border-2 p-3 transition lg:p-5 ${
                isCorrect ? "border-emerald-300 bg-emerald-50" : isWrong ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-3 flex items-center justify-center gap-2 lg:mb-4 lg:gap-3">
                <button
                  onClick={() => speak(row.word)}
                  aria-label="Тыңда"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-lg text-teal-600 transition active:scale-90 lg:h-14 lg:w-14 lg:text-2xl"
                >
                  🔊
                </button>
                {/* Балалар әріпті оқи алмайды: сөз checked болғанша жасырын, тек тыңдап анықтайды. */}
                {checked ? (
                  <p className="font-[var(--font-display)] text-2xl font-extrabold text-slate-800 lg:text-4xl">{row.word}</p>
                ) : (
                  <p className="text-sm font-semibold text-slate-400 lg:text-lg">Тыңда да, ретімен тіз</p>
                )}
                {checked && <span className="text-xl lg:text-3xl">{isCorrect ? "✅" : "❌"}</span>}
              </div>

              <button
                onClick={() => clearRow(wi)}
                disabled={checked}
                className="mx-auto mb-3 flex w-full flex-wrap items-center justify-center gap-2 lg:gap-3"
              >
                {Array.from({ length: n }).map((_, si) => (
                  <span
                    key={si}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 font-[var(--font-display)] text-lg font-extrabold transition lg:h-16 lg:w-16 lg:text-2xl ${
                      slots[wi][si] ? "border-teal-400 bg-teal-100 text-teal-700" : "border-slate-200 bg-slate-50 text-slate-200"
                    }`}
                  >
                    {slots[wi][si]?.text ?? ""}
                  </span>
                ))}
              </button>

              {!checked && banks[wi].length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
                  {banks[wi].map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => placeTile(wi, tile)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-teal-300 bg-white font-[var(--font-display)] text-lg font-extrabold text-teal-700 shadow-sm transition active:scale-90 lg:h-16 lg:w-16 lg:text-2xl"
                    >
                      {tile.text}
                    </button>
                  ))}
                </div>
              )}

              {isWrong && (
                <p className="mt-2 text-center text-xs font-semibold text-rose-500 lg:text-sm">Дұрысы: {row.sounds.join(" - ")}</p>
              )}
            </div>
          );
        })}
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
