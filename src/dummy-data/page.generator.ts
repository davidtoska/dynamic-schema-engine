import { PageDto } from "../lib/SchemaDto";
import { ID } from "../lib/ID";
import { Fact } from "../lib/rules/fact";
import { DStyle } from "../lib/Delement/DStyle";
import { DDivDto, DImgDto, DTextDto } from "../lib/DElement.dto";
import { img } from "./media-urls";
export namespace PageGenerator {
    import ElementId = ID.ElementId;
    export const imagePage = (url: string) => {
        const pageDto: PageDto = {
            id: ID.pageId(),
            elements: [
                {
                    id: "1" as ElementId,
                    _tag: "img",
                    style: { backgroundColor: "red", x: 14, y: 85, h: 10, w: 20 },
                    url: url,
                    onClick: [
                        {
                            kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                            target: "PAGE_QUE",
                            targetId: "PAGE_QUE",
                            payload: {},
                        },
                    ],
                },
            ],
        };
        return pageDto;
    };

    export const imageElement = (id: ElementId, url: string, style: Partial<DStyle>): DImgDto => {
        return {
            id,
            _tag: "img",
            style: style,
            url,
            onClick: [
                {
                    kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                    target: "PAGE_QUE",
                    targetId: "PAGE_QUE",
                    payload: {},
                },
            ],
        };
    };

    export const allElementsPage = (): PageDto => {
        const imageElement1 = imageElement(ID.elementId(), img["1"], { h: 10, w: 13, x: 10, y: 20 });
        const t1 = text("hello world", { fontSize: { _unit: "px", value: 100 }, textAlign: "right", w: 40 });
        const comp: DDivDto = {
            id: ID.elementId(),
            style: { h: 30, w: 50, x: 20, y: 30, backgroundColor: "red" },
            children: [{ _tag: "img", style: { h: 50, w: 50, x: 50, y: 0 }, id: ID.elementId(), url: img["3"] }],
            _tag: "div",
            onClick: [],
        };
        const page: PageDto = {
            id: ID.pageId(),
            elements: [imageElement1, comp, t1],
        };
        return page;
    };

    const text = (text: string, style: Partial<DStyle>) => {
        const el: DTextDto = {
            id: ID.elementId(),
            eventHandlers: [],
            text,
            _tag: "p",
            style,
        };
        return el;
    };
    const createVideoDto = () => {};

    export const questionPage = () => {
        const pageId = ID.pageId();
        const fact: Fact = {
            referenceId: "sdf",
            referenceLabel: "label",
            kind: "numeric-fact",
            value: 2,
            label: "",
        };
        const pageDto: PageDto = {
            id: pageId,
            elements: [
                {
                    eventHandlers: [],
                    id: "1" as ElementId,
                    _tag: "div",
                    style: { backgroundColor: "red", x: 14, y: 85, h: 10, w: 20 },
                    onClick: [
                        {
                            kind: "ENGINE_LEAVE_PAGE_COMMAND",
                            target: "ENGINE",
                            targetId: "ENGINE",
                            payload: {
                                pageId: pageId,
                                factsCollected: [fact],
                            },
                        },
                    ],
                    children: [
                        {
                            id: ID.elementId(),
                            _tag: "p",
                            text: "pageId: " + pageId,
                            style: {},
                        },
                    ],
                },
            ],
        };
        return pageDto;
    };
}
