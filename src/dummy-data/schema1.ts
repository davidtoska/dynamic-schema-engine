import { SchemaDto } from "../lib/SchemaDto";
import { audios, img, videos } from "./media-urls";
import { Theme1 } from "./theme1";
import { DB } from "./DB";
import { DStateProps } from "./standard-props";

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

const q0 = db.createQuestion("Er det vanskelig for det å sovne om kvelden?", [
    { value: 1, theme: "level1" },
    { value: 2, theme: "level2" },
    { value: 3, theme: "level4" },
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

const page0 = Theme1.createQuestionPage({ question: q0, db, questionTextAudio: { audio: audio1, autoplay: false } });

const page1 = Theme1.createQuestionPage({
    question: q1,
    db,
    questionTextAudio: { audio: audio1, autoplay: false },
    videoConfig: { video: video1, autoplay: false },
});

const autoPlayAudioPage = Theme1.createQuestionPage({
    question: q2,
    db,
    questionTextAudio: { audio: audio1, autoplay: true },
    videoConfig: { video: video1, autoplay: false },
});

const autoPlayVideo = Theme1.createQuestionPage({
    question: q2,
    db,
    questionTextAudio: { audio: audio1, autoplay: false },
    videoConfig: { video: video1, autoplay: true },
});

const autoplayVideoAndAudio = Theme1.createQuestionPage({
    question: q2,
    db,
    videoConfig: { video: video1, autoplay: true },
    questionTextAudio: { audio: audio1, autoplay: true },
});

export const schema1: SchemaDto = {
    id: "schema1",
    prefix: "a",
    backgroundColor: "white",
    baseHeight: 1300,
    baseWidth: 1024,
    pages: [page0, autoPlayAudioPage, autoPlayVideo, autoplayVideoAndAudio],
    rules: [],
    stateProps: DStateProps.allDefaultProperties.map((def) => def.propDefinition),
    stateQueries: DStateProps.allDefaultQueries,
    stateFromEvent: [
        {
            onEvent: "VIDEO_ENDED_EVENT",
            thenExecute: [
                DStateProps.userPausedVideo.setFalseCommand,
                DStateProps.mediaBlockedByVideo.setFalseCommand,
                DStateProps.videoIsPlaying.setFalseCommand,
            ],
        },
        {
            onEvent: "VIDEO_PAUSED_EVENT",
            thenExecute: [DStateProps.videoIsPlaying.setFalseCommand, DStateProps.mediaBlockedByVideo.setFalseCommand],
        },
        {
            onEvent: "VIDEO_PLAY_EVENT",
            thenExecute: [DStateProps.videoIsPlaying.setTrueCommand, DStateProps.userPausedVideo.setFalseCommand],
        },
        {
            onEvent: "AUDIO_PLAY_EVENT",
            thenExecute: [DStateProps.audioIsPlaying.setTrueCommand, DStateProps.mediaBlockedByAudio.setTrueCommand],
        },
        {
            onEvent: "AUDIO_ENDED_EVENT",
            thenExecute: [DStateProps.audioIsPlaying.setFalseCommand, DStateProps.mediaBlockedByAudio.setFalseCommand],
        },
        {
            onEvent: "AUDIO_PAUSED_EVENT",
            thenExecute: [DStateProps.audioIsPlaying.setFalseCommand, DStateProps.mediaBlockedByAudio.setFalseCommand],
        },
    ],
    pageSequences: [],
};
