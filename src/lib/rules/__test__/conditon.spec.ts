import { Condition } from '../condition';
import { Fact } from '../fact';

const xEqCondition = (value: number): Condition.Numeric => {
  const numericCondition: Condition.Numeric = {
    kind: 'numeric-condition',
    value,
    valueLabel: 'value-label',
    operator: 'eq',
    factId: 'x',
    factLabel: 'fact-label',
  };
  return numericCondition;
};
const exq1: Fact.Numeric = {
  label: '',
  referenceId: 'x',
  referenceLabel: 'x-label',
  value: 1,
  kind: 'numeric-fact',
};

const exq2: Fact.Numeric = {
  label: '',
  referenceId: 'x',
  referenceLabel: 'x-label',
  value: 2,
  kind: 'numeric-fact',
};
const f = {
  xeq1: exq1,
  xeq2: exq2,
} as const;
const con = {
  xeq1: xEqCondition(1),
  xeq2: xEqCondition(2),
  xeq3: xEqCondition(3),
} as const;

const complex = (
  all: Condition.Simple[],
  some: Condition.Simple[]
): Condition.Complex => ({
  kind: 'complex-condition',
  all,
  some,
  name: 'test-name',
});

const validNumericCondition: Condition.Numeric = {
  kind: 'numeric-condition',
  value: 1,
  factId: 'x',
  factLabel: 'fact-label',
  valueLabel: 'value-label',
  operator: 'not-eq',
};

const inValidFactId: Condition.Numeric = {
  kind: 'numeric-condition',
  value: 1,
  factId: '',
  factLabel: 'fact-label',
  valueLabel: 'value-label',
  operator: 'not-eq',
};

const undefinedCondition = undefined as unknown as Condition;

const validStringCondition: Condition.String = {
  kind: 'string-condition',
  value: 'hello',
  factId: 'asdf',
  factLabel: 'fact-label',
  valueLabel: 'value-label',
  operator: 'not-eq',
};

describe('condition validation', () => {
  it('empty condition will always be false', () => {
    expect(Condition.evaluate(complex([], []), [f.xeq1])).toBe(false);
  });
});

describe('condition evaluation', () => {
  it('If 1 in some is true -> true', () => {
    const all: Condition.Simple[] = [];
    const some: Condition.Simple[] = [con.xeq1, con.xeq3];
    const facts: Fact[] = [f.xeq1];
    expect(Condition.evaluate(complex(all, some), facts)).toBe(true);
  });
  it('If not all is true (empty some) -> false', () => {
    const all: Condition.Simple[] = [con.xeq1, con.xeq3];
    const some: Condition.Simple[] = [];
    const facts: Fact[] = [f.xeq1];
    expect(Condition.evaluate(complex(all, some), facts)).toBe(false);
  });

  it('If not all is true (non empty some) -> false', () => {
    const all: Condition.Simple[] = [con.xeq1, con.xeq3];
    const some: Condition.Simple[] = [con.xeq3];
    const facts: Fact[] = [f.xeq1];
    expect(Condition.evaluate(complex(all, some), facts)).toBe(false);
  });

  it('If not all is true (non empty some) -> false', () => {
    const all: Condition.Simple[] = [con.xeq1, con.xeq3];
    const some: Condition.Simple[] = [con.xeq3];
    const facts: Fact[] = [f.xeq1];
    expect(Condition.evaluate(complex(all, some), facts)).toBe(false);
  });
});
