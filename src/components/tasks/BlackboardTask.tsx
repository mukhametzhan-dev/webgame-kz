import { useRef, useState } from "react";
import type { BlackboardTask as BlackboardTaskType } from "../../types";

const W = 640;
const H = 360;

export function BlackboardTask({
  task,
  isLast,
  onAdvance,
}: {
  task: BlackboardTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [done, setDone] = useState(false);

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = posFromEvent(e);
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
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#fde68a";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
  };

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      <p className="mb-4 text-center text-sm text-slate-400 lg:mb-6 lg:text-lg">
        Тақтаға саусағыңмен немесе тінтуірмен «{task.letter}» әрпін бор түсімен сыз.
      </p>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="w-full touch-none rounded-3xl border-4 border-emerald-950 bg-emerald-900 shadow-inner"
        style={{ aspectRatio: `${W} / ${H}` }}
      />

      <div className="mt-4 flex gap-3 lg:mt-6 lg:gap-4">
        <button
          onClick={clear}
          className="flex-1 rounded-2xl bg-white py-3 font-extrabold text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 lg:py-4 lg:text-lg"
        >
          Тазарту
        </button>
        <button
          onClick={() => setDone(true)}
          className={`flex-1 rounded-2xl py-3 font-extrabold text-white shadow-md transition lg:py-4 lg:text-lg ${
            done ? "bg-emerald-500" : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          {done ? "Дайын! ✅" : "Дайын"}
        </button>
      </div>

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
