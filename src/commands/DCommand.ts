import { DStyle } from "../Delement/DStyle";
import { AnimationDto } from "../dto/AnimationDto";
import { Fact } from "../rules/fact";
import { DState } from "../state/Dstate";

type CommandTarget = "VIDEO" | "AUDIO" | "ELEMENT" | "PAGE_QUE" | "ENGINE" | "STATE";
type CommandKind = `${Uppercase<CommandTarget>}_${Uppercase<string>}_COMMAND`;

export type StateCommand = CommandDto<"STATE_MUTATE_COMMAND", "STATE", { mutation: DState.StateMutation }>;
// export type StateCommand = CommandDto<"STATE_MUTATE_COMMAND", "STATE", { mutation: DState.StateMutation }>;

export type NavigationCommand =
    | CommandDto<"PAGE_QUE_NEXT_PAGE_COMMAND", "PAGE_QUE", {}>
    | CommandDto<"PAGE_QUE_GO_TO_SEQUENCE_COMMAND", "PAGE_QUE", { sequenceId: string }>
    | CommandDto<"PAGE_QUE_GO_TO_PAGE_COMMAND", "PAGE_QUE", { pageId: string }>;

export type EngineCommand = CommandDto<
    "ENGINE_LEAVE_PAGE_COMMAND",
    "ENGINE",
    {
        readonly pageId: string;
        readonly factsCollected: ReadonlyArray<Fact>;
    }
>;

interface CommandDto<K extends CommandKind, T extends CommandTarget, P> {
    readonly kind: K;
    readonly target: T;
    readonly targetId: T | Omit<string, T>;
    readonly payload: P;
}

export type VideoCommand =
    | CommandDto<"VIDEO_PLAY_COMMAND", "VIDEO", { volume?: number }>
    | CommandDto<"VIDEO_SET_VOLUME_COMMAND", "VIDEO", { volume: number }>
    | CommandDto<"VIDEO_JUMP_TO_COMMAND", "VIDEO", { volume?: number; ms: number }>
    | CommandDto<"VIDEO_PAUSE_COMMAND", "VIDEO", {}>;

export type AudioCommand =
    | CommandDto<"AUDIO_PAUSE_COMMAND", "AUDIO", {}>
    | CommandDto<"AUDIO_PLAY_COMMAND", "AUDIO", { volume?: number; startAt?: number }>
    | CommandDto<"AUDIO_SET_VOLUME_COMMAND", "AUDIO", { volume: number }>;

export type ElementCommand =
    | CommandDto<"ELEMENT_ANIMATE_COMMAND", "ELEMENT", AnimationDto>
    | CommandDto<"ELEMENT_DISABLE_CLICK_COMMAND", "ELEMENT", {}>
    | CommandDto<"ELEMENT_ENABLE_CLICK_COMMAND", "ELEMENT", {}>
    | CommandDto<"ELEMENT_STYLE_COMMAND", "ELEMENT", { changes: Partial<DStyle>; clickIsAllowed?: boolean }>;

export type PageQueCommand =
    | CommandDto<"PAGE_QUE_EXCLUDE_BY_TAG_COMMAND", "PAGE_QUE", { tagIds: string[] }>
    | CommandDto<"PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND", "PAGE_QUE", { pageIds: Array<string> }>
    | CommandDto<"PAGE_QUE_JUMP_TO_PAGE_COMMAND", "PAGE_QUE", { readonly pageId: string }>;

export type DCommand =
    | StateCommand
    | NavigationCommand
    | VideoCommand
    | AudioCommand
    | ElementCommand
    | EngineCommand
    | PageQueCommand;
