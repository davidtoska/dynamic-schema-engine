import { DElement } from "./DElement";
import { DImgDto } from "../DElement.dto";
import { DCommandBus } from "../events-and-actions/DCommandBus";
import { EventBus } from "../events-and-actions/event-bus";
import { ScaleService } from "../engine/scale";

export class DImg extends DElement<HTMLImageElement> {
    private static IMAGE_COUNT = 0;
    private readonly imageCount: number;
    readonly TAG: string;
    readonly TIMING_TAG: string;

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

    // private onClick(ev: Event) {
    //   console.log(ev.type);
    //   // this.dto.clickAction.forEach((action) => {
    //   //   this.actionSubject.emit(action);
    //   // });
    // }

    private onError(ev: Event | string) {
        if (ev instanceof Event) {
            console.log(this.TAG + " " + ev.type);
        } else {
            console.log(this.TAG + ev);
        }
    }

    private onLoad(ev: Event) {
        console.groupCollapsed(this.TAG + "LOADED");
        console.log("H: " + this.el.height);
        console.log("W: " + this.el.width);
        console.log("W: " + this.el.loading);
        console.log(ev);

        console.log("Natural H: " + this.el.naturalHeight);
        console.log("Natural W: " + this.el.naturalWidth);
        console.timeEnd(this.TIMING_TAG);
        console.groupEnd();
    }
}
