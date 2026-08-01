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
    key: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "extra";
    colorName: string;
    colorHex: string;
    shape?: "square" | "triangle" | "circle" | "trapezoid" | "letter";
    /** Only used when shape is "letter" — the character to render/color. */
    letterText?: string;
  }[];
}

export interface PracticeTask {
  type: "practice";
  id: string;
  prompt: string;
  items: string[];
  actionLabel: string;
}

export type SoundPosition = "start" | "middle" | "end";

/** Sequential audio+visual reaction game: items play one by one, child taps the reaction
 *  button whenever the target sound/syllable/word is heard. */
export interface SoundReactionTask {
  type: "sound-reaction";
  id: string;
  prompt: string;
  itemKind: "sound" | "syllable" | "word";
  items: string[];
  isTarget: (item: string, index: number) => boolean;
  reactionEmoji: string;
  reactionLabel: string;
}

/** Where in the word does the target sound sit? "hands" = raised-hand icon buttons,
 *  "notebook" = notebook-corner icon buttons (start/middle only),
 *  "face" = frowning/laughing face buttons (start/middle only),
 *  "clap" = clap-once/clap-twice/find-words buttons,
 *  "clap-count" = clap-once/twice/three-times buttons (start/middle/end),
 *  "segments" = the word itself is split into three tappable start/middle/end zones. */
export interface PositionDetectTask {
  type: "position-detect";
  id: string;
  prompt: string;
  variant: "hands" | "notebook" | "face" | "clap" | "clap-count" | "segments";
  words: { word: string; correct: SoundPosition }[];
}

/** Drag the letter tile into the blank in each word. `prefix` is fixed text shown
 *  before the blank (for mid-word replacement); omit it to replace the 1st letter. */
export interface LetterSwapTask {
  type: "letter-swap";
  id: string;
  prompt: string;
  letter: string;
  items: { before: string; prefix?: string; rest: string; result: string }[];
}

/** Tap out one sound box per phoneme to build the word's sound scheme. */
export interface PhonemeSchemeTask {
  type: "phoneme-scheme";
  id: string;
  prompt: string;
  words: { word: string; sounds: string[] }[];
}

/** Freehand drawing over guide shapes on two canvases.
 *  "bilateral" = both sides show the flower/plus/letter guide (two-hand coordination drill).
 *  "trace-free" = left side shows only a dotted letter guide, right side starts blank. */
export interface TracingCanvasTask {
  type: "tracing-canvas";
  id: string;
  prompt: string;
  letter: string;
  mode?: "bilateral" | "trace-free";
}

/** Draw a horizontal strike through any one "O" shape to turn it into the target letter.
 *  Any single completed stroke instantly finishes the task. */
export interface StrikeThroughTask {
  type: "strike-through";
  id: string;
  prompt: string;
  letter: string;
  count: number;
}

/** Static picture + spoken instruction, always auto-passes with an immediate continue button. */
export interface InfoSlideTask {
  type: "info-slide";
  id: string;
  prompt: string;
  image?: string;
}

/** Full-size freehand blackboard: no guides, just a big canvas + chalk stroke + Done button. */
export interface BlackboardTask {
  type: "blackboard";
  id: string;
  prompt: string;
  letter: string;
}

/** Rows of syllable sets for listen-and-repeat practice; each row has a "Reverse" toggle
 *  that flips the display/playback order. Always auto-passes. */
export interface SyllablePracticeTask {
  type: "syllable-practice";
  id: string;
  prompt: string;
  sets: string[][];
}

/** Animal picture cards: listen to the word, tap where the target sound sits.
 *  No right/wrong scoring — Next unlocks once every card has a tag picked. */
export interface ImageWordTask {
  type: "image-word";
  id: string;
  prompt: string;
  letter: string;
  items: { image: string; word: string }[];
}

/** Minimal-pair discrimination: drag the correctly-colored triangle (plain "н" vs. the
 *  target letter) into its matching notebook corner for each word. */
export interface SpatialDragTask {
  type: "spatial-drag";
  id: string;
  prompt: string;
  letter: string;
  items: { word: string; correct: "plain" | "target" }[];
}

export type Task =
  | ChipSelectTask
  | PositionChoiceTask
  | LetterFillTask
  | BuildWordTask
  | CountChoiceTask
  | ColorShapesTask
  | PracticeTask
  | SoundReactionTask
  | PositionDetectTask
  | LetterSwapTask
  | PhonemeSchemeTask
  | TracingCanvasTask
  | StrikeThroughTask
  | InfoSlideTask
  | BlackboardTask
  | SyllablePracticeTask
  | ImageWordTask
  | SpatialDragTask;

export interface Section {
  id: string;
  order: number;
  letter: string;
  title: string;
  color: string; // tailwind gradient "from-X to-Y"
  ring: string;
  tasks: Task[];
}
