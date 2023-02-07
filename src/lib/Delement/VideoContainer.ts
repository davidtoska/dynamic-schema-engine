import { DVideoDto } from "../dto/DElement.dto";
import { DTimestamp } from "../common/DTimestamp";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "../engine/scale";
import { DStyle } from "./DStyle";
import { DUtil } from "../utils/DUtil";

export interface CanPlayToEnd {
    playToEnd(): Promise<boolean>;
}

export class VideoContainer implements CanPlayToEnd {
    private readonly TAG: string;
    private dto?: DVideoDto;
    private defaultStyles: Partial<DStyle> = { h: 45, w: 100, visibility: "hidden", y: 55 };

    pause() {
        this.el.pause();
    }

    async playToEnd() {
        this.el.volume = 1;
        const endedOrErrored = new Promise<boolean>((resolve) => {
            this.el.addEventListener(
                "ended",
                (_) => {
                    resolve(true);
                },
                { once: true }
            );
            this.el.addEventListener(
                "error",
                (_) => {
                    resolve(false);
                },
                { once: true }
            );
        });
        try {
            console.log("PLAY");
            await this.el.play();
            await endedOrErrored;
            return true;
        } catch (e) {
            console.log(e);
            return false;
        } finally {
            console.log(this.TAG + " playToEnd() completed! videoId: " + this.dto?.id);
        }
    }

    constructor(
        private readonly el: HTMLVideoElement,
        private readonly eventBus: EventBus,
        private readonly scale: ScaleService,
        dto?: DVideoDto
    ) {
        this.TAG = "[ D_Video ] : ";
        this.el.controls = false;
        DStyle.normalize(this.el);
        DStyle.applyStyles(this.el, this.defaultStyles, this.scale.scale);
        this._onReadyToPlay = this._onReadyToPlay.bind(this);
        this._onPlayHandler = this._onPlayHandler.bind(this);
        this._onPauseHandler = this._onPauseHandler.bind(this);
        this._onEndedHandler = this._onEndedHandler.bind(this);

        this.el.onended = this._onEndedHandler;
        this.el.onplay = this._onPlayHandler;
        this.el.onpause = this._onPauseHandler;
        this.el.oncanplay = this._onReadyToPlay;
        if (dto) {
            this.setDto(dto);
        }
        this.el.onloadedmetadata = () => {
            const duration = this.el.duration;
            const isInfinity = DUtil.isInfinity(duration);
            this.eventBus.emit({
                kind: "VIDEO_LOADED_METADATA_EVENT",
                timestamp: DTimestamp.now(),
                producer: "DVideo",
                producerId: this.id,
                data: { duration, isInfinity },
            });
        };
        // TODO USE THIS SYNTAX?
        this.el.ondurationchange = () => {
            const duration = this.el.duration;
            const isInfinity = DUtil.isInfinity(duration);
            this.eventBus.emit({
                kind: "VIDEO_DURATION_CHANGE_EVENT",
                producer: "DVideo",
                producerId: this.id,
                timestamp: DTimestamp.now(),
                data: { duration, isInfinity },
            });
        };
    }

    getStats() {
        const duration = this.el.duration;
        const currentTime = this.el.currentTime;
        const volume = this.el.volume;
        const isConnected = this.el.isConnected;
        const playbackQuality = this.el.getVideoPlaybackQuality();
        const defaultPlaybackRate = this.el.defaultPlaybackRate;
        const paused = this.el.paused;
        const played = this.el.played;

        return {
            duration,
            paused,
            played,
            currentTime,
            volume,
            isConnected,
            playbackQuality,
            defaultPlaybackRate,
        };
    }

    setDto(dto: DVideoDto) {
        this.dto = dto;
        this.el.volume = 1;
        this.setStyle(dto.style);
        this.el.src = dto.url;
        this.el.load();
    }

    getCurrentDto(): DVideoDto | false {
        return this.dto ?? false;
    }

    setStyle(styles: Partial<DStyle>) {
        DStyle.applyStyles(this.el, styles, this.scale.scale);
    }

    private _onPlayHandler(_: Event) {
        const producerId = this.dto?.id ?? "DVideo";
        this.eventBus.emit({
            kind: "VIDEO_PLAY_EVENT",
            data: {},
            producer: "DVideo",
            producerId,
            timestamp: DTimestamp.now(),
        });
    }

    private get id() {
        return this.dto?.id ?? "DVideo";
    }

    private _onReadyToPlay(_: Event) {
        // console.groupCollapsed();
        // console.group(this.TAG + 'READY TO PLAY');
        console.groupCollapsed(this.TAG + "READY TO PLAY");
        console.log("Duration: " + this.el.duration);
        console.log("Id: " + this.id);
        console.log("Current Time: " + this.el.currentTime);
        console.log("AudoPlay: " + this.el.autoplay);
        console.groupEnd();
    }

    private _onPauseHandler(_: Event) {
        this.eventBus.emit({
            kind: "VIDEO_PAUSED_EVENT",
            data: {},
            producer: "DVideo",
            producerId: this.id,
            timestamp: DTimestamp.now(),
        });
    }

    private _onErrorHandler(ev: Event) {
        this.eventBus.emit({
            kind: "VIDEO_ERROR_EVENT",
            timestamp: DTimestamp.now(),
            producer: "DVideo",
            producerId: this.id,
            data: { error: ev },
        });
    }

    private _onEndedHandler(_: Event) {
        this.eventBus.emit({
            kind: "VIDEO_ENDED_EVENT",
            timestamp: DTimestamp.now(),
            producer: "DVideo",
            producerId: this.id,
            data: {},
        });
    }
}
