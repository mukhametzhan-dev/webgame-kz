// Shared types for the "Дыбыстарды тап!" phonemic-awareness game.

export type Position = "басында" | "ортасында" | "соңында" | "басында және соңында" | "басында және ортасында";

export interface ChipSelectTask {
  type: "chip-select";
  id: string;
  prompt: string;
  actionEmoji: string;
  actionLabel: string;
  items: string[];
  isTarget: (item: string, index: number) => boolean;
}

export interface PositionChoiceTask {
  type: "position-choice";
  id: string;
  prompt: string;
  words: { word: string; correct: Position }[];
}

export interface LetterFillTask {
  type: "letter-fill";
  id: string;
  prompt: string;
  items: {
    stem: string; // e.g. "...н" or "к...рме"
    options: string[];
    correct: string;
    result: string; // full resulting word, revealed after correct answer
  }[];
}

export interface BuildWordTask {
  type: "build-word";
  id: string;
  prompt: string;
  pool: string[]; // tiles available (letters or syllables), includes distractors
  words: { target: string; tiles: string[] }[]; // tiles must be subset of pool, joined = target
}

export interface CountChoiceTask {
  type: "count-choice";
  id: string;
  prompt: string;
  items: { word: string; correct: number; options: number[] }[];
}

export interface ColorShapesTask {
  type: "color-shapes";
  id: string;
  prompt: string;
  quadrants: {
    key: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    colorName: string;
    colorHex: string;
  }[];
}

export interface PracticeTask {
  type: "practice";
  id: string;
  prompt: string;
  items: string[];
  actionLabel: string;
}

export type Task =
  | ChipSelectTask
  | PositionChoiceTask
  | LetterFillTask
  | BuildWordTask
  | CountChoiceTask
  | ColorShapesTask
  | PracticeTask;

export interface Section {
  id: string;
  order: number;
  letter: string;
  title: string;
  color: string; // tailwind gradient "from-X to-Y"
  ring: string;
  tasks: Task[];
}
