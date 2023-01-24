import { DTimestamp } from "../common/DTimestamp";
import { ID } from "../ID";
import ElementId = ID.ElementId;
import { AnsweredQuestion } from "../player/history-que";
import PageId = ID.PageId;

type EventProducer =
    | "DHtml"
    | "DVideo"
    | "User"
    | "DAudio"
    | "DImage"
    | "MediaManager"
    | "DPage"
    | "Window"
    | "HOST"
    | "RuleEngine"
    | "Engine";
interface Ev<K extends EventKind, P extends EventProducer, T> {
    readonly kind: K;
    readonly timestamp: DTimestamp;
    readonly producer: P;
    readonly producerId: string;
    readonly data: T;
}

type EventKind = `${Uppercase<string>}_EVENT`;

export type DEvent =
    | Ev<"VIDEO_PLAY_EVENT", "DVideo", {}>
    | Ev<"VIDEO_PAUSED_EVENT", "DVideo", {}>
    | Ev<"VIDEO_ERROR_EVENT", "DVideo", { error: unknown }>
    | Ev<"VIDEO_EVENT", "DVideo", { error: unknown }>
    | Ev<"VIDEO_ENDED_EVENT", "DVideo", {}>
    | Ev<"AUDIO_PLAY_EVENT", "DAudio", {}>
    | Ev<"AUDIO_PAUSED_EVENT", "DAudio", {}>
    | Ev<"BLOCKING_MEDIA_START_EVENT", "MediaManager", {}>
    | Ev<"BLOCKING_MEDIA_END_EVENT", "MediaManager", {}>
    | Ev<"USER_CLICKED_EVENT", "User", { elementId: ElementId }>
    | Ev<"AUDIO_ENDED_EVENT", "DAudio", {}>
    | Ev<"AUDIO_ERROR_EVENT", "DAudio", { error: unknown }>
    | Ev<"PAGE_ENTER_EVENT", "DPage", {}>
    | Ev<"PAGE_LEAVE_EVENT", "DPage", {}>
    | Ev<"PAGE_COMPLETED_EVENT", "DPage", { pageId: PageId; answers: AnsweredQuestion[] }>
    | Ev<"WINDOW_VISIBILITY_CHANGE_EVENT", "Window", {}>
    | Ev<"WINDOW_ONLINE_STATUS_CHANGE_EVENT", "Window", {}>
    | Ev<"RULE_MATCH_EVENT", "Window", { ruleId: string }>
    | Ev<
          "ENGINE_SCHEMA_LOADED_EVENT",
          "Engine",
          { pageCount: number; hostHeight: number; hostWidth: number; scale: number }
      >
    | Ev<"HOST_SCALE_CHANGED_EVENT", "HOST", { scale: number }>;
