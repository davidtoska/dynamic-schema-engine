import { DAudioDto, DImgDto, DVideoDto } from "../dto/DElement.dto";

export class ResourceProvider {
    private readonly TAG = "[ RESOURCE_PROVIDER ]: ";
    private readonly videoMap = new Map<string, DVideoDto>();
    private readonly audioMap = new Map<string, DAudioDto>();
    constructor(data: { videos: ReadonlyArray<DVideoDto>; audio: ReadonlyArray<DAudioDto> }) {
        // console.log(this.TAG + "VIDEO_COUNT " + data.videos.length);
        // console.log(this.TAG + "AUDIO_COUNT " + data.audio.length);
        data.videos.forEach((video) => {
            this.videoMap.set(video.id, video);
        });
        data.audio.forEach((audio) => {
            this.audioMap.set(audio.id, audio);
        });
    }

    getAudioById(id: string): DAudioDto | false {
        const maybeAudio = this.audioMap.get(id);
        if (!maybeAudio) {
            console.error(this.TAG + "Audio by id " + id + " dont exist");
        }
        return maybeAudio ?? false;
    }

    getVideoById(id: string): DVideoDto | false {
        const maybeVideo = this.videoMap.get(id);
        if (!maybeVideo) {
            console.error(this.TAG + "Video by id " + id + " dont exist");
        }
        return maybeVideo ?? false;
    }
}
