import { useMemo, useRef, useState } from "react";
import type { SpatialDragTask as SpatialDragTaskType } from "../../types";
import { useTTS } from "../../state/useTTS";
import { TaskActions } from "./TaskActions";

type Kind = "plain" | "target";
interface Tile {
  id: string;
  kind: Kind;
}

export function SpatialDragTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: SpatialDragTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const { speak } = useTTS();
  const initialBanks = useMemo<Tile[][]>(
    () =>
      task.items.map((_, i) => [
        { id: `${i}-plain`, kind: "plain" as Kind },
        { id: `${i}-target`, kind: "target" as Kind },
      ]),
    [task]
  );
  const [banks, setBanks] = useState<Tile[][]>(initialBanks);
  const [placed, setPlaced] = useState<Record<number, { kind: Kind; zone: "left" | "right" }>>({});
  const [checked, setChecked] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [draggingTile, setDraggingTile] = useState<{ row: number; tile: Tile } | null>(null);
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allPlaced = task.items.every((_, i) => placed[i]);
  const percent = useMemo(() => {
    if (!checked) return 0;
    const correct = task.items.filter((it, i) => placed[i]?.kind === it.correct).length;
    return Math.round((correct / task.items.length) * 100);
  }, [checked, task.items, placed]);

  const zoneUnder = (x: number, y: number, row: number): "left" | "right" | null => {
    for (const zone of ["left", "right"] as const) {
      const el = zoneRefs.current[`${row}-${zone}`];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zone;
    }
    return null;
  };

  const startDrag = (row: number, tile: Tile) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (checked || placed[row]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingTile({ row, tile });
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const moveDrag = (row: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTile) return;
    setDragPos({ x: e.clientX, y: e.clientY });
    const zone = zoneUnder(e.clientX, e.clientY, row);
    setDragOverZone(zone ? `${row}-${zone}` : null);
  };

  const endDrag = (row: number, tile: Tile) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTile) return;
    const zone = zoneUnder(e.clientX, e.clientY, row);
    if (zone) {
      setPlaced((prev) => ({ ...prev, [row]: { kind: tile.kind, zone } }));
      setBanks((prev) => prev.map((b, i) => (i === row ? [] : b)));
    }
    setDraggingTile(null);
    setDragPos(null);
    setDragOverZone(null);
  };

  const clearRow = (row: number) => {
    if (checked || !placed[row]) return;
    setPlaced((prev) => {
      const next = { ...prev };
      delete next[row];
      return next;
    });
    setBanks((prev) => prev.map((b, i) => (i === row ? initialBanks[row] : b)));
  };

  const reset = () => {
    setBanks(initialBanks);
    setPlaced({});
    setChecked(false);
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <p className="mb-4 text-center text-xs text-slate-400 lg:mb-6 lg:text-base">
        🟡 сары үшбұрыш — «{task.letter}» дыбысы (сол жақ төмен), 🔵 көк үшбұрыш — «н» дыбысы (оң жақ төмен).
      </p>

      <div className="flex flex-col gap-4 lg:gap-5">
        {task.items.map((row, i) => {
          const rowPlaced = placed[i];
          const isCorrect = checked && rowPlaced?.kind === row.correct;
          const isWrong = checked && rowPlaced && rowPlaced.kind !== row.correct;
          return (
            <div
              key={i}
              className={`rounded-2xl border-2 p-3 transition lg:p-4 ${
                checked ? (isCorrect ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-center gap-2 lg:mb-3">
                <button
                  onClick={() => speak(row.word)}
                  aria-label="Тыңда"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-base text-teal-600 transition active:scale-90 lg:h-10 lg:w-10 lg:text-lg"
                >
                  🔊
                </button>
                <p className="font-[var(--font-display)] text-xl font-extrabold text-slate-800 lg:text-3xl">{row.word}</p>
                {checked && <span className="text-lg lg:text-2xl">{isCorrect ? "✅" : "❌"}</span>}
              </div>

              <div className="mx-auto flex max-w-xs overflow-hidden rounded-2xl border-4 border-slate-300 bg-white shadow-inner lg:max-w-sm">
                <div
                  ref={(el) => {
                    zoneRefs.current[`${i}-left`] = el;
                  }}
                  onClick={() => clearRow(i)}
                  className={`flex h-16 flex-1 items-center justify-center border-r-2 border-dashed border-slate-300 text-xs font-bold transition lg:h-20 lg:text-sm ${
                    rowPlaced?.zone === "left" ? "bg-amber-100 text-2xl lg:text-4xl" : dragOverZone === `${i}-left` ? "bg-amber-50 text-slate-400" : "bg-white text-slate-400"
                  }`}
                >
                  {rowPlaced?.zone === "left" ? "🟡" : "Сол жақ төмен"}
                </div>
                <div
                  ref={(el) => {
                    zoneRefs.current[`${i}-right`] = el;
                  }}
                  onClick={() => clearRow(i)}
                  className={`flex h-16 flex-1 items-center justify-center text-xs font-bold transition lg:h-20 lg:text-sm ${
                    rowPlaced?.zone === "right" ? "bg-sky-100 text-2xl lg:text-4xl" : dragOverZone === `${i}-right` ? "bg-sky-50 text-slate-400" : "bg-white text-slate-400"
                  }`}
                >
                  {rowPlaced?.zone === "right" ? "🔵" : "Оң жақ төмен"}
                </div>
              </div>

              {isWrong && (
                <p className="mt-2 text-center text-xs font-semibold text-rose-500 lg:text-sm">
                  Дұрысы: {row.correct === "target" ? `🟡 сол жақ (${task.letter})` : "🔵 оң жақ (н)"}
                </p>
              )}

              {!checked && banks[i]?.length > 0 && (
                <div className="mt-3 flex justify-center gap-3">
                  {banks[i].map((tile) => (
                    <button
                      key={tile.id}
                      onPointerDown={startDrag(i, tile)}
                      onPointerMove={moveDrag(i)}
                      onPointerUp={endDrag(i, tile)}
                      style={
                        draggingTile?.tile.id === tile.id && dragPos
                          ? { position: "fixed", left: dragPos.x, top: dragPos.y, transform: "translate(-50%, -50%)", zIndex: 50 }
                          : undefined
                      }
                      className="touch-none select-none rounded-full border-2 border-slate-200 bg-white p-3 text-2xl shadow-md transition active:scale-95 lg:p-4 lg:text-4xl"
                    >
                      {tile.kind === "plain" ? "🔵" : "🟡"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TaskActions
        checked={checked}
        percent={percent}
        canCheck={allPlaced}
        onCheck={() => setChecked(true)}
        onRetry={reset}
        onNext={() => onAdvance(percent)}
        onFeedback={onFeedback}
        isLast={isLast}
      />
    </div>
  );
}
