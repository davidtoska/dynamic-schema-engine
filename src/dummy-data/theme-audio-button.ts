import { ID } from "../lib/ID";
import { DAudioDto, DElementDto, DImgDto } from "../lib/DElement.dto";
import { IconUrls } from "../lib/icon-urls";
import { DB } from "./DB";
import { DCommand } from "../lib/commands/DCommand";
import { DEFAULT_STATE_PROPS } from "../lib/state/default-props";

export namespace ThemeAudioButton {
    // interface PlayButtonOption {
    //     style: Partial<DStyle>;
    // }
    export const createMainTextAudio = (audioDb: DB.AudioDB): { audioDto: DAudioDto; elements: DElementDto[] } => {
        const audioId = ID.elementId();
        const btnId = ID.elementId();
        const url = IconUrls.volumeUpSvg;
        const placeholderId = ID.elementId();
        const h = 6;
        const w = 6;
        const x = 4;
        const y = 32;
        const OPACITY_DISABLED = 0.3;
        const OPACITY_ENABLED = 0.8;

        const mainTextAudioDto: DAudioDto = {
            id: audioId,
            _tag: "audio",
            url: audioDb.src,
            isMediaBlocking: true,
        };

        const disableCommands: Array<DCommand> = [
            { kind: "ELEMENT_DISABLE_CLICK_COMMAND", target: "ELEMENT", targetId: btnId, payload: {} },
            {
                kind: "ELEMENT_STYLE_COMMAND",
                target: "ELEMENT",
                targetId: btnId,
                payload: { changes: { opacity: OPACITY_DISABLED, cursor: "not-allowed" } },
            },
        ];
        const enableCommands: Array<DCommand> = [
            { kind: "ELEMENT_ENABLE_CLICK_COMMAND", target: "ELEMENT", targetId: btnId, payload: {} },
            {
                kind: "ELEMENT_STYLE_COMMAND",
                target: "ELEMENT",
                targetId: btnId,
                payload: { changes: { opacity: 0.8, cursor: "pointer" } },
            },
        ];
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
                {
                    kind: "STATE_MUTATE_COMMAND",
                    target: "STATE",
                    targetId: "STATE",
                    payload: {
                        mutation: DEFAULT_STATE_PROPS.mediaBlockedByAudio.setTrueMutation,
                    },
                },
            ],
            style: { h, w, x, y, cursor: "pointer", opacity: 0.8, visibility: "visible" },
            eventHandlers: [
                { onEvent: "MEDIA_BLOCKING_START_EVENT", thenExecute: [...disableCommands] },
                { onEvent: "MEDIA_BLOCKING_END_EVENT", thenExecute: [...enableCommands] },
                { onEvent: "VIDEO_PLAY_EVENT", thenExecute: [...disableCommands] },
                { onEvent: "VIDEO_PAUSED_EVENT", thenExecute: [...enableCommands] },
                { onEvent: "VIDEO_ENDED_EVENT", thenExecute: [...enableCommands] },
                // { onEvent: "STATE_CHANGED_EVENT", when: {}, thenExecute: [] },
                // { onEvent: "VIDEO_ENDED_EVENT", thenExecute: [...enableCommands] },
            ],
            stateQueryChange: { queryName: "", whenTrue: [], whenFalse: [] },
        };

        return { audioDto: mainTextAudioDto, elements: [playMainTextAudioButton] };
    };
}
