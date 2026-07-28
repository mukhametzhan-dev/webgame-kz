import { useEffect, useRef } from "react";

export function TaskActions({
  checked,
  percent,
  onCheck,
  onRetry,
  onNext,
  canCheck,
  isLast,
  checkLabel = "Тексеру",
  onFeedback,
}: {
  checked: boolean;
  percent: number;
  onCheck: () => void;
  onRetry: () => void;
  onNext: () => void;
  canCheck: boolean;
  isLast: boolean;
  checkLabel?: string;
  onFeedback?: (percent: number) => void;
}) {
  const prevChecked = useRef(false);
  useEffect(() => {
    if (checked && !prevChecked.current) onFeedback?.(percent);
    prevChecked.current = checked;
  }, [checked, percent, onFeedback]);

  return (
    <div className="mt-6 lg:mt-8">
      {checked && (
        <div
          className={`animate-pop-in mb-4 rounded-2xl px-4 py-3 text-center font-bold lg:mb-6 lg:px-6 lg:py-4 lg:text-lg ${
            percent >= 100
              ? "bg-emerald-100 text-emerald-700"
              : percent > 0
                ? "bg-amber-100 text-amber-700"
                : "bg-rose-100 text-rose-600"
          }`}
        >
          {percent >= 100 ? "Тамаша! Барлығы дұрыс! 🎉" : percent > 0 ? `Жақсы, бірақ кейбірі қате. Тағы көр! (${percent}%)` : "Қате! Тағы бір байқап көр. 🙈"}
        </div>
      )}
      <div className="flex gap-3 lg:gap-4">
        {!checked ? (
          <button
            onClick={onCheck}
            disabled={!canCheck}
            className="flex-1 rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition enabled:hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40 lg:py-4 lg:text-lg"
          >
            {checkLabel}
          </button>
        ) : (
          <>
            {percent < 100 && (
              <button
                onClick={onRetry}
                className="flex-1 rounded-2xl bg-white py-3 font-extrabold text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 lg:py-4 lg:text-lg"
              >
                Қайталау
              </button>
            )}
            <button
              onClick={onNext}
              className="flex-1 rounded-2xl bg-teal-500 py-3 font-extrabold text-white shadow-md transition hover:bg-teal-600 lg:py-4 lg:text-lg"
            >
              {isLast ? "Аяқтау" : "Келесі →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
