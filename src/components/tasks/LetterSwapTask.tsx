import { useMemo, useRef, useState } from "react";
import type { LetterSwapTask as LetterSwapTaskType } from "../../types";
import { TaskActions } from "./TaskActions";

interface Tile {
  id: number;
}

export function LetterSwapTask({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: LetterSwapTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  const bankTiles = useMemo<Tile[]>(() => task.items.map((_, i) => ({ id: i })), [task]);
  const [bank, setBank] = useState<Tile[]>(bankTiles);
  const [filled, setFilled] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [draggingTile, setDraggingTile] = useState<Tile | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const filledCount = Object.keys(filled).length;
  const allFilled = filledCount === task.items.length;
  const percent = checked ? 100 : 0;

  const slotUnder = (x: number, y: number): number | null => {
    for (let i = 0; i < slotRefs.current.length; i++) {
      if (filled[i]) continue;
      const el = slotRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    return null;
  };

  const startDrag = (tile: Tile) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (checked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDraggingTile(tile);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const moveDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTile) return;
    setDragPos({ x: e.clientX, y: e.clientY });
    setDragOverSlot(slotUnder(e.clientX, e.clientY));
  };

  const endDrag = (tile: Tile) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTile) return;
    const start = dragStartRef.current;
    const moved = start ? Math.hypot(e.clientX - start.x, e.clientY - start.y) : 0;

    const target = moved < 6 ? firstOpenSlot() : slotUnder(e.clientX, e.clientY);
    if (target !== null) {
      setFilled((prev) => ({ ...prev, [target]: true }));
      setBank((prev) => prev.filter((t) => t.id !== tile.id));
    }
    dragStartRef.current = null;
    setDraggingTile(null);
    setDragPos(null);
    setDragOverSlot(null);
  };

  const firstOpenSlot = (): number | null => {
    const target = Array.from({ length: task.items.length }).findIndex((_, i) => !filled[i]);
    return target === -1 ? null : target;
  };

  const clearSlot = (i: number) => {
    if (checked || !filled[i]) return;
    setFilled((prev) => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
    setBank((prev) => [...prev, { id: i }]);
  };

  const reset = () => {
    setBank(bankTiles);
    setFilled({});
    setChecked(false);
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>

      <div className="mb-6 flex flex-col gap-3 lg:mb-10 lg:gap-4">
        {task.items.map((item, i) => {
          const isFilled = !!filled[i];
          const showResult = isFilled;
          return (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              onClick={() => clearSlot(i)}
              className={`flex items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-3 font-[var(--font-display)] text-2xl font-extrabold transition lg:gap-2 lg:px-6 lg:py-5 lg:text-4xl ${
                isFilled
                  ? "cursor-pointer border-emerald-400 bg-emerald-50 text-emerald-700"
                  : dragOverSlot === i
                    ? "border-teal-400 bg-teal-50 text-teal-700"
                    : "border-slate-300 bg-white text-slate-500"
              }`}
            >
              <span className="text-base text-slate-400 lg:text-xl">{item.before} →</span>
              {item.prefix && <span>{item.prefix}</span>}
              <span
                className={`inline-flex min-w-12 items-center justify-center rounded-xl px-1 lg:min-w-16 ${
                  !isFilled ? "border-b-4 border-slate-300" : ""
                }`}
              >
                {showResult ? task.letter : ""}
              </span>
              <span>{item.rest}</span>
              {showResult && <span className="ml-2 text-base text-slate-400 lg:text-xl">= {item.result}</span>}
            </div>
          );
        })}
      </div>

      {!checked && bank.length > 0 && (
        <>
          <p className="mb-2 text-center text-sm font-bold text-slate-500 lg:mb-3 lg:text-lg">
            Әрпін бос орынға сүйреп апар:
          </p>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {bank.map((tile) => (
              <button
                key={tile.id}
                onPointerDown={startDrag(tile)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag(tile)}
                style={
                  draggingTile?.id === tile.id && dragPos
                    ? { position: "fixed", left: dragPos.x, top: dragPos.y, transform: "translate(-50%, -50%)", zIndex: 50 }
                    : undefined
                }
                className="min-w-14 touch-none select-none rounded-2xl border-2 border-teal-300 bg-white px-5 py-3 font-[var(--font-display)] text-2xl font-extrabold text-teal-700 shadow-md transition active:scale-95 lg:min-w-20 lg:px-7 lg:py-5 lg:text-4xl"
              >
                {task.letter}
              </button>
            ))}
          </div>
        </>
      )}

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
