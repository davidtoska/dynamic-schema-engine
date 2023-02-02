import { DElementDto } from "../lib/DElement.dto";
import { DStyle } from "../lib/Delement/DStyle";
import { ID } from "../lib/ID";
import { DCommand } from "../lib/commands/DCommand";
import { DEventHandler } from "../lib/event-handlers/DEventHandler";

export namespace ThemeUtils {
    import ElementId = ID.ElementId;

    export const disableClickCommands = (elementId: ElementId, styleChanges: Partial<DStyle>): DCommand[] => {
        return [
            { kind: "ELEMENT_DISABLE_CLICK_COMMAND", target: "ELEMENT", targetId: elementId, payload: {} },
            {
                kind: "ELEMENT_STYLE_COMMAND",
                target: "ELEMENT",
                targetId: elementId,
                payload: { changes: styleChanges },
            },
        ];
    };

    export const enableClickCommands = (elementId: ElementId, styleChanges: Partial<DStyle>): DCommand[] => {
        return [
            { kind: "ELEMENT_ENABLE_CLICK_COMMAND", target: "ELEMENT", targetId: elementId, payload: {} },
            {
                kind: "ELEMENT_STYLE_COMMAND",
                target: "ELEMENT",
                targetId: elementId,
                payload: { changes: styleChanges },
            },
        ];
    };

    export const showOnVideoPlay = (elementId: ElementId): Array<DEventHandler> => {
        const eventHandlers: Array<DEventHandler> = [
            {
                onEvent: "VIDEO_PLAY_EVENT",
                thenExecute: [ThemeUtils.showCommand(elementId)],
            },
            {
                onEvent: "VIDEO_ENDED_EVENT",
                thenExecute: [ThemeUtils.hideCommand(elementId)],
            },
            {
                onEvent: "VIDEO_PAUSED_EVENT",
                thenExecute: [ThemeUtils.hideCommand(elementId)],
            },
        ];
        return eventHandlers;
    };

    export const hideOnVideoPlay = (elementId: ElementId): Array<DEventHandler> => {
        const eventHandlers: Array<DEventHandler> = [
            {
                onEvent: "VIDEO_PLAY_EVENT",
                thenExecute: [ThemeUtils.hideCommand(elementId)],
            },
            {
                onEvent: "VIDEO_ENDED_EVENT",
                thenExecute: [ThemeUtils.showCommand(elementId)],
            },
            {
                onEvent: "VIDEO_PAUSED_EVENT",
                thenExecute: [ThemeUtils.showCommand(elementId)],
            },
        ];

        return eventHandlers;
    };

    export const hideOnMediaPlay = <T extends DElementDto>(element: T): T => {
        const oldHandlers = element.eventHandlers ?? [];
        const eventHandlers: Array<DEventHandler> = [
            {
                onEvent: "VIDEO_PLAY_EVENT",
                thenExecute: [ThemeUtils.hideCommand(element.id)],
            },
            {
                onEvent: "VIDEO_ENDED_EVENT",
                thenExecute: [ThemeUtils.showCommand(element.id)],
            },
            {
                onEvent: "VIDEO_PAUSED_EVENT",
                thenExecute: [ThemeUtils.showCommand(element.id)],
            },
            {
                onEvent: "AUDIO_PLAY_EVENT",
                thenExecute: [ThemeUtils.hideCommand(element.id)],
            },

            {
                onEvent: "AUDIO_ENDED_EVENT",
                thenExecute: [ThemeUtils.showCommand(element.id)],
            },
        ];
        const allHandlers: ReadonlyArray<DEventHandler> = [...oldHandlers, ...eventHandlers];
        return { ...element, eventHandlers: allHandlers };
    };

    export const showOnMediaPlay = <T extends DElementDto>(element: T): T => {
        const oldHandlers = element.eventHandlers ?? [];
        const eventHandlers: Array<DEventHandler> = [
            {
                onEvent: "VIDEO_PLAY_EVENT",
                thenExecute: [ThemeUtils.showCommand(element.id)],
            },
            {
                onEvent: "VIDEO_ENDED_EVENT",
                thenExecute: [ThemeUtils.hideCommand(element.id)],
            },
            {
                onEvent: "VIDEO_PAUSED_EVENT",
                thenExecute: [ThemeUtils.hideCommand(element.id)],
            },
            {
                onEvent: "AUDIO_PLAY_EVENT",
                thenExecute: [ThemeUtils.showCommand(element.id)],
            },

            {
                onEvent: "AUDIO_ENDED_EVENT",
                thenExecute: [ThemeUtils.hideCommand(element.id)],
            },
        ];
        const allHandlers: ReadonlyArray<DEventHandler> = [...oldHandlers, ...eventHandlers];
        return { ...element, eventHandlers: allHandlers };
    };

    export const hideCommand = (elementId: ElementId): DCommand => {
        const hideCommand: DCommand = {
            kind: "ELEMENT_STYLE_COMMAND",
            target: "ELEMENT",
            targetId: elementId,
            payload: { changes: { visibility: "hidden" } },
        };
        return hideCommand;
    };
    export const showCommand = (elementId: ElementId): DCommand => {
        const showCommand: DCommand = {
            kind: "ELEMENT_STYLE_COMMAND",
            target: "ELEMENT",
            targetId: elementId,
            payload: { changes: { visibility: "visible" } },
        };
        return showCommand;
    };

    export const spaceEvenlyX = <T extends Pick<DElementDto, "style">>(
        items: ReadonlyArray<T>,
        options: { startAt: number; endAt: number; defaultItemWidth: number } = {
            startAt: 0,
            endAt: 100,
            defaultItemWidth: 5,
        }
    ): ReadonlyArray<T> => {
        const startAt = options?.startAt ?? 0;
        const endAt = options?.endAt ?? 100;
        const range = Math.abs(endAt - startAt);
        if (items.length === 0) {
            return [];
        }
        const marginCount = items.length + 1;
        const defaultWidth = options.defaultItemWidth ?? 150 / marginCount;

        let totalWidthOfElements = items.reduce((prev, curr) => {
            const w = curr.style.w ?? defaultWidth;
            return prev + w;
        }, 0);

        let cursor = startAt;
        const rest = Math.max(range - totalWidthOfElements, 0);
        const margin = rest / marginCount;

        items.forEach((item) => {
            cursor = cursor + margin;
            const w = item.style.w ?? defaultWidth;
            const x = cursor;
            cursor = cursor + w;
            item.style.w = w;
            item.style.x = x;
        });

        return items;
    };

    export const centerY = (): Pick<DStyle, "y" | "transform"> => ({
        y: 50,
        transform: "translate(0%, 50%)",
    });
    export const centerX = (): Pick<DStyle, "x" | "transform"> => ({
        x: 50,
        transform: "translate(-50%, 0%)",
    });

    export const centerXY = (): Pick<DStyle, "x" | "y" | "transform"> => ({
        x: 50,
        y: 50,
        transform: "translate(-50%, 50%)",
    });
}
