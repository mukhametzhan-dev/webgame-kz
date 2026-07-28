import { useMemo, useState } from "react";
import { sections } from "./data/sections";
import { useProgress } from "./state/useProgress";
import { useSound } from "./state/useSound";
import { TopBar } from "./components/TopBar";
import { Home } from "./components/Home";
import { SectionPlayer } from "./components/SectionPlayer";
import { ResultsScreen } from "./components/ResultsScreen";
import { ProgressModal } from "./components/ProgressModal";
import { SettingsModal } from "./components/SettingsModal";
import { BackgroundDecor } from "./components/BackgroundDecor";

type View = { name: "home" } | { name: "section"; sectionId: string } | { name: "results"; sectionId: string; percent: number };

function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [modal, setModal] = useState<"progress" | "settings" | null>(null);
  const { progress, recordResult, resetProgress, totalStars } = useProgress();
  const sound = useSound();

  const currentSection = useMemo(() => {
    if (view.name === "home") return null;
    return sections.find((s) => s.id === view.sectionId) ?? null;
  }, [view]);

  const goHome = () => setView({ name: "home" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 via-teal-500 to-emerald-600">
      <div className="relative flex min-h-screen flex-col">
        <BackgroundDecor />
        <TopBar
          soundOn={sound.enabled}
          onTrophy={() => setModal("progress")}
          onSound={sound.toggle}
          onSettings={() => setModal("settings")}
          homeButton={view.name !== "home" ? { label: "Басты бет", onClick: goHome } : undefined}
        />

        <div className="flex flex-1 items-center justify-center">
          {view.name === "home" && <Home sections={sections} progress={progress} onSelect={(id) => setView({ name: "section", sectionId: id })} />}

          {view.name === "section" && currentSection && (
            <SectionPlayer
              key={currentSection.id}
              section={currentSection}
              onFeedback={(percent) => sound.play(percent >= 100 ? "correct" : "wrong")}
              onFinish={(percent) => {
                recordResult(currentSection.id, percent);
                sound.play(percent >= 90 ? "win" : percent >= 60 ? "correct" : "wrong");
                setView({ name: "results", sectionId: currentSection.id, percent });
              }}
            />
          )}

          {view.name === "results" && currentSection && (
            <ResultsScreen
              section={currentSection}
              percent={view.percent}
              onRetry={() => setView({ name: "section", sectionId: currentSection.id })}
              onHome={goHome}
            />
          )}
        </div>

        {modal === "progress" && <ProgressModal sections={sections} progress={progress} totalStars={totalStars} onClose={() => setModal(null)} />}
        {modal === "settings" && (
          <SettingsModal soundOn={sound.enabled} onToggleSound={sound.toggle} onReset={resetProgress} onClose={() => setModal(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
