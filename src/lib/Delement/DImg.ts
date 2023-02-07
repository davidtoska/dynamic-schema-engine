import { DElement } from "./DElement";
import { DImgDto } from "../dto/DElement.dto";
import { DCommandBus } from "../commands/DCommandBus";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "../engine/scale";
import { DTimestamp } from "../common/DTimestamp";

export class DImg extends DElement<HTMLImageElement> {
    private static IMAGE_COUNT = 0;
    private readonly imageCount: number;
    readonly TAG: string;
    readonly TIMING_TAG: string;
    private readonly loadStart: DTimestamp;

    constructor(
        private readonly dto: DImgDto,
        private readonly actionSubject: DCommandBus,
        readonly eventBus: EventBus,
        readonly scaleService: ScaleService
    ) {
        super(document.createElement("img"), eventBus, actionSubject, dto, scaleService);
        DImg.IMAGE_COUNT += 1;
        this.imageCount = DImg.IMAGE_COUNT;
        this.TAG = "[D_IMG " + DImg.IMAGE_COUNT + " ]: ";
        this.TIMING_TAG = "load-time (" + DImg.IMAGE_COUNT + ") ";
        this.el.loading = "eager";
        this.el.style.position = "absolute";
        this.setStyle(dto.style);
        this.loadStart = DTimestamp.now();
        // Bind Handlers
        this.onError = this.onError.bind(this);
        this.onLoad = this.onLoad.bind(this);
        // this.onClick = this.onClick.bind(this);
        this.el.onload = this.onLoad;
        this.el.onerror = this.onError;
        // this.el.onclick = this.onClick;
        this.el.src = dto.url;
        console.time(this.TIMING_TAG);
    }

    log(): void {}

    setScale(scale: number) {
        console.log(scale);
        this.setStyle(this.currStyle);
    }

    private onError(ev: Event | string) {
        if (ev instanceof Event) {
            console.log(this.TAG + " " + ev.type);
        } else {
            console.log(this.TAG + ev);
        }
    }

    private onLoad(_: Event) {
        const loadTime = DTimestamp.diffNow(this.loadStart);

        this.eventBus.emit({
            kind: "IMAGE_LOADED_EVENT",
            producer: "DImage",
            producerId: this.id,
            timestamp: DTimestamp.now(),
            data: {
                loadTime,
                naturalHeight: this.el.naturalHeight,
                naturalWidth: this.el.naturalWidth,
                height: this.el.height,
                width: this.el.width,
            },
        });
    }
}
