import { DB } from "./DB";
import { ID } from "../lib/ID";
import { DElementDto, DImgDto, DVideoDto } from "../lib/DElement.dto";
import { ThemeUtils } from "./theme-utils";
import { IconUrls } from "../lib/icon-urls";
import { DStyle } from "../lib/Delement/DStyle";
import { _PROPS } from "../lib/state/standard-props";

export namespace ThemeVideoPlayer {
    import ImageDB = DB.ImageDB;
    import VideoDB = DB.VideoDB;
    const videoDB = DB.createDB();
    const playIconDB = videoDB.createImage(IconUrls.playCircleRegular);
    const videoPauseIcon = videoDB.createImage(IconUrls.pauseSvg);

    interface IconButtonTemplate {
        src: ImageDB;
        css: Partial<DStyle>;
        cssEnabled: Partial<DStyle>;
        cssDisabled: Partial<DStyle>;
    }
    interface VideoPlayerTheme {
        playIcon: IconButtonTemplate;
        pauseIcon: IconButtonTemplate;
        overlayPlayIcon: IconButtonTemplate | false;
        videoElementStyles: Partial<DStyle>;
    }

    const iconX = 8;
    const iconY = 48;
    const iconW = 5;
    const iconH = 5;
    const disabledOpacity = 0.3;
    const enabledOpacity = 0.8;
    const cssDisabled: Partial<DStyle> = { opacity: disabledOpacity, cursor: "not-allowed" };
    const cssEnabled: Partial<DStyle> = { opacity: enabledOpacity, cursor: "pointer" };
    const theme: VideoPlayerTheme = {
        overlayPlayIcon: false,
        pauseIcon: {
            src: videoPauseIcon,
            css: { w: iconW, h: iconH, y: iconY, x: iconX },
            cssDisabled,
            cssEnabled,
        },
        playIcon: {
            src: playIconDB,
            css: { w: iconW, h: iconH, y: iconY, x: iconX },
            cssDisabled,
            cssEnabled,
        },
        videoElementStyles: { w: 100, h: 45, y: 55, x: 0 },
    };

    export const createPlayer = (video: VideoDB): { videoDto: DVideoDto; elements: DElementDto[] } => {
        const videoId = ID.elementId();
        const mainVideo: DVideoDto = {
            id: videoId,
            style: theme.videoElementStyles,
            _tag: "video",
            eventHandlers: [],
            // isMediaBlocking: true,
            onClick: [],
            url: video.src,
        };
        const playButtonId = ID.elementId();
        const pauseButtonId = ID.elementId();
        const playBtn: DImgDto = {
            id: playButtonId,
            _tag: "img",
            url: playIconDB.src,
            style: { ...theme.playIcon.css, ...theme.playIcon.cssEnabled },
            onClick: [
                { kind: "VIDEO_PLAY_COMMAND", target: "VIDEO", targetId: videoId, payload: {} },
                _PROPS.mediaBlockedByVideo.setTrueCommand,
            ],
            eventHandlers: [
                ...ThemeUtils.hideOnVideoPlay(playButtonId),
                {
                    onEvent: "MEDIA_BLOCKING_END_EVENT",
                    thenExecute: [...ThemeUtils.enableClickCommands(playButtonId, { ...theme.playIcon.cssEnabled })],
                },
                {
                    onEvent: "MEDIA_BLOCKING_START_EVENT",
                    thenExecute: [...ThemeUtils.disableClickCommands(playButtonId, { ...theme.playIcon.cssDisabled })],
                },
            ],
        };

        const pauseBtn: DImgDto = {
            id: pauseButtonId,
            _tag: "img",
            style: { ...theme.pauseIcon.css, visibility: "hidden" },
            url: theme.pauseIcon.src.src,
            onClick: [{ kind: "VIDEO_PAUSE_COMMAND", target: "VIDEO", targetId: videoId, payload: {} }],
            eventHandlers: [
                ...ThemeUtils.showOnVideoPlay(pauseButtonId),
                {
                    onEvent: "MEDIA_BLOCKING_END_EVENT",
                    thenExecute: [...ThemeUtils.enableClickCommands(pauseButtonId, { ...theme.pauseIcon.cssEnabled })],
                },
                {
                    onEvent: "MEDIA_BLOCKING_START_EVENT",
                    thenExecute: [
                        ...ThemeUtils.disableClickCommands(pauseButtonId, { ...theme.pauseIcon.cssDisabled }),
                    ],
                },
            ],
        };
        return { videoDto: mainVideo, elements: [playBtn, pauseBtn] };
    };
}
