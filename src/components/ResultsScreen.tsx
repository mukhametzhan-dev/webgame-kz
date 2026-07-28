import type { Section } from "../types";

function starsFor(percent: number): 0 | 1 | 2 | 3 {
  if (percent >= 90) return 3;
  if (percent >= 60) return 2;
  if (percent > 0) return 1;
  return 0;
}

function messageFor(percent: number): string {
  if (percent >= 90) return "Керемет! Сен нағыз жұлдызсың! 🌟";
  if (percent >= 60) return "Жарайсың! Тағы да жаттықсаң, тіпті жақсы болады.";
  if (percent > 0) return "Жаман емес! Тағы бір рет байқап көрсеңші?";
  return "Қорықпа, тағы да көрейік! Сен білесің!";
}

const CONFETTI_COLORS = ["#2dd4bf", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa", "#34d399"];

export function ResultsScreen({
  section,
  percent,
  onRetry,
  onHome,
}: {
  section: Section;
  percent: number;
  onRetry: () => void;
  onHome: () => void;
}) {
  const stars = starsFor(percent);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center px-4 py-10 sm:px-6 lg:max-w-xl">
      {stars >= 2 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="animate-confetti absolute top-0 block h-2.5 w-2.5 rounded-sm"
              style={{
                left: `${(i * 137) % 100}%`,
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDelay: `${(i % 8) * 0.15}s`,
                animationDuration: `${2 + (i % 5) * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="animate-pop-in w-full rounded-3xl bg-white p-7 text-center shadow-xl lg:p-10">
        <p
          className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${section.color} mx-auto text-4xl font-extrabold text-white shadow-lg lg:h-28 lg:w-28 lg:text-6xl`}
        >
          {section.letter}
        </p>
        <h2 className="mt-4 font-[var(--font-display)] text-2xl font-extrabold text-slate-800 lg:mt-6 lg:text-4xl">{section.title}</h2>

        <div className="my-5 flex justify-center gap-2 text-4xl lg:my-8 lg:gap-4 lg:text-6xl">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < stars ? "animate-pop-in" : "opacity-25"} style={{ animationDelay: `${i * 0.15}s` }}>
              ⭐
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-teal-600 lg:text-2xl">{percent}% дұрыс</p>
        <p className="mt-2 text-slate-500 lg:mt-3 lg:text-xl">{messageFor(percent)}</p>

        <div className="mt-7 flex gap-3 lg:mt-10 lg:gap-4">
          <button
            onClick={onRetry}
            className="flex-1 rounded-2xl bg-slate-100 py-3 font-extrabold text-slate-600 transition hover:bg-slate-200 lg:py-4 lg:text-lg"
          >
            ↻ Қайталау
          </button>
          <button
            onClick={onHome}
            className="flex-1 rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition hover:bg-teal-600 lg:py-4 lg:text-lg"
          >
            🏠 Басты бет
          </button>
        </div>
      </div>
    </div>
  );
}
