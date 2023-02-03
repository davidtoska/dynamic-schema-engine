import { ID } from "../lib/ID";
import { DAudioDto, DElementDto, DImgDto } from "../lib/DElement.dto";
import { IconUrls } from "../lib/icon-urls";
import { DB } from "./DB";
import { DCommand, ElementCommand } from "../lib/commands/DCommand";
import { _PROPS, _Queries } from "../lib/state/standard-props";

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
            // isMediaBlocking: true,
        };

        const disableCommands: Array<ElementCommand> = [
            { kind: "ELEMENT_DISABLE_CLICK_COMMAND", target: "ELEMENT", targetId: btnId, payload: {} },
            {
                kind: "ELEMENT_STYLE_COMMAND",
                target: "ELEMENT",
                targetId: btnId,
                payload: { changes: { opacity: OPACITY_DISABLED, cursor: "not-allowed" } },
            },
        ];
        const enableCommands: Array<ElementCommand> = [
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

                // TODO IF IsMedia-blocking
                _PROPS.mediaBlockedByAudio.setTrueCommand,
            ],
            style: { h, w, x, y, cursor: "pointer", opacity: 0.8, visibility: "visible" },
            eventHandlers: [
                {
                    onEvent: "AUDIO_ENDED_EVENT",
                    when: { producerId: audioId },
                    thenExecute: [_PROPS.mediaBlockedByAudio.setFalseCommand],
                },
            ],
            stateQueryChange: [
                {
                    queryName: _Queries.disableAudioIconQuery.name,
                    whenTrue: [...disableCommands],
                    whenFalse: [...enableCommands],
                },
            ],
        };

        return { audioDto: mainTextAudioDto, elements: [playMainTextAudioButton] };
    };
}
