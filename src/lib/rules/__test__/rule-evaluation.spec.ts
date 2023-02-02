import { Rule } from "../rule";
import { Fact } from "../fact";
import { Condition } from "../condition";

const xIs = (value: number): Fact.Numeric => ({
    referenceId: "x",
    referenceLabel: "x-label",
    label: "label for x",
    value,
    kind: "numeric-fact",
});

const yIs = (value: number): Fact.Numeric => ({
    kind: "numeric-fact",
    referenceId: "y",
    referenceLabel: "y-label",
    label: "value-label-y",
    // valueLabel: 'value-label-y',
    value,
});

const conditionFactory =
    (factId: string) =>
    (op: Condition.NumericOperator) =>
    (value: number): Condition.Numeric => ({
        kind: "numeric-condition",
        referenceId: factId,
        operator: op,
        value,
        referenceLabel: "fact-label",
        valueLabel: "value-label",
    });

// Conditon helpers
const xConditionFactory = conditionFactory("x");
const xEq = xConditionFactory("eq");
const xLessThan = xConditionFactory("less-then");
const xGreaterThan = xConditionFactory("greater-then");

const yConditionFactory = conditionFactory("y");
const yEq = yConditionFactory("eq");
const yLessThan = yConditionFactory("less-then");
const yGreaterThan = yConditionFactory("greater-then");

const con = {
    xEq,
    xLessThan,
    xGreaterThan,
    yEq,
    yLessThan,
    yGreaterThan,
} as const;

const complex = (all: ReadonlyArray<Condition.Simple>, some: ReadonlyArray<Condition.Simple>): Condition.Complex => ({
    name: "test-name",
    kind: "complex-condition",
    all,
    some,
});

const createRule = (all: ReadonlyArray<Condition>, some: ReadonlyArray<Condition>): Rule<any, any> => {
    const rule: Rule<any, any> = {
        id: "xyz",
        description: "",
        some,
        all,
        onSuccess: [],
        onFailure: [],
    };
    return rule;
};

describe("Rule-evaluation works", () => {
    it("A empty rule is not valid, and will always return false", () => {
        expect(Rule.solve(createRule([], []), [])).toBe(false);
    });

    it("One all condition is true => true", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(0)];
        const some: ReadonlyArray<Condition> = [];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toEqual(true);
    });

    it("one some condition is true => true", () => {
        const all: ReadonlyArray<Condition> = [];
        const some: ReadonlyArray<Condition> = [con.xEq(0)];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toEqual(true);
    });

    it("one some condition is true, but all condition is false => false", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(6)];
        const some: ReadonlyArray<Condition> = [con.xEq(0)];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toEqual(false);
    });

    it("some is empty, and all is not all true => false", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(6), con.xEq(0)];
        const some: ReadonlyArray<Condition> = [];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toEqual(false);
    });

    it("some is false, and all is not all true => false", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(6), con.xEq(0)];
        const some: ReadonlyArray<Condition> = [con.xLessThan(-2)];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toEqual(false);
    });
    it("If one all-condition is true -> true", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(0)];
        const some: ReadonlyArray<Condition> = [];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toBe(true);
    });

    it("All all-condition is true, and some is empty -> true", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(0), con.xLessThan(8), con.xGreaterThan(-1)];
        const some: ReadonlyArray<Condition> = [];
        const facts: ReadonlyArray<Fact> = [xIs(0)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toBe(true);
    });

    it("All all-condition is true, and none in some is true -> false", () => {
        const all: ReadonlyArray<Condition> = [con.xEq(0), con.xLessThan(8), con.xGreaterThan(-1), con.yEq(9)];
        const some: ReadonlyArray<Condition> = [con.yLessThan(9)];
        const facts: ReadonlyArray<Fact> = [xIs(0), yIs(9)];
        const rule = createRule(all, some);
        expect(Rule.solve(rule, facts)).toBe(false);
    });
});
