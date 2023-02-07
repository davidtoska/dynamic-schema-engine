export interface AnimationDto {
  readonly keyframes: Keyframe[];
  readonly options: { duration: number; startIn?: number };
}
