import { BooleanStateProperty } from "./boolean-property";
import { DState } from "./Dstate";

export const _STANDARD_PROPS = {
    mediaBlockedByAudio: "media-blocked-by-audio",
    inputBlockedByAudio: "input-blocked-by-audio",
};

const mediaBlockedBySequence = new BooleanStateProperty("media-blocked-by-autoplay-sequence", false);
const inputBlockingBySequence = new BooleanStateProperty("input-blocked-by-autoplay-sequence", false);
const mediaBlockedByAudio = new BooleanStateProperty("media-blocked-by-audio", false);
const inputBlockedByAudio = new BooleanStateProperty("input-blocked-by-audio", false);
const mediaBlockedByVideo = new BooleanStateProperty("media-blocked-by-video", false);
const inputBlockedByVideo = new BooleanStateProperty("input-blocked-by-video", false);

const disableAudioIconQuery: DState.StateQuery = {
    name: "disableAudio",
    condition: {
        kind: "complex-condition",
        name: "audio-controls-are-blocked",
        some: [
            mediaBlockedBySequence.isTrueCondition,
            mediaBlockedByAudio.isTrueCondition,
            mediaBlockedByVideo.isTrueCondition,
        ],
        all: [],
    },
};
export const _Queries = {
    disableAudioIconQuery,
};

export const _PROPS = {
    inputBlockedByAudio,
    mediaBlockedByAudio,
    inputBlockingBySequence,
    mediaBlockedBySequence,
    inputBlockedByVideo,
    mediaBlockedByVideo,
} as const;

// export const DEFAULT_STATE_PROPS_LIST = Object.values(DEFAULT_STATE_PROPS);
// export const DEFAULT_STATE_DERIVED_LIST = Object.values(DERIVED_STATE);
