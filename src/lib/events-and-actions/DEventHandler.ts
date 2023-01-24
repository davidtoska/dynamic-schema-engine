import { DCommand } from "./DCommand";
import { DEvent } from "./DEvents";

export interface DEventHandler {
  readonly onEvent: DEvent["kind"];
  readonly thenExecute: ReadonlyArray<DCommand>;
}

export namespace DEventHandler {
  export type LookUp = Map<
    DEventHandler["onEvent"],
    DEventHandler["thenExecute"]
  >;
  export const createLookUp = (
    handlers?: ReadonlyArray<DEventHandler>
  ): LookUp => {
    const map = new Map<
      DEventHandler["onEvent"],
      DEventHandler["thenExecute"]
    >();
    handlers?.forEach((h) => {
      const kind = h.onEvent;
      const current = map.get(kind);
      const actions = current
        ? [...current, ...h.thenExecute]
        : [...h.thenExecute];
      map.set(kind, actions);
    });
    return map;
  };
}
