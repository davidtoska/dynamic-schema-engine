import { DElement } from "./DElement";
import { DTextDto } from "../dto/DElement.dto";
import { DCommandBus } from "../commands/DCommandBus";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "../engine/scale";

export class DText extends DElement<HTMLParagraphElement> {
    private readonly TAG = "[ DParagraph ]: ";
    protected defaultStyle = {};

    constructor(dto: DTextDto, eventBus: EventBus, actionService: DCommandBus, scale: ScaleService) {
        super(document.createElement("p"), eventBus, actionService, dto, scale);
        this.el.style.position = "absolute";
        this.el.innerText = "" + dto.text;
        this.setStyle(dto.style);
    }

    setScale(scale: number) {
        this.setStyle(this.currStyle);
        const fontSize = this.el.style.fontSize;
        console.log(this.TAG + "scale: " + scale + " Fontsize: " + fontSize);
    }
}
