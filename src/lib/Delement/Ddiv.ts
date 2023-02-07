import { DElement } from "./DElement";
import { DDivDto } from "../dto/DElement.dto";
import { DText } from "./DText";
import { DImg } from "./DImg";
import { DCommandBus } from "../commands/DCommandBus";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "../engine/scale";

export class DDiv extends DElement<HTMLDivElement> {
    private readonly TAG = "[ DDiv ]: ";
    protected readonly defaultStyle = { x: 22, y: 4 };
    private children: Array<DText | DImg> = [];

    constructor(
        dto: DDivDto,
        eventBus: EventBus,
        actionService: DCommandBus,
        scale: ScaleService,
        children: Array<DText | DImg>
    ) {
        const d = document.createElement("div");
        super(d, eventBus, actionService, dto, scale);
        this.children = children;

        this.children.forEach((child) => {
            child.appendYourself(this.el);
        });
    }
}
