import { useEffect, useRef, useState } from "react";
import type { StrikeThroughTask as StrikeThroughTaskType } from "../../types";

const W = 360;
const H = 240;
const COLS = 3;

function ovalPositions(count: number): { x: number; y: number }[] {
  const rows = Math.ceil(count / COLS);
  const cellW = W / COLS;
  const cellH = H / rows;
  return Array.from({ length: count }).map((_, i) => ({
    x: (i % COLS) * cellW + cellW / 2,
    y: Math.floor(i / COLS) * cellH + cellH / 2,
  }));
}

function drawGuides(ctx: CanvasRenderingContext2D, count: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#94a3b8";
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 3;

  for (const { x, y } of ovalPositions(count)) {
    ctx.beginPath();
    ctx.ellipse(x, y, 34, 26, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

export function StrikeThroughTask({
  task,
  isLast,
  onAdvance,
}: {
  task: StrikeThroughTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const strokeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawGuides(ctx, task.count);
  }, [task.count]);

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (done) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = posFromEvent(e);
    strokeStartRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = posFromEvent(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f97316";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const start = strokeStartRef.current;
    const { x, y } = posFromEvent(e);
    const moved = start ? Math.hypot(x - start.x, y - start.y) : 0;
    // Критикалық логика: кез келген бір сызық сызылса, тапсырма бірден орындалды деп есептеледі.
    if (moved > 12) setDone(true);
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawGuides(ctx, task.count);
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <p className="mb-4 text-center text-sm text-slate-400 lg:mb-6 lg:text-lg">
        Кез келген «О» дөңгелегін ортасынан сызып, «{task.letter}» әрпіне айналдыр.
      </p>

      <div className="mx-auto flex max-w-md flex-col items-center gap-3 lg:max-w-lg lg:gap-4">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="w-full touch-none rounded-2xl border-2 border-slate-200 bg-white shadow-inner"
        />
        {!done && (
          <button
            onClick={clear}
            className="rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-200 lg:px-5 lg:py-2 lg:text-sm"
          >
            Тазарту
          </button>
        )}
      </div>

      {done && (
        <div className="animate-pop-in mt-5 rounded-2xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-700 lg:mt-8 lg:px-6 lg:py-4 lg:text-lg">
          Тамаша! «{task.letter}» болды! 🎉
        </div>
      )}

      <button
        onClick={() => onAdvance(100)}
        disabled={!done}
        className="mt-4 w-full rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition enabled:hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40 lg:mt-6 lg:py-4 lg:text-lg"
      >
        {isLast ? "Аяқтау" : "Келесі →"}
      </button>
    </div>
  );
}
