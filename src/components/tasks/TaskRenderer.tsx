import type { Task } from "../../types";
import { ChipSelectTask } from "./ChipSelectTask";
import { PositionChoiceTask } from "./PositionChoiceTask";
import { LetterFillTask } from "./LetterFillTask";
import { BuildWordTask } from "./BuildWordTask";
import { CountChoiceTask } from "./CountChoiceTask";
import { ColorShapesTask } from "./ColorShapesTask";
import { PracticeTask } from "./PracticeTask";
import { SoundReactionTask } from "./SoundReactionTask";
import { PositionDetectTask } from "./PositionDetectTask";
import { LetterSwapTask } from "./LetterSwapTask";
import { PhonemeSchemeTask } from "./PhonemeSchemeTask";
import { TracingCanvasTask } from "./TracingCanvasTask";
import { StrikeThroughTask } from "./StrikeThroughTask";
import { InfoSlideTask } from "./InfoSlideTask";
import { BlackboardTask } from "./BlackboardTask";
import { SyllablePracticeTask } from "./SyllablePracticeTask";
import { ImageWordTask } from "./ImageWordTask";
import { SpatialDragTask } from "./SpatialDragTask";

export function TaskRenderer({
  task,
  isLast,
  onAdvance,
  onFeedback,
}: {
  task: Task;
  isLast: boolean;
  onAdvance: (percent: number) => void;
  onFeedback?: (percent: number) => void;
}) {
  switch (task.type) {
    case "chip-select":
      return <ChipSelectTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "position-choice":
      return <PositionChoiceTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "letter-fill":
      return <LetterFillTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "build-word":
      return <BuildWordTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "count-choice":
      return <CountChoiceTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "color-shapes":
      return <ColorShapesTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "practice":
      return <PracticeTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "sound-reaction":
      return <SoundReactionTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "position-detect":
      return <PositionDetectTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "letter-swap":
      return <LetterSwapTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "phoneme-scheme":
      return <PhonemeSchemeTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
    case "tracing-canvas":
      return <TracingCanvasTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "strike-through":
      return <StrikeThroughTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "info-slide":
      return <InfoSlideTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "blackboard":
      return <BlackboardTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "syllable-practice":
      return <SyllablePracticeTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "image-word":
      return <ImageWordTask task={task} isLast={isLast} onAdvance={onAdvance} />;
    case "spatial-drag":
      return <SpatialDragTask task={task} isLast={isLast} onAdvance={onAdvance} onFeedback={onFeedback} />;
  }
}
