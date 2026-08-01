import type { Section, Task, SoundPosition } from "../types";

const norm = (s: string) => s.toLocaleLowerCase("kk");

const isLetter = (letter: string) => (item: string) => norm(item) === norm(letter);
const contains = (letter: string) => (item: string) => norm(item).includes(norm(letter));

let uid = 0;
const id = (prefix: string) => `${prefix}-${uid++}`;

function buildWord(prompt: string, pool: string[], words: { target: string; tiles: string[] }[]): Task {
  return { type: "build-word", id: id("bw"), prompt, pool, words };
}

function colorShapes(
  prompt: string,
  quadrants: {
    key: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "extra";
    colorName: string;
    colorHex: string;
    shape?: "square" | "triangle" | "circle" | "trapezoid" | "letter";
    letterText?: string;
  }[]
): Task {
  return { type: "color-shapes", id: id("col"), prompt, quadrants };
}

function soundReaction(
  prompt: string,
  itemKind: "sound" | "syllable" | "word",
  items: string[],
  target: (item: string) => boolean,
  reactionEmoji: string,
  reactionLabel: string
): Task {
  return {
    type: "sound-reaction",
    id: id("sr"),
    prompt,
    itemKind,
    items,
    isTarget: (item) => target(item),
    reactionEmoji,
    reactionLabel,
  };
}

function positionDetect(
  prompt: string,
  variant: "hands" | "notebook" | "face" | "clap" | "clap-count" | "segments",
  words: { word: string; correct: SoundPosition }[]
): Task {
  return { type: "position-detect", id: id("pd"), prompt, variant, words };
}

function letterSwap(
  prompt: string,
  letter: string,
  items: { before: string; prefix?: string; rest: string; result: string }[]
): Task {
  return { type: "letter-swap", id: id("ls"), prompt, letter, items };
}

function phonemeScheme(prompt: string, words: { word: string; sounds: string[] }[]): Task {
  return { type: "phoneme-scheme", id: id("ph"), prompt, words };
}

function tracingCanvas(prompt: string, letter: string, mode?: "bilateral" | "trace-free"): Task {
  return { type: "tracing-canvas", id: id("tr"), prompt, letter, mode };
}

function strikeThrough(prompt: string, letter: string, count: number): Task {
  return { type: "strike-through", id: id("st"), prompt, letter, count };
}

function infoSlide(prompt: string, image?: string): Task {
  return { type: "info-slide", id: id("is"), prompt, image };
}

function blackboard(prompt: string, letter: string): Task {
  return { type: "blackboard", id: id("bb"), prompt, letter };
}

function syllablePractice(prompt: string, sets: string[][]): Task {
  return { type: "syllable-practice", id: id("sp"), prompt, sets };
}

function imageWord(prompt: string, letter: string, items: { image: string; word: string }[]): Task {
  return { type: "image-word", id: id("iw"), prompt, letter, items };
}

function spatialDrag(prompt: string, letter: string, items: { word: string; correct: "plain" | "target" }[]): Task {
  return { type: "spatial-drag", id: id("sd"), prompt, letter, items };
}

export const sections: Section[] = [
  {
    id: "a",
    order: 1,
    letter: "А",
    title: "1-бөлім. А дыбысы",
    color: "from-rose-400 to-orange-400",
    ring: "ring-rose-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «А» дыбысын естігенде жалауды көтер!",
        "sound",
        ["А", "ы", "е", "а", "о", "ү", "а", "а", "и", "а", "у"],
        isLetter("а"),
        "🚩",
        "Жалауды көтер"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде А дыбысы барын естігенде жалауды көтер!",
        "syllable",
        ["АЛ", "ІЛ", "ҮЛ", "АЛ", "ЫЛ", "ҰЛ", "ЛА", "ЛҰ", "ЛО"],
        contains("а"),
        "🚩",
        "Жалауды көтер"
      ),
      soundReaction(
        "Сөздерді тыңда. Ішінде А дыбысы барын естігенде жалауды көтер!",
        "word",
        ["АРА", "ОЛА", "ҮЛ", "АЛА", "ЫЛ", "ИЛА", "ЛА", "ЛҰ", "ЛАО"],
        contains("а"),
        "🚩",
        "Жалауды көтер"
      ),
      positionDetect("А дыбысы әр сөздің қай жерінде тұрғанын тап.", "hands", [
        { word: "Бас", correct: "middle" },
        { word: "аяқ", correct: "start" },
        { word: "арқа", correct: "start" },
        { word: "қас", correct: "middle" },
        { word: "құлақ", correct: "middle" },
        { word: "қарын", correct: "middle" },
        { word: "шаш", correct: "middle" },
      ]),
    ],
  },
  {
    id: "ae",
    order: 2,
    letter: "Ә",
    title: "2-бөлім. Ә дыбысы",
    color: "from-fuchsia-400 to-pink-400",
    ring: "ring-fuchsia-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. Ә дыбысын естігенде ешкінің дауысын сал!",
        "sound",
        ["А", "ә", "ы", "е", "ә", "а", "о", "ү", "а", "ә", "и", "а", "у", "ә"],
        isLetter("ә"),
        "🐐",
        "Ешкінің дауысын сал"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Ә дыбысы барын естігенде әтештің дауысын сал!",
        "syllable",
        ["ӘН", "АҢ", "ҮЛ", "ІЛ", "ӘЛ", "ҰЛ", "ЛӘ", "ЛҰ", "ЛӨ"],
        contains("ә"),
        "🐓",
        "Әтештің дауысын сал"
      ),
      positionDetect("Ә дыбысы сөздің қай жерінде тұр? Сөзді бас та, жеріне тап.", "segments", [
        { word: "Әже", correct: "start" },
        { word: "сәукеле", correct: "start" },
        { word: "күнә", correct: "end" },
        { word: "сәбіз", correct: "start" },
      ]),
      letterSwap("Ә әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "Ә", [
        { before: "Ін", rest: "н", result: "Ән" },
        { before: "Өр", rest: "р", result: "Әр" },
        { before: "Ене", rest: "не", result: "Әне" },
        { before: "Атыр", rest: "тір", result: "Әтір" },
        { before: "Ай", rest: "й", result: "Әй" },
      ]),
      phonemeScheme("Сөздегі дыбыстарды санап, ұяшықтарды толтыр.", [
        { word: "әке", sounds: ["ә", "к", "е"] },
        { word: "әпке", sounds: ["ә", "п", "к", "е"] },
        { word: "әже", sounds: ["ә", "ж", "е"] },
        { word: "әтеш", sounds: ["ә", "т", "е", "ш"] },
        { word: "сәукеле", sounds: ["с", "ә", "у", "к", "е", "л", "е"] },
      ]),
      tracingCanvas("Гүлді бір рет сыз, «+» белгілерін дөңгелекте, «Ә» әрпін екі рет сыз.", "Ә"),
    ],
  },
  {
    id: "o2",
    order: 3,
    letter: "Ө",
    title: "3-бөлім. Ө дыбысы",
    color: "from-amber-400 to-yellow-400",
    ring: "ring-amber-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «Ө» дыбысын естігенде ұзын қарандашты көрсет!",
        "sound",
        ["Ұ", "Ө", "Ы", "О", "Ө", "І", "Ү", "Ө", "О", "Ұ", "Ө", "Ы", "О", "Ө"],
        isLetter("ө"),
        "✏️",
        "Ұзын қарандашты көрсет"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Ө дыбысы барын естігенде қысқа қарандашты көрсет!",
        "syllable",
        ["Ұр", "Өр", "Ор", "Ыр", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Өр", "Ыр", "Ор", "Өр"],
        contains("ө"),
        "🖊️",
        "Қысқа қарандашты көрсет"
      ),
      letterSwap("Ө әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "Ө", [
        { before: "от", rest: "т", result: "өт" },
        { before: "ермек", rest: "рмек", result: "өрмек" },
        { before: "әмір", rest: "мір", result: "өмір" },
        { before: "ор", rest: "р", result: "өр" },
        { before: "әсер", rest: "сер", result: "өсер" },
        { before: "енеге", rest: "неге", result: "өнеге" },
      ]),
      letterSwap("Ө әрпін сөздің ортасына сүйреп апарып, жаңа сөз жаса.", "Ө", [
        { before: "керме", prefix: "к", rest: "рме", result: "көрме" },
        { before: "кәмір", prefix: "к", rest: "мір", result: "көмір" },
        { before: "кірме", prefix: "к", rest: "рме", result: "көрме" },
        { before: "тор", prefix: "т", rest: "р", result: "төр" },
        { before: "шап", prefix: "ш", rest: "п", result: "шөп" },
        { before: "тал", prefix: "т", rest: "л", result: "төл" },
      ]),
      strikeThrough("«О» дөңгелектерінің бірін сызып, «Ө» әрпіне айналдыр.", "Ө", 6),
      infoSlide("Ө әріпіндегі дөңгелектер қайда, қалай тұрғанын айт."),
    ],
  },
  {
    id: "u2",
    order: 4,
    letter: "Ү",
    title: "4-бөлім. Ү дыбысы",
    color: "from-sky-400 to-cyan-400",
    ring: "ring-sky-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «Ү» дыбысын естігенде дәптердің оң жақ төменгі бұрышын көрсет!",
        "sound",
        ["Ұ", "Ө", "Ү", "Ы", "О", "Ө", "І", "Ү", "Ө", "Ү", "О", "Ұ", "Ө", "Ү", "Ы", "О", "Ө"],
        isLetter("ү"),
        "📓",
        "Дәптердің оң жақ төменгі бұрышы"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Ү дыбысы барын естігенде дәптердің оң жақ төменгі бұрышын көрсет!",
        "syllable",
        ["Ұр", "Өр", "Үр", "Ор", "Ыр", "Үр", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Үр", "Өр", "Ыр", "Ор", "Үр", "Өр"],
        contains("ү"),
        "📓",
        "Дәптердің оң жақ төменгі бұрышы"
      ),
      positionDetect("Ү дыбысы сөздің қай жерінде тұрғанын тап.", "notebook", [
        { word: "Үкі", correct: "start" },
        { word: "бүркіт", correct: "middle" },
        { word: "үйрек", correct: "start" },
        { word: "сүлгі", correct: "middle" },
        { word: "үміт", correct: "start" },
        { word: "сүргі", correct: "middle" },
        { word: "күрке", correct: "middle" },
        { word: "үйшік", correct: "start" },
      ]),
      letterSwap("Ү әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "Ү", [
        { before: "ермек", rest: "рмек", result: "үрмек" },
        { before: "ұн", rest: "н", result: "үн" },
        { before: "әзер", rest: "зер", result: "үзер" },
        { before: "іш", rest: "ш", result: "үш" },
      ]),
      letterSwap("Ү әрпін сөздің ортасына сүйреп апарып, жаңа сөз жаса.", "Ү", [
        { before: "керме", prefix: "к", rest: "рме", result: "күрме" },
        { before: "жыр", prefix: "ж", rest: "р", result: "жүр" },
        { before: "кірме", prefix: "к", rest: "рме", result: "күрме" },
        { before: "тер", prefix: "т", rest: "р", result: "түр" },
        { before: "жан", prefix: "ж", rest: "н", result: "жүн" },
        { before: "тал", prefix: "т", rest: "л", result: "түл" },
      ]),
      tracingCanvas("Сол жақта нүктелі үлгі бойынша, оң жақта еркін «Ү» әрпін сыз.", "Ү", "trace-free"),
      blackboard("Оқушы тақтаға «Ү» әріпін сызуы керек.", "Ү"),
    ],
  },
  {
    id: "i2",
    order: 5,
    letter: "І",
    title: "5-бөлім. І дыбысы",
    color: "from-lime-400 to-green-400",
    ring: "ring-lime-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «І» дыбысын естігенде жымиған смайликті бас!",
        "sound",
        ["І", "Ө", "Ү", "І", "Ө", "І", "Ы", "Ү", "Ө", "Ү", "І", "О", "Ұ", "Ө", "І"],
        isLetter("і"),
        "🙂",
        "Жымиған смайликті бас"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде І дыбысы барын естігенде жымиған смайликті бас!",
        "syllable",
        ["Ұр", "Ір", "Үр", "Ор", "Ыр", "Ір", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Ір"],
        contains("і"),
        "🙂",
        "Жымиған смайликті бас"
      ),
      positionDetect("Сөзді тыңда. І дыбысы басында болса — қабағын түйген, ортасында болса — күлген смайликті бас.", "face", [
        { word: "Ілгіш", correct: "start" },
        { word: "киім", correct: "middle" },
        { word: "сүлгі", correct: "middle" },
        { word: "ішік", correct: "start" },
        { word: "мәсі", correct: "middle" },
      ]),
      syllablePractice("Буындарды тыңда, қайталап айт. Керек болса, ретін керісінше бұрып та тыңда:", [
        ["іс", "ыс", "іс"],
        ["іре", "ірө", "ірі"],
        ["екі", "екы", "екү"],
        ["ін", "ән", "ін"],
        ["ірө", "ірү", "ірө"],
        ["ікі", "ікө", "ікү"],
        ["іл", "өл", "іл"],
        ["ілә", "ілө", "ілу"],
        ["ісу", "ісә", "ісө"],
      ]),
      letterSwap("І әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "І", [
        { before: "өш", rest: "ш", result: "іш" },
        { before: "ұн", rest: "н", result: "ін" },
        { before: "ел", rest: "л", result: "іл" },
        { before: "өс", rest: "с", result: "іс" },
      ]),
      tracingCanvas("Алдымен «Ү» әрпінің үстінен екі қолыңмен бір мезгілде сыз.", "Ү"),
      tracingCanvas("Енді «І» әрпінің үстінен екі қолыңмен бір мезгілде сыз.", "І"),
    ],
  },
  {
    id: "q",
    order: 6,
    letter: "Қ",
    title: "6-бөлім. Қ дыбысы",
    color: "from-teal-400 to-emerald-400",
    ring: "ring-teal-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «Қ» дыбысын естігенде алақаныңды бір рет соқ!",
        "sound",
        ["Ғ", "Қ", "Х", "Һ", "Қ", "Ғ", "Х", "Қ"],
        isLetter("қ"),
        "👏",
        "Алақаныңды 1 рет соқ"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Қ дыбысы барын естігенде алақаныңды екі рет соқ!",
        "syllable",
        ["АХ", "АҚ", "АҒ", "АҺ", "АҚ", "АХ", "АҺ", "АҚ"],
        contains("қ"),
        "👏🏻👏🏻",
        "2 рет соқ"
      ),
      positionDetect(
        "Қ дыбысы сөздің қай жерінде тұрғанын тап: басында — 1 рет соқ, ортасында — 2 рет соқ, соңында — тап.",
        "clap",
        [
          { word: "Қоян", correct: "start" },
          { word: "арқар", correct: "middle" },
          { word: "мысық", correct: "end" },
          { word: "қарға", correct: "start" },
          { word: "тауық", correct: "end" },
          { word: "қой", correct: "start" },
          { word: "қошқар", correct: "middle" },
        ]
      ),
      syllablePractice("Буындарды тыңда, қайталап айт. Керек болса, ретін керісінше бұрып та тыңда:", [
        ["ақ", "ах", "ақ"],
        ["аха", "ақа", "аһа"],
        ["ақа", "аһа", "ақа"],
        ["ұқ", "ух", "оқ"],
        ["ақа", "аға", "ақа"],
      ]),
      letterSwap("Қ әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "Қ", [
        { before: "тас", rest: "ас", result: "қас" },
        { before: "той", rest: "ой", result: "қой" },
        { before: "таз", rest: "аз", result: "қаз" },
        { before: "шаш", rest: "аш", result: "қаш" },
      ]),
      imageWord("Суреттегі аңды ата, «Қ» дыбысы қай жерде тұрғанын тап, сөйлем құра.", "Қ", [
        { image: "/wolf.jpg", word: "Қасқыр" },
        { image: "/rabbit.jpg", word: "Қоян" },
        { image: "/lamb.jpg", word: "Қозы" },
      ]),
      buildWord(
        "Буындардан сөз құра.",
        ["қа", "қа", "қа", "ла", "лам", "қар", "ға", "мақ"],
        [
          { target: "қала", tiles: ["қа", "ла"] },
          { target: "қалам", tiles: ["қа", "лам"] },
          { target: "қарға", tiles: ["қар", "ға"] },
          { target: "қамақ", tiles: ["қа", "мақ"] },
        ]
      ),
      tracingCanvas("«Қ» әрпінің үстінен екі қолыңмен бір мезгілде сыз.", "Қ"),
    ],
  },
  {
    id: "gh",
    order: 7,
    letter: "Ғ",
    title: "7-бөлім. Ғ дыбысы",
    color: "from-violet-400 to-indigo-400",
    ring: "ring-violet-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «Ғ» дыбысын естігенде үстелді 1 рет ұр!",
        "sound",
        ["Г", "Ғ", "Қ", "Х", "Ғ", "Һ", "Қ", "Ғ", "Х"],
        isLetter("ғ"),
        "✊",
        "Үстелді 1 рет ұр"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Ғ дыбысы барын естігенде үстелді 2 рет ұр!",
        "syllable",
        ["ҚА", "ҒА", "ҺА", "ҚА", "ҒА", "ХА", "ҒА", "ҚА"],
        contains("ғ"),
        "✊✊",
        "Үстелді 2 рет ұр"
      ),
      syllablePractice("Тіркесті тыңда, қайталап айт:", [["АҒА", "АҚА", "АҒА", "АХА", "АҺА", "АҒА", "АҚА"]]),
      soundReaction(
        "Сөздерді тыңда. Ішінде Ғ дыбысы барын естігенде «Ғ» батырмасын бас!",
        "word",
        ["аға", "хат", "таға", "қара", "ғалам", "қарыс", "ғарыш"],
        contains("ғ"),
        "Ғ",
        "Ғ әріпін бас"
      ),
      letterSwap("Ғ әрпін бос орынға сүйреп апарып, жаңа сөз жаса.", "Ғ", [
        { before: "қашық", rest: "ашық", result: "ғашық" },
        { before: "қалам", rest: "алам", result: "ғалам" },
        { before: "қарыш", rest: "арыш", result: "ғарыш" },
      ]),
      buildWord(
        "Әріптерден сөз құра.",
        ["ғ", "ғ", "а", "а", "а", "а", "т"],
        [
          { target: "аға", tiles: ["а", "ғ", "а"] },
          { target: "таға", tiles: ["т", "а", "ғ", "а"] },
        ]
      ),
      colorShapes(
        "Суреттегі фигураларды түсіне қарай бояп шық.",
        [
          { key: "top-left", colorName: "жасыл", colorHex: "#22c55e", shape: "square" },
          { key: "top-right", colorName: "қызыл", colorHex: "#ef4444", shape: "triangle" },
          { key: "bottom-left", colorName: "сары", colorHex: "#eab308", shape: "circle" },
          { key: "bottom-right", colorName: "көк", colorHex: "#3b82f6", shape: "trapezoid" },
          { key: "extra", colorName: "күлгін", colorHex: "#a855f7", shape: "letter", letterText: "Қ" },
        ]
      ),
    ],
  },
  {
    id: "ng",
    order: 8,
    letter: "Ң",
    title: "8-бөлім. Ң дыбысы",
    color: "from-orange-400 to-red-400",
    ring: "ring-orange-200",
    tasks: [
      soundReaction(
        "Дыбыстарды тыңда. «Ң» дыбысын естігенде бір рет шапалақта!",
        "sound",
        ["М", "Н", "Ң", "Л", "М", "Ң", "Л", "Н"],
        isLetter("ң"),
        "👏",
        "1 рет шапалақта"
      ),
      soundReaction(
        "Буындарды тыңда. Ішінде Ң дыбысы барын естігенде екі рет шапалақта!",
        "syllable",
        ["АЛ", "АН", "АҢ", "МА", "АЛ", "АН", "АҢ"],
        contains("ң"),
        "👏🏻👏🏻",
        "2 рет шапалақта"
      ),
      positionDetect(
        "Ң дыбысы сөздің қай жерінде тұрғанын тап: басында — 1 рет, ортасында — 2 рет, соңында — 3 рет шапалақта.",
        "clap-count",
        [
          { word: "Аң", correct: "end" },
          { word: "шаңғы", correct: "middle" },
          { word: "қараңғы", correct: "middle" },
          { word: "сараң", correct: "end" },
          { word: "қоңыз", correct: "middle" },
        ]
      ),
      letterSwap("Ң әрпін сөздің ортасына сүйреп апарып, жаңа сөз жаса.", "Ң", [
        { before: "көміл", prefix: "кө", rest: "іл", result: "көңіл" },
        { before: "жамыл", prefix: "жа", rest: "ыл", result: "жаңыл" },
      ]),
      spatialDrag("Сөзді тыңда: «н» дыбысы болса 🔵 көк үшбұрышты, «ң» дыбысы болса 🟡 сары үшбұрышты тиісті бұрышқа сүйреп апар.", "ң", [
        { word: "көн", correct: "plain" },
        { word: "көң", correct: "target" },
        { word: "сең", correct: "target" },
        { word: "сен", correct: "plain" },
        { word: "тен", correct: "plain" },
        { word: "тең", correct: "target" },
        { word: "кен", correct: "plain" },
        { word: "кең", correct: "target" },
        { word: "шын", correct: "plain" },
        { word: "шың", correct: "target" },
        { word: "шарын", correct: "plain" },
        { word: "шарың", correct: "target" },
        { word: "қарын", correct: "plain" },
        { word: "қарың", correct: "target" },
      ]),
      tracingCanvas("«Ң» әрпінің үстінен оң қолыңмен сыз.", "Ң"),
    ],
  },
];

export const totalTasks = sections.reduce((sum, s) => sum + s.tasks.length, 0);
