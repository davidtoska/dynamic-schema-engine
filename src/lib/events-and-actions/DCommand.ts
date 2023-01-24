import { DStyle } from "../Delement/DStyle";
import { ID } from "../ID";
import { AnimationDto } from "../AnimationDto";
import PageId = ID.PageId;
import ElementId = ID.ElementId;
import { Fact } from "../rules/fact";

type CommandTarget = "VIDEO" | "AUDIO" | "ELEMENT" | "PAGE_QUE" | "ENGINE";
type CommandKind = `${Uppercase<CommandTarget>}_${Uppercase<string>}_COMMAND`;

export type NavigationCommand =
    | CommandDto<"PAGE_QUE_NEXT_PAGE_COMMAND", "PAGE_QUE", {}>
    | CommandDto<"PAGE_QUE_GO_TO_SEQUENCE_COMMAND", "PAGE_QUE", { sequenceId: string }>
    | CommandDto<"PAGE_QUE_GO_TO_PAGE_COMMAND", "PAGE_QUE", { pageId: PageId }>;

export type EngineCommand = CommandDto<
    "ENGINE_LEAVE_PAGE_COMMAND",
    "ENGINE",
    {
        readonly pageId: PageId;
        readonly factsCollected: ReadonlyArray<Fact>;
    }
>;
export interface CommandDto<K extends CommandKind, T extends CommandTarget, P> {
    readonly kind: K;
    readonly target: T;
    readonly targetId: T | ElementId;
    readonly payload: P;
}
export type VideoCommand =
    | CommandDto<"VIDEO_PLAY_COMMAND", "VIDEO", { volume?: number }>
    | CommandDto<"VIDEO_SET_VOLUME_COMMAND", "VIDEO", { volume: number }>
    | CommandDto<"VIDEO_JUMP_TO_COMMAND", "VIDEO", { volume?: number; ms: number }>
    | CommandDto<"VIDEO_PAUSE_COMMAND", "VIDEO", {}>;

export type AudioCommand =
    | CommandDto<"AUDIO_PAUSE_COMMAND", "AUDIO", {}>
    | CommandDto<"AUDIO_PLAY_COMMAND", "AUDIO", { volume?: number }>
    | CommandDto<"AUDIO_SET_VOLUME_COMMAND", "AUDIO", { volume: number }>
    | CommandDto<"AUDIO_JUMP_TO_COMMAND", "AUDIO", { volume?: number; ms: number }>;

export type StyleCommand =
    | CommandDto<"ELEMENT_ANIMATE_COMMAND", "ELEMENT", AnimationDto>
    | CommandDto<"ELEMENT_STYLE_COMMAND", "ELEMENT", { changes: Partial<DStyle> }>;

export type RuleCommand =
    | CommandDto<"PAGE_QUE_EXCLUDE_BY_TAG_COMMAND", "PAGE_QUE", { tagIds: string[] }>
    | CommandDto<"PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND", "PAGE_QUE", { pageIds: Array<PageId> }>
    | CommandDto<"PAGE_QUE_JUMP_TO_PAGE_COMMAND", "PAGE_QUE", { readonly pageId: PageId }>;

export type DCommand = NavigationCommand | VideoCommand | AudioCommand | StyleCommand | EngineCommand | RuleCommand;
