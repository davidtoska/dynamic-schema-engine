declare namespace DCss {
    interface Px {
        readonly _unit: "px";
        readonly value: number;
    }
    type LengthString = `${number}px` | `${number}%`;
    interface Percent {
        readonly _unit: "percent";
        readonly value: number;
    }
    type LengthUnit = Px | Percent;
    /**
     * Will scale to 3% of baseScale
     * @param unit
     * @param scale
     */
    const toString: (unit: Readonly<LengthUnit>, scale: number) => LengthString;
    const isLengthUnit: (unit?: LengthUnit) => unit is LengthUnit;
}

interface DStyle {
    opacity: number;
    backgroundColor: string;
    visibility: "visible" | "hidden";
    cursor: "pointer" | "help" | "copy" | "wait" | "not-allowed" | "context-menu" | "move" | "grabbing" | "grab" | "zoom-in" | "zoom-out" | "none" | "auto" | "default";
    h: number;
    w: number;
    x: number;
    y: number;
    borderStyle: "solid" | "none" | "dotted" | "dashed";
    borderRadius: DCss.Px | DCss.Percent;
    borderWidth: DCss.Px;
    borderColor: string;
    margin: DCss.Px | DCss.Percent;
    padding: DCss.Px | DCss.Percent;
    transform: string;
    translate: string;
    fontSize: DCss.Px;
    textColor: string;
    fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    textAlign: "right" | "left" | "center";
    letterSpacing: DCss.Px;
}
declare namespace DStyle {
    const normalize: <T extends HTMLElement>(el: T) => T;
    const applyStyles: <T extends HTMLElement>(el: T, style: Partial<DStyle>, scale: number) => T;
}

declare namespace ID {
    type PageId = string & {
        __pageId: true;
    };
    const pageId: () => PageId;
    type ElementId = string & {
        __elementId: true;
    };
    const elementId: () => ElementId;
}

interface AnimationDto {
    readonly keyframes: Keyframe[];
    readonly options: {
        duration: number;
        startIn?: number;
    };
}

type Fact = Fact.Numeric | Fact.String;
declare namespace Fact {
    interface Numeric {
        readonly kind: "numeric-fact";
        readonly value: number;
        readonly label: string;
        readonly referenceId: string;
        readonly referenceLabel: string;
    }
    interface String {
        readonly kind: "string-fact";
        readonly label: string;
        readonly value: string;
        readonly referenceId: string;
        readonly referenceLabel: string;
    }
}

type Condition = Condition.String | Condition.Numeric | Condition.Complex;
declare namespace Condition {
    type StringOperator = "eq" | "not-eq" | "longer-then" | "shorter-then";
    type NumericOperator = "eq" | "not-eq" | "greater-then" | "less-then" | "greater-then-inclusive" | "less-then-inclusive";
    interface Numeric {
        readonly referenceId: string;
        readonly referenceLabel: string;
        readonly valueLabel: string;
        readonly kind: "numeric-condition";
        readonly operator: NumericOperator;
        readonly value: number;
    }
    interface String {
        readonly referenceId: string;
        readonly referenceLabel: string;
        readonly valueLabel: string;
        readonly kind: "string-condition";
        readonly operator: StringOperator;
        readonly value: string;
    }
    interface Complex {
        readonly kind: "complex-condition";
        readonly name: string;
        readonly all: ReadonlyArray<Condition.Simple>;
        readonly some: ReadonlyArray<Condition.Simple>;
    }
    type Simple = Condition.String | Condition.Numeric;
    /**
     * An empty condition will evaluate to false,
     * @param condition: Condition.Any
     * @param facts
     */
    const evaluate: (condition: Condition, facts: ReadonlyArray<Fact>) => boolean;
    const isEmpty: (complex: Complex) => boolean;
    const getAllSimpleConditions: (condition: Condition | Array<Condition>) => ReadonlyArray<Condition.Simple>;
}

type DTimestamp = number & {
    __timestamp__: true;
};
declare namespace DTimestamp {
    const now: () => DTimestamp;
    type Diff = number & {
        __diff__: true;
    };
    const diff: (t1: DTimestamp, t2: DTimestamp) => Diff;
    const diffNow: (t: DTimestamp) => Diff;
}

interface AnsweredQuestion {
    readonly timestamp: DTimestamp;
    readonly fact: Fact;
}
declare namespace AnsweredQuestion {
    const eq: (a: AnsweredQuestion, b: AnsweredQuestion) => boolean;
}

type EventProducer = "DVideo" | "DUser" | "DAudio" | "DImage" | "MediaManager" | "DPage" | "Window" | "HOST" | "RuleEngine" | "Engine" | "STATE-SERVICE";
interface Ev<K extends EventKind, P extends EventProducer, T> {
    readonly kind: K;
    readonly timestamp: DTimestamp;
    readonly producer: P;
    readonly producerId: string;
    readonly data: T;
}
type EventKind = `${Uppercase<string>}_EVENT`;
type QueryChangedEvent = Ev<"STATE_QUERY_RESULT_CHANGED_EVENT", "STATE-SERVICE", DState.StateQueryResult>;
type AudioPlayEvent = Ev<"AUDIO_PLAY_EVENT", "DAudio", {}>;
type DAudioEvent = AudioPlayEvent | Ev<"AUDIO_PAUSED_EVENT", "DAudio", {}> | Ev<"AUDIO_ENDED_EVENT", "DAudio", {}> | Ev<"AUDIO_ERROR_EVENT", "DAudio", {
    error: unknown;
}> | Ev<"AUDIO_METADATA_LOADED_EVENT", "DAudio", {}> | Ev<"AUDIO_LOAD_EVENT", "DAudio", {}> | Ev<"AUDIO_CAN_PLAY_THROUGH_EVENT", "DAudio", {}> | Ev<"AUDIO_DURATION_CHANGE_EVENT", "DAudio", {
    duration: number;
    isInfinity: boolean;
}> | Ev<"AUDIO_PROGRESS_EVENT", "DAudio", {}>;
type DVideoEvent = Ev<"VIDEO_PLAY_EVENT", "DVideo", {}> | Ev<"VIDEO_PAUSED_EVENT", "DVideo", {}> | Ev<"VIDEO_ERROR_EVENT", "DVideo", {
    error: unknown;
}> | Ev<"VIDEO_EVENT", "DVideo", {
    error: unknown;
}> | Ev<"VIDEO_LOADED_METADATA_EVENT", "DVideo", {
    duration: number;
    isInfinity: boolean;
}> | Ev<"VIDEO_DURATION_CHANGE_EVENT", "DVideo", {
    duration: number;
    isInfinity: boolean;
}> | Ev<"VIDEO_PROGRESS_EVENT", "DVideo", {
    duration: number;
    progress: number;
}> | Ev<"VIDEO_ENDED_EVENT", "DVideo", {}>;
type DImageEvent = Ev<"IMAGE_LOADED_EVENT", "DImage", {
    naturalHeight: number;
    naturalWidth: number;
    loadTime: DTimestamp.Diff;
    height: number;
    width: number;
}> | Ev<"IMAGE_ERROR_EVENT", "DImage", {
    error: unknown;
}>;
type DPageEvents = Ev<"PAGE_ENTER_EVENT", "DPage", {
    pageId: ID.PageId;
}> | Ev<"PAGE_COMPLETED_EVENT", "DPage", {
    pageId: ID.PageId;
    answers: AnsweredQuestion[];
}>;
type DWindowEvents = Ev<"WINDOW_VISIBILITY_CHANGE_EVENT", "Window", {}> | Ev<"WINDOW_ONLINE_STATUS_CHANGE_EVENT", "Window", {}>;
type DEvent = DImageEvent | DAudioEvent | DVideoEvent | DPageEvents | DWindowEvents | QueryChangedEvent | Ev<"USER_CLICKED_EVENT", "DUser", {
    elementId: ID.ElementId;
}> | Ev<"RULE_MATCH_EVENT", "Window", {
    ruleId: string;
}> | Ev<"ENGINE_SCHEMA_LOADED_EVENT", "Engine", {
    pageCount: number;
    hostHeight: number;
    hostWidth: number;
    scale: number;
}> | Ev<"HOST_SCALE_CHANGED_EVENT", "HOST", {
    scale: number;
}>;

declare namespace DState {
    interface PropDefinition<TypeName, Type extends string | number> {
        readonly _type: TypeName;
        readonly propName: string;
        readonly propDescription: string;
        readonly initialValue?: Type;
        readonly options?: ReadonlyArray<PropValue<Type>>;
    }
    export type NumericProp = PropDefinition<"number", number>;
    export type StringProp = PropDefinition<"string", string>;
    export interface fromEventHandler {
        readonly onEvent: DEvent["kind"];
        readonly thenExecute: ReadonlyArray<StateCommand>;
    }
    export interface PropValue<T> {
        readonly value: T;
        readonly valueLabel: string;
    }
    export type Prop = NumericProp | StringProp;
    export interface SetStringMutation {
        readonly kind: "set-string";
        readonly propName: string;
        readonly value: string;
    }
    export interface IncrementNumberMutation {
        readonly kind: "increment-number";
        readonly propName: string;
        readonly stepSize: number;
        readonly ifNotExistThenSetTo: number;
    }
    export interface DecrementNumberMutation {
        readonly kind: "decrement-number";
        readonly propName: string;
        readonly stepSize: number;
        readonly ifNotExistThenSetTo: number;
    }
    export interface SetNumberMutation {
        readonly kind: "set-number";
        readonly propName: string;
        readonly value: number;
    }
    export type NumberMutations = IncrementNumberMutation | DecrementNumberMutation | SetNumberMutation;
    export type StateMutation = SetStringMutation | NumberMutations;
    export const isNumberMutation: (mutations: StateMutation) => mutations is NumberMutations;
    export const isStringMutation: (mutation: StateMutation) => mutation is SetStringMutation;
    export interface StateQuery {
        readonly name: string;
        readonly condition: Condition;
    }
    export interface StateQueryResult {
        readonly queryName: string;
        readonly prev: boolean;
        readonly curr: boolean;
    }
    export const numericPropToFact: (prop: NumericProp, value: number) => Fact.Numeric;
    export const stringPropToFact: (prop: StringProp, value: string) => Fact.String;
    export {};
}

type CommandTarget = "VIDEO" | "AUDIO" | "ELEMENT" | "PAGE_QUE" | "ENGINE" | "STATE";
type CommandKind = `${Uppercase<CommandTarget>}_${Uppercase<string>}_COMMAND`;
type StateCommand = CommandDto<"STATE_MUTATE_COMMAND", "STATE", {
    mutation: DState.StateMutation;
}>;
type NavigationCommand = CommandDto<"PAGE_QUE_NEXT_PAGE_COMMAND", "PAGE_QUE", {}> | CommandDto<"PAGE_QUE_GO_TO_SEQUENCE_COMMAND", "PAGE_QUE", {
    sequenceId: string;
}> | CommandDto<"PAGE_QUE_GO_TO_PAGE_COMMAND", "PAGE_QUE", {
    pageId: ID.PageId;
}>;
type EngineCommand = CommandDto<"ENGINE_LEAVE_PAGE_COMMAND", "ENGINE", {
    readonly pageId: ID.PageId;
    readonly factsCollected: ReadonlyArray<Fact>;
}>;
interface CommandDto<K extends CommandKind, T extends CommandTarget, P> {
    readonly kind: K;
    readonly target: T;
    readonly targetId: T | ID.ElementId;
    readonly payload: P;
}
type VideoCommand = CommandDto<"VIDEO_PLAY_COMMAND", "VIDEO", {
    volume?: number;
}> | CommandDto<"VIDEO_SET_VOLUME_COMMAND", "VIDEO", {
    volume: number;
}> | CommandDto<"VIDEO_JUMP_TO_COMMAND", "VIDEO", {
    volume?: number;
    ms: number;
}> | CommandDto<"VIDEO_PAUSE_COMMAND", "VIDEO", {}>;
type AudioCommand = CommandDto<"AUDIO_PAUSE_COMMAND", "AUDIO", {}> | CommandDto<"AUDIO_PLAY_COMMAND", "AUDIO", {
    volume?: number;
    startAt?: number;
}> | CommandDto<"AUDIO_SET_VOLUME_COMMAND", "AUDIO", {
    volume: number;
}>;
type ElementCommand = CommandDto<"ELEMENT_ANIMATE_COMMAND", "ELEMENT", AnimationDto> | CommandDto<"ELEMENT_DISABLE_CLICK_COMMAND", "ELEMENT", {}> | CommandDto<"ELEMENT_ENABLE_CLICK_COMMAND", "ELEMENT", {}> | CommandDto<"ELEMENT_STYLE_COMMAND", "ELEMENT", {
    changes: Partial<DStyle>;
    clickIsAllowed?: boolean;
}>;
type PageQueCommand = CommandDto<"PAGE_QUE_EXCLUDE_BY_TAG_COMMAND", "PAGE_QUE", {
    tagIds: string[];
}> | CommandDto<"PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND", "PAGE_QUE", {
    pageIds: Array<ID.PageId>;
}> | CommandDto<"PAGE_QUE_JUMP_TO_PAGE_COMMAND", "PAGE_QUE", {
    readonly pageId: ID.PageId;
}>;
type DCommand = StateCommand | NavigationCommand | VideoCommand | AudioCommand | ElementCommand | EngineCommand | PageQueCommand;

/**
 * Autoplay video by Id.
 */
interface AutoPlayVideo {
    readonly kind: "autoplay-video";
    readonly muted?: boolean;
    readonly startAt?: number;
    readonly videoId: string;
}
interface AutoPlayAudio {
    readonly kind: "autoplay-audio";
    readonly audioId: string;
    readonly startAt?: number;
}
interface AutoPlayOverlay {
    readonly id: string;
    readonly kind: "autoplay-overlay";
    readonly startAt: number;
    readonly circleAt: {
        x: number;
        y: number;
        radius: number;
    };
}
interface DAutoPlaySequence {
    readonly id: string;
    readonly blockUserInput: boolean;
    readonly items: Array<AutoPlayAudio | AutoPlayVideo | AutoPlayOverlay>;
    readonly startCommands: ReadonlyArray<DCommand>;
    readonly endCommands: ReadonlyArray<DCommand>;
}

interface QueryChangedHandler {
    readonly queryName: string;
    readonly whenTrue: ReadonlyArray<ElementCommand>;
    readonly whenFalse: ReadonlyArray<ElementCommand>;
}
interface DEventHandler<E extends DEvent = DEvent> {
    readonly onEvent: E["kind"];
    readonly when?: {
        producerId?: string;
        condition?: Condition;
    };
    readonly thenExecute: ReadonlyArray<DCommand>;
}
declare namespace DEventHandler {
    type LookUp = Map<DEventHandler["onEvent"], Array<DEventHandler>>;
    const createLookUp: (handlers?: ReadonlyArray<DEventHandler>) => LookUp;
}

type DElementDto = DTextDto | DImgDto | DDivDto;
interface DStateListener {
    readonly onStateChange?: ReadonlyArray<QueryChangedHandler>;
}
interface DElementBaseDto extends DStateListener {
    readonly id: ID.ElementId;
    readonly style: Partial<DStyle>;
    readonly eventHandlers?: ReadonlyArray<DEventHandler>;
    readonly onClick?: ReadonlyArray<DCommand>;
}
interface DTextDto extends DElementBaseDto {
    readonly _tag: "p";
    readonly text: string;
}
interface DDivDto extends DElementBaseDto {
    readonly _tag: "div";
    readonly children: Array<DTextDto | DImgDto>;
}
interface DImgDto extends DElementBaseDto {
    readonly _tag: "img";
    readonly url: string;
}
interface DVideoDto extends DElementBaseDto {
    readonly _tag: "video";
    readonly url: string;
}
interface DAudioDto {
    readonly id: string;
    readonly _tag: "audio";
    readonly url: string;
    readonly eventHandlers: ReadonlyArray<DEventHandler>;
}

interface Rule<OnSuccessAction, OnFailureAction> {
    readonly id: string;
    readonly description: string;
    readonly all: ReadonlyArray<Condition>;
    readonly some: ReadonlyArray<Condition>;
    readonly onSuccess: ReadonlyArray<OnSuccessAction>;
    readonly onFailure: ReadonlyArray<OnFailureAction>;
}
declare namespace Rule {
    /**
     * Validates that the rule is valid.
     * @param rule
     */
    const isEmpty: (rule: Rule<any, any>) => boolean;
    const solve: (rule: Rule<any, any>, facts: ReadonlyArray<Fact>) => boolean;
}

type PageQueRules = Rule<PageQueCommand, never>;
interface PageDto {
    readonly id: ID.PageId;
    readonly elements: Array<DElementDto>;
    readonly tags?: string[];
    readonly mainVideoId?: string;
    readonly backgroundColor?: string;
    readonly video?: Array<DVideoDto>;
    readonly audio?: Array<DAudioDto>;
    readonly autoPlaySequence?: DAutoPlaySequence;
}
interface PageSequenceDto {
    readonly id: string;
    readonly rules: Array<PageQueRules>;
    readonly pages: Array<PageDto>;
}
interface SchemaDto {
    readonly id: string;
    readonly prefix: string;
    readonly baseHeight: number;
    readonly baseWidth: number;
    readonly backgroundColor: string;
    readonly pages: PageDto[];
    readonly rules: Array<PageQueRules>;
    readonly stateProps?: ReadonlyArray<DState.Prop>;
    readonly stateQueries?: ReadonlyArray<DState.StateQuery>;
    readonly stateFromEvent: ReadonlyArray<DState.fromEventHandler>;
    readonly pageSequences?: Array<PageSequenceDto>;
    readonly predefinedFacts?: ReadonlyArray<Fact>;
}
declare namespace SchemaDto {
    const getResources: (schema: SchemaDto) => {
        videoList: ReadonlyArray<DVideoDto>;
        audioList: ReadonlyArray<DAudioDto>;
        imageList: ReadonlyArray<DImgDto>;
    };
}

declare class SchemaEngine {
    private readonly height;
    private readonly width;
    private readonly schema;
    private readonly commandBus;
    private readonly eventBus;
    private readonly mediaManager;
    private readonly scale;
    private readonly hostElement;
    private readonly uiContainer;
    private readonly mediaContainer;
    private readonly resourceProvider;
    private readonly stateService;
    private readonly globalEventToStateHandlers;
    private player;
    private readonly subs;
    constructor(hostEl: HTMLDivElement, height: number, width: number, schema: SchemaDto);
    private hookUpListeners;
    private styleSelf;
    private nextPage;
}

interface SolveResult<S, F> {
    matching: ReadonlyArray<Match<S, F>>;
    errors: ReadonlyArray<RuleEngineError>;
}
interface Match<S, F> {
    readonly matchingRuleId: string;
    readonly ruleDescription: string;
    readonly actionList: ReadonlyArray<S> | ReadonlyArray<F>;
}
interface RuleEngineError {
    readonly kind?: string;
    readonly message: string;
}
declare class RuleEngine<S, F> {
    constructor();
    solveAll(rules: Rule<S, F>[], facts: Fact[]): SolveResult<S, F>;
    solve(rule: Rule<S, F>, facts: Fact[]): boolean;
}

declare class BooleanStateProperty<PropName extends string> {
    private readonly initialValue;
    readonly propName: PropName;
    private static readonly TRUE;
    private static readonly FALSE;
    readonly propDefinition: DState.NumericProp;
    get isTrueCondition(): Condition.Numeric;
    get isFalseCondition(): Condition.Numeric;
    get setTrueCommand(): StateCommand;
    get setFalseCommand(): StateCommand;
    constructor(propName: PropName, initialValue: boolean);
}

export { AnimationDto, AudioPlayEvent, BooleanStateProperty, Condition, DAudioDto, DAudioEvent, DDivDto, DElementBaseDto, DElementDto, DEvent, DEventHandler, DImageEvent, DImgDto, DPageEvents, DState, DTextDto, DVideoDto, DVideoEvent, DWindowEvents, Fact, Match, PageDto, PageQueRules, PageSequenceDto, QueryChangedEvent, QueryChangedHandler, Rule, RuleEngine, RuleEngineError, SchemaDto, SchemaEngine, SolveResult };
