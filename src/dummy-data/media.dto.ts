import { audios, videos } from "./media-urls";
import { DAudioDto, DVideoDto } from "../lib/DElement.dto";
import { ID } from "../lib/ID";
import ElementId = ID.ElementId;

export namespace MediaDto {
    export const audio1: DAudioDto = {
        id: "audio1" as ElementId,
        _tag: "audio",
        url: audios["1"],
    };
    export const audio2: DAudioDto = {
        id: "audio2" as ElementId,
        _tag: "audio",
        url: audios["2"],
    };
    export const audio3: DAudioDto = {
        id: "audio3" as ElementId,
        _tag: "audio",
        url: audios["3"],
    };
    export const audio4: DAudioDto = {
        id: "audio4" as ElementId,
        _tag: "audio",
        url: audios["4"],
    };

    export const video1: DVideoDto = {
        id: "video1" as ElementId,
        _tag: "video",
        url: videos["1"],
        style: { x: 0, y: 55, h: 50, w: 100 },
    };
    export const video2: DVideoDto = {
        id: "video2" as ElementId,
        _tag: "video",
        url: videos["2"],
        isMediaBlocking: true,
        style: { x: 25, y: 55, h: 10, w: 18 },
        clickActions: [],
    } as DVideoDto;

    export const video3: DVideoDto = {
        id: "video3" as ElementId,
        _tag: "video",
        url: videos["3"],
        style: { x: 50, y: 55, h: 10, w: 18 },
    };
    export const video4: DVideoDto = {
        id: "video4" as ElementId,
        _tag: "video",
        url: videos["4"],
        style: { x: 75, y: 55, h: 10, w: 18 },
    };
}
