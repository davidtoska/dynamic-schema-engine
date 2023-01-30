import { DAudioDto, DDivDto, DElementDto, DImgDto, DTextDto, DVideoDto } from "../lib/DElement.dto";
import { ID } from "../lib/ID";
import { PageDto } from "../lib/SchemaDto";
import { DB } from "./DB";
import { ButtonTheme } from "./theme-response-bar";
import { ThemeUtils } from "./theme-utils";
import { IconUrls } from "../lib/icon-urls";
import { ThemeAudioButton } from "./theme-audio-button";
import { ThemeVideoPlayer } from "./theme-video-player";

export namespace Theme1 {
    import VideoDB = DB.VideoDB;
    import QOptionDB = DB.OptionDB;
    import PageId = ID.PageId;
    import QuestionDB = DB.QuestionDB;
    import AudioDB = DB.AudioDB;

    export const responseButtons = (question: DB.QuestionDB, pageId: PageId, db: DB.DB): ReadonlyArray<DDivDto> => {
        const createBtn = (questionId: DB.QuestionUUID, opt: QOptionDB) => {
            const theme = ButtonTheme.themes[opt.theme];
            const btn: DDivDto = {
                id: ID.elementId(),
                _tag: "div",
                children: [
                    {
                        _tag: "p",
                        id: ID.elementId(),
                        text: opt.label,
                        style: {
                            textColor: theme.textColor,
                            fontSize: theme.fontSize,
                            w: 84,
                            x: 8,
                            fontWeight: theme.fontWeight,
                            textAlign: "center",
                            ...ThemeUtils.centerY(),
                        },
                    },
                ],
                onClick: [
                    {
                        kind: "ENGINE_LEAVE_PAGE_COMMAND",
                        target: "ENGINE",
                        targetId: "ENGINE",
                        payload: {
                            pageId,
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
                style: { ...theme },
            };
            return btn;
        };

        const options = question.options.map((id) => db.getOption(id));
        const buttonElement = options.map((o) => createBtn(question.id, o));
        ThemeUtils.spaceEvenlyX(buttonElement);
        return buttonElement;
    };

    export interface QuestionPageInput {
        question: QuestionDB;
        db: DB.DB;
        videoConfig?: { autoplay: boolean; video: VideoDB };
        questionTextAudio?: AudioDB;
    }

    export const createQuestionPage = (input: QuestionPageInput): PageDto => {
        const pageId = ID.pageId();
        const { question, questionTextAudio, videoConfig, db } = input;
        const btns = responseButtons(question, pageId, db);
        const elements: DElementDto[] = [];
        const audioResources: DAudioDto[] = [];
        const videoResources: DVideoDto[] = [];
        let mainVideo: DVideoDto | null = null;

        if (questionTextAudio) {
            const mainTextAudio = ThemeAudioButton.createMainTextAudio(questionTextAudio);
            audioResources.push(mainTextAudio.audioDto);
            elements.push(...mainTextAudio.elements);
        }

        if (videoConfig) {
            const playerData = ThemeVideoPlayer.createPlayer(videoConfig.video);
            mainVideo = playerData.videoDto;
            elements.push(...playerData.elements);
        }

        const playIcon: DImgDto = {
            _tag: "img",
            id: ID.elementId(),
            style: { x: 30, y: 30, h: 8, w: 8, opacity: 0.8 },
            url: IconUrls.playCircleRegular,
        };
        const pauseIcon: DImgDto = {
            _tag: "img",
            id: ID.elementId(),
            style: { x: 50, y: 30, h: 8, w: 8, opacity: 0.8 },
            url: IconUrls.pauseSvg,
        };

        const replayIcon: DImgDto = {
            _tag: "img",
            id: ID.elementId(),
            style: { x: 70, y: 30, h: 8, w: 8, opacity: 0.8 },
            url: IconUrls.replayCircleSvg,
        };
        elements.push(playIcon, pauseIcon, replayIcon);

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
            id: pageId,
            elements: [...btns, questionText, ...elements],
            autoPlaySequence: { blocking: true, id: "1", items: [] },
            video: videoResources,
            audio: audioResources,
        };
        if (mainVideo) {
            pageDto.video?.push(mainVideo);
            pageDto.mainVideoId = mainVideo.id;
            if (videoConfig?.autoplay === true) {
                pageDto.autoPlaySequence?.items.push({
                    id: "1",
                    kind: "autoplay-video",
                    videoId: mainVideo.id,
                    mode: "blocking",
                    muted: false,
                });
            }
        }
        return pageDto;
    };
}
