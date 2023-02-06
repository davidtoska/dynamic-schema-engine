import { DEvent } from "./DEvents";

export class EventBus {
    private readonly TAG = "[  EVENT_BUS  ] ";
    readonly subscribers = new Set<(event: DEvent) => void>();
    /**
     * Emit on module end.
     * @private
     */
    private readonly eventLog: DEvent[] = [];
    consoleLogEvents = false;
    // readonly sub

    subscribe(cb: (event: DEvent) => void) {
        this.subscribers.add(cb);
        // console.log("ADDED sub");
        return () => {
            this.subscribers.delete(cb);
        };
    }

    query(): boolean {
        return false;
    }

    emit(event: DEvent) {
        if (this.consoleLogEvents) {
            this.logEvent(event);
        }
        this.eventLog.push(event);
        this.subscribers.forEach((cb) => {
            // console.log('CALLING EMIT');
            cb(event);
        });
        // this.logEvents();
    }

    private logEvent(event: DEvent) {
        console.groupCollapsed(this.TAG + " " + event.kind);
        console.log("ProducerId: " + event.producerId);
        console.log(event.data);
        console.groupEnd();
    }

    private logEvents() {
        console.group(this.TAG + "LOGG");
        console.table(this.eventLog);
        console.groupEnd();
    }
}
