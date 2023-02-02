import { Condition } from "./condition";
import { Fact } from "./fact";
import { DUtil } from "../utils/DUtil";

export interface Rule<OnSuccessAction, OnFailureAction> {
    readonly id: string;
    readonly description: string;
    readonly all: ReadonlyArray<Condition>;
    readonly some: ReadonlyArray<Condition>;
    readonly onSuccess: ReadonlyArray<OnSuccessAction>;
    readonly onFailure: ReadonlyArray<OnFailureAction>;
}

export namespace Rule {
    /**
     * Validates that the rule is valid.
     * @param rule
     */

    export const isEmpty = (rule: Rule<any, any>): boolean => {
        const emptyConditions = rule.all.length === 0 && rule.some.length === 0;
        const emptyActions = rule.onSuccess.length === 0 && rule.onFailure.length === 0;
        return emptyConditions || emptyActions;
    };

    export const solve = (rule: Rule<any, any>, facts: ReadonlyArray<Fact>): boolean => {
        if (rule.some.length === 0 && rule.all.length === 0) {
            // TODO RETURN WARNING? OR LOGGING ?
            return false;
        }

        const someSolved = rule.some.map((condition) => Condition.evaluate(condition, facts));

        const someResult = someSolved.length === 0 || someSolved.some(DUtil.isTrue);

        const allSolved = rule.all.map((condition) => Condition.evaluate(condition, facts)).every(DUtil.isTrue);

        return allSolved && someResult;
    };
}
