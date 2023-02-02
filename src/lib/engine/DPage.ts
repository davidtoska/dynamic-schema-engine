import { DElement } from "../Delement/DElement";
import { PageDto } from "../SchemaDto";
import { createDElement } from "./element-factory";
import { EventBus } from "../events/event-bus";
import { DCommandBus } from "../commands/DCommandBus";
import { DTimestamp } from "../common/DTimestamp";
import { ScaleService } from "./scale";

export class DPage {
    private readonly TAG = "[ DPage ]: ";
    private elements: DElement<HTMLElement>[] = [];
    private readonly eventBus;
    private readonly commandBus;
    private readonly scale: ScaleService;
    // Todo GLOBAL EVENT_BUSS AND PAGE EVENTS:

    constructor(private readonly dto: PageDto, eventBus: EventBus, commandBus: DCommandBus, scale: ScaleService) {
        this.eventBus = eventBus;
        this.commandBus = commandBus;
        this.scale = scale;
        this.elements = dto.elements.map((dto) => createDElement(dto, this.commandBus, this.eventBus, this.scale));
    }

    appendYourself(parent: HTMLElement, preloadMode = false) {
        console.log("APPENDING PAGE");
        this.elements.forEach((el) => {
            el.appendYourself(parent);
            // parent.appendChild(el.el);
        });

        if (!preloadMode) {
            this.eventBus.emit({
                kind: "PAGE_ENTER_EVENT",
                timestamp: DTimestamp.now(),
                producer: "DPage",
                producerId: this.id,
                data: { pageId: this.id },
            });
        }
    }

    log(): void {
        // console.log(this.TAG + 'scale - ' + this.scale);
    }

    get id() {
        return this.dto.id;
    }
}
