import { useState } from "react";
import { Modal } from "./Modal";

export function SettingsModal({
  soundOn,
  onToggleSound,
  onReset,
  onClose,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <Modal title="Баптаулар" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <button
          onClick={onToggleSound}
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <span>Дыбыс эффектілері</span>
          <span className="text-lg">{soundOn ? "🔊 Қосулы" : "🔇 Өшірулі"}</span>
        </button>

        {!confirmingReset ? (
          <button
            onClick={() => setConfirmingReset(true)}
            className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <span>Нәтижелерді тазалау</span>
            <span className="text-lg">🗑️</span>
          </button>
        ) : (
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="mb-3 text-sm font-semibold text-rose-700">Барлық жетістіктер өшеді. Сенімдісің бе?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onReset();
                  setConfirmingReset(false);
                }}
                className="flex-1 rounded-xl bg-rose-500 py-2 font-bold text-white transition hover:bg-rose-600"
              >
                Иә, тазала
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className="flex-1 rounded-xl bg-white py-2 font-bold text-slate-500 shadow"
              >
                Жоқ
              </button>
            </div>
          </div>
        )}

        <p className="pt-2 text-center text-xs text-slate-400">
          «Дыбыстарды тап!» — қазақ тілінің дыбыстарын ажыратуға үйрететін балаларға арналған ойын.
        </p>
      </div>
    </Modal>
  );
}
