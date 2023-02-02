import { DCommand } from "../commands/DCommand";
import { DEvent } from "../events/DEvents";
import { Condition } from "../rules/condition";

export interface DEventHandler<E extends DEvent = DEvent> {
    readonly onEvent: E["kind"];
    readonly when?: { producerIdEquals?: string | string[] };
    readonly thenExecute: ReadonlyArray<DCommand>;
    readonly elseExecute?: ReadonlyArray<DCommand>;
}

interface Obs {
    readonly name: string;
    readonly conditions: Condition;
}

export namespace DEventHandler {
    export type LookUp = Map<DEventHandler["onEvent"], Array<DEventHandler>>;
    export const createLookUp = (handlers?: ReadonlyArray<DEventHandler>): LookUp => {
        const map = new Map<DEventHandler["onEvent"], Array<DEventHandler>>();
        handlers?.forEach((h) => {
            const kind = h.onEvent;
            const current = map.get(kind);
            const actions = current ? [...current, h] : [h];
            map.set(kind, actions);
        });
        return map;
    };
}
