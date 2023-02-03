import { SchemaDto } from "../lib/SchemaDto";
import { PageGenerator } from "./page.generator";
import { audios, img, videos } from "./media-urls";
import { Theme1 } from "./theme1";
import { DAutoPlaySequence } from "../lib/Delement/DAuto-play";
import { DB } from "./DB";
import { IconUrls } from "../lib/icon-urls";
import { Ok } from "../lib/common/result";
import { _PROPS, _Queries } from "../lib/state/standard-props";

const imgPages = [
    PageGenerator.imagePage(img["1"]),
    PageGenerator.imagePage(img["2"]),
    PageGenerator.imagePage(img["3"]),
    PageGenerator.imagePage(img["4"]),
];

const answerPages = [
    PageGenerator.allElementsPage(),
    PageGenerator.questionPage(),
    PageGenerator.questionPage(),
    PageGenerator.questionPage(),
    PageGenerator.questionPage(),
];

const db = DB.createDB();

const img1 = db.createImage(img["1"]);
const img2 = db.createImage(img["2"]);
const img3 = db.createImage(img["3"]);
const img4 = db.createImage(img["4"]);
const video1 = db.createVideo(videos["1"]);
const video2 = db.createVideo(videos["2"]);
const video3 = db.createVideo(videos["3"]);
const video4 = db.createVideo(videos["4"]);
const audio1 = db.createAudio(audios["1"]);
const audio2 = db.createAudio(audios["2"]);
const audio3 = db.createAudio(audios["3"]);
const audio4 = db.createAudio(audios["4"]);

const autoplaySequence: DAutoPlaySequence = {
    id: "Er det vanskelig for deg å sovne om kvelden?",
    blocking: true,
    items: [],
};

const q0 = db.createQuestion("Intro", [
    { value: 1, theme: "level1" },
    { value: 2, theme: "level2" },
    { value: 3, theme: "level3" },
    { value: 9, theme: "dont-know" },
]);

const q1 = db.createQuestion("Er du trist og lei deg Hvor langt må vi skrive for å rekke over le?", [
    { value: 1, theme: "normal" },
    { value: 0, theme: "normal" },
    { value: 9, theme: "dont-know" },
]);

const q2 = db.createQuestion("Hvor lenge har du egentlig hatt det sånn?", [
    { value: 1, theme: "normal" },
    { value: 0, theme: "normal" },
    { value: 9, theme: "dont-know" },
]);

const page0 = Theme1.createQuestionPage({ question: q0, db, questionTextAudio: audio1 });

const page1 = Theme1.createQuestionPage({
    question: q1,
    db,
    questionTextAudio: audio1,
    videoConfig: { video: video1, autoplay: false },
});

const page2 = Theme1.createQuestionPage({
    question: q2,
    db,
    videoConfig: { video: video1, autoplay: true },
    questionTextAudio: audio1,
});

export const schema1: SchemaDto = {
    id: "schema1",
    prefix: "a",
    backgroundColor: "white",
    baseHeight: 1300,
    baseWidth: 1024,
    pages: [page1, page1, page2],
    rules: [],
    stateVariables: Object.values(_PROPS).map((def) => def.propDefinition),
    stateQueries: Object.values(_Queries),
    pageSequences: [],
};
