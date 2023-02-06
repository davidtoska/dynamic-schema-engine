import { DCommand } from "../commands/DCommand";

export interface AutoPlayVideo {
    readonly kind: "autoplay-video";
    readonly muted?: boolean;
    readonly startAt?: number;
    readonly videoId: string;
}

export interface AutoPlayPause {
    readonly kind: "autoplay-pause";
    readonly duration: number;
}

export interface AutoPlayAudio {
    readonly kind: "autoplay-audio";
    readonly audioId: string;
    readonly startAt?: number;
}

export interface AutoPlayOverlay {
    readonly id: string;
    readonly kind: "autoplay-overlay";
    readonly startAt: number;
    readonly circleAt: { x: number; y: number; radius: number };
}

export type AutoPlayElement = AutoPlayOverlay | AutoPlayVideo | AutoPlayAudio | AutoPlayPause;

export interface DAutoPlaySequence {
    readonly id: string;
    readonly blockUserInput: boolean;
    readonly items: Array<AutoPlayAudio | AutoPlayVideo | AutoPlayOverlay>;
    readonly startCommands: ReadonlyArray<DCommand>;
    readonly endCommands: ReadonlyArray<DCommand>;
}
