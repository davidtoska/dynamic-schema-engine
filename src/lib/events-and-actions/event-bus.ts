import { DEvent } from "./DEvents";

export class EventBus {
  private readonly TAG = "[ EVENT_BUS ]";
  readonly subscribers = new Set<(event: DEvent) => void>();
  /**
   * Emit on module end.
   * @private
   */
  private readonly eventLog: DEvent[] = [];
  // readonly sub

  subscribe(cb: (event: DEvent) => void) {
    this.subscribers.add(cb);
    // console.log("ADDED sub");
    return () => {
      this.subscribers.delete(cb);
    };
  }

  emit(event: DEvent) {
    // console.log(this.TAG + " " + event.kind);
    this.eventLog.push(event);
    this.subscribers.forEach((cb) => {
      // console.log('CALLING EMIT');
      cb(event);
    });
    // this.logEvents();
  }

  private logEvents() {
    console.group(this.TAG + "LOGG");
    console.table(this.eventLog);
    console.groupEnd();
  }
}
