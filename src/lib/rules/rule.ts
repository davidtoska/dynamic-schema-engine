import { Condition } from "./condition";
import { Fact } from "./fact";
import { DUtil } from "../utils/DUtil";
import { RuleCommand } from "../events-and-actions/DCommand";

export interface Rule {
  readonly id: string;
  readonly description: string;
  readonly all: ReadonlyArray<Condition>;
  readonly some: ReadonlyArray<Condition>;
  readonly actions: ReadonlyArray<RuleCommand>;
}

export namespace Rule {
  export const createEmpty = (id: string): Rule => {
    const newRule: Rule = {
      actions: [],
      all: [],
      description: "Describe this rule ",
      id,
      // label: 'Add a label',
      some: [],
    };
    return newRule;
  };

  /**
   * Validates that the rule is valid.
   * @param rule
   */

  export const isEmpty = (rule: Rule): boolean => {
    const emptyConditions = rule.all.length === 0 && rule.some.length === 0;
    const emptyActions = rule.actions.length === 0;
    return emptyConditions || emptyActions;
  };

  export const solve = (rule: Rule, facts: ReadonlyArray<Fact>): boolean => {
    if (rule.some.length === 0 && rule.all.length === 0) {
      return false;
    }

    const someSolved = rule.some.map((condition) =>
      Condition.evaluate(condition, facts)
    );

    const someResult = someSolved.length === 0 || someSolved.some(DUtil.isTrue);

    const allSolved = rule.all
      .map((condition) => Condition.evaluate(condition, facts))
      .every(DUtil.isTrue);

    return allSolved && someResult;
  };
}
