import { BooleanStateProperty } from "../lib/state/boolean-property";
import { DState } from "../lib/state/Dstate";

export namespace DStateProps {
    export const mediaBlockedBySequence = new BooleanStateProperty("media-blocked-by-autoplay-sequence", false);
    export const inputBlockingBySequence = new BooleanStateProperty("input-blocked-by-autoplay-sequence", false);
    export const mediaBlockedByAudio = new BooleanStateProperty("media-blocked-by-audio", false);
    export const inputBlockedByAudio = new BooleanStateProperty("input-blocked-by-audio", false);
    export const mediaBlockedByVideo = new BooleanStateProperty("media-blocked-by-video", false);
    export const inputBlockedByVideo = new BooleanStateProperty("input-blocked-by-video", false);
    export const userPausedVideo = new BooleanStateProperty("user-paused-video", false);
    export const videoIsPlaying = new BooleanStateProperty("video-is-playing", false);
    export const audioIsPlaying = new BooleanStateProperty("audio-is-playing", false);
    const _props = {
        inputBlockedByAudio,
        mediaBlockedByAudio,
        inputBlockingBySequence,
        mediaBlockedBySequence,
        inputBlockedByVideo,
        mediaBlockedByVideo,
        userPausedVideo,
        videoIsPlaying,
    };
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
    const hideVideoPlayQuery: DState.StateQuery = {
        name: "hide video play button",
        condition: {
            kind: "complex-condition",
            name: "video-is-playing-condition",
            all: [videoIsPlaying.isTrueCondition],
            some: [],
        },
    };

    const hideVideoPauseQuery: DState.StateQuery = {
        name: "hide video pause button",
        condition: {
            kind: "complex-condition",
            name: "video-is-not-playing-condition",
            all: [videoIsPlaying.isFalseCondition],
            some: [],
        },
    };

    const disableVideoPlayQuery: DState.StateQuery = {
        name: "disableVideo",
        condition: {
            kind: "complex-condition",
            name: "video-play shall be disabled",
            all: [userPausedVideo.isFalseCondition],
            some: [
                mediaBlockedBySequence.isTrueCondition,
                mediaBlockedByAudio.isTrueCondition,
                mediaBlockedByVideo.isTrueCondition,
                audioIsPlaying.isTrueCondition,
            ],
        },
    };
    const disableUserInputQuery: DState.StateQuery = {
        name: "disableUserInput",
        condition: {
            kind: "complex-condition",
            name: "User input shall be disabled (Response-buttons, FormControls...)",
            all: [],
            some: [
                inputBlockedByAudio.isTrueCondition,
                inputBlockedByVideo.isTrueCondition,
                inputBlockingBySequence.isTrueCondition,
            ],
        },
    };
    export const _Queries = {
        disableAudioIconQuery,
        disableVideoPlayQuery,
        disableUserInputQuery,
        hideVideoPauseQuery,
        hideVideoPlayQuery,
    };
    export const allDefaultProperties = Object.values(_props);
    export const allDefaultQueries = Object.values(_Queries);
}
