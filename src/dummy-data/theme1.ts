import { DAudioDto, DDivDto, DElementDto, DTextDto, DVideoDto } from "../lib/DElement.dto";
import { DUtil } from "../lib/utils/DUtil";
import { ID } from "../lib/ID";
import { PageDto } from "../lib/SchemaDto";
import { DStyle } from "../lib/Delement/DStyle";

export namespace DB {
    export type OptionUUID = string & { __OPTION_UUID__: true };
    export type QuestionUUID = string & { __QUESTION_UUID__: true };
    export type VideoUUID = string & { __VIDEO_UUID__: true };
    export type AudioUUID = string & { __Audio_UUID__: true };
    export type ImageUUID = string & { __Image_UUID__: true };
    export type TextUUID = string & { __Text_UUID__: true };
    export type PageUUID = string & { __Page_UUID__: true };

    export const createId = () => {
        return DUtil.randomString(12);
    };

    class DBImpl {
        private readonly data = {
            questions: new Map<QuestionUUID, QuestionDB>(),
            options: new Map<OptionUUID, OptionDB>(),
            video: new Map<VideoUUID, VideoDB>(),
            audio: new Map<AudioUUID, AudioDB>(),
            image: new Map<ImageUUID, ImageDB>(),
            page: new Map<PageUUID, PageDB>(),
            text: new Map<TextUUID, PageDB>(),
        };

        createPage(data: {
            mainTextAudio?: AudioUUID;
            mainVideo?: VideoUUID;
            mainImage?: ImageUUID;
            question: QuestionUUID;
        }) {
            const id = createId() as PageUUID;
            const newPage: PageDB = {
                id,
                question: [],
            };

            return { ...data };
        }

        createVideo(url: string): VideoDB {
            const id = createId() as VideoUUID;
            const newVideo: VideoDB = { id, src: url };
            this.data.video.set(newVideo.id, newVideo);
            return newVideo;
        }

        createAudio(url: string): AudioDB {
            const id = createId() as AudioUUID;
            const newAudio: AudioDB = { id, src: url };
            this.data.audio.set(newAudio.id, newAudio);
            return newAudio;
        }

        createImage(url: string): ImageDB {
            const id = createId() as ImageUUID;
            const newImage: ImageDB = { id, src: url };
            this.data.image.set(newImage.id, newImage);
            return newImage;
        }

        private createOption(value: number): OptionDB {
            const id = createId() as OptionUUID;
            const option: OptionDB = { label: "label-for: " + value, value, id };
            this.data.options.set(option.id, option);
            return option;
        }

        createQuestion(question: string, opt: number[]): QuestionDB {
            const id = createId() as QuestionUUID;
            const options = opt.map((value) => this.createOption(value)).map((o) => o.id);
            const newQuestion: QuestionDB = { id, text: question, options };
            this.data.questions.set(newQuestion.id, newQuestion);
            return newQuestion;
        }

        getQuestion(id: QuestionUUID): QuestionDB {
            return this.data.questions.get(id) as QuestionDB;
        }

        getOption(id: OptionUUID): OptionDB {
            return this.data.options.get(id) as OptionDB;
        }
    }
    export type DB = InstanceType<typeof DBImpl>;

    export const createDB = () => new DBImpl();

    export interface QuestionDB {
        readonly id: QuestionUUID;
        readonly text: string;
        readonly options: ReadonlyArray<OptionUUID>;
    }

    export interface PageDB {
        readonly id: PageUUID;
        question: Array<QuestionUUID>;
        mainVideo?: VideoUUID;
        mainImage?: ImageUUID;
    }

    export interface OptionDB {
        readonly id: OptionUUID;
        readonly value: number;
        readonly label: string;
    }

    export interface VideoDB {
        readonly id: VideoUUID;
        readonly src: string;
    }

    export interface AudioDB {
        readonly id: AudioUUID;
        readonly src: string;
    }

    export interface TextDB {
        readonly id: TextUUID;
        readonly text: string;
    }

    export interface ImageDB {
        readonly id: ImageUUID;
        readonly src: string;
    }
}

export namespace Theme1 {
    import VideoDB = DB.VideoDB;
    import QOptionDB = DB.OptionDB;
    import PageId = ID.PageId;
    import QuestionDB = DB.QuestionDB;
    import VideoUUID = DB.VideoUUID;
    import AudioDB = DB.AudioDB;
    const BTN: Partial<DStyle> = {
        w: 17,
        h: 10,
        y: 10,
        backgroundColor: "blue",
    };
    const BTN_TEXT: Partial<DStyle> = {
        textColor: "white",
        fontWeight: 500,
        fontSize: { _unit: "px", value: 20 },
        textAlign: "center",
    };

    const sumReducer = (p: number, curr: number) => p + curr;

    export const spaceEvenlyX = <T extends Pick<DElementDto, "style">>(
        items: ReadonlyArray<T>,
        options: { startAt: number; endAt: number; defaultItemWidth: number } = {
            startAt: 0,
            endAt: 100,
            defaultItemWidth: 5,
        }
    ): ReadonlyArray<T> => {
        const startAt = options?.startAt ?? 0;
        const endAt = options?.endAt ?? 100;
        const range = Math.abs(endAt - startAt);
        if (items.length === 0) {
            return [];
        }
        const marginCount = items.length + 1;
        const defaultWidth = options.defaultItemWidth ?? 150 / marginCount;

        let totalWidthOfElements = items.reduce((prev, curr) => {
            const w = curr.style.w ?? defaultWidth;
            return prev + w;
        }, 0);

        let cursor = startAt;
        const rest = Math.max(range - totalWidthOfElements, 0);
        const margin = rest / marginCount;

        items.forEach((item) => {
            cursor = cursor + margin;
            const w = item.style.w ?? defaultWidth;
            const x = cursor;
            cursor = cursor + w;
            item.style.w = w;
            item.style.x = x;
        });

        return items;
    };
    export const responseButtons = (question: DB.QuestionDB, db: DB.DB): ReadonlyArray<DDivDto> => {
        const createBtn = (questionId: DB.QuestionUUID, opt: QOptionDB) => {
            const btn: DDivDto = {
                id: ID.elementId(),
                _tag: "div",
                children: [{ _tag: "p", id: ID.elementId(), text: opt.label, style: { ...BTN_TEXT } }],
                onClick: [
                    {
                        kind: "ENGINE_LEAVE_PAGE_COMMAND",
                        target: "ENGINE",
                        targetId: "ENGINE",
                        payload: {
                            pageId: "" as PageId,
                            factsCollected: [
                                {
                                    kind: "numeric-fact",
                                    label: opt.label,
                                    value: opt.value,
                                    referenceId: questionId,
                                    referenceLabel: "",
                                },
                            ],
                        },
                    },
                ],
                style: { ...BTN },
            };
            return btn;
        };

        const options = question.options.map((id) => db.getOption(id));
        const buttonElement = options.map((o) => createBtn(question.id, o));
        spaceEvenlyX(buttonElement);
        return buttonElement;
    };

    export interface QuestionPageInput {
        question: QuestionDB;
        db: DB.DB;
        video?: VideoDB;
        questionTextAudio?: AudioDB;
    }
    export const createQuestionPage = (
        input: QuestionPageInput

        // autoplay?: Array<VideoDB>
    ): PageDto => {
        const { question, questionTextAudio, video, db } = input;
        const btns = responseButtons(question, db);
        const elements: DElementDto[] = [];
        const audioElements: DAudioDto[] = [];
        let mainVideo: DVideoDto | null = null;
        let mainTextAudioDto: DAudioDto | null = null;
        if (questionTextAudio) {
            const audioId = ID.elementId();
            const playAudioId = ID.elementId();

            mainTextAudioDto = {
                id: audioId,
                _tag: "audio",
                url: questionTextAudio.src,
                // style: { visibility: "hidden" },
            };
            audioElements.push(mainTextAudioDto);

            const playMainTextAudioButton: DDivDto = {
                id: playAudioId,
                _tag: "div",
                children: [
                    {
                        id: ID.elementId(),
                        _tag: "p",
                        style: { fontSize: { _unit: "px", value: 30 } },
                        text: "play",
                    },
                ],
                onClick: [{ kind: "AUDIO_PLAY_COMMAND", target: "AUDIO", targetId: audioId, payload: { volume: 1 } }],
                style: { h: 5, w: 10, backgroundColor: "red", x: 5, y: 30, cursor: "pointer" },
            };
            elements.push(playMainTextAudioButton);
        }

        if (video) {
            const videoId = ID.elementId();
            mainVideo = {
                id: videoId,
                style: { h: 45, w: 100 },
                _tag: "video",
                eventHandlers: [],
                onClick: [],
                url: video.src,
            };
            const playButtonId = ID.elementId();
            const pauseButtonId = ID.elementId();
            const playBtn: DDivDto = {
                id: playButtonId,
                _tag: "div",
                style: { h: 5, w: 15, y: 50, x: 10, backgroundColor: "green" },
                children: [
                    { _tag: "p", style: { fontSize: { _unit: "px", value: 50 } }, text: "Play", id: ID.elementId() },
                ],
                onClick: [{ kind: "VIDEO_PLAY_COMMAND", target: "VIDEO", targetId: videoId, payload: {} }],
                eventHandlers: [
                    {
                        onEvent: "VIDEO_PLAY_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: playButtonId,
                                payload: { changes: { visibility: "hidden" } },
                            },
                        ],
                    },
                    {
                        onEvent: "BLOCKING_MEDIA_END_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: playButtonId,
                                payload: { changes: { opacity: 1 } },
                            },
                        ],
                    },
                    {
                        onEvent: "BLOCKING_MEDIA_START_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: playButtonId,
                                payload: { changes: { opacity: 0.2 } },
                            },
                        ],
                    },

                    {
                        onEvent: "VIDEO_PAUSED_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: playButtonId,
                                payload: { changes: { visibility: "visible" } },
                            },
                        ],
                    },

                    {
                        onEvent: "VIDEO_ENDED_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: playButtonId,
                                payload: { changes: { visibility: "visible" } },
                            },
                        ],
                    },
                ],
            };

            const pauseBtn: DDivDto = {
                id: pauseButtonId,
                _tag: "div",
                style: { h: 5, w: 15, y: 50, x: 10, backgroundColor: "red", visibility: "hidden" },
                children: [
                    { _tag: "p", style: { fontSize: { _unit: "px", value: 50 } }, text: "Pause", id: ID.elementId() },
                ],
                onClick: [{ kind: "VIDEO_PAUSE_COMMAND", target: "VIDEO", targetId: videoId, payload: {} }],
                eventHandlers: [
                    {
                        onEvent: "VIDEO_PLAY_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: pauseButtonId,
                                payload: { changes: { visibility: "visible" } },
                            },
                        ],
                    },
                    {
                        onEvent: "VIDEO_ENDED_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: pauseButtonId,
                                payload: { changes: { visibility: "hidden" } },
                            },
                        ],
                    },
                    {
                        onEvent: "VIDEO_PAUSED_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: pauseButtonId,
                                payload: { changes: { visibility: "hidden" } },
                            },
                        ],
                    },
                    {
                        onEvent: "BLOCKING_MEDIA_END_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: pauseButtonId,
                                payload: { changes: { opacity: 1 } },
                            },
                        ],
                    },
                    {
                        onEvent: "BLOCKING_MEDIA_START_EVENT",
                        thenExecute: [
                            {
                                kind: "ELEMENT_STYLE_COMMAND",
                                target: "ELEMENT",
                                targetId: pauseButtonId,
                                payload: { changes: { opacity: 0.2 } },
                            },
                        ],
                    },
                ],
            };
            elements.push(playBtn);
            elements.push(pauseBtn);
        }
        const questionText: DTextDto = {
            id: ID.elementId(),
            _tag: "p",
            text: question.text,
            style: {
                w: 80,
                y: 27,
                x: 10,
                textAlign: "center",
                textColor: "black",
                fontSize: { _unit: "px", value: 30 },
            },
        };

        const pageDto: PageDto = {
            id: ID.pageId(),
            elements: [...btns, questionText, ...elements],
            autoPlaySequence: { blocking: true, id: "1", items: [] },
            // video: videoArray,
            audio: audioElements,
        };
        if (mainVideo) {
            pageDto.mainVideo = mainVideo;
            pageDto.autoPlaySequence?.items.push({
                id: "1",
                kind: "autoplay-video",
                dto: mainVideo,
                mode: "blocking",
                muted: false,
            });
        }
        return pageDto;
    };
}
