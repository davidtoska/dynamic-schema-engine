import { PageDto } from "../SchemaDto";
import { VideoContainer } from "../Delement/VideoContainer";
import { AudioContainer } from "../Delement/AudioContainer";
import { DAutoPlaySequence } from "../Delement/DAuto-play";
import { DCommandBus } from "../commands/DCommandBus";
import { DCommand } from "../commands/DCommand";
import { DTimestamp } from "../common/DTimestamp";
import { EventBus } from "../events/event-bus";
import { ScaleService } from "../engine/scale";
import { ResourceProvider } from "./resource-provider";

export class DMediaManager {
    private readonly TAG = "[ D_MEDIA_MANAGER ] : ";
    private readonly videoContainer: VideoContainer;
    private readonly audioContainer: AudioContainer;
    // private sequence: Array<AutoPlayElement> = [];
    private pageEnter: DTimestamp;
    private sincePageEnter: DTimestamp.Diff;
    private currentPage: PageDto | null = null;

    constructor(
        private hostEl: HTMLDivElement,
        private readonly commandBus: DCommandBus,
        private readonly eventBus: EventBus,
        private readonly resourceProvider: ResourceProvider,
        private readonly scale: ScaleService
    ) {
        const videoEl = document.createElement("video");
        const audioEl = document.createElement("audio");
        this.hostEl.append(videoEl);
        this.videoContainer = new VideoContainer(videoEl, eventBus, this.scale);
        this.audioContainer = new AudioContainer(audioEl, this.eventBus, this.commandBus);
        this.tick = this.tick.bind(this);
        this.videoContainer.setStyle({ visibility: "hidden" });
        const now = DTimestamp.now();
        this.pageEnter = now;
        this.sincePageEnter = DTimestamp.diff(now, now);
        this.commandBus.subscribe((action) => {
            this.commandHandler(action);
        });
    }

    setPage(page: PageDto) {
        this.currentPage = page;
        this.pageEnter = DTimestamp.now();
        const seq = page.autoPlaySequence;
        // this.sequence = seq ? [...seq.items] : [];
        const { mainVideoId, audio } = page;
        const audioElements = page.audio;

        if (mainVideoId) {
            const dto = this.resourceProvider.getVideoById(mainVideoId);
            if (dto) {
                this.videoContainer.setDto(dto);
                this.videoContainer.setStyle({ ...dto.style, visibility: "visible" });
            }
            // this.videoContainer.playToEnd();
        } else {
            this.videoContainer.setStyle({ visibility: "hidden" });
            // HIDE?
        }
        if (audioElements) {
            const first = audioElements[0];
            if (first) {
                this.audioContainer.setAudio(first);
            }
        }
        if (seq) {
            this.playSequence(seq);
        }
        // const hasVideo =
    }

    private showVideo() {}

    private commandHandler(command: DCommand) {
        if (command.kind === "VIDEO_PLAY_COMMAND") {
            const video = command.targetId;
            const dto = this.videoContainer.getCurrentDto();
            if (dto && dto.id === command.targetId) {
                console.log(video);
                // TODO Load on demand.
                this.videoContainer
                    .playToEnd()
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
        if (command.kind === "VIDEO_PAUSE_COMMAND") {
            this.videoContainer.pause();
        }
        if (command.kind === "AUDIO_PLAY_COMMAND") {
            this.audioContainer
                .playToEnd()
                .then(() => {})
                .catch()
                .finally(() => {});
        }

        if (command.kind === "AUDIO_PAUSE_COMMAND") {
            // this.audio
        }
    }

    private async playSequence(seq: DAutoPlaySequence) {
        console.log(this.TAG + "SEQUENCE STARTED -- TODO EVENT FOR THIS??");
        const elements = seq.items;
        if (elements.length === 0) {
            return false;
        }
        seq.startCommands.forEach((c) => {
            this.commandBus.emit(c);
        });
        // this.commandBus.emit(DStateProps.mediaBlockedBySequence.setTrueCommand);
        // if (seq.blockUserInput) {
        //     this.commandBus.emit(DStateProps.inputBlockingBySequence.setTrueCommand);
        // }
        for (let i = 0; i < elements.length; i++) {
            const item = elements[i];
            if (item.kind === "autoplay-video") {
                const dto = this.resourceProvider.getVideoById(item.videoId);
                if (dto) this.videoContainer.setDto(dto);
                console.log("DE");
                await this.videoContainer.playToEnd();
                // await sleep(item.)
            }
            if (item.kind === "autoplay-audio") {
                console.log(item);
                const dto = this.resourceProvider.getAudioById(item.audioId);
                if (dto) this.audioContainer.setAudio(dto);
                await this.audioContainer.playToEnd();
            }
        }
        seq.endCommands.forEach((c) => {
            this.commandBus.emit(c);
        });
        // this.actionService.emit(DStateProps.mediaBlockedBySequence.setFalseCommand);
        // this.actionService.emit(DStateProps.inputBlockingBySequence.setFalseCommand);
        console.log(this.TAG + "SEQUENCE ENDED");
        return true;
    }

    // setPage()

    private tick() {
        // console.log(this.video1.getStats());
    }
}
