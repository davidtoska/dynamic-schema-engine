import { Fact } from "./fact";
import { Rule } from "./rule";
import { PageQueCommand } from "../commands/DCommand";

export interface SolveResult<S, F> {
    matching: ReadonlyArray<Match<S, F>>;
    errors: ReadonlyArray<RuleEngineError>;
}

export interface Match<S, F> {
    readonly matchingRuleId: string;
    readonly ruleDescription: string;
    readonly actionList: ReadonlyArray<S> | ReadonlyArray<F>;
}

export interface RuleEngineError {
    readonly kind?: string;
    readonly message: string;
}

export class RuleEngine<S, F> {
    constructor() {}

    solveAll(rules: Rule<S, F>[], facts: Fact[]): SolveResult<S, F> {
        const errors: RuleEngineError[] = [];
        const matching: Match<S, F>[] = [];
        rules.forEach((rule) => {
            if (Rule.isEmpty(rule)) {
                errors.push({ message: "Empty rule: " + rule.id });
            } else if (Rule.solve(rule, facts)) {
                const match: Match<S, F> = {
                    ruleDescription: rule.description,
                    matchingRuleId: rule.id,
                    actionList: [...rule.onSuccess],
                };
                matching.push(match);
            }
        });
        return { matching, errors };
    }

    solve(rule: Rule<S, F>, facts: Fact[]): boolean {
        // TODO Validate, and Return result
        return Rule.solve(rule, facts);
    }
}
