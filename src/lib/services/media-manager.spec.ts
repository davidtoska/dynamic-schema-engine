import { DMediaManager } from "./DMedia-manager";
import { EventBus } from "../events-and-actions/event-bus";
import { ScaleService } from "../engine/scale";
import { DCommandBus } from "../events-and-actions/DCommandBus";

describe("Media-manager to work", () => {
    test("Can be instanciated", () => {
        const host = document.createElement("div");
        const eventBus = new EventBus();
        const commandBus = new DCommandBus();
        const scale = new ScaleService({
            baseHeight: 1300,
            baseWidth: 1024,
            containerHeight: 650,
            containerWidth: 600,
        });
        const mm = new DMediaManager(host, commandBus, eventBus, scale);
        // const pageDto: PageDto = {id}
        expect(host.children.length).toBe(2);
    });
});
