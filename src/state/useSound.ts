import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "dyb-tap-sound-v1";

type SoundKind = "correct" | "wrong" | "click" | "win";

let sharedCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!sharedCtx) sharedCtx = new AC();
  return sharedCtx;
}

function playTone(ctx: AudioContext, freq: number, start: number, duration: number, gain = 0.15, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

export function useSound() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? true : raw === "1";
    } catch {
      return true;
    }
  });
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  }, [enabled]);

  const play = useCallback((kind: SoundKind) => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    switch (kind) {
      case "click":
        playTone(ctx, 520, 0, 0.08, 0.08);
        break;
      case "correct":
        playTone(ctx, 660, 0, 0.12);
        playTone(ctx, 880, 0.1, 0.16);
        break;
      case "wrong":
        playTone(ctx, 220, 0, 0.18, 0.12, "sawtooth");
        break;
      case "win":
        playTone(ctx, 523, 0, 0.14);
        playTone(ctx, 659, 0.12, 0.14);
        playTone(ctx, 784, 0.24, 0.22);
        break;
    }
  }, []);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return { enabled, toggle, play };
}
