import { ID } from "../lib/ID";
import { DAudioDto, DElementDto, DImgDto } from "../lib/DElement.dto";
import { IconUrls } from "../lib/icon-urls";
import { DB } from "./DB";
import { DCommand } from "../lib/events-and-actions/DCommand";

type DisableStates = { disableAnswers: boolean; disableAudio: boolean; validStateQuestionMark: boolean };
type AudioOptions = { autoplay: boolean };
type VideoOptions = { autoplay: boolean; mustSeeOnce: boolean; loop: boolean; muted: boolean };
type VideoModes =
    | "gif-mode (non-blocking)"
    | "auto-play (blocking blocking answer & audio)"
    | "autoplay & required (blocking answer & audio)"
    | "not-autoplay & required (blocking answer)"
    | "not-autoplay & not-required (non-blocking)";

type AutoPlay = "autoplay=true" | "autoplay=false";
type Loop = "loop=true" | "loop=false";
type MustSeeOnce = "must-see-once=true" | "must-see-once=false";
type WatchCount = "Not seen" | "Seen once or more";
type AudioStates = "not-playing" | "playing" | "auto-playing";
type VideoStates = `${AutoPlay} && ${Loop} && ${MustSeeOnce} && ${WatchCount} && ${AudioStates}`;

const states: Record<VideoStates, DisableStates> = {
    "autoplay=false && loop=false && must-see-once=false && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=false && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=false && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=false && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=false && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=false && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=false && must-see-once=true && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=false && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=false && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=false && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=false && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=false && loop=true && must-see-once=false && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=false && loop=true && must-see-once=false && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=false && loop=true && must-see-once=true && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=false && loop=true && must-see-once=true && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=true && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=true && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=true && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=false && loop=true && must-see-once=true && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=true && loop=false && must-see-once=false && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=true && loop=false && must-see-once=false && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=true && loop=false && must-see-once=false && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=true && loop=false && must-see-once=false && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },

    "autoplay=true && loop=false && must-see-once=false && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=false && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=false && must-see-once=true && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=false && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Not seen && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Not seen && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Not seen && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Seen once or more && auto-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Seen once or more && not-playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    "autoplay=true && loop=true && must-see-once=true && Seen once or more && playing": {
        disableAnswers: true,
        disableAudio: true,
        validStateQuestionMark: true,
    },
    // "autoplay=false && loop=true && must-see-once=false": {
    //     disableAnswers: false,
    //     disableAudio: false,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=false && loop=true && must-see-once=true": {
    //     disableAnswers: false,
    //     disableAudio: false,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=true && loop=true && must-see-once=true": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=false && loop=false && must-see-once=false": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=false && loop=false && must-see-once=true": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=true && loop=false && must-see-once=false": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=true && loop=false && must-see-once=true": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
    // "autoplay=true && loop=true && must-see-once=false": {
    //     disableAnswers: true,
    //     disableAudio: true,
    //     validStateQuestionMark: true,
    // },
};
console.log(states);
// type VideoMode = { kind: "gif-mode"; disableAnswer: false; disableAudio: false } | { kind: "autoplay" };

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
            onClick: [{ kind: "AUDIO_PLAY_COMMAND", target: "AUDIO", targetId: audioId, payload: { volume: 1 } }],
            style: { h, w, x, y, cursor: "pointer", opacity: 0.8, visibility: "visible" },
            eventHandlers: [
                { onEvent: "MEDIA_BLOCKING_START_EVENT", thenExecute: [...disableCommands] },
                { onEvent: "MEDIA_BLOCKING_END_EVENT", thenExecute: [...enableCommands] },
                { onEvent: "VIDEO_PLAY_EVENT", thenExecute: [...disableCommands] },
                { onEvent: "VIDEO_PAUSED_EVENT", thenExecute: [...enableCommands] },
                { onEvent: "VIDEO_ENDED_EVENT", thenExecute: [...enableCommands] },
                // { onEvent: "VIDEO_ENDED_EVENT", thenExecute: [...enableCommands] },
            ],
        };

        return { audioDto: mainTextAudioDto, elements: [playMainTextAudioButton] };
    };
}
