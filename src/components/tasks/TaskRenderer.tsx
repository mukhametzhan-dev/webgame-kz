import type { Task } from "../../types";
import { ChipSelectTask } from "./ChipSelectTask";
import { PositionChoiceTask } from "./PositionChoiceTask";
import { LetterFillTask } from "./LetterFillTask";
import { BuildWordTask } from "./BuildWordTask";
import { CountChoiceTask } from "./CountChoiceTask";
import { ColorShapesTask } from "./ColorShapesTask";
import { PracticeTask } from "./PracticeTask";

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
  }
}
