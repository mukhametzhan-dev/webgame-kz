import { useCallback, useEffect, useState } from "react";

export interface SectionResult {
  stars: 0 | 1 | 2 | 3;
  best: number; // best percentage 0-100
  completedAt: number;
}

export type ProgressState = Record<string, SectionResult>;

const STORAGE_KEY = "dyb-tap-progress-v1";

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressState) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const recordResult = useCallback((sectionId: string, percent: number) => {
    const stars: 0 | 1 | 2 | 3 = percent >= 90 ? 3 : percent >= 60 ? 2 : percent > 0 ? 1 : 0;
    setProgress((prev) => {
      const existing = prev[sectionId];
      const best = existing ? Math.max(existing.best, percent) : percent;
      const bestStars: 0 | 1 | 2 | 3 = best >= 90 ? 3 : best >= 60 ? 2 : best > 0 ? 1 : 0;
      return {
        ...prev,
        [sectionId]: { stars: (existing ? Math.max(existing.stars, stars, bestStars) : stars) as 0 | 1 | 2 | 3, best, completedAt: Date.now() },
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  const totalStars = Object.values(progress).reduce((sum, r) => sum + r.stars, 0);
  const completedCount = Object.keys(progress).length;

  return { progress, recordResult, resetProgress, totalStars, completedCount };
}
