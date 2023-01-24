import { Condition } from '../condition';
describe('Rule validations', () => {
  // beforeEach(() => {
  // });

  it('isCondition -> true', () => {
    const d: Condition.Complex = {
      kind: 'complex-condition',
      name: 'test-name',
      all: [],
      some: [],
    };
    expect(Condition.isEmpty(d)).toBe(true);
  });
});
