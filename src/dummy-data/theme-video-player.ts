import { DB } from "./DB";
import { ID } from "../lib/ID";
import { DAudioDto, DElementDto, DImgDto, DVideoDto } from "../lib/DElement.dto";
import { ThemeUtils } from "./theme-utils";
import { IconUrls } from "../lib/icon-urls";
import { DStyle } from "../lib/Delement/DStyle";
import { DStateProps } from "./standard-props";
export interface DComponent {
    ui: Array<DElementDto>;
    audioList: DAudioDto[];
}

export interface CssTheme {
    css: Partial<DStyle>;
    cssEnabled: Partial<DStyle>;
    cssDisabled: Partial<DStyle>;
}

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

    const iconX = 4;
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
                // TODO Check if this video shall block other media first?
                DStateProps.mediaBlockedByVideo.setTrueCommand,
                DStateProps.userPausedVideo.setFalseCommand,
            ],
            stateQueryChange: [
                {
                    queryName: DStateProps._Queries.disableVideoPlayQuery.name,
                    whenTrue: [...ThemeUtils.disableClickCommands(playButtonId, theme.playIcon.cssDisabled)],
                    whenFalse: [...ThemeUtils.enableClickCommands(playButtonId, theme.playIcon.cssEnabled)],
                },
                {
                    queryName: DStateProps._Queries.hideVideoPlayQuery.name,
                    whenTrue: [ThemeUtils.hideCommand(playButtonId)],
                    whenFalse: [ThemeUtils.showCommand(playButtonId)],
                },
            ],
        };

        const pauseBtn: DImgDto = {
            id: pauseButtonId,
            _tag: "img",
            style: { ...theme.pauseIcon.css, visibility: "hidden", ...theme.pauseIcon.cssEnabled },
            url: theme.pauseIcon.src.src,
            onClick: [
                { kind: "VIDEO_PAUSE_COMMAND", target: "VIDEO", targetId: videoId, payload: {} },
                DStateProps.mediaBlockedByVideo.setFalseCommand,
                DStateProps.userPausedVideo.setTrueCommand,
            ],
            stateQueryChange: [
                {
                    queryName: DStateProps._Queries.hideVideoPauseQuery.name,
                    whenTrue: [ThemeUtils.hideCommand(pauseButtonId)],
                    whenFalse: [ThemeUtils.showCommand(pauseButtonId)],
                },
            ],
        };
        return { videoDto: mainVideo, elements: [playBtn, pauseBtn] };
    };
}
