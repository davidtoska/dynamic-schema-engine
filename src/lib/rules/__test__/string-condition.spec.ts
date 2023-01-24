import { Condition } from '../condition';
import { Fact } from '../fact';

const helloWorldString = 'hello-world';
const eqHelloWorld: Condition.String = {
  operator: 'eq',
  factId: 'not-important',
  value: helloWorldString,
  kind: 'string-condition',
  factLabel: 'fact-label',
  valueLabel: 'value-label',
};

const strFact = (str: string): [Fact.String] => [
  {
    kind: 'string-fact',
    value: str,
    label: 'asdf',
    referenceId: 'not-important',
    referenceLabel: 'not-important-label',
  },
  // Fact.string('not-important', 'var-label-' + str, str, 'value-label-' + str),
];
const notEqHelloWorld: Condition.String = {
  ...eqHelloWorld,
  operator: 'not-eq',
};

describe('string-conditions test-suite', () => {
  // beforeEach(() => {});

  it('string eq works', () => {
    expect(Condition.evaluate(eqHelloWorld, strFact(helloWorldString))).toBe(
      true
    );
    expect(Condition.evaluate(eqHelloWorld, strFact('not-hello-world'))).toBe(
      false
    );
  });

  it('string not-eq works', () => {
    expect(Condition.evaluate(eqHelloWorld, strFact('not-hello-world'))).toBe(
      false
    );
    expect(Condition.evaluate(eqHelloWorld, strFact(helloWorldString))).toBe(
      true
    );
  });
});
