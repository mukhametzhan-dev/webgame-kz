import type { Section } from "../types";
import type { ProgressState } from "../state/useProgress";

export function Home({
  sections,
  progress,
  onSelect,
}: {
  sections: Section[];
  progress: ProgressState;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-8">
      <div className="text-center sm:text-left">
        <p className="text-xs font-bold tracking-[0.2em] text-white/70 sm:text-sm">БАЛАЛАРҒА АРНАЛҒАН ОЙЫН</p>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl font-extrabold text-white drop-shadow-sm sm:text-4xl">
          Дыбыстарды тап!
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Әр бөлімде қазақ тілінің ерекше дыбыстарын үйрен, тапсырмаларды орында және жұлдыз жина.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4">
        {sections.map((s) => {
          const stars = progress[s.id]?.stars ?? 0;
          return (
            <SectionCard key={s.id} section={s} stars={stars} onClick={() => onSelect(s.id)} />
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  stars,
  onClick,
}: {
  section: Section;
  stars: number;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-center text-sm font-extrabold text-white sm:text-base">{section.title.split(". ")[1]}</p>
      <button
        onClick={onClick}
        className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${section.color} p-1 shadow-lg ring-4 ring-white/70 transition hover:scale-105 active:scale-95 sm:h-28 sm:w-28`}
        aria-label={`${section.title} бастау`}
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white/15 font-[var(--font-display)] text-4xl font-extrabold text-white drop-shadow sm:text-5xl">
          {section.letter}
        </span>
        {stars > 0 && (
          <span className="absolute -top-2 -right-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-amber-500 shadow">
            {"⭐".repeat(stars)}
          </span>
        )}
      </button>
      <button
        onClick={onClick}
        className="mt-3 rounded-full bg-white px-5 py-1.5 text-sm font-extrabold text-teal-700 shadow-md transition hover:bg-teal-50 active:scale-95"
      >
        Бастау
      </button>
    </div>
  );
}
