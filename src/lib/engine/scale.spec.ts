import { Scale, ScaleService } from "./scale";

describe("Scale works", () => {
    test("scaleService", () => {
        const scaleService = new ScaleService({
            baseHeight: 1300,
            baseWidth: 1024,
            containerWidth: 600,
            containerHeight: 650,
        });
        expect(scaleService.scale).toBe(0.5);
        const unsub = scaleService.onChange((scale) => {
            expect(scale).toBe(0.5);
        });
        unsub();

        scaleService.setContainerBounds({ height: 1170, width: 1000 });

        expect(scaleService.scale).toBe(0.9);
    });
    test("scaleFn", () => {
        const scaleFunction = Scale.calc(1200, 1200);
        expect(scaleFunction({ height: 600, width: 600 })).toBe(0.5);
        expect(scaleFunction({ height: 900, width: 600 })).toBe(0.5);
        expect(scaleFunction({ height: 400, width: 600 })).toBe(4 / 12);
        expect(scaleFunction({ height: 900, width: 300 })).toBe(0.25);
        expect(scaleFunction({ height: 300, width: 400 })).toBe(0.25);
        expect(scaleFunction({ height: 0, width: 0 })).toBe(0);
        const scaleFunction2 = Scale.calc(1200, 1024);
        expect(scaleFunction2({ height: 600, width: 6000 })).toBe(0.5);
        expect(scaleFunction2({ height: 400, width: 800 })).toBe(4 / 12);
        expect(scaleFunction2({ height: 800, width: 512 })).toBe(0.5);
        const scale = Scale.scaleFunctionCreator(0.5);

        expect(scale(500)).toBe(250);
        expect(scale(200)).toBe(100);
    });
});
