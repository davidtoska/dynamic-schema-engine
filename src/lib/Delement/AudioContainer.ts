import { CanPlayToEnd } from "./VideoContainer";
import { DAudioDto } from "../DElement.dto";
import { EventBus } from "../events-and-actions/event-bus";
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

        // BIND CALLBACKS
        // BIND CALLBACKS
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
    }

    setAudio(dto: DAudioDto) {
        console.log("DID SET AUDIO");
        this.dto = dto;
        this.el.src = dto.url;

        this.el.load();
    }

    onLoadedMetadata(_: Event) {
        console.log("TODO emit on bus", _);
    }

    onLoad(_: Event) {
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
        console.group("CAN PLAY THROUGH");
        console.log("dur: " + this.el.duration);
        console.log("played: " + this.el.played);
        console.groupEnd();
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
                (e) => {
                    console.log(e);
                    resolve(true);
                },
                { once: true }
            );
            this.el.addEventListener(
                "error",
                (e) => {
                    console.log(e);
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
            if (e instanceof Error) {
                console.warn(e.message);
                console.warn(e.name);
            } else {
                console.log("Unknown error on play to end");
            }
            return false;
        } finally {
            console.log("Audio played to end!!");
        }

        return Promise.resolve(false);
    }
}
