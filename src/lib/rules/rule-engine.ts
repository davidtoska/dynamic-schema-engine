import { Fact } from "./fact";
import { Rule } from "./rule";
import { PageQueCommand } from "../events-and-actions/DCommand";
import { DVariable } from "./Dvariable";

export interface SolveResult {
    matching: ReadonlyArray<Match>;
    errors: ReadonlyArray<RuleEngineError>;
}

export interface Match {
    readonly matchingRuleId: string;
    readonly ruleDescription: string;
    readonly actionList: ReadonlyArray<PageQueCommand>;
}

export interface RuleEngineError {
    readonly kind?: string;
    readonly message: string;
}

export class RuleEngine {
    constructor() {}

    solveAll(rules: Rule[], facts: Fact[]): SolveResult {
        const errors: RuleEngineError[] = [];
        const matching: Match[] = [];
        rules.forEach((rule) => {
            if (Rule.isEmpty(rule)) {
                errors.push({ message: "Empty rule: " + rule.id });
            } else if (Rule.solve(rule, facts)) {
                const match: Match = {
                    ruleDescription: rule.description,
                    matchingRuleId: rule.id,
                    actionList: [...rule.actions],
                };
                matching.push(match);
            }
        });
        return { matching, errors };
    }

    solve(rule: Rule, facts: Fact[]): boolean {
        // TODO Validate, and Return result
        return Rule.solve(rule, facts);
    }
}
