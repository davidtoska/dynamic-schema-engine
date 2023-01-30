import { DVariable, StateContainer } from "../Dvariable";
import { Condition } from "../condition";

let stateContainer = new StateContainer([]);

const {
    inputBlockedByAudio,
    inputBlockedByVideo,
    inputBlockingBySequence,
    mediaBlockedByVideo,
    mediaBlockedBySequence,
    mediaBlockedByAudio,
} = DVariable.HARD_CODED_VARIABLES;

const allVariables = Object.values(DVariable.HARD_CODED_VARIABLES);
describe("State-container", () => {
    beforeEach(() => {
        stateContainer = new StateContainer(allVariables);
    });

    it("can add variables, and update", () => {
        stateContainer = new StateContainer([inputBlockedByAudio]);
        stateContainer.updateVariableByName(inputBlockedByAudio.id, 0);
        const result = stateContainer.getVariableByName(inputBlockedByAudio.id);
        expect(result.isOk()).toBe(true);

        // expect(result.errors.length).toBe(1);
    });

    it("can not update non-excisting variable", () => {
        stateContainer = new StateContainer([inputBlockingBySequence]);
        const invalidName = "invalid-variable-name";
        stateContainer.updateVariableByName(invalidName, 0);
        const result0 = stateContainer.getVariableByName(invalidName);
        expect(result0.isOk()).toBe(false);
    });
    it("can solve condition: ", () => {
        stateContainer = new StateContainer([inputBlockingBySequence]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: inputBlockingBySequence.id,
            referenceLabel: inputBlockingBySequence.variableLabel,
            valueLabel: "",
            value: 0,
            operator: "eq",
        };

        const conditionNot: Condition = {
            kind: "numeric-condition",
            referenceId: inputBlockingBySequence.id,
            referenceLabel: inputBlockingBySequence.variableLabel,
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
            referenceId: inputBlockingBySequence.id,
            referenceLabel: inputBlockingBySequence.variableLabel,
            valueLabel: "",
            value: 0,
            operator: "eq",
        };

        expect(stateContainer.isMatched(condition)).toBe(true);
        stateContainer.updateVariableByName(inputBlockingBySequence.id, 1);
        expect(stateContainer.isMatched(condition)).toBe(false);
    });

    it("Can also add audio-played count facts, and get results. ", () => {
        const variable: DVariable = {
            kind: "numeric-value-variable",
            id: "audio-play-count-audio-1",
            variableLabel: "Number of times audio 1 has played through.",
        };
        // stateContainer = new StateContainer([variable]);
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: variable.id,
            referenceLabel: variable.variableLabel,
            valueLabel: "Audio played at least 1 time.",
            value: 0,
            operator: "greater-then",
        };

        expect(stateContainer.isMatched(condition)).toBe(false);
        stateContainer.setFact({
            kind: "numeric-fact",
            referenceId: variable.id,
            referenceLabel: variable.variableLabel,
            value: 1,
            label: "Audio has been seen once",
        });
        expect(stateContainer.isMatched(condition)).toBe(true);
        stateContainer.setFact({
            kind: "numeric-fact",
            referenceId: variable.id,
            referenceLabel: variable.variableLabel,
            value: 0,
            label: "Audio has been seen once",
        });
        expect(stateContainer.isMatched(condition)).toBe(false);
        // expect(stateContainer.isMatched(condition)).toBe(true);
        // stateContainer.updateVariable(inputBlockingBySequence.uniqueName, 1);
        // expect(stateContainer.isMatched(condition)).toBe(false);
    });

    it("Can have a counter variable in state. ", () => {
        const condition: Condition = {
            kind: "numeric-condition",
            referenceId: "page-count",
            referenceLabel: "Number of pages seen today",
            valueLabel: "Audio played at least 1 time.",
            value: 10,
            operator: "eq",
        };

        expect(stateContainer.isMatched(condition)).toBe(false);
        stateContainer.addToCount(condition.referenceId, 1);
        stateContainer.addToCount(condition.referenceId, 4);
        stateContainer.addToCount(condition.referenceId, 5);
        expect(stateContainer.isMatched(condition)).toBe(true);
        stateContainer.addToCount(condition.referenceId, 5);
        expect(stateContainer.isMatched(condition)).toBe(false);
    });
});
