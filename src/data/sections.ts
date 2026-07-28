import type { Section, Task, Position } from "../types";

const norm = (s: string) => s.toLocaleLowerCase("kk");

const isLetter = (letter: string) => (item: string) => norm(item) === norm(letter);
const contains = (letter: string) => (item: string) => norm(item).includes(norm(letter));

let uid = 0;
const id = (prefix: string) => `${prefix}-${uid++}`;

function chipSelect(
  prompt: string,
  actionEmoji: string,
  actionLabel: string,
  items: string[],
  target: (item: string) => boolean
): Task {
  return {
    type: "chip-select",
    id: id("cs"),
    prompt,
    actionEmoji,
    actionLabel,
    items,
    isTarget: (item) => target(item),
  };
}

function positionChoice(prompt: string, words: { word: string; correct: Position }[]): Task {
  return { type: "position-choice", id: id("pc"), prompt, words };
}

function letterFill(prompt: string, items: { stem: string; options: string[]; correct: string; result: string }[]): Task {
  return { type: "letter-fill", id: id("lf"), prompt, items };
}

function buildWord(prompt: string, pool: string[], words: { target: string; tiles: string[] }[]): Task {
  return { type: "build-word", id: id("bw"), prompt, pool, words };
}

function countChoice(prompt: string, items: { word: string; correct: number; options: number[] }[]): Task {
  return { type: "count-choice", id: id("cc"), prompt, items };
}

function colorShapes(
  prompt: string,
  quadrants: { key: "top-left" | "top-right" | "bottom-left" | "bottom-right"; colorName: string; colorHex: string }[]
): Task {
  return { type: "color-shapes", id: id("col"), prompt, quadrants };
}

function practice(prompt: string, items: string[], actionLabel: string): Task {
  return { type: "practice", id: id("pr"), prompt, items, actionLabel } as Task;
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
      chipSelect(
        "А дыбысын тап та, жалауды көтер!",
        "🚩",
        "Жалауды көтер",
        ["А", "ы", "е", "а", "о", "ү", "а", "а", "и", "а", "у"],
        isLetter("а")
      ),
      chipSelect(
        "Буындардың ішінен А дыбысы бар буынды тап.",
        "🚩",
        "Жалауды көтер",
        ["АЛ", "ІЛ", "ҮЛ", "АЛ", "ЫЛ", "ҰЛ", "ЛА", "ЛҰ", "ЛО"],
        contains("а")
      ),
      chipSelect(
        "Тағы да А дыбысы бар буындарды тап.",
        "🚩",
        "Жалауды көтер",
        ["АРА", "ОЛА", "ҮЛ", "АЛА", "ЫЛ", "ИЛА", "ЛА", "ЛҰ", "ЛАО"],
        contains("а")
      ),
      positionChoice("А дыбысы әр сөздің қай жерінде тұрғанын тап.", [
        { word: "Бас", correct: "ортасында" },
        { word: "аяқ", correct: "басында" },
        { word: "арқа", correct: "басында және соңында" },
        { word: "қас", correct: "ортасында" },
        { word: "құлақ", correct: "ортасында" },
        { word: "қарын", correct: "ортасында" },
        { word: "шаш", correct: "ортасында" },
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
      chipSelect(
        "Ә дыбысын естігендей ойлан да, ешкінің дауысын сал!",
        "🐐",
        "Ешкінің дауысын сал",
        ["А", "ә", "ы", "е", "ә", "а", "о", "ү", "а", "ә", "и", "а", "у", "ә"],
        isLetter("ә")
      ),
      chipSelect(
        "Ә дыбысы бар буынды тауып, әтештің дауысын сал!",
        "🐓",
        "Әтештің дауысын сал",
        ["ӘН", "АҢ", "ҮЛ", "ІЛ", "ӘЛ", "ҰЛ", "ЛӘ", "ЛҰ", "ЛӨ"],
        contains("ә")
      ),
      positionChoice("Ә дыбысы сөздің қай жерінде тұр?", [
        { word: "Әже", correct: "басында" },
        { word: "сәукеле", correct: "ортасында" },
        { word: "күнә", correct: "соңында" },
        { word: "сәбіз", correct: "ортасында" },
      ]),
      letterFill("Сөздің бірінші әрпін Ә-ға алмастырып, жаңа сөз жаса.", [
        { stem: "…н", options: ["ә", "о", "ы"], correct: "ә", result: "ән" },
        { stem: "…р", options: ["е", "ә", "ұ"], correct: "ә", result: "әр" },
        { stem: "…не", options: ["і", "ә", "ү"], correct: "ә", result: "әне" },
      ]),
      countChoice("Сөзде неше дыбыс бар? Санап көр.", [
        { word: "әке", correct: 3, options: [2, 3, 4] },
        { word: "әпке", correct: 4, options: [3, 4, 5] },
        { word: "әтеш", correct: 4, options: [3, 4, 5] },
        { word: "сәукеле", correct: 7, options: [5, 6, 7] },
      ]),
      practice(
        "Алдымен гүлді бір рет, «ә» әрпін екі рет — оң қолыңмен бас. Сосын сол қолыңмен қайтала.",
        ["🌸 — 1 рет", "ә — 2 рет", "🌸 — 1 рет (сол қол)", "ә — 2 рет (сол қол)"],
        "Дайын!"
      ),
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
      chipSelect(
        "Ө дыбысын тауып, ұзын қарындашты көрсет!",
        "✏️",
        "Ұзын қарындашты көрсет",
        ["Ұ", "Ө", "Ы", "О", "Ө", "І", "Ү", "Ө", "О", "Ұ", "Ө", "Ы", "О", "Ө"],
        isLetter("ө")
      ),
      chipSelect(
        "Буынның ішінен Ө дыбысын тауып, қысқа қарандашты көрсет!",
        "🖊️",
        "Қысқа қарандашты көрсет",
        ["Ұр", "Өр", "Ор", "Ыр", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Өр", "Ыр", "Ор", "Өр"],
        contains("ө")
      ),
      letterFill("Сөздің бірінші дыбысын Ө-ге алмастыр.", [
        { stem: "от — …т", options: ["ө", "ә", "ы"], correct: "ө", result: "өт" },
        { stem: "ор — …р", options: ["ұ", "ө", "е"], correct: "ө", result: "өр" },
        { stem: "ермек — …рмек", options: ["і", "ө", "ұ"], correct: "ө", result: "өрмек" },
        { stem: "әсер — …сер", options: ["ө", "ү", "а"], correct: "ө", result: "өсер" },
        { stem: "енеге — …неге", options: ["е", "ө", "і"], correct: "ө", result: "өнеге" },
      ]),
      letterFill("Сөздің екінші дыбысын Ө-ге алмастыр.", [
        { stem: "керме — к…рме", options: ["ө", "е", "ұ"], correct: "ө", result: "көрме" },
        { stem: "кәмір — к…мір", options: ["ә", "ө", "ү"], correct: "ө", result: "көмір" },
        { stem: "тор — т…р", options: ["о", "ө", "ы"], correct: "ө", result: "төр" },
        { stem: "шап — ш…п", options: ["а", "ө", "і"], correct: "ө", result: "шөп" },
        { stem: "тал — т…л", options: ["ө", "а", "ы"], correct: "ө", result: "төл" },
      ]),
      practice(
        "Ұяшықтағы дөңгелектердің белін сол қолыңмен сыз. Олар Ө әрпіне қалай ұқсайды — ойлан.",
        ["⚪➖ дөңгелек 1", "⚪➖ дөңгелек 2", "⚪➖ дөңгелек 3"],
        "Байқадым!"
      ),
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
      chipSelect(
        "Ү дыбысын тауып, дәптердің оң жақ төменгі бұрышын көрсет!",
        "📓",
        "Дәптердің бұрышын көрсет",
        ["Ұ", "Ө", "Ү", "Ы", "О", "Ө", "І", "Ү", "Ө", "Ү", "О", "Ұ", "Ө", "Ү", "Ы", "О", "Ө"],
        isLetter("ү")
      ),
      chipSelect(
        "Буынның ішінен Ү дыбысы барын тап.",
        "📓",
        "Дәптердің бұрышын көрсет",
        ["Ұр", "Өр", "Үр", "Ор", "Ыр", "Үр", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Үр", "Өр", "Ыр", "Ор", "Үр", "Өр"],
        contains("ү")
      ),
      positionChoice("Ү дыбысы сөздің басында ма, ортасында ма?", [
        { word: "Үкі", correct: "басында" },
        { word: "бүркіт", correct: "ортасында" },
        { word: "үйрек", correct: "басында" },
        { word: "сүлгі", correct: "ортасында" },
        { word: "үміт", correct: "басында" },
        { word: "сүргі", correct: "ортасында" },
        { word: "күрке", correct: "ортасында" },
        { word: "үйшік", correct: "басында" },
      ]),
      letterFill("Сөздің дыбысын Ү-ге алмастырып, жаңа сөз тап.", [
        { stem: "ұн — …н", options: ["ү", "і", "о"], correct: "ү", result: "үн" },
        { stem: "іш — …ш", options: ["е", "ү", "ы"], correct: "ү", result: "үш" },
        { stem: "жыр — ж…р", options: ["ү", "ұ", "і"], correct: "ү", result: "жүр" },
        { stem: "тер — т…р", options: ["і", "ү", "ы"], correct: "ү", result: "түр" },
        { stem: "жан — ж…н", options: ["ү", "а", "о"], correct: "ү", result: "жүн" },
      ]),
      practice(
        "Ү әрпінің үзік сызықтарын сол қолыңмен үстінен бастыр. Сосын суретін оң қолыңмен ұяшыққа сал.",
        ["Ү – – – –", "🖼️ сурет салу"],
        "Дайын!"
      ),
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
      chipSelect(
        "І дыбысын тауып, жымиған смайликті бас!",
        "😊",
        "Жымиған смайликті бас",
        ["І", "Ө", "Ү", "І", "Ө", "І", "Ы", "Ү", "Ө", "Ү", "І", "О", "Ұ", "Ө", "І"],
        isLetter("і")
      ),
      chipSelect(
        "Буынның ішінен І дыбысы барын тап.",
        "😊",
        "Жымиған смайликті бас",
        ["Ұр", "Ір", "Үр", "Ор", "Ыр", "Ір", "Өр", "Ір", "Ор", "Үр", "Өр", "Ұр", "Ір"],
        contains("і")
      ),
      positionChoice("І дыбысы сөздің қай жерінде тұр?", [
        { word: "Ілгіш", correct: "басында" },
        { word: "киім", correct: "ортасында" },
        { word: "сүлгі", correct: "соңында" },
        { word: "ішік", correct: "басында" },
        { word: "мәсі", correct: "соңында" },
      ]),
      letterFill("Сөздің бірінші дыбысын І-ге алмастыр.", [
        { stem: "өш — …ш", options: ["і", "е", "ы"], correct: "і", result: "іш" },
        { stem: "ұн — …н", options: ["е", "і", "ө"], correct: "і", result: "ін" },
        { stem: "ел — …л", options: ["і", "ы", "ө"], correct: "і", result: "іл" },
        { stem: "өс — …с", options: ["ы", "ө", "і"], correct: "і", result: "іс" },
      ]),
      practice(
        "Буындарды оқы, содан кейін керісінше айтып көр:",
        ["ис — ыс — іс", "ін —ән — ін", "іл — өл — іл", "іре — ірө — ірі", "екі — екы — екү"],
        "Оқып шықтым!"
      ),
      practice(
        "Бірінші Ү әрпінің үстінен, содан соң І әрпінің үстінен екі қолыңмен бір мезгілде бастыр.",
        ["Ү – – – –", "І – – – –"],
        "Дайын!"
      ),
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
      chipSelect(
        "Қ дыбысын тауып, алақаныңды бір рет соқ!",
        "👏",
        "Алақаныңды соқ",
        ["Ғ", "Қ", "Х", "Һ", "Қ", "Ғ", "Х", "Қ"],
        isLetter("қ")
      ),
      chipSelect(
        "Буынның ішінен Қ дыбысы барын тап.",
        "👏",
        "Алақаныңды соқ",
        ["АХ", "АҚ", "АҒ", "АҺ", "АҚ", "АХ", "АҺ", "АҚ"],
        contains("қ")
      ),
      positionChoice("Қ дыбысы сөздің қай жерінде тұр?", [
        { word: "Қоян", correct: "басында" },
        { word: "арқар", correct: "ортасында" },
        { word: "мысық", correct: "соңында" },
        { word: "қарға", correct: "басында" },
        { word: "тауық", correct: "соңында" },
        { word: "қой", correct: "басында" },
        { word: "қошқар", correct: "басында және ортасында" },
      ]),
      practice(
        "Буындарды оқы, содан кейін керісінше айтып көр:",
        ["ақ — ах — ақ", "аха — ақа — аһа", "ақа — аһа — ақа", "ұқ — ух — оқ"],
        "Оқып шықтым!"
      ),
      letterFill("Сөздің бірінші дыбысын Қ-ға алмастыр.", [
        { stem: "тас — …ас", options: ["қ", "к", "х"], correct: "қ", result: "қас" },
        { stem: "той — …ой", options: ["ғ", "қ", "к"], correct: "қ", result: "қой" },
        { stem: "таз — …аз", options: ["к", "х", "қ"], correct: "қ", result: "қаз" },
        { stem: "шаш — …аш", options: ["қ", "ш", "ғ"], correct: "қ", result: "қаш" },
      ]),
      buildWord(
        "Буындардан сөз құра.",
        ["қа", "ла", "лам", "қар", "ға", "мақ"],
        [
          { target: "қалам", tiles: ["қа", "лам"] },
          { target: "қарға", tiles: ["қар", "ға"] },
        ]
      ),
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
      chipSelect(
        "Ғ дыбысын тауып, үстелді бір рет ұр!",
        "🥁",
        "Үстелді ұр",
        ["Г", "Ғ", "Қ", "Х", "Ғ", "Һ", "Қ", "Ғ", "Х"],
        isLetter("ғ")
      ),
      chipSelect(
        "Буынның ішінен Ғ дыбысы барын тап.",
        "🥁",
        "Үстелді ұр",
        ["ҚА", "ҒА", "ҺА", "ҚА", "ҒА", "ХА", "ҒА", "ҚА"],
        contains("ғ")
      ),
      chipSelect(
        "Сөз тіркестерінің ішінен Ғ дыбысы барын тап.",
        "🥁",
        "Үстелді ұр",
        ["АҒА", "АҚА", "АҒА", "АХА", "АҺА", "АҒА", "АҚА"],
        contains("ғ")
      ),
      chipSelect(
        "Сөздердің ішінен Ғ дыбысы барын тап.",
        "🥁",
        "Үстелді ұр",
        ["аға", "хат", "таға", "қара", "ғалам", "қарыс", "ғарыш"],
        contains("ғ")
      ),
      letterFill("Сөздің бірінші дыбысын Ғ-ға алмастыр.", [
        { stem: "қашық — …ашық", options: ["ғ", "қ", "х"], correct: "ғ", result: "ғашық" },
        { stem: "қалам — …алам", options: ["қ", "ғ", "к"], correct: "ғ", result: "ғалам" },
        { stem: "қарыш — …арыш", options: ["х", "ғ", "қ"], correct: "ғ", result: "ғарыш" },
      ]),
      buildWord(
        "Әріптерден сөз құра.",
        ["ғ", "а", "а", "т", "ғ", "а", "а"],
        [
          { target: "аға", tiles: ["а", "ғ", "а"] },
          { target: "таға", tiles: ["т", "а", "ғ", "а"] },
        ]
      ),
      colorShapes(
        "Суреттегі фигураларды түсіне қарай бояп шық.",
        [
          { key: "top-left", colorName: "жасыл", colorHex: "#22c55e" },
          { key: "top-right", colorName: "қызыл", colorHex: "#ef4444" },
          { key: "bottom-left", colorName: "сары", colorHex: "#eab308" },
          { key: "bottom-right", colorName: "көк", colorHex: "#3b82f6" },
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
      chipSelect(
        "Ң дыбысын тауып, бір рет шапалақта!",
        "👏",
        "Шапалақта",
        ["М", "Н", "Ң", "Л", "М", "Ң", "Л", "Н"],
        isLetter("ң")
      ),
      chipSelect(
        "Буынның ішінен Ң дыбысы барын тап.",
        "👏",
        "Шапалақта",
        ["АЛ", "АН", "АҢ", "МА", "АЛ", "АН", "АҢ"],
        contains("ң")
      ),
      positionChoice("Ң дыбысы сөздің қай жерінде тұр?", [
        { word: "Аң", correct: "соңында" },
        { word: "шаңғы", correct: "ортасында" },
        { word: "қараңғы", correct: "ортасында" },
        { word: "сараң", correct: "соңында" },
        { word: "қоңыз", correct: "ортасында" },
      ]),
      letterFill("Сөздің ортаңғы дыбысын Ң-ге алмастыр.", [
        { stem: "көміл — кө…іл", options: ["ң", "м", "н"], correct: "ң", result: "көңіл" },
        { stem: "жамыл — жа…ыл", options: ["м", "ң", "л"], correct: "ң", result: "жаңыл" },
      ]),
      chipSelect(
        "Ң дыбысы бар сөзді тап та, сары үшбұрышты көрсет.",
        "🔺",
        "Сары үшбұрышты көрсет",
        ["көн", "көң", "сең", "сен", "тен", "тең", "кен", "кең", "шын", "шың", "шарын", "шарың", "қарын", "қарың"],
        contains("ң")
      ),
      practice(
        "Н әрпін оң қолыңмен, содан кейін Ң әрпін де оң қолыңмен бастыр.",
        ["Н – – – –", "Ң – – – –"],
        "Дайын!"
      ),
    ],
  },
];

export const totalTasks = sections.reduce((sum, s) => sum + s.tasks.length, 0);
