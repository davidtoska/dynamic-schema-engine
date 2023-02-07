import { DUtil } from "../utils/DUtil";

export namespace ID {
    export type PageId = string & { __pageId: true };
    export const pageId = (): PageId => {
        return createId() as PageId;
    };

    export type ElementId = string & { __elementId: true };
    export const elementId = (): ElementId => {
        return createId() as ElementId;
    };

    const createId = () => {
        return DUtil.randomString(50);
    };
}
