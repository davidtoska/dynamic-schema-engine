import { DUtil } from "../lib/utils/DUtil";
import { ButtonTheme } from "./theme-response-bar";

export namespace DB {
    import ButtonThemeKind = ButtonTheme.ButtonThemeKind;
    export type OptionUUID = string & { __OPTION__UUID__: true };
    export type QuestionUUID = string & { __QUESTION__UUID__: true };
    export type VideoUUID = string & { __VIDEO__UUID__: true };
    export type AudioUUID = string & { __AUDIO__UUID__: true };
    export type ImageUUID = string & { __IMAGE__UUID__: true };
    export type TextUUID = string & { __TEXT__UUID__: true };
    export type PageUUID = string & { __PAGE__UUID__: true };
    export class TextToken {
        private readonly id;
        constructor(private readonly text: string) {
            this.id = createId();
        }

        get() {
            return "asdf";
        }
    }

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
            text: new Map<TextUUID, TextDB>(),
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

        private createOption(value: number, theme: ButtonThemeKind = "normal"): OptionDB {
            const id = createId() as OptionUUID;
            const option: OptionDB = { label: "label-for: " + value, value, id, theme };
            this.data.options.set(option.id, option);
            return option;
        }

        createQuestion(question: string, opt: Array<Pick<OptionDB, "value" | "theme">>): QuestionDB {
            const id = createId() as QuestionUUID;
            const options = opt.map((op) => this.createOption(op.value, op.theme)).map((o) => o.id);
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
        readonly theme: ButtonThemeKind;
        readonly label: string;
    }

    export interface VideoDB {
        readonly id: VideoUUID;
        readonly src: string;
        readonly isMediaBlocking?: boolean;
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
