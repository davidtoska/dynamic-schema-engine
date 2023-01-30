import { EventBus } from "./event-bus";
import { DTimestamp } from "../common/DTimestamp";
describe("Event-bus-works", () => {
    test("Can create event-bus", (done) => {
        const bus = new EventBus();

        bus.consoleLogEvents = false;
        bus.subscribe((ev) => {
            expect(ev.kind === "AUDIO_PLAY_EVENT").toBe(true);
            done();
        });

        bus.emit({
            kind: "AUDIO_PLAY_EVENT",
            timestamp: DTimestamp.now(),
            data: {},
            producerId: "",
            producer: "DAudio",
        });
    });

    test("Can query for blocking media.", () => {
        const bus = new EventBus();

        bus.consoleLogEvents = false;

        bus.emit({
            kind: "MEDIA_BLOCKING_START_EVENT",
            timestamp: DTimestamp.now(),
            data: {},
            producerId: "",
            producer: "MediaManager",
        });
        expect(bus.query());
    });
});
