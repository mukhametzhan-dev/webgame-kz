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
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 lg:max-w-6xl 2xl:max-w-7xl 2xl:py-10">
      <div className="text-center sm:text-left">
        <p className="text-xs font-bold tracking-[0.2em] text-white/70 sm:text-sm lg:text-base">БАЛАЛАРҒА АРНАЛҒАН ОЙЫН</p>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl font-extrabold text-white drop-shadow-sm sm:text-4xl lg:text-5xl 2xl:text-6xl">
          Дыбыстарды тап!
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base lg:max-w-2xl lg:text-lg 2xl:text-xl">
          Әр бөлімде қазақ тілінің ерекше дыбыстарын үйрен, тапсырмаларды орында және жұлдыз жина.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:mt-8 lg:gap-x-6 lg:gap-y-8 2xl:mt-14 2xl:gap-x-10 2xl:gap-y-14">
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
      <p className="mb-2 text-center text-sm font-extrabold text-white sm:text-base lg:mb-2 lg:text-base 2xl:mb-3 2xl:text-xl">
        {section.title.split(". ")[1]}
      </p>
      <button
        onClick={onClick}
        className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${section.color} p-1 shadow-lg ring-4 ring-white/70 transition hover:scale-105 active:scale-95 sm:h-28 sm:w-28 lg:h-28 lg:w-28 2xl:h-40 2xl:w-40`}
        aria-label={`${section.title} бастау`}
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white/15 font-[var(--font-display)] text-4xl font-extrabold text-white drop-shadow sm:text-5xl 2xl:text-7xl">
          {section.letter}
        </span>
        {stars > 0 && (
          <span className="absolute -top-2 -right-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-amber-500 shadow 2xl:px-2 2xl:py-1 2xl:text-base">
            {"⭐".repeat(stars)}
          </span>
        )}
      </button>
      <button
        onClick={onClick}
        className="mt-3 rounded-full bg-white px-5 py-1.5 text-sm font-extrabold text-teal-700 shadow-md transition hover:bg-teal-50 active:scale-95 lg:mt-3 2xl:mt-4 2xl:px-8 2xl:py-3 2xl:text-xl"
      >
        Бастау
      </button>
    </div>
  );
}
