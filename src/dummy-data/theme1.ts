import { DAudioDto, DDivDto, DElementDto, DImgDto, DTextDto, DVideoDto } from "../lib/DElement.dto";
import { ID } from "../lib/ID";
import { PageDto } from "../lib/SchemaDto";
import { DB } from "./DB";
import { ButtonTheme } from "./theme-response-bar";
import { ThemeUtils } from "./theme-utils";
import { ThemeAudioButton } from "./theme-audio-button";
import { ThemeVideoPlayer } from "./theme-video-player";
import { DStyle } from "../lib/Delement/DStyle";
import { DStateProps } from "./standard-props";

export namespace Theme1 {
    import VideoDB = DB.VideoDB;
    import QOptionDB = DB.OptionDB;
    import PageId = ID.PageId;
    import QuestionDB = DB.QuestionDB;
    import AudioDB = DB.AudioDB;

    const createBtn = (pageId: PageId, questionId: DB.QuestionUUID, opt: QOptionDB) => {
        const enabledStyles: Partial<DStyle> = { opacity: 1 };
        const disabledStyles: Partial<DStyle> = { opacity: 0.3 };
        const theme = ButtonTheme.themes[opt.theme];
        const btnId = ID.elementId();
        const btn: DDivDto = {
            id: btnId,
            _tag: "div",
            children: [
                {
                    _tag: "p",
                    id: ID.elementId(),
                    text: opt.label,
                    style: {
                        // ...theme,
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
                                referenceLabel: "QuestionId: " + questionId,
                            },
                        ],
                    },
                },
            ],
            stateQueryChange: [
                {
                    queryName: DStateProps._Queries.disableUserInputQuery.name,
                    whenFalse: [...ThemeUtils.enableClickCommands(btnId, enabledStyles)],
                    whenTrue: [...ThemeUtils.disableClickCommands(btnId, disabledStyles)],
                },
            ],
            style: { ...theme, ...enabledStyles },
        };
        return btn;
    };

    export const responseButtons = (question: DB.QuestionDB, pageId: PageId, db: DB.DB): ReadonlyArray<DDivDto> => {
        const options = question.options.map((id) => db.getOption(id));
        const buttonElement = options.map((o) => createBtn(pageId, question.id, o));
        ThemeUtils.spaceEvenlyX(buttonElement);
        return buttonElement;
    };

    export interface QuestionPageInput {
        question: QuestionDB;
        db: DB.DB;
        videoConfig?: { autoplay: boolean; video: VideoDB };
        questionTextAudio?: { autoplay: boolean; audio: AudioDB };
        // autoPlaySequence: Array<>
        // buttonTheme: ButtonTheme.ButtonThemeKind;
    }

    export const createQuestionPage = (input: QuestionPageInput): PageDto => {
        const pageId = ID.pageId();
        const { question, questionTextAudio, videoConfig, db } = input;
        const btns = responseButtons(question, pageId, db);
        const elements: DElementDto[] = [];
        const audioResources: DAudioDto[] = [];
        const videoResources: DVideoDto[] = [];
        let mainVideo: DVideoDto | null = null;
        let mainTextAudio: DAudioDto | null = null;

        if (questionTextAudio) {
            const mainTextAudioComponent = ThemeAudioButton.createMainTextAudio(questionTextAudio.audio);
            mainTextAudio = mainTextAudioComponent.audioDto;
            audioResources.push(mainTextAudioComponent.audioDto);
            elements.push(...mainTextAudioComponent.elements);
        }

        if (videoConfig) {
            const playerData = ThemeVideoPlayer.createPlayer(videoConfig.video);
            mainVideo = playerData.videoDto;
            videoResources.push(playerData.videoDto);
            elements.push(...playerData.elements);
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
            id: pageId,
            elements: [...btns, questionText, ...elements],
            autoPlaySequence: {
                blockUserInput: true,
                id: "1",
                items: [],
                startCommands: [
                    DStateProps.mediaBlockedBySequence.setTrueCommand,
                    DStateProps.inputBlockingBySequence.setTrueCommand,
                ],
                endCommands: [
                    DStateProps.mediaBlockedBySequence.setFalseCommand,
                    DStateProps.inputBlockingBySequence.setFalseCommand,
                ],
            },
            video: videoResources,
            audio: audioResources,
        };
        if (mainTextAudio && questionTextAudio?.autoplay) {
            pageDto.autoPlaySequence?.items.push({
                kind: "autoplay-audio",
                audioId: mainTextAudio.id,
            });
        }
        if (mainVideo) {
            pageDto.mainVideoId = mainVideo.id;
            if (videoConfig?.autoplay) {
                pageDto.autoPlaySequence?.items.push({
                    kind: "autoplay-video",
                    videoId: mainVideo.id,
                    muted: false,
                });
            }
        }
        return pageDto;
    };
}
