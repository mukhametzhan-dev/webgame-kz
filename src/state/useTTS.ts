import { useCallback, useRef } from "react";

const TTS_BASE = "https://edgettsapi.vercel.app/tts";
const VOICE = "kk-KZ-AigulNeural";
const RATE = "-10%";

function buildUrl(text: string) {
  const params = new URLSearchParams({ text, voice: VOICE, rate: RATE });
  return `${TTS_BASE}?${params.toString()}`;
}

export function useTTS() {
  const cacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    currentRef.current?.pause();

    let audio = cacheRef.current.get(text);
    if (!audio) {
      audio = new Audio(buildUrl(text));
      cacheRef.current.set(text, audio);
    } else {
      audio.currentTime = 0;
    }
    audio.onended = onEnd ?? null;
    audio.onerror = onEnd ?? null;
    currentRef.current = audio;
    audio.play().catch(() => onEnd?.());
  }, []);

  const stop = useCallback(() => {
    currentRef.current?.pause();
  }, []);

  return { speak, stop };
}
