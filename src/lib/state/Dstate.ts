import { Fact } from "../rules/fact";
import { Condition } from "../rules/condition";
import { DEvent } from "../events/DEvents";
import { StateCommand } from "../commands/DCommand";

export namespace DState {
    interface PropDefinition<TypeName, Type extends string | number> {
        readonly _type: TypeName;
        readonly propName: string;
        readonly propDescription: string;
        readonly initialValue?: Type;
        readonly options?: ReadonlyArray<PropValue<Type>>;
    }

    export type NumericProp = PropDefinition<"number", number>;
    export type StringProp = PropDefinition<"string", string>;

    export interface fromEventHandler {
        readonly onEvent: DEvent["kind"];
        readonly thenExecute: ReadonlyArray<StateCommand>;
    }

    export interface PropValue<T> {
        readonly value: T;
        readonly valueLabel: string;
    }
    export type Prop = NumericProp | StringProp;

    export interface SetStringMutation {
        readonly kind: "set-string";
        readonly propName: string;
        readonly value: string;
    }

    export interface IncrementNumberMutation {
        readonly kind: "increment-number";
        readonly propName: string;
        readonly stepSize: number;
        readonly ifNotExistThenSetTo: number;
    }
    export interface DecrementNumberMutation {
        readonly kind: "decrement-number";
        readonly propName: string;
        readonly stepSize: number;
        readonly ifNotExistThenSetTo: number;
    }

    export interface SetNumberMutation {
        readonly kind: "set-number";
        readonly propName: string;
        readonly value: number;
    }
    export type NumberMutations = IncrementNumberMutation | DecrementNumberMutation | SetNumberMutation;

    export type StateMutation = SetStringMutation | NumberMutations;

    export const isNumberMutation = (mutations: StateMutation): mutations is NumberMutations => {
        if (!mutations) {
            return false;
        }

        return (
            mutations.kind === "set-number" ||
            mutations.kind === "decrement-number" ||
            mutations.kind === "increment-number"
        );
    };

    export const isStringMutation = (mutation: StateMutation): mutation is SetStringMutation => {
        return mutation && mutation.kind === "set-string";
    };

    export interface StateQuery {
        readonly name: string;
        readonly condition: Condition;
    }

    export interface StateQueryResult {
        readonly queryName: string;
        readonly prev: boolean;
        readonly curr: boolean;
    }

    export const numericPropToFact = (prop: NumericProp, value: number) => {
        const fact: Fact.Numeric = {
            kind: "numeric-fact",
            referenceId: prop.propName,
            referenceLabel: prop.propDescription ?? " [STATE_PROPERTY] : " + prop.propName,
            value,
            label: " [VALUE] : " + value,
        };
        return fact;
    };

    export const stringPropToFact = (prop: StringProp, value: string) => {
        const fact: Fact.String = {
            kind: "string-fact",
            referenceId: prop.propName,
            referenceLabel: " [STATE_PROPERTY] : " + prop.propName,
            value,
            label: " [VALUE] : " + value,
        };
        return fact;
    };
}
