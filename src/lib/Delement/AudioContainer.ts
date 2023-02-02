import { CanPlayToEnd } from "./VideoContainer";
import { DAudioDto } from "../DElement.dto";
import { EventBus } from "../events/event-bus";
import { DTimestamp } from "../common/DTimestamp";

export class AudioContainer implements CanPlayToEnd {
    private readonly TAG = "[ DAudio]";
    protected dto: DAudioDto | null = null;
    private el: HTMLAudioElement;
    constructor(
        element: HTMLAudioElement,
        // private pageActionService: DCommandBus,
        private eventBus: EventBus,
        dto?: DAudioDto
    ) {
        this.el = element;
        this.el.style.position = "absolute";
        this.el.style.visibility = "hidden";
        if (dto) {
            this.dto = dto;
        }

        this.onLoad = this.onLoad.bind(this);
        this.el.onload = this.onLoad;
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.el.onloadedmetadata = this.onLoadedMetadata;
        this.onEnded = this.onEnded.bind(this);
        this.el.onended = this.onEnded;
        this.onPlay = this.onPlay.bind(this);
        this.el.onplay = this.onPlay;
        this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
        this.el.oncanplaythrough = this.onCanPlayThrough;
        this.onEnded = this.onEnded.bind(this);
        this.el.onended = this.onEnded;
        this.el.ondurationchange = (_: Event) => {
            const duration = this.el.duration;
            const isInfinity = duration === Number.POSITIVE_INFINITY;
            this.eventBus.emit({
                kind: "AUDIO_DURATION_CHANGE_EVENT",
                timestamp: DTimestamp.now(),
                producer: "DAudio",
                producerId: this.id,
                data: { duration: this.el.duration, isInfinity },
            });
        };
    }

    setAudio(dto: DAudioDto) {
        // this.el.onprogress
        // console.log("DID SET AUDIO");
        this.dto = dto;
        this.el.src = dto.url;
        this.el.load();
        // this.el.ondurationchange
    }

    onLoadedMetadata(_: Event) {
        this.eventBus.emit({
            kind: "AUDIO_METADATA_LOADED_EVENT",
            timestamp: DTimestamp.now(),
            producer: "DAudio",
            producerId: this.id,
            data: {},
        });
    }

    onLoad(_: Event) {
        this.eventBus.emit({
            kind: "AUDIO_LOAD_EVENT",
            timestamp: DTimestamp.now(),
            producer: "DAudio",
            producerId: this.id,
            data: {},
        });
        // console.log(this.TAG + event.type);
    }

    get id() {
        return this.dto?.id ?? "DAudio";
    }

    private onEnded(_: Event) {
        this.eventBus.emit({
            kind: "AUDIO_ENDED_EVENT",
            data: {},
            producer: "DAudio",
            timestamp: DTimestamp.now(),
            producerId: this.id,
        });
    }

    private onCanPlayThrough(_: Event) {
        this.eventBus.emit({
            kind: "AUDIO_CAN_PLAY_THROUGH_EVENT",
            data: {},
            producer: "DAudio",
            timestamp: DTimestamp.now(),
            producerId: this.id,
        });
    }

    private onPlay(_: Event) {
        this.eventBus.emit({
            kind: "AUDIO_PLAY_EVENT",
            producerId: this.id,
            data: {},
            producer: "DAudio",
            timestamp: DTimestamp.now(),
        });
    }

    async playToEnd(): Promise<boolean> {
        const endedOrErrored = new Promise<boolean>((resolve) => {
            this.el.addEventListener(
                "ended",
                (_) => {
                    // console.log(e);
                    resolve(true);
                },
                { once: true }
            );
            this.el.addEventListener(
                "error",
                (_) => {
                    // console.log(e);
                    resolve(false);
                },
                { once: true }
            );
        });
        try {
            await this.el.play();
            await endedOrErrored;
            return true;
        } catch (e) {
            this.eventBus.emit({
                kind: "AUDIO_ERROR_EVENT",
                timestamp: DTimestamp.now(),
                producer: "DAudio",
                producerId: this.id,
                data: { error: e },
            });
            return false;
        } finally {
        }

        return Promise.resolve(false);
    }
}
