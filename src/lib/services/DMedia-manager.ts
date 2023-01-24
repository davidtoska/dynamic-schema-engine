import { PageDto } from "../SchemaDto";
import { VideoContainer } from "../Delement/VideoContainer";
import { AudioContainer } from "../Delement/AudioContainer";
import { AutoPlayElement } from "../Delement/DAuto-play";
import { DCommandBus } from "../events-and-actions/DCommandBus";
import { DCommand } from "../events-and-actions/DCommand";
import { DTimestamp } from "../common/DTimestamp";
import { EventBus } from "../events-and-actions/event-bus";
import { ScaleService } from "../engine/scale";

export class DMediaManager {
    private readonly TAG = "[ D_MEDIA_MANAGER ] : ";
    private readonly videoContainer: VideoContainer;
    private readonly audioContainer: AudioContainer;
    private sequence: Array<AutoPlayElement> = [];
    private pageEnter: DTimestamp;
    private sincePageEnter: DTimestamp.Diff;
    private currentPage: PageDto | null = null;

    constructor(
        private hostEl: HTMLDivElement,
        private readonly actionService: DCommandBus,
        private readonly eventBus: EventBus,
        private readonly scale: ScaleService
    ) {
        const videoEl = document.createElement("video");
        const audioEl = document.createElement("audio");
        this.hostEl.append(videoEl);
        this.videoContainer = new VideoContainer(videoEl, eventBus, this.scale);
        this.audioContainer = new AudioContainer(audioEl, this.eventBus);
        this.tick = this.tick.bind(this);
        this.videoContainer.setStyle({ visibility: "hidden" });
        const now = DTimestamp.now();
        this.pageEnter = now;
        this.sincePageEnter = DTimestamp.diff(now, now);
        this.actionService.subscribe((action) => {
            this.commandHandler(action);
        });
    }

    setPage(page: PageDto) {
        this.currentPage = page;
        this.pageEnter = DTimestamp.now();
        const seq = page.autoPlaySequence;
        this.sequence = seq ? [...seq.items] : [];
        const { mainVideo, audio } = page;
        const audioElements = page.audio;

        if (mainVideo) {
            this.videoContainer.setDto(mainVideo);
            this.videoContainer.setStyle({ ...mainVideo.style, visibility: "visible" });
            // this.videoContainer.playToEnd();
        } else {
            this.videoContainer.setStyle({ visibility: "hidden" });
            // HIDE?
        }
        if (audioElements) {
            console.log(audioElements);

            const first = audioElements[0];
            if (first) {
                this.audioContainer.setAudio(first);
            }
        }
        this.playSequence();
        // const hasVideo =
    }

    private showVideo() {}

    private commandHandler(command: DCommand) {
        if (command.kind === "VIDEO_PLAY_COMMAND") {
            console.log(command);
            // this.video1.el.src;
            this.videoContainer
                .playToEnd()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (command.kind === "VIDEO_PAUSE_COMMAND") {
            this.videoContainer.pause();
        }
        if (command.kind === "AUDIO_PLAY_COMMAND") {
            console.log(command);
            this.audioContainer.playToEnd();
        }

        if (command.kind === "AUDIO_PAUSE_COMMAND") {
            // this.audio
        }
    }

    private async playSequence() {
        const seq = this.sequence;
        this.eventBus.emit({
            kind: "BLOCKING_MEDIA_START_EVENT",
            producer: "MediaManager",
            producerId: "MediaManager",
            timestamp: DTimestamp.now(),
            data: {},
        });
        console.log(seq);
        for (let i = 0; i < seq.length; i++) {
            const item = seq[i];
            if (item.kind === "autoplay-video") {
                this.videoContainer.setDto(item.dto);
                console.log("DE");
                await this.videoContainer.playToEnd();
                // await sleep(item.)
            }
            if (item.kind === "autoplay-audio") {
                console.log(item);
                this.audioContainer.setAudio(item.dto);
                await this.audioContainer.playToEnd();
            }
        }

        this.eventBus.emit({
            kind: "BLOCKING_MEDIA_END_EVENT",
            producer: "MediaManager",
            producerId: "MediaManager",
            timestamp: DTimestamp.now(),
            data: {},
        });
    }

    // setPage()

    private tick() {
        // console.log(this.video1.getStats());
    }
}
