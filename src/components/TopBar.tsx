export function TopBar({
  onTrophy,
  onSound,
  onSettings,
  soundOn,
  homeButton,
}: {
  onTrophy: () => void;
  onSound: () => void;
  onSettings: () => void;
  soundOn: boolean;
  homeButton?: { label: string; onClick: () => void };
}) {
  return (
    <div className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
      <div className="flex gap-2 lg:gap-3">
        <IconButton emoji="🏆" label="Жетістіктер" onClick={onTrophy} />
        <IconButton emoji={soundOn ? "🔊" : "🔇"} label="Дыбыс" onClick={onSound} />
        <IconButton emoji="⚙️" label="Баптаулар" onClick={onSettings} />
      </div>
      {homeButton && (
        <button
          onClick={homeButton.onClick}
          className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-teal-700 shadow-md transition hover:bg-white active:scale-95 lg:px-6 lg:py-3 lg:text-lg"
        >
          🏠 {homeButton.label}
        </button>
      )}
    </div>
  );
}

function IconButton({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-xl text-white shadow-sm backdrop-blur-sm transition hover:bg-white/30 active:scale-90 lg:h-14 lg:w-14 lg:text-2xl lg:rounded-3xl"
    >
      {emoji}
    </button>
  );
}
