import { useEffect, useRef, useState } from "react";
import type { TracingCanvasTask as TracingCanvasTaskType } from "../../types";

const W = 320;
const H = 220;

function drawGuides(ctx: CanvasRenderingContext2D, letter: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#cbd5e1";
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 2;

  // flower: center + 5 petals
  const cx = 42;
  const cy = 40;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 14, cy + Math.sin(angle) * 14, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.stroke();

  // plus signs scattered
  const plusPoints: [number, number][] = [
    [90, 20],
    [110, 55],
    [80, 65],
  ];
  for (const [px, py] of plusPoints) {
    ctx.beginPath();
    ctx.moveTo(px - 7, py);
    ctx.lineTo(px + 7, py);
    ctx.moveTo(px, py - 7);
    ctx.lineTo(px, py + 7);
    ctx.stroke();
  }

  // letter, traced twice
  ctx.font = "bold 90px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(letter, 170, 120);
  ctx.strokeText(letter, 260, 120);

  ctx.setLineDash([]);
}

function drawLetterOnly(ctx: CanvasRenderingContext2D, letter: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#cbd5e1";
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 2;
  ctx.font = "bold 130px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(letter, W / 2, H / 2);
  ctx.setLineDash([]);
}

function drawBlank(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
}

function TracingCanvas({
  label,
  letter,
  guide,
  done,
  onDone,
}: {
  label: string;
  letter: string;
  guide: "bilateral" | "letter" | "blank";
  done: boolean;
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (guide === "bilateral") drawGuides(ctx, letter);
    else if (guide === "letter") drawLetterOnly(ctx, letter);
    else drawBlank(ctx);
  }, [letter, guide]);

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (guide === "bilateral") drawGuides(ctx, letter);
    else if (guide === "letter") drawLetterOnly(ctx, letter);
    else drawBlank(ctx);
  };

  return (
    <div className="flex flex-col items-center gap-2 lg:gap-3">
      <p className="text-sm font-bold text-slate-500 lg:text-lg">{label}</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="touch-none rounded-2xl border-2 border-slate-200 bg-white shadow-inner"
      />
      <div className="flex gap-2 lg:gap-3">
        <button
          onClick={clear}
          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-200 lg:px-4 lg:py-2 lg:text-sm"
        >
          Тазарту
        </button>
        <button
          onClick={onDone}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition lg:px-6 lg:py-2 lg:text-sm ${
            done ? "bg-emerald-500 text-white" : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          {done ? "Дайын! ✅" : "Дайын"}
        </button>
      </div>
    </div>
  );
}

export function TracingCanvasTask({
  task,
  isLast,
  onAdvance,
}: {
  task: TracingCanvasTaskType;
  isLast: boolean;
  onAdvance: (percent: number) => void;
}) {
  const [rightDone, setRightDone] = useState(false);
  const [leftDone, setLeftDone] = useState(false);
  const bothDone = rightDone && leftDone;
  const mode = task.mode ?? "bilateral";

  return (
    <div>
      <p className="mb-5 text-center text-lg font-bold text-slate-700 lg:mb-8 lg:text-2xl">{task.prompt}</p>
      {mode === "bilateral" && (
        <p className="mb-4 text-center text-xs text-slate-400 lg:mb-6 lg:text-base">
          Гүлді бір рет, «{task.letter}» әрпін екі рет сыз, «+» белгілерін дөңгелекте.
        </p>
      )}

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        {mode === "bilateral" ? (
          <>
            <TracingCanvas
              label="Оң қол / Right hand"
              letter={task.letter}
              guide="bilateral"
              done={rightDone}
              onDone={() => setRightDone((v) => !v)}
            />
            <TracingCanvas
              label="Сол қол / Left hand"
              letter={task.letter}
              guide="bilateral"
              done={leftDone}
              onDone={() => setLeftDone((v) => !v)}
            />
          </>
        ) : (
          <>
            <TracingCanvas
              label="Үлгі бойынша сыз"
              letter={task.letter}
              guide="letter"
              done={leftDone}
              onDone={() => setLeftDone((v) => !v)}
            />
            <TracingCanvas
              label="Енді өзің сал"
              letter={task.letter}
              guide="blank"
              done={rightDone}
              onDone={() => setRightDone((v) => !v)}
            />
          </>
        )}
      </div>

      <button
        onClick={() => onAdvance(100)}
        disabled={!bothDone}
        className="mt-6 w-full rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition enabled:hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40 lg:mt-8 lg:py-4 lg:text-lg"
      >
        {isLast ? "Аяқтау" : "Келесі →"}
      </button>
    </div>
  );
}
