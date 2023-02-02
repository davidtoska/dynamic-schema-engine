import { DState } from "./Dstate";
import NumericProp = DState.NumericProp;

interface DefaultStateProperty<PropName extends string> {
    readonly propName: PropName;
    readonly propDefinition: NumericProp;
    readonly setTrueMutation: DState.SetNumberMutation;
    readonly setFalseMutation: DState.SetNumberMutation;
}

/**
 * Create a "boolean" property (0 or 1) on the state
 * This could be derived from an event-log? Is that better?
 * @param propName
 */
const createDefaultStateProperty = <K extends string>(propName: K): DefaultStateProperty<K> => {
    const prop: DefaultStateProperty<K> = {
        propName,
        propDefinition: {
            propDescription: "DESCRIPTION for: " + propName,
            propName: propName,
            initialValue: 0,
            options: [
                { value: 0, valueLabel: "FALSE" },
                { value: 1, valueLabel: "TRUE" },
            ],
            _type: "number",
        },
        setFalseMutation: { propName, kind: "set-number", value: 0 },
        setTrueMutation: { propName, kind: "set-number", value: 1 },
    };
    return prop;
};

const mediaBlockedBySequence = createDefaultStateProperty("media-blocked-by-autoplay-sequence");
const inputBlockingBySequence = createDefaultStateProperty("input-blocked-by-autoplay-sequence");
const mediaBlockedByAudio = createDefaultStateProperty("media-blocked-by-audio");
const inputBlockedByAudio = createDefaultStateProperty("input-blocked-by-audio");
const mediaBlockedByVideo = createDefaultStateProperty("media-blocked-by-video");
const inputBlockedByVideo = createDefaultStateProperty("input-blocked-by-video");

const disableAudioIcon: DState.StateQuery = {
    name: "disableAudio",
    condition: {
        kind: "complex-condition",
        name: "audio-controls-are-blocked",
        some: [
            {
                kind: "numeric-condition",
                referenceId: mediaBlockedByAudio.propName,
                operator: "eq",
                value: 1,
                valueLabel: "TRUE",
                referenceLabel: mediaBlockedByAudio.propName,
            },
            {
                kind: "numeric-condition",
                referenceId: mediaBlockedByVideo.propName,
                value: 1,
                operator: "eq",
                valueLabel: "TRUE",
                referenceLabel: mediaBlockedByVideo.propName,
            },
            {
                kind: "numeric-condition",
                referenceId: mediaBlockedBySequence.propName,
                value: 1,
                operator: "eq",
                valueLabel: "TRUE",
                referenceLabel: mediaBlockedBySequence.propName,
            },
        ],
        all: [],
    },
};
export const DERIVED_STATE = {
    disableAudioIcon,
};

export const DEFAULT_STATE_PROPS = {
    inputBlockedByAudio,
    mediaBlockedByAudio,
    inputBlockingBySequence,
    mediaBlockedBySequence,
    inputBlockedByVideo,
    mediaBlockedByVideo,
} as const;

export const DEFAULT_STATE_PROPS_LIST = Object.values(DEFAULT_STATE_PROPS);
export const DEFAULT_STATE_DERIVED_LIST = Object.values(DERIVED_STATE);
