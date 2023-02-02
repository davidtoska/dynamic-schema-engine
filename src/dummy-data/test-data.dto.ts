import { img } from "./media-urls";
import { DElementDto } from "../lib/DElement.dto";
import { PageDto } from "../lib/SchemaDto";
import { ID } from "../lib/ID";
import ElementId = ID.ElementId;
import PageId = ID.PageId;

export const testDataDto: Array<DElementDto> = [
    {
        id: "div1" as ElementId,
        _tag: "div",
        style: {
            x: 50,
            y: 30,
            h: 20,
            w: 90,
            backgroundColor: "blue",
            borderWidth: { _unit: "px", value: 50 },
            borderStyle: "solid",
            borderColor: "black",
            borderRadius: { _unit: "px", value: 10 },
        },
        children: [],
        onClick: [
            {
                kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                target: "PAGE_QUE",
                targetId: "PAGE_QUE",
                payload: {},
            },
        ],
    },

    {
        id: "img1" as ElementId,
        _tag: "img",
        style: { x: 5, y: 85, h: 10, w: 20 },
        url: img["1"],
        onClick: [
            {
                kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                target: "PAGE_QUE",
                targetId: "PAGE_QUE",
                payload: {},
            },
        ],
    },
    {
        id: "img2" as ElementId,
        _tag: "img",
        style: { x: 30, y: 85, h: 10, w: 20 },
        url: img["2"],
        onClick: [
            {
                kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                target: "PAGE_QUE",
                targetId: "PAGE_QUE",
                payload: {},
            },
        ],
    },
    {
        id: "img3" as ElementId,
        _tag: "img",
        style: { x: 55, y: 85, h: 10, w: 20 },
        url: img["3"],
        onClick: [
            {
                kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                target: "PAGE_QUE",
                targetId: "PAGE_QUE",
                payload: {},
            },
        ],
    },
    {
        id: "img4" as ElementId,
        _tag: "img",
        style: { x: 75, y: 85, h: 10, w: 20 },
        url: img["4"],
        onClick: [
            {
                kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                target: "PAGE_QUE",
                targetId: "PAGE_QUE",
                payload: {},
            },
        ],
    },
    // videoDto.video1,
];

export const pages: Array<PageDto> = [
    // divPage,
    {
        id: "page1" as PageId,
        elements: [
            // videoDto.video1,
            {
                id: "1" as ElementId,
                _tag: "img",
                style: { backgroundColor: "red", x: 14, y: 85, h: 10, w: 20 },
                url: img["1"],
                onClick: [
                    {
                        kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                        target: "PAGE_QUE",
                        targetId: "PAGE_QUE",
                        payload: {},
                    },
                    {
                        kind: "AUDIO_PLAY_COMMAND",
                        target: "AUDIO",
                        targetId: "AUDIO",
                        payload: {},
                    },
                ],
            },
        ],
        autoPlaySequence: {
            id: "seq1",
            blocking: true,
            items: [],
        },
    },
    {
        id: "page2" as PageId,
        elements: [
            // MediaDto.video2,
            {
                id: "page_2_img2" as ElementId,
                _tag: "img",
                style: { x: 30, y: 85, h: 10, w: 20 },
                url: img["2"],
                onClick: [
                    {
                        kind: "PAGE_QUE_NEXT_PAGE_COMMAND",
                        target: "PAGE_QUE",
                        targetId: "PAGE_QUE",
                        payload: {},
                    },
                ],
            },
            {
                id: "1" as ElementId,
                _tag: "p",
                style: { x: 30, y: 15, h: 10, w: 20 },
                text: "hello from page1",
            },
        ],
        autoPlaySequence: { id: "", blocking: false, items: [] },
    },
    {
        id: "1" as PageId,
        elements: [...testDataDto],
        autoPlaySequence: { id: "1", blocking: false, items: [] },
    },
];
