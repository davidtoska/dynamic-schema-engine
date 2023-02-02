import { DCommand } from "./DCommand";
import { DTimestamp } from "../common/DTimestamp";

export class DCommandBus {
    private readonly TAG = "[ COMMAND_BUS ] ";
    private readonly commandLog: Array<DCommand & { timestamp: DTimestamp }> = [];
    readonly subscribers = new Set<(event: DCommand) => void>();
    // readonly sub

    subscribe(cb: (command: DCommand) => void) {
        this.subscribers.add(cb);
        return () => {
            this.subscribers.delete(cb);
        };
    }

    emit(command: DCommand) {
        const timestamp = DTimestamp.now();
        this.commandLog.push({ ...command, timestamp });
        this.logCommand(command);
        this.subscribers.forEach((cb) => {
            cb(command);
        });
    }

    private logCommand(command: DCommand) {
        console.groupCollapsed(this.TAG + " " + command.kind);
        console.log("TargetID : " + command.targetId);
        console.log(command.payload);
        console.groupEnd();
    }

    private dumpCommandLog() {
        console.group(this.TAG + "LOGG");
        console.table(this.commandLog);
        console.groupEnd();
    }
}
