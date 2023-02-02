import { DState } from "./Dstate";

describe("Prop-utils work", () => {
    it("isMutation works", () => {
        expect(DState.isStringMutation({ propName: "", value: 2, kind: "set-number" })).toBe(false);
    });
});
