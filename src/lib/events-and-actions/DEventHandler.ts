import { DCommand } from "./DCommand";
import { DEvent } from "./DEvents";

interface A {
    name: string;
    age: number;
}

type data = { [P in keyof A]: A[P] };
const a: data = { name: "adf", age: 7 };
export interface DEventHandler<E extends DEvent = DEvent> {
    readonly onEvent: E["kind"];
    readonly when?: { producerIdEquals?: string | string[] };
    readonly thenExecute: ReadonlyArray<DCommand>;
}

export namespace DEventHandler {
    export type LookUp = Map<DEventHandler["onEvent"], DEventHandler["thenExecute"]>;
    export const createLookUp = (handlers?: ReadonlyArray<DEventHandler>): LookUp => {
        const map = new Map<DEventHandler["onEvent"], DEventHandler["thenExecute"]>();
        handlers?.forEach((h) => {
            const kind = h.onEvent;
            const current = map.get(kind);
            const actions = current ? [...current, ...h.thenExecute] : [...h.thenExecute];
            map.set(kind, actions);
        });
        return map;
    };
}
