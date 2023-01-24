import { Condition } from '../condition';
import { Fact } from '../fact';
const numFact = (n: number): [Fact.Numeric] => [
  {
    kind: 'numeric-fact',
    value: n,
    label: 'Label-for ' + n,
    referenceId: 'test-fact',
    referenceLabel: 'test-fact-label',
  },
];
const eq0: Condition.Numeric = {
  kind: 'numeric-condition',
  factId: 'test-fact',
  operator: 'eq',
  value: 0,
  factLabel: 'fact-label',
  valueLabel: 'value-label',
};

const notEq0: Condition.Numeric = {
  ...eq0,
  operator: 'not-eq',
};

const lessThen0: Condition.Numeric = {
  ...eq0,
  operator: 'less-then',
};

const greaterThen0: Condition.Numeric = {
  ...eq0,
  operator: 'greater-then',
};
const greaterThen0Inclusive: Condition.Numeric = {
  ...eq0,
  operator: 'greater-then-inclusive',
};

const lessThen0Inclusive: Condition.Numeric = {
  ...eq0,
  operator: 'less-then-inclusive',
};

describe('Numeric conditions', () => {
  // beforeEach(() => {});

  it('eq works', () => {
    const equals = Condition.evaluate(eq0, numFact(0));
    const notEquals = Condition.evaluate(eq0, numFact(1));
    expect(equals).toBe(true);
    expect(notEquals).toBe(false);
  });

  it('not-eq works', () => {
    expect(Condition.evaluate(notEq0, numFact(1))).toBe(true);
    expect(Condition.evaluate(notEq0, numFact(-1))).toBe(true);
    expect(Condition.evaluate(notEq0, numFact(0))).toBe(false);
  });

  it('less than works', () => {
    expect(Condition.evaluate(lessThen0, numFact(-1))).toBe(true);
    expect(Condition.evaluate(lessThen0, numFact(0))).toBe(false);
    expect(Condition.evaluate(lessThen0, numFact(1))).toBe(false);
  });

  it('less than inclusive works', () => {
    expect(Condition.evaluate(lessThen0Inclusive, numFact(-1))).toBe(true);
    expect(Condition.evaluate(lessThen0Inclusive, numFact(0))).toBe(true);
    expect(Condition.evaluate(lessThen0Inclusive, numFact(1))).toBe(false);
  });

  it('greater than works', () => {
    expect(Condition.evaluate(greaterThen0, numFact(-1))).toBe(false);
    expect(Condition.evaluate(greaterThen0, numFact(0))).toBe(false);
    expect(Condition.evaluate(greaterThen0, numFact(1))).toBe(true);
  });

  it('greater than inclusive works', () => {
    expect(Condition.evaluate(greaterThen0Inclusive, numFact(-1))).toBe(false);
    expect(Condition.evaluate(greaterThen0Inclusive, numFact(0))).toBe(true);
    expect(Condition.evaluate(greaterThen0Inclusive, numFact(1))).toBe(true);
  });
});
