import { DState } from "./Dstate";
import { Condition } from "../rules/condition";
import { Fact } from "../rules/fact";
import { Ok } from "../common/result";
import { StateService } from "./state-service";
import { _P, _Q } from "./state-testing-helpers";
import { EventBus } from "../events/event-bus";
import { DCommandBus } from "../commands/DCommandBus";
import { StateCommand } from "../commands/DCommand";

let eventBus = new EventBus();
let commandBus = new DCommandBus();
let stateContainer = new StateService(eventBus, commandBus, [], []);
const allVariables = Object.values(_P).map((p) => p.propDefinition);
const allDerived = Object.values(_Q);

const createCommand = (mutation: DState.StateMutation): StateCommand => {
    return { kind: "STATE_MUTATE_COMMAND", target: "STATE", targetId: "STATE", payload: { mutation } };
};

describe("State-container", () => {
    beforeEach(() => {
        eventBus = new EventBus();
        stateContainer = new StateService(eventBus, commandBus, allVariables, allDerived);
    });

    it("can add variables, and update", () => {
        stateContainer = new StateService(eventBus, commandBus, [_P.propA.propDefinition]);

        commandBus.emit(_P.propA.setFalseCommand);
        const result = stateContainer.getPropAsFact(_P.propA.propName);
        expect(result.isOk()).toBe(true);

        // expect(result.errors.length).toBe(1);
    });

    it("can not update non-excisting variable", () => {
        const p = _P.propB;
        stateContainer = new StateService(eventBus, commandBus, [p.propDefinition]);
        const invalidName = "invalid-variable-name";
        commandBus.emit({
            kind: "STATE_MUTATE_COMMAND",
            target: "STATE",
            targetId: "STATE",
            payload: { mutation: { kind: "set-number", value: 1, propName: invalidName } },
        });
        const result0 = stateContainer.getPropAsFact(invalidName);
        expect(result0.isOk()).toBe(false);
    });
    it("can solve condition, and initial value is false.: ", () => {
        const p = _P.propD;
        expect(stateContainer.isMatched(p.isTrueCondition)).toBe(false);
        expect(stateContainer.isMatched(p.isFalseCondition)).toBe(true);
    });

    it("Solve will change after update: ", () => {
        expect(stateContainer.isMatched(_P.propA.isFalseCondition)).toBe(true);
        commandBus.emit(_P.propA.setTrueCommand);
        expect(stateContainer.isMatched(_P.propA.isFalseCondition)).toBe(false);
    });

    it("Can also add audio-played count facts, and get results. ", () => {
        const variable: DState.NumericProp = {
            _type: "number",
            propName: "audio-play-count-audio-1",
            propDescription: "Number of times audio 1 has played through.",
        };
        stateContainer = new StateService(eventBus, commandBus, [variable]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: variable.propName,
            referenceLabel: variable.propDescription ?? "",
            valueLabel: "Audio played at least 1 time.",
            value: 0,
            operator: "greater-then",
        };

        expect(stateContainer.isMatched(condition)).toBe(false);

        const command = createCommand({
            propName: variable.propName,
            kind: "increment-number",
            stepSize: 1,
            ifNotExistThenSetTo: 1,
        });
        commandBus.emit(command);
        // expect(res.success).toBe(true);
        // expect(stateContainer.isMatched(condition)).toBe(true);
        expect(stateContainer.isMatched(condition)).toBe(true);
    });

    it("Can create and update properties in state", () => {
        const numProp1: DState.NumericProp = { _type: "number", propName: "numProp1", propDescription: "" };
        const stringProp1: DState.StringProp = {
            _type: "string",
            propName: "stringProp1",
            initialValue: "initial",
            propDescription: "",
        };
        const stringProp2: DState.StringProp = { _type: "string", propName: "stringProp2", propDescription: "" };
        const numericProp2: DState.NumericProp = {
            _type: "number",
            propName: "numProp2",
            initialValue: 100,
            propDescription: "",
        };
        stateContainer = new StateService(eventBus, commandBus, [numProp1, stringProp1, numericProp2, stringProp2]);

        commandBus.emit(
            createCommand({
                propName: numProp1.propName,
                kind: "increment-number",
                stepSize: 1,
                ifNotExistThenSetTo: 1,
            })
        );
        const resultIntialString = stateContainer.getPropAsFact(stringProp1.propName) as Ok<Fact.String>;
        const resultIntialStringEmpty = stateContainer.getPropAsFact(stringProp2.propName);

        expect(resultIntialStringEmpty.isFailure()).toBe(true);
        expect(resultIntialString.value.value).toBe(stringProp1.initialValue);
        const result1 = stateContainer.getPropAsFact(numProp1.propName) as Ok<Fact.Numeric>;
        expect(result1.value.value).toBe(1);
        commandBus.emit(createCommand({ propName: numProp1.propName, kind: "set-number", value: 10 }));
        const result10 = stateContainer.getPropAsFact(numProp1.propName) as Ok<Fact.Numeric>;
        expect(result10.value.value).toBe(10);

        // NUMPROP2
        const numProp2InitialResult = stateContainer.getPropAsFact(numericProp2.propName) as Ok<Fact.Numeric>;
        expect(numProp2InitialResult.value.value).toBe(100);
        commandBus.emit(
            createCommand({
                propName: numericProp2.propName,
                kind: "decrement-number",
                stepSize: 10,
                ifNotExistThenSetTo: 1,
            })
        );
        const numProp2Res90 = stateContainer.getPropAsFact(numericProp2.propName) as Ok<Fact.Numeric>;
        expect(numProp2Res90.value.value).toBe(90);

        commandBus.emit(createCommand({ propName: stringProp1.propName, kind: "set-string", value: "updated-value" }));
        const stringResUpdated = stateContainer.getPropAsFact(stringProp1.propName) as Ok<Fact.String>;
        expect(stringResUpdated.value.value).toBe("updated-value");
    });

    it("Can have a counter variable in state. ", () => {
        stateContainer = new StateService(eventBus, commandBus, [
            { _type: "number", propDescription: "", propName: "page-count", initialValue: 0 },
        ]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: "page-count",
            referenceLabel: "Number of pages seen today",
            valueLabel: "Audio played at least 1 time.",
            value: 10,
            operator: "eq",
        };

        expect(stateContainer.isMatched(condition)).toBe(false);
        commandBus.emit(
            createCommand({
                propName: condition.referenceId,
                kind: "increment-number",
                stepSize: 1,
                ifNotExistThenSetTo: 1,
            })
        );
        commandBus.emit(
            createCommand({
                propName: condition.referenceId,
                kind: "increment-number",
                stepSize: 5,
                ifNotExistThenSetTo: 5,
            })
        );
        commandBus.emit(
            createCommand({
                propName: condition.referenceId,
                kind: "increment-number",
                stepSize: 4,
                ifNotExistThenSetTo: 4,
            })
        );
        expect(stateContainer.isMatched(condition)).toBe(true);
    });

    it("Can get state-schema:", () => {
        const s = stateContainer.getState();

        expect(s.propCount).toBe(7);
        expect(s.state[_P.propA.propName]).toBe(0);
        expect(s.propArray.find((p) => p.propName === "not-defined")).toBe(undefined);
        expect(s.propArray.find((p) => p.propName === _P.propB.propName)).toBeDefined();
    });

    it("Check that condition can be matched:", () => {
        const simpleFn = (refId: string): Condition.Simple => {
            if (Math.random() < 0.5) {
                return {
                    kind: "string-condition",
                    referenceId: refId,
                    referenceLabel: "label for " + refId,
                    value: "dummy value",
                    operator: "not-eq",
                    valueLabel: "Is False",
                };
            } else {
                return {
                    kind: "numeric-condition",
                    referenceId: refId,
                    referenceLabel: "Label for " + refId,
                    value: 0,
                    operator: "not-eq",
                    valueLabel: "Is False",
                };
            }
        };

        const complex = (all: Condition.Simple[], some: Condition.Simple[]): Condition.Complex => {
            return { kind: "complex-condition", name: "", all, some };
        };
        const a = _P.propA;
        const b = _P.propB;
        const c = _P.propC;

        expect(stateContainer.canBeMatched(simpleFn(a.propName))).toBe(true);
        expect(stateContainer.canBeMatched(simpleFn("invalid"))).toBe(false);
        expect(
            stateContainer.canBeMatched(complex([simpleFn(a.propName), simpleFn(b.propName)], [simpleFn(c.propName)]))
        ).toBe(true);
    });

    it("Can mutate state TODO!! Query", () => {
        const { propA, propB, propC } = _P;
        const s0 = stateContainer.getState();

        expect(s0.propNames.length).toBe(7);
        expect(s0.propCount).toBe(7);
        expect(s0.propArray.length).toBe(6);

        expect(s0.state[propA.propName]).toBe(0);
        commandBus.emit(propA.setTrueCommand);
        commandBus.emit(propB.setTrueCommand);
        const s1 = stateContainer.getState();
        expect(s1.state[propA.propName]).toBe(1);
        commandBus.emit(propA.setFalseCommand);

        commandBus.emit(propB.setFalseCommand);
        const s2 = stateContainer.getState();
        expect(s2.state[propA.propName]).toBe(0);
    });

    it("Will only emit query when changed changed event.", (done) => {
        const { A_or_B_or_C_Query } = _Q;
        let count = 0;
        eventBus.subscribe((event) => {
            if (event.kind === "STATE_QUERY_RESULT_CHANGED_EVENT") {
                if (event.data.queryName === A_or_B_or_C_Query.name) {
                    count += 1;
                    if (count === 1) {
                        expect(event.data.curr).toBe(true);
                    }
                    if (count === 2) {
                        expect(event.data.curr).toBe(false);
                        done();
                    }
                }
            }
        });
        // 1 CHANGES QUERY
        commandBus.emit(_P.propA.setTrueCommand);
        // 2 NO CHANGE
        commandBus.emit(_P.propA.setTrueCommand);
        // 3 NO CHANGE
        commandBus.emit(_P.propA.setTrueCommand);
        // 4 CHANGES QUERY
        commandBus.emit(_P.propA.setFalseCommand);
    });

    it("Can upsert props", (done) => {
        const { A_or_B_or_C_Query } = _Q;
        let count = 0;
        eventBus.subscribe((event) => {
            if (event.kind === "STATE_QUERY_RESULT_CHANGED_EVENT") {
                if (event.data.queryName === A_or_B_or_C_Query.name) {
                    count += 1;
                    if (count === 1) {
                        expect(event.data.curr).toBe(true);
                    }
                    if (count === 2) {
                        expect(event.data.curr).toBe(false);
                        done();
                    }
                }
            }
        });
        // 1 CHANGES QUERY
        commandBus.emit(_P.propA.setTrueCommand);
        // 2 NO CHANGE
        commandBus.emit(_P.propA.setTrueCommand);
        // 3 NO CHANGE
        commandBus.emit(_P.propA.setTrueCommand);
        // 4 CHANGES QUERY
        commandBus.emit(_P.propA.setFalseCommand);
    });
});
