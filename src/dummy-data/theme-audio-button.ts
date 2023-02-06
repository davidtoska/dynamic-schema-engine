import { ID } from "../lib/ID";
import { DAudioDto, DElementDto, DImgDto } from "../lib/DElement.dto";
import { IconUrls } from "../lib/icon-urls";
import { DB } from "./DB";
import { ThemeUtils } from "./theme-utils";
import { DStateProps } from "./standard-props";
import { CssTheme } from "./theme-video-player";

export namespace ThemeAudioButton {
    const theme: CssTheme = {
        css: { h: 6, w: 6, x: 4, y: 32, cursor: "pointer", opacity: 0.8, visibility: "visible" },
        cssDisabled: { opacity: 0.3, cursor: "not-allowed" },
        cssEnabled: { opacity: 0.8, cursor: "pointer" },
    };
    export const createMainTextAudio = (audioDb: DB.AudioDB): { audioDto: DAudioDto; elements: DElementDto[] } => {
        const audioId = ID.elementId();
        const btnId = ID.elementId();
        const url = IconUrls.volumeUpSvg;
        const mainTextAudioDto: DAudioDto = {
            id: audioId,
            _tag: "audio",
            url: audioDb.src,
            eventHandlers: [],
        };
        const enableCommands = ThemeUtils.enableClickCommands(btnId, theme.cssEnabled);
        const disableCommands = ThemeUtils.enableClickCommands(btnId, theme.cssDisabled);
        const playMainTextAudioButton: DImgDto = {
            id: btnId,
            _tag: "img",
            url,
            onClick: [
                {
                    kind: "AUDIO_PLAY_COMMAND",
                    target: "AUDIO",
                    targetId: audioId,
                    payload: { volume: 1 },
                },
            ],
            style: { ...theme.css, ...theme.cssEnabled },
            stateQueryChange: [
                {
                    queryName: DStateProps._Queries.disableAudioIconQuery.name,
                    whenTrue: [...disableCommands],
                    whenFalse: [...enableCommands],
                },
            ],
        };

        return { audioDto: mainTextAudioDto, elements: [playMainTextAudioButton] };
    };
}
