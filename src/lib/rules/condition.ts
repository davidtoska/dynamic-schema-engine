import { Fact } from './fact';
import { DUtil } from '../utils/DUtil';
export type Condition =
  | Condition.String
  | Condition.Numeric
  | Condition.Complex;

export namespace Condition {
  export type StringOperator = 'eq' | 'not-eq' | 'longer-then' | 'shorter-then';

  export type NumericOperator =
    | 'eq'
    | 'not-eq'
    | 'greater-then'
    | 'less-then'
    | 'greater-then-inclusive'
    | 'less-then-inclusive';

  export interface Numeric {
    readonly factId: string;
    readonly factLabel: string;
    readonly valueLabel: string;
    readonly kind: 'numeric-condition';
    readonly operator: NumericOperator;
    readonly value: number;
  }
  export interface String {
    readonly factId: string;
    readonly factLabel: string;
    readonly valueLabel: string;
    readonly kind: 'string-condition';
    readonly operator: StringOperator;
    readonly value: string;
  }

  export interface Complex {
    readonly kind: 'complex-condition';
    readonly name: string;
    readonly all: ReadonlyArray<Condition.Simple>;
    readonly some: ReadonlyArray<Condition.Simple>;
  }

  export type Simple = Condition.String | Condition.Numeric;

  /**
   * An empty condition will evaluate to false,
   * @param condition: Condition.Any
   * @param facts
   */
  export const evaluate = (
    condition: Condition,
    facts: ReadonlyArray<Fact>
  ) => {
    let result: boolean = false;
    switch (condition.kind) {
      case 'string-condition':
        result = evaluateSimple(condition, facts);
        break;
      case 'numeric-condition':
        result = evaluateSimple(condition, facts);
        break;
      case 'complex-condition':
        result = evaluateComplex(condition, facts);
        break;
      default:
        const check: never = condition;
    }
    return result;
  };

  /**
   *
   * @param item
   * @param facts
   */
  const evaluateComplex = (
    condition: Condition.Complex,
    facts: ReadonlyArray<Fact>
  ): boolean => {
    if (condition.some.length === 0 && condition.all.length === 0) {
      return false;
    }
    const allSolved = condition.all.map((condition) => {
      return evaluateSimple(condition, facts);
    });

    const someEvaluated = condition.some.map((condition) => {
      return evaluateSimple(condition, facts);
    });
    const allResult = allSolved.every(DUtil.isTrue);
    const someResult =
      someEvaluated.length === 0 || someEvaluated.some(DUtil.isTrue);
    return someResult && allResult;
  };

  const evaluateSimple = (
    condition: Condition.Simple,
    facts: ReadonlyArray<Fact>
  ): boolean => {
    const fact = facts.find((f) => f.referenceId === condition.factId);
    if (!fact) {
      return false;
    }
    let res = false;
    switch (condition.kind) {
      case 'numeric-condition':
        if (fact.kind === 'numeric-fact') {
          res = evaluateNumeric(condition, fact.value);
        }
        break;
      case 'string-condition':
        if (fact.kind === 'string-fact') {
          res = evaluateString(condition, fact.value);
        }
        break;
      default:
        const check: never = condition;
    }
    return res;
  };

  export const isEmpty = (complex: Complex) => {
    return complex.all.length === 0 && complex.some.length === 0;
  };

  const evaluateString = (
    condition: Readonly<Condition.String>,
    value: string
  ): boolean => {
    const operator = condition.operator;
    let result = false;
    switch (operator) {
      case 'eq':
        result = condition.value === value;
        break;
      case 'not-eq':
        result = condition.value !== value;
        break;
      case 'shorter-then':
        result = condition.value !== value;
        break;
      case 'longer-then':
        result = condition.value !== value;
        break;
      default:
        const check: never = operator;
    }
    return result;
  };

  const evaluateNumeric = (condition: Numeric, value: number): boolean => {
    const op = condition.operator;
    const conditionValue = condition.value;
    let result = false;
    switch (op) {
      case 'eq':
        result = value === conditionValue;
        break;
      case 'not-eq':
        result = value !== conditionValue;
        break;
      case 'greater-then':
        result = value > conditionValue;
        break;
      case 'greater-then-inclusive':
        result = value >= conditionValue;
        break;
      case 'less-then':
        result = value < conditionValue;
        break;
      case 'less-then-inclusive':
        result = value <= conditionValue;
        break;
      default:
        const check: never = op;
    }
    return result;
  };
}
