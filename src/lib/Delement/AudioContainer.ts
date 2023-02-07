import { CanPlayToEnd } from "./VideoContainer";
import { DAudioDto } from "../dto/DElement.dto";
import { EventBus } from "../events/event-bus";
import { DTimestamp } from "../common/DTimestamp";
import { DEvent } from "../events/DEvents";
import { DEventHandler } from "../event-handlers/DEventHandler";
import { DCommandBus } from "../commands/DCommandBus";

export class AudioContainer implements CanPlayToEnd {
    private readonly TAG = "[ DAudio]";
    protected dto: DAudioDto | null = null;
    private el: HTMLAudioElement;
    private subs: Array<() => void> = [];
    constructor(
        element: HTMLAudioElement,
        private eventBus: EventBus,
        private readonly commandBus: DCommandBus,
        dto?: DAudioDto
    ) {
        this.el = element;
        this.el.style.position = "absolute";
        this.el.style.visibility = "hidden";
        if (dto) {
            this.setAudio(dto);
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
        this.subs.forEach((unsubscribe) => {
            unsubscribe();
        });
        const sub = this.eventBus.subscribe((ev) => {
            this.handleEvent(ev);
        });
        this.subs.push(sub);
        this.dto = dto;
        this.el.src = dto.url;
        this.el.load();
    }
    private handleEvent(ev: DEvent) {
        const handlers = this.dto?.eventHandlers;
        const id = this.dto?.id;
        if (!handlers) {
            return false;
        }
        const lookUp = DEventHandler.createLookUp(handlers);
        const allHandlers = lookUp.get(ev.kind) ?? [];
        allHandlers.forEach((h) => {
            const pId = h.when?.producerId;
            const thisId = this.dto?.id;
            console.log(pId, thisId);
            if (pId && thisId && pId === thisId) {
                const commands = h.thenExecute;
                commands.forEach((c) => {
                    this.commandBus.emit(c);
                });
            }
        });
        return true;
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
