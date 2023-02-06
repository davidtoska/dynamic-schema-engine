import { DState } from "./Dstate";
import { Condition } from "../rules/condition";
import { StateCommand } from "../commands/DCommand";

export class BooleanStateProperty<PropName extends string> {
    readonly propName: PropName;
    private static readonly TRUE = { value: 1, label: "TRUE" };
    private static readonly FALSE = { value: 0, label: "FALSE" };
    readonly propDefinition: DState.NumericProp;

    get isTrueCondition(): Condition.Numeric {
        return {
            kind: "numeric-condition",
            referenceId: this.propName,
            referenceLabel: this.propName + "[ BOOLEAN ]",
            valueLabel: BooleanStateProperty.TRUE.label,
            value: BooleanStateProperty.TRUE.value,
            operator: "eq",
        };
    }
    get isFalseCondition(): Condition.Numeric {
        return {
            kind: "numeric-condition",
            referenceId: this.propName,
            referenceLabel: this.propName + "[ BOOLEAN ]",
            valueLabel: BooleanStateProperty.FALSE.label,
            value: BooleanStateProperty.FALSE.value,
            operator: "eq",
        };
    }

    get setTrueCommand(): StateCommand {
        return {
            kind: "STATE_MUTATE_COMMAND",
            target: "STATE",
            targetId: "STATE",
            payload: {
                mutation: { propName: this.propName, kind: "set-number", value: 1 },
            },
        };
    }

    get setFalseCommand(): StateCommand {
        return {
            kind: "STATE_MUTATE_COMMAND",
            target: "STATE",
            targetId: "STATE",
            payload: {
                mutation: { propName: this.propName, kind: "set-number", value: 0 },
            },
        };
    }

    constructor(propName: PropName, private readonly initialValue: boolean) {
        this.propName = propName;
        const initial = initialValue ? 1 : 0;
        this.propDefinition = {
            propDescription: "DESCRIPTION for: " + propName,
            propName: propName,
            initialValue: initial,
            options: [
                { value: BooleanStateProperty.FALSE.value, valueLabel: BooleanStateProperty.FALSE.label },
                { value: BooleanStateProperty.TRUE.value, valueLabel: BooleanStateProperty.TRUE.label },
            ],
            _type: "number",
        };
    }
}
