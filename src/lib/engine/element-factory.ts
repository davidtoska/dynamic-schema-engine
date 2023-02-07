import { DElement } from "../Delement/DElement";
import { DDiv } from "../Delement/Ddiv";
import { DImg } from "../Delement/DImg";
import { DText } from "../Delement/DText";
import { DDivDto, DElementDto } from "../dto/DElement.dto";
import { DCommandBus } from "../commands/DCommandBus";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "./scale";

export const createDElement = (
    dto: DElementDto,
    actionBus: DCommandBus,
    eventBus: EventBus,
    scale: ScaleService
): DElement<any> => {
    switch (dto._tag) {
        case "div":
            const childEls = createChildrenForDiv(dto, actionBus, eventBus, scale);
            const newDiv = new DDiv(dto, eventBus, actionBus, scale, childEls);
            return newDiv;
        case "img":
            return new DImg(dto, actionBus, eventBus, scale);
        case "p":
            return new DText(dto, eventBus, actionBus, scale);
        default:
            const check: never = dto;
            throw new Error("Unknown dto given to the createDElement function.");
        // TODO LOGGING or create any HTML-ELEMENT??
    }
};

const createChildrenForDiv = (
    dto: DDivDto,
    actionSubject: DCommandBus,
    eventBus: EventBus,
    scale: ScaleService
): DDiv["children"] => {
    const childDto = dto.children;
    const childEls: Array<DImg | DText> = [];
    // console.log(childElements);
    childDto.forEach((dto) => {
        if (dto._tag === "p") {
            const newText = new DText(dto, eventBus, actionSubject, scale);
            childEls.push(newText);
        }
        if (dto._tag === "img") {
            const newImage = new DImg(dto, actionSubject, eventBus, scale);
            childEls.push(newImage);
        }
    });
    return childEls;
};
