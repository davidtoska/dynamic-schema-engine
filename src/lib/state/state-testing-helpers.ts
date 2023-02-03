import { DState } from "./Dstate";
import NumericProp = DState.NumericProp;
import { Condition } from "../rules/condition";
export class BooleanPropDef<PropName extends string> {
    readonly propDefinition: NumericProp;
    readonly setTrueMutation: DState.SetNumberMutation;
    readonly setFalseMutation: DState.SetNumberMutation;
    readonly isTrue: Condition.Numeric;
    readonly isFalse: Condition.Numeric;
    constructor(public readonly propName: PropName) {
        this.propDefinition = {
            propDescription: "DESCRIPTION for: " + propName,
            propName: propName,
            initialValue: 0,
            options: [
                { value: 0, valueLabel: "FALSE" },
                { value: 1, valueLabel: "TRUE" },
            ],
            _type: "number",
        };
        // this.setTrueMutation = {}
        this.setFalseMutation = { propName, kind: "set-number", value: 0 };
        this.setTrueMutation = { propName, kind: "set-number", value: 1 };
        this.isTrue = {
            kind: "numeric-condition",
            referenceId: propName,
            referenceLabel: "",
            valueLabel: "",
            value: 1,
            operator: "eq",
        };
        this.isFalse = {
            kind: "numeric-condition",
            referenceId: propName,
            referenceLabel: "",
            valueLabel: "",
            value: 0,
            operator: "eq",
        };
    }
}

const propA = new BooleanPropDef("a");
const propB = new BooleanPropDef("b");
const propC = new BooleanPropDef("c");
const propD = new BooleanPropDef("d");
const propE = new BooleanPropDef("e");
const propF = new BooleanPropDef("f");

const A_or_B_or_C_Query: DState.StateQuery = {
    name: "disableAudio",
    condition: {
        kind: "complex-condition",
        name: "audio-controls-are-blocked",
        some: [
            {
                kind: "numeric-condition",
                referenceId: propA.propName,
                operator: "eq",
                value: 1,
                valueLabel: "TRUE",
                referenceLabel: propA.propName,
            },
            {
                kind: "numeric-condition",
                referenceId: propB.propName,
                value: 1,
                operator: "eq",
                valueLabel: "TRUE",
                referenceLabel: propB.propName,
            },
            {
                kind: "numeric-condition",
                referenceId: propC.propName,
                value: 1,
                operator: "eq",
                valueLabel: "TRUE",
                referenceLabel: propC.propName,
            },
        ],
        all: [],
    },
};
export const _Q = {
    A_or_B_or_C_Query,
};

export const _P = {
    propA,
    propB,
    propC,
    propD,
    propE,
    propF,
} as const;

// export const DEFAULT_STATE_PROPS_LIST = Object.values(DEFAULT_STATE_PROPS);
// export const DEFAULT_STATE_DERIVED_LIST = Object.values(DERIVED_STATE);
