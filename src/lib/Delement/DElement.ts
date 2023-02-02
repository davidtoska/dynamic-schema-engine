import { DStyle } from "./DStyle";
import { DElementBaseDto } from "../DElement.dto";
import { DCommand } from "../commands/DCommand";
import { DCommandBus } from "../commands/DCommandBus";
import { DEventHandler } from "../event-handlers/DEventHandler";
import { DUtil } from "../utils/DUtil";
import { EventBus } from "../events/event-bus";
import { ID } from "../ID";
import ElementId = ID.ElementId;
import { DTimestamp } from "../common/DTimestamp";
import { AnimationDto } from "../AnimationDto";
import { ScaleService } from "../engine/scale";

export abstract class DElement<T extends HTMLElement> {
    protected readonly el: T;
    private clickHandlerIsEnabled = true;
    readonly id: ElementId;
    private isAnimatingSelf = false;
    protected currStyle: Partial<DStyle> = {
        fontSize: { _unit: "px", value: 100 },
        fontWeight: 500,
        textColor: "black",
        opacity: 1,
    };

    private readonly eventHandlers: DEventHandler.LookUp;
    protected readonly commandBud: DCommandBus;
    protected readonly eventBus: EventBus;
    protected scale: ScaleService;
    private readonly baseDto: DElementBaseDto;

    protected constructor(
        el: T,
        eventBus: EventBus,
        commandBus: DCommandBus,
        dto: DElementBaseDto,
        scale: ScaleService
    ) {
        this.el = el;
        this.id = dto.id;
        this.baseDto = dto;
        // this.el.style.position = "absolute";
        this.commandBud = commandBus;
        this.eventBus = eventBus;
        this.eventHandlers = DEventHandler.createLookUp(dto.eventHandlers);
        this.scale = scale;
        // CLICK
        this.onClickHandler = this.onClickHandler.bind(this);
        this.el.onclick = this.onClickHandler;

        this.onContextMenuClick = this.onContextMenuClick.bind(this);
        this.el.oncontextmenu = this.onContextMenuClick;

        // HOVER
        this.onMouseOver = this.onMouseOver.bind(this);
        this.el.onmouseover = this.onMouseOver;

        if (dto) {
            this.updateStyles(dto?.style);
        }
        // TODO MEMORY LEAK
        this.eventBus.subscribe((event) => {
            const handlers = this.eventHandlers.get(event.kind) ?? [];

            // TODO Apply Conditions in WHEN.
            const commands = handlers.map((h) => h.thenExecute).flat(1);
            commands.forEach((command) => {
                this.doAction(command);
            });
            if (event.kind === "HOST_SCALE_CHANGED_EVENT") {
                console.log("HANDLE THIS SCALE CHANGE!!");
                this.updateStyles({});
            }
        });
        this.normalize();
    }

    // abstract setScale(scale: number): void;

    private doAction(command: DCommand) {
        switch (command.kind) {
            case "ELEMENT_STYLE_COMMAND":
                this.updateStyles(command.payload.changes);
                break;
            case "ELEMENT_ANIMATE_COMMAND":
                // TODO CHECK FOR TARGET ID
                this.handleAnimateSelfAction(command.payload);
                break;
            case "ELEMENT_ENABLE_CLICK_COMMAND":
                this.clickHandlerIsEnabled = true;
                // this.updateStyles(command.payload.changes);
                break;
            case "ELEMENT_DISABLE_CLICK_COMMAND":
                this.clickHandlerIsEnabled = false;
                // this.handleAnimateSelfAction(command.payload);
                break;
            case "VIDEO_PLAY_COMMAND":
                this.commandBud.emit(command);
                break;
            case "VIDEO_PAUSE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "ENGINE_LEAVE_PAGE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "VIDEO_JUMP_TO_COMMAND":
                this.commandBud.emit(command);
                break;
            case "VIDEO_SET_VOLUME_COMMAND":
                this.commandBud.emit(command);
                break;
            case "AUDIO_PLAY_COMMAND":
                this.commandBud.emit(command);
                break;
            case "AUDIO_PAUSE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "AUDIO_SET_VOLUME_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_NEXT_PAGE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_GO_TO_SEQUENCE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_GO_TO_PAGE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_JUMP_TO_PAGE_COMMAND":
                this.commandBud.emit(command);
                break;
            case "PAGE_QUE_EXCLUDE_BY_TAG_COMMAND":
                this.commandBud.emit(command);
                break;
            case "STATE_MUTATE_COMMAND":
                this.commandBud.emit(command);
                break;
            default:
                DUtil.neverCheck(command);
        }
    }

    private onClickHandler(_: MouseEvent) {
        if (!this.clickHandlerIsEnabled) {
            console.log(this.id + "Click disabled");
            return;
        }
        const clickAction = this.baseDto.onClick;
        if (clickAction && clickAction.length > 0) {
            this.eventBus.emit({
                kind: "USER_CLICKED_EVENT",
                producer: "DUser",
                producerId: this.id,
                data: { elementId: this.id },
                timestamp: DTimestamp.now(),
            });
            clickAction.forEach((command) => {
                this.commandBud.emit(command);
                // this.doAction(action);
            });
        }
    }

    private onContextMenuClick(_: MouseEvent) {}

    private onMouseOver(_: MouseEvent) {
        // console.log(ev);
    }

    setStyle(style: Partial<DStyle>) {
        this.updateStyles(style);
    }

    appendYourself(parent: HTMLElement) {
        parent.append(this.el);
        // console.log(parent);
    }

    private handleAnimateSelfAction(dto: AnimationDto) {
        this.isAnimatingSelf = true;
        const { keyframes, options } = dto;

        const animation = this.el.animate(keyframes, options.duration);
        animation.onfinish = (e: AnimationPlaybackEvent) => {
            console.log(e.type);
            this.isAnimatingSelf = false;
        };
        animation.onremove = () => {
            console.warn("ANIMATION REMOVED: " + animation.id);
            this.isAnimatingSelf = false;
        };
        animation.oncancel = () => {
            console.warn("ANIMATION CANCELED: " + animation.id);
            this.isAnimatingSelf = false;
        };
    }

    private normalize() {
        DStyle.normalize(this.el);
    }

    protected updateStyles(style: Partial<DStyle>) {
        this.currStyle = Object.assign(this.currStyle, style);
        DStyle.applyStyles(this.el, this.currStyle, this.scale.scale);
        window.getComputedStyle(this.el);
    }
}
