import { DUtil } from "./utils/DUtil";

export namespace ID {
  export type PageId = string & { __pageId: true };
  export const pageId = (): PageId => {
    return createId() as PageId;
  };

  export type VariableId = string & { __variableId: true };
  export const variableId = (): VariableId => {
    return createId() as VariableId;
  };

  export type ElementId = string & { __elementId: true };
  export const elementId = (): ElementId => {
    return createId() as ElementId;
  };

  export type RuleId = string & { __ruleId: true };

  export type RuleActionId = string & { __ruleActionId: true };
  export type ConditionId = string & { __conditionComplexId: true };

  export type TagId = string & { __tagId: true };
  export type QuestionId = string & { __questionId: true };
  export const questionId = (): QuestionId => {
    return createId() as QuestionId;
  };

  export const ruleId = (): RuleId => {
    return createId() as RuleId;
  };

  export const tagId = (): TagId => {
    return createId() as TagId;
  };

  const createId = () => {
    return DUtil.randomString(50);
  };
}
