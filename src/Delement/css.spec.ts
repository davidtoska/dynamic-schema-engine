import { DCss } from "./css";
import LengthUnit = DCss.LengthUnit;
import { DStyle } from "./DStyle";
describe("Css utils testing", () => {
    test("Clamp and round of px-units", () => {
        const px1300: DCss.Px = { _unit: "px", value: 1300 };
        const px555: DCss.Px = { _unit: "px", value: 555 };
        const px123: DCss.Px = { _unit: "px", value: 123 };
        const px10: DCss.Px = { _unit: "px", value: 10 };
        const px3: DCss.Px = { _unit: "px", value: 3 };
        const px0: DCss.Px = { _unit: "px", value: 0 };
        const px1: DCss.Px = { _unit: "px", value: 1 };
        const scale026 = DCss.toString;
        // const scale001 = DCss.toStringCreator(0.01);

        expect(DCss.toString(px1300, 0.26)).toBe("338px");
        expect(DCss.toString(px10, 0.26)).toBe("3px");
        expect(DCss.toString(px1, 0.26)).toBe("1px");
        expect(DCss.toString(px3, 0.26)).toBe("1px");
        expect(DCss.toString(px0, 0.26)).toBe("0px");
        expect(DCss.toString(px0, 0.26)).toBe("0px");
        expect(DCss.toString(px555, 0.26)).toBe("144px");
        expect(DCss.toString(px123, 0.01)).toBe("4px");
        expect(DCss.toString(px1300, 0.01)).toBe("39px");
        expect(DCss.isLengthUnit()).toBe(false);
        expect(DCss.isLengthUnit({} as LengthUnit)).toBe(false);
        expect(DCss.isLengthUnit(px123)).toBe(true);
    });

    test("Normalize div: ", () => {
        const div = document.createElement("div");
        const normalized = DStyle.normalize(div);
        expect(normalized.style.padding).toBe("0px");
        expect(normalized.style.boxSizing).toBe("border-box");
    });
});
