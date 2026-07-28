import { Modal } from "./Modal";
import type { Section } from "../types";
import type { ProgressState } from "../state/useProgress";

export function ProgressModal({
  sections,
  progress,
  totalStars,
  onClose,
}: {
  sections: Section[];
  progress: ProgressState;
  totalStars: number;
  onClose: () => void;
}) {
  const maxStars = sections.length * 3;
  return (
    <Modal title="Жетістіктер" onClose={onClose}>
      <p className="mb-4 text-center text-sm font-semibold text-slate-500">
        Жиналған жұлдыздар: <span className="text-amber-500">⭐ {totalStars}</span> / {maxStars}
      </p>
      <ul className="flex flex-col gap-2">
        {sections.map((s) => {
          const r = progress[s.id];
          const stars = r?.stars ?? 0;
          return (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5"
            >
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-sm font-extrabold text-white`}
                >
                  {s.letter}
                </span>
                {s.title.replace(/^\d+-бөлім\.\s*/, "")}
              </span>
              <span className="text-base tracking-wide" aria-label={`${stars} жұлдыз`}>
                {"⭐".repeat(stars)}
                <span className="opacity-20">{"⭐".repeat(3 - stars)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
