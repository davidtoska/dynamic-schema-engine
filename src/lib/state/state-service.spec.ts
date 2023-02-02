import { DState } from "./Dstate";
import { Condition } from "../rules/condition";
import { Fact } from "../rules/fact";
import { Failure, Ok } from "../common/result";
import { StateService } from "./state-service";
import { DEFAULT_STATE_PROPS, DERIVED_STATE } from "./default-props";
import { EventBus } from "../events/event-bus";

let eventBus = new EventBus();
let stateContainer = new StateService(eventBus, [], []);
const {
    inputBlockedByAudio,
    inputBlockedByVideo,
    inputBlockingBySequence,
    mediaBlockedByVideo,
    mediaBlockedBySequence,
    mediaBlockedByAudio,
} = DEFAULT_STATE_PROPS;

const allVariables = Object.values(DEFAULT_STATE_PROPS).map((p) => p.propDefinition);
const allDerived = Object.values(DERIVED_STATE);
describe("State-container", () => {
    beforeEach(() => {
        eventBus = new EventBus();
        stateContainer = new StateService(eventBus, allVariables, allDerived);
    });

    it("can add variables, and update", () => {
        stateContainer = new StateService(eventBus, [inputBlockedByAudio.propDefinition]);
        const setBlocked: DState.StateMutation = {
            kind: "set-number",
            propName: inputBlockedByAudio.propDefinition.propName,
            value: 0,
        };
        stateContainer.mutation(setBlocked);
        const result = stateContainer.getPropAsFact(inputBlockedByAudio.propDefinition.propName);
        expect(result.isOk()).toBe(true);

        // expect(result.errors.length).toBe(1);
    });

    it("can not update non-excisting variable", () => {
        stateContainer = new StateService(eventBus, [inputBlockingBySequence.propDefinition]);
        const invalidName = "invalid-variable-name";
        stateContainer.mutation({ kind: "set-number", propName: invalidName, value: 2 });
        const result0 = stateContainer.getPropAsFact(invalidName);
        expect(result0.isOk()).toBe(false);
    });
    it("can solve condition: ", () => {
        stateContainer = new StateService(eventBus, [inputBlockingBySequence.propDefinition]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: inputBlockingBySequence.propDefinition.propName,
            referenceLabel: "",
            valueLabel: "",
            value: 0,
            operator: "eq",
        };

        const conditionNot: Condition = {
            kind: "numeric-condition",
            referenceId: inputBlockingBySequence.propDefinition.propName,
            referenceLabel: "",
            valueLabel: "",
            value: 1,
            operator: "eq",
        };

        expect(stateContainer.isMatched(condition)).toBe(true);
        expect(stateContainer.isMatched(conditionNot)).toBe(false);
    });

    it("Solve will change after update: ", () => {
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: inputBlockingBySequence.propDefinition.propName,
            referenceLabel: "",
            valueLabel: "",
            value: 0,
            operator: "eq",
        };

        expect(stateContainer.isMatched(condition)).toBe(true);
        // stateContainer.update(condition.referenceId, { _type: "set", value: 5 });
        // expect(stateContainer.isMatched(condition)).toBe(false);
    });

    it("Can also add audio-played count facts, and get results. ", () => {
        const variable: DState.NumericProp = {
            _type: "number",
            propName: "audio-play-count-audio-1",
            propDescription: "Number of times audio 1 has played through.",
        };
        stateContainer = new StateService(eventBus, [variable]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: variable.propName,
            referenceLabel: variable.propDescription ?? "",
            valueLabel: "Audio played at least 1 time.",
            value: 0,
            operator: "greater-then",
        };

        expect(stateContainer.isMatched(condition)).toBe(false);
        const res = stateContainer.mutation({
            propName: variable.propName,
            kind: "increment-number",
            stepSize: 1,
            ifNotExistThenSetTo: 1,
        });
        expect(res.success).toBe(true);
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
        stateContainer = new StateService(eventBus, [numProp1, stringProp1, numericProp2, stringProp2]);

        stateContainer.mutation({
            propName: numProp1.propName,
            kind: "increment-number",
            stepSize: 1,
            ifNotExistThenSetTo: 1,
        });
        const resultIntialString = stateContainer.getPropAsFact(stringProp1.propName) as Ok<Fact.String>;
        const resultIntialStringEmpty = stateContainer.getPropAsFact(stringProp2.propName);

        expect(resultIntialStringEmpty.isFailure()).toBe(true);
        expect(resultIntialString.value.value).toBe(stringProp1.initialValue);
        const result1 = stateContainer.getPropAsFact(numProp1.propName) as Ok<Fact.Numeric>;
        expect(result1.value.value).toBe(1);
        stateContainer.mutation({ propName: numProp1.propName, kind: "set-number", value: 10 });
        const result10 = stateContainer.getPropAsFact(numProp1.propName) as Ok<Fact.Numeric>;
        expect(result10.value.value).toBe(10);

        // NUMPROP2
        const numProp2InitialResult = stateContainer.getPropAsFact(numericProp2.propName) as Ok<Fact.Numeric>;
        expect(numProp2InitialResult.value.value).toBe(100);
        stateContainer.mutation({
            propName: numericProp2.propName,
            kind: "decrement-number",
            stepSize: 10,
            ifNotExistThenSetTo: 1,
        });
        const numProp2Res90 = stateContainer.getPropAsFact(numericProp2.propName) as Ok<Fact.Numeric>;
        expect(numProp2Res90.value.value).toBe(90);

        stateContainer.mutation({ propName: stringProp1.propName, kind: "set-string", value: "updated-value" });
        const stringResUpdated = stateContainer.getPropAsFact(stringProp1.propName) as Ok<Fact.String>;
        expect(stringResUpdated.value.value).toBe("updated-value");
    });

    it("Can have a counter variable in state. ", () => {
        stateContainer = new StateService(eventBus, [
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
        stateContainer.mutation({
            propName: condition.referenceId,
            kind: "increment-number",
            stepSize: 1,
            ifNotExistThenSetTo: 1,
        });
        stateContainer.mutation({
            propName: condition.referenceId,
            kind: "increment-number",
            stepSize: 5,
            ifNotExistThenSetTo: 5,
        });
        stateContainer.mutation({
            propName: condition.referenceId,
            kind: "increment-number",
            stepSize: 4,
            ifNotExistThenSetTo: 4,
        });
        expect(stateContainer.isMatched(condition)).toBe(true);
    });

    it("Can get state-schema:", () => {
        const s = stateContainer.getState();

        expect(s.propCount).toBe(7);
        expect(s.state[mediaBlockedByAudio.propDefinition.propName]).toBe(0);
        expect(s.propArray.find((p) => p.propName === "not-defined")).toBe(undefined);
        expect(s.propArray.find((p) => p.propName === mediaBlockedByAudio.propDefinition.propName)).toBeDefined();
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
        expect(stateContainer.canBeMatched(simpleFn(mediaBlockedByAudio.propDefinition.propName))).toBe(true);
        expect(stateContainer.canBeMatched(simpleFn("invalid"))).toBe(false);
        expect(
            stateContainer.canBeMatched(
                complex(
                    [
                        simpleFn(inputBlockedByAudio.propDefinition.propName),
                        simpleFn(inputBlockingBySequence.propDefinition.propName),
                    ],
                    [simpleFn(mediaBlockedByAudio.propDefinition.propName)]
                )
            )
        ).toBe(true);
    });

    it("Can get derived state", () => {
        const { disableAudioIcon } = DERIVED_STATE;
        const { mediaBlockedByAudio, mediaBlockedBySequence } = DEFAULT_STATE_PROPS;
        stateContainer = new StateService(eventBus, allVariables, [disableAudioIcon]);
        const s0 = stateContainer.getState();

        expect(s0.propNames.length).toBe(7);
        expect(s0.propCount).toBe(7);
        expect(s0.propArray.length).toBe(6);
        expect(s0.state[disableAudioIcon.name]).toBe(false);
        stateContainer.mutation(mediaBlockedBySequence.setTrueMutation);
        stateContainer.mutation(mediaBlockedByAudio.setTrueMutation);
        const s1 = stateContainer.getState();
        expect(s1.state[disableAudioIcon.name]).toBe(true);
        stateContainer.mutation(mediaBlockedByAudio.setFalseMutation);

        stateContainer.mutation(mediaBlockedBySequence.setFalseMutation);
        const s2 = stateContainer.getState();
        expect(s2.state[disableAudioIcon.name]).toBe(false);
    });

    it("Will emit mutation-events", (done) => {
        const { mediaBlockedBySequence } = DEFAULT_STATE_PROPS;
        const { disableAudioIcon } = DERIVED_STATE;
        eventBus.subscribe((event) => {
            if (event.kind === "STATE_QUERY_RESULT_CHANGED_EVENT") {
                if (event.data.queryName === disableAudioIcon.name) {
                    expect(event.data.value).toBe(true);
                    done();
                }
            }
        });
        const mutationResult = stateContainer.mutation({
            propName: mediaBlockedBySequence.propName,
            kind: "set-number",
            value: 1,
        });
    });

    it("Can not set at property with options to a invalid value:", () => {
        const { mediaBlockedByAudio, mediaBlockedBySequence } = DEFAULT_STATE_PROPS;
        stateContainer = new StateService(eventBus, allVariables, []);

        const s0 = stateContainer.getState();
        const mutationResult = stateContainer.mutation({
            propName: mediaBlockedBySequence.propName,
            kind: "set-number",
            value: 5,
        });
        const s1 = stateContainer.getState();
        // TODO VALIDATE
        // expect(s0.state[mediaBlockedBySequence.propName]).toBe(s1.state[mediaBlockedBySequence.propName]);
        // stateContainer.mutation(mediaBlockedByAudio.setFalseMutation);
        //
        // stateContainer.mutation(mediaBlockedBySequence.setFalseMutation);
        // const s2 = stateContainer.getState();
        // expect(s2.state[disableAudioIcon.propName]).toBe(false);
    });
});
