import { EventBus } from "./event-bus";
import { DTimestamp } from "../common/DTimestamp";

test("Event-bus works", (done) => {
  const bus = new EventBus();
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
