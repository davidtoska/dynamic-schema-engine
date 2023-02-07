import { RuleEngine } from "../rule-engine";
import { Rule } from "../rule";
import { Fact } from "../fact";
import { Condition } from "../condition";
import { PageQueCommand } from "../../commands/DCommand";
import {ID} from "../../Delement/ID";

const excludeById = (ids: ID.PageId[]): PageQueCommand => {
    return {
        kind: "PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND",
        target: "PAGE_QUE",
        targetId: "PAGE_QUE",
        payload: { pageIds: ids },
    };
};

const excludeByTag = (id: string): PageQueCommand => ({
    kind: "PAGE_QUE_EXCLUDE_BY_TAG_COMMAND",
    target: "PAGE_QUE",
    targetId: "PAGE_QUE",
    payload: { tagIds: [id] },
});

let engine = new RuleEngine();
// const x = 'x';
// const y = 'y';

const xIs = (value: number): Fact.Numeric => ({
    referenceId: "x",
    referenceLabel: "x-label",
    label: "value-label x",
    value,
    kind: "numeric-fact",
});

const yIs = (value: number): Fact.Numeric => ({
    kind: "numeric-fact",
    referenceId: "y",
    referenceLabel: "y-label",
    label: "var-label y",
    // valueLabel: 'value-label y',
    value,
});

const xCondition = (operator: Condition.NumericOperator, value: number): Condition.Numeric => ({
    kind: "numeric-condition",
    referenceId: "x",
    referenceLabel: "",
    operator,
    value,
    valueLabel: "",
});

const trueIf_0_conditions: Condition.Numeric[] = [
    xCondition("eq", 0),
    xCondition("not-eq", 2),
    xCondition("less-then", 1),
    xCondition("less-then-inclusive", 0),
    xCondition("greater-then", -1),
    xCondition("greater-then-inclusive", 0),
];

const falseIf_0_conditions: Condition.Numeric[] = [
    xCondition("eq", 10),
    xCondition("not-eq", 0),
    xCondition("less-then", -5),
    xCondition("less-then-inclusive", -1),
    xCondition("greater-then", 0),
    xCondition("greater-then-inclusive", 1),
];

const trueIf_0_simple: Condition.Complex[] = [
    {
        kind: "complex-condition",
        name: "test-name",
        all: [...trueIf_0_conditions],
        some: [...trueIf_0_conditions, ...falseIf_0_conditions],
    },
];

const falseIf_0_simple: Condition.Complex[] = [
    {
        kind: "complex-condition",
        name: "test-name",
        all: [...trueIf_0_conditions, ...falseIf_0_conditions],
        some: [...falseIf_0_conditions],
    },
];

describe("Rule-engine spec", () => {
    beforeEach(() => {
        engine = new RuleEngine();
    });

    it("Empty rule => one error, no actions", () => {
        const rule: Rule<any, any> = {
            id: "id123",
            description: "",
            some: [],
            all: [],
            onFailure: [],
            onSuccess: [],
        };
        const result = engine.solveAll([rule], []);
        expect(result.matching.length).toBe(0);
        expect(result.errors.length).toBe(1);
    });

    it("Empty facts => no actions, no errors.", () => {
        const hideAs1 = excludeById(["as1" as ID.PageId]);
        const rule: Rule<any, any> = {
            id: "id123",
            description: "",
            some: [],
            all: [...trueIf_0_conditions],
            onFailure: [],
            onSuccess: [hideAs1],
        };
        const facts = [yIs(1)];
        const rules = [rule];
        // engine.addRule(rule);
        // engine.addFact(yIs(1)); // X is now missing.
        const result = engine.solveAll(rules, facts);

        expect(result.matching.length).toBe(0);
        expect(result.errors.length).toBe(0);
    });

    it("and-rule 0=0 true -> 2 Actions in ruleMatch", () => {
        const rule: Rule<any, any> = {
            id: "id123",
            description: "",
            some: [],
            all: [...trueIf_0_conditions],
            onFailure: [],
            onSuccess: [excludeById(["as3" as ID.PageId, "as6" as ID.PageId])],
        };
        const f1 = xIs(0);
        const rules = [rule];
        const result = engine.solveAll(rules, [f1]);
        const firstMatch = result.matching[0];
        expect(firstMatch.actionList.length).toBe(1);
        expect(result.matching.length).toBe(1);
        expect(result.errors.length).toBe(0);
    });

    it("and-rule 0=1 false", () => {
        const facts = [xIs(1)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [],
            all: [xCondition("eq", 0)],
            onFailure: [],
            onSuccess: [excludeById(["abx" as ID.PageId, "dfg" as ID.PageId])],
        };
        expect(engine.solve(rule, facts)).toEqual(false);
        const results = engine.solveAll([rule], facts);
        expect(results.matching.length).toBe(0);
        expect(results.errors.length).toBe(0);
    });

    it("One true some-rule gives true", () => {
        const facts = [xIs(6)];
        const rule: Rule<any, any> = {
            id: "id123",
            description: "",
            some: [xCondition("eq", 6)],
            all: [],
            onFailure: [],
            onSuccess: [excludeById(["abcf" as ID.PageId])],
        };
        expect(engine.solve(rule, facts)).toBe(true);
        const result = engine.solveAll([rule], facts);
        expect(result.matching.length).toBe(1);
    });

    it("One false some-rule gives false", () => {
        const facts = [xIs(6)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [xCondition("eq", 5)],
            all: [],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, facts)).toBe(false);
    });

    it("All true all-rules, and one true some-rule -> true", () => {
        const facts = [xIs(9)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [xCondition("eq", 5), xCondition("greater-then", 3)],
            all: [xCondition("greater-then", 5), xCondition("eq", 9)],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, facts)).toBe(true);
    });

    it("Can solve complex rule [some-2 -> true]", () => {
        const facts = [xIs(9)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [
                {
                    kind: "complex-condition",
                    name: "test-name",
                    all: [],
                    some: [xCondition("eq", 5), xCondition("greater-then", 3)],
                },
            ],
            all: [],
            onFailure: [],
            onSuccess: [excludeByTag("asdf")],
        };
        expect(engine.solve(rule, facts)).toBe(true);
        const result = engine.solveAll([rule], facts);
        expect(result.matching.length).toBe(1);
    });
    it("Can solve complex rule [some-1 -> false]", () => {
        const facts = [xIs(0)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [
                {
                    kind: "complex-condition",
                    name: "test-name",
                    all: [],
                    some: [xCondition("eq", 5)],
                },
            ],
            all: [],
            onFailure: [],
            onSuccess: [excludeByTag("xbj")],
        };
        expect(engine.solve(rule, facts)).toBe(false);
        const result = engine.solveAll([rule], facts);
        expect(result.matching.length).toBe(0);
        expect(result.errors.length).toBe(0);
    });

    it("Can solve complex rule [some-1-true -> true]", () => {
        const facts = [xIs(0)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [
                {
                    kind: "complex-condition",
                    name: "test-name",
                    all: [],
                    some: [xCondition("greater-then", -5)],
                },
            ],
            all: [],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, facts)).toBe(true);
    });

    it("Empty some (nested) returns false (not valid condition)", () => {
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [
                {
                    kind: "complex-condition",
                    name: "test-name",
                    all: [],
                    some: [],
                },
            ],
            all: [],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, [])).toBe(false);
    });

    it("Empty complex -> false", () => {
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [],
            all: [],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, [])).toBe(false);
    });

    it("Complex all 6 true conditions -> true", () => {
        const facts = [xIs(0)];
        const action = excludeById(["as1" as ID.PageId]);
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [...falseIf_0_simple, ...trueIf_0_simple],
            all: [...trueIf_0_conditions, ...trueIf_0_simple],
            onFailure: [],
            onSuccess: [action],
        };
        // CAN SOLVE
        expect(engine.solve(rule, facts)).toBe(true);
        // engine.addRule(rule);
        // expect(engine.getRules().length).toBe(1);

        // const lastAction = engine.actionState?.lastAction as HidePageAction;
        // expect(lastAction?.pageId).toBe('as1');
    });

    it("True some, but false all -> true", () => {
        const facts = [xIs(0)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [...falseIf_0_simple, ...trueIf_0_simple],
            all: [...trueIf_0_conditions, ...trueIf_0_simple, ...falseIf_0_simple],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, facts)).toBe(false);
    });

    it("Empty some && true all -> true", () => {
        const facts = [xIs(0)];
        const rule: Rule<any, any> = {
            id: "id123",

            description: "",
            some: [],
            all: [...trueIf_0_conditions, ...trueIf_0_simple],
            onFailure: [],
            onSuccess: [],
        };
        expect(engine.solve(rule, facts)).toBe(true);
    });
});
