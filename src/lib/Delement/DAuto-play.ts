import { DAudioDto, DVideoDto } from '../DElement.dto';

export interface AutoPlayVideo {
  readonly id: string;
  readonly kind: 'autoplay-video';
  readonly muted: boolean;
  readonly mode: 'blocking' | 'non-blocking';
  readonly dto: DVideoDto;
}
export interface AutoPlayAudio {
  readonly id: string;
  readonly kind: 'autoplay-audio';
  readonly dto: DAudioDto;
  readonly startAt: number;
}
export interface AutoPlayOverlay {
  readonly id: string;
  readonly kind: 'autoplay-overlay';
  readonly startAt: number;
  readonly circleAt: { x: number; y: number; radius: number };
}

export type AutoPlayElement = AutoPlayOverlay | AutoPlayVideo | AutoPlayAudio;

export interface DAutoPlaySequence {
  readonly id: string;
  readonly blocking: boolean;
  readonly items: Array<AutoPlayAudio | AutoPlayVideo | AutoPlayOverlay>;
}
