import { Fact } from "./fact";
import { Result } from "../common/result";
import { Condition } from "./condition";

export type DVariable = DVariable.NumericUnion | DVariable.NumericValue;

export namespace DVariable {
    export const FALSE: NumericValueOption = { value: 0, label: "FALSE" };
    export const TRUE: NumericValueOption = { value: 1, label: "TRUE" };

    const mediaBlockedBySequence: NumericUnion = {
        id: "media-blocked-by-autoplay-sequence",
        initialValue: FALSE,
        variableLabel: "Media is blocked by a running auto-play sequence.",
        kind: "numeric-union-variable",
        options: [TRUE, FALSE],
    };

    const inputBlockingBySequence: NumericUnion = {
        id: "input-blocked-by-autoplay-sequence",
        initialValue: FALSE,
        variableLabel: "User input is blocked by a running auto-play sequence.",
        kind: "numeric-union-variable",
        options: [TRUE, FALSE],
    };

    const mediaBlockedByAudio: NumericUnion = {
        id: "media-blocked-by-audio",
        initialValue: FALSE,
        variableLabel: "Media is blocked by a audio-file.",
        kind: "numeric-union-variable",
        options: [TRUE, FALSE],
    };

    const inputBlockedByAudio: NumericUnion = {
        id: "input-blocked-by-audio",
        initialValue: FALSE,
        variableLabel: "User input is blocked by a audio-file.",
        kind: "numeric-union-variable",
        options: [TRUE, FALSE],
    };

    const mediaBlockedByVideo: NumericUnion = {
        id: "media-blocked-by-video",
        initialValue: FALSE,
        variableLabel: "Media is blocked by a video-file.",
        kind: "numeric-union-variable",
        options: [TRUE, FALSE],
    };

    const inputBlockedByVideo: NumericUnion = {
        kind: "numeric-union-variable",
        id: "input-blocked-by-video",
        initialValue: FALSE,
        variableLabel: "User input (forms/response-buttons) is blocked a video-file",
        options: [TRUE, FALSE],
    };
    export const HARD_CODED_VARIABLES = {
        inputBlockedByAudio,
        mediaBlockedByAudio,
        inputBlockingBySequence,
        mediaBlockedBySequence,
        inputBlockedByVideo,
        mediaBlockedByVideo,
    } as const;

    export interface NumericUnion {
        readonly kind: "numeric-union-variable";
        readonly id: string;
        readonly initialValue?: NumericValueOption;
        readonly variableLabel: string;
        readonly options: NumericValueOption[];
    }

    interface NumericValueOption {
        readonly label: string;
        readonly value: number;
    }

    interface BooleanProp {
        readonly kind: "boolean-prop";
        readonly name: string;
        readonly defaultValue?: boolean;
    }

    interface NumericProp {
        readonly kind: "numeric-prop";
        readonly name: string;
        readonly defaultValue?: number;
    }

    interface CounterProp {
        readonly kind: "counter-prop";
        readonly name: string;
    }

    interface NumericLiteralProp {
        readonly kind: "numeric-literal-prop";
        readonly name: string;
        readonly options: number[];
    }
    interface StringLiteralProp {
        readonly kind: "string-literal-prop";
        readonly name: string;
        readonly options: string[];
    }

    export interface CountVariable {
        readonly kind: "counter-prop";
        readonly id: string;
        readonly variableLabel: string;
        readonly initialValue: number;
    }

    export interface NumericValue {
        readonly id: string;
        readonly variableLabel: string;
        readonly initialValue?: NumericValueOption;
        readonly kind: "numeric-value-variable";
        readonly minValue?: NumericValueOption;
        readonly maxValue?: NumericValueOption;
    }

    // const asFact =
    const numericUnionAsFact = (variable: NumericUnion, option: NumericValueOption): Fact.Numeric => {
        const numericFact: Fact.Numeric = {
            kind: "numeric-fact",
            referenceId: variable.id,
            referenceLabel: variable.variableLabel,
            value: option.value,
            label: option.label,
        };
        return numericFact;
    };
    export const asFact = (variable: DVariable, value: NumericValueOption) => {
        switch (variable.kind) {
            case "numeric-value-variable":
                return numericValueAsFact(variable, value.value, value.label);
            case "numeric-union-variable":
                return numericUnionAsFact(variable, value);
            // default:
            //     DUtil.neverCheck(variable);
        }
    };

    const numericValueAsFact = (variable: NumericValue, value: number, valueLabel: string): Fact.Numeric => {
        const numericFact: Fact.Numeric = {
            kind: "numeric-fact",
            referenceId: variable.id,
            referenceLabel: variable.variableLabel,
            value,
            label: valueLabel,
        };
        return numericFact;
    };

    export const toFact = (variable: DVariable, value: number): Result<Fact.Numeric> => {
        switch (variable.kind) {
            case "numeric-union-variable":
                const option = variable.options.find((o) => o.value === value);

                if (!option) {
                    return Result.failure("");
                }
                const fact: Fact.Numeric = {
                    value: value,
                    label: option.label,
                    referenceId: variable.id,
                    referenceLabel: variable.variableLabel,
                    kind: "numeric-fact",
                };

                return Result.ok(fact);
            case "numeric-value-variable":
                const numbericValueFact: Fact.Numeric = {
                    kind: "numeric-fact",
                    referenceId: variable.id,
                    referenceLabel: variable.variableLabel,
                    value,
                    label: "value: " + value,
                };
                return Result.ok(numbericValueFact);
            default:
                return Result.failure("Unknown variable kind.");
        }
    };
}

export class StateContainer {
    private readonly variables = new Map<string, DVariable>();
    private readonly facts = new Map<string, Fact>();
    private readonly counters = new Map<string, number>();

    constructor(private readonly variableList: ReadonlyArray<DVariable>) {
        this.variableList.forEach((v) => {
            this.addVariable(v);
        });
    }

    private addVariable(variable: DVariable) {
        if (this.variables.has(variable.id)) {
            console.warn("VARIABLE IS ALREADY REGISTERED", variable);
        }
        if (this.facts.has(variable.id)) {
            console.warn("FACT With THis refid exists", variable.id);
        }

        this.variables.set(variable.id, variable);
        if (variable.initialValue) {
            const fact = DVariable.asFact(variable, variable.initialValue);
            this.facts.set(fact.referenceId, fact);
        }
    }

    addToCount(factId: string, toAdd: number = 1) {
        const current = this.facts.get(factId);
        if (current && current.kind === "numeric-fact") {
            const curr = current.value;
            const updated: Fact.Numeric = {
                ...current,
                value: curr + toAdd,
            };
            this.facts.set(updated.referenceId, updated);
        } else {
            console.log("WARNING: SHOULD BE DEFINED IN VARIABLES.");
            const newCounter: Fact.Numeric = {
                kind: "numeric-fact",
                referenceId: factId,
                referenceLabel: "label for: " + factId,
                value: toAdd,
                label: "Value: " + toAdd,
            };
            this.facts.set(newCounter.referenceId, newCounter);
        }
    }

    setFact(fact: Fact) {
        const oldValue = this.facts.get(fact.referenceId);
        if (oldValue && oldValue.value !== fact.value) {
            console.log(`State-changed: ` + fact.referenceId + " from " + oldValue.value + " to " + fact.value);
        } else {
        }
        this.facts.set(fact.referenceId, fact);
    }

    updateVariableByName(name: string, value: number): void {
        const variable = this.variables.get(name);
        if (variable) {
            const factResult = DVariable.toFact(variable, value);
            if (factResult.isOk()) {
                const fact = factResult.value;
                this.facts.set(fact.referenceId, fact);
            }
        }
    }

    getVariableByName(name: string): Result<Fact> {
        const value = this.facts.get(name);
        return value ? Result.ok(value) : Result.failure("Could not find variable by that name.");
    }

    isMatched(condition: Condition) {
        const facts = [...this.facts.values()];
        const s = Condition.evaluate(condition, facts);
        return s;
    }
}
