import { SchemaDto } from "../dto/SchemaDto";
import { DMediaManager } from "../services/DMedia-manager";
import { DCommandBus } from "../commands/DCommandBus";
import { EventBus } from "../events/event-bus";
import { DPlayer } from "../player/dplayer";
import { AnsweredQuestion } from "../player/history-que";
import { DTimestamp } from "../common/DTimestamp";
import { DPage } from "./DPage";
import { ScaleService } from "./scale";
import { ResourceProvider } from "../services/resource-provider";
import { StateService } from "../state/state-service";
import { StateCommand } from "../commands/DCommand";

export class SchemaEngine {
    private readonly commandBus = new DCommandBus();
    private readonly eventBus = new EventBus();
    private readonly mediaManager: DMediaManager;
    private readonly scale: ScaleService;
    private readonly hostElement: HTMLDivElement;
    private readonly uiContainer: HTMLDivElement = document.createElement("div");
    private readonly mediaContainer: HTMLDivElement = document.createElement("div");
    private readonly resourceProvider: ResourceProvider;
    private readonly stateService: StateService;
    private readonly globalEventToStateHandlers = new Map<string, ReadonlyArray<StateCommand>>();
    private player: DPlayer;
    private readonly subs: Array<() => void> = [];

    constructor(
        hostEl: HTMLDivElement,
        private readonly height: number,
        private readonly width: number,
        private readonly schema: SchemaDto
    ) {
        this.hostElement = hostEl;
        this.hostElement.appendChild(this.uiContainer);
        this.hostElement.appendChild(this.mediaContainer);
        const stateProps = this.schema.stateProps ?? [];
        const stateQueries = this.schema.stateQueries ?? [];
        this.stateService = new StateService(this.eventBus, this.commandBus, stateProps, stateQueries);
        this.scale = new ScaleService({
            baseHeight: schema.baseHeight,
            baseWidth: schema.baseWidth,
            containerWidth: width,
            containerHeight: height,
        });
        const globalEventHandlers = schema.stateFromEvent ?? [];
        globalEventHandlers.forEach((h) => {
            this.globalEventToStateHandlers.set(h.onEvent, h.thenExecute);
        });

        const resources = SchemaDto.getResources(this.schema);
        this.resourceProvider = new ResourceProvider({ videos: resources.videoList, audio: resources.audioList });
        this.mediaManager = new DMediaManager(
            this.mediaContainer,
            this.commandBus,
            this.eventBus,
            this.resourceProvider,
            this.scale
        );
        this.player = new DPlayer(this.schema);
        this.styleSelf();
        this.nextPage();
        this.hookUpListeners();
        // setInterval(() => {
        //     const scale = Math.random() * 1.3;
        //     this.scale.setContainerBounds({
        //         height: this.schema.baseHeight * scale,
        //         width: this.schema.baseWidth * scale,
        //     });
        //     this.styleSelf();
        //     this.eventBus.emit({
        //         kind: "HOST_SCALE_CHANGED_EVENT",
        //         timestamp: DTimestamp.now(),
        //         producer: "HOST",
        //         producerId: "HOST",
        //         data: { scale: scale },
        //     });
        // }, 2000);
    }

    private hookUpListeners() {
        const eventSubscription = this.eventBus.subscribe((ev) => {
            const globalHandlers = this.globalEventToStateHandlers.get(ev.kind) ?? [];
            globalHandlers.forEach((stateCommand) => {
                this.commandBus.emit(stateCommand);
            });
        });
        const commandSubscription = this.commandBus.subscribe((command) => {
            // switch (command.kind) {
            //
            // }
            if (command.kind === "PAGE_QUE_NEXT_PAGE_COMMAND") {
                this.nextPage();
            }

            if (command.kind === "ENGINE_LEAVE_PAGE_COMMAND") {
                const pageId = command.payload.pageId;
                const facts = command.payload.factsCollected;
                const timestamp = DTimestamp.now();
                const ans: AnsweredQuestion[] = facts.map((f) => ({
                    timestamp,
                    fact: f,
                }));

                this.player.saveHistory({
                    answeredQuestions: ans,
                    pageId,
                });

                this.nextPage();
                // const history: PageHistory = { page: {}, answeredQuestions: [] };
            }
        });

        this.subs.push(commandSubscription);
        this.subs.push(eventSubscription);
    }

    private styleSelf() {
        this.hostElement.style.height = this.scale.pageHeight + "px";
        this.hostElement.style.width = this.scale.pageWidth + "px";
        this.hostElement.style.backgroundColor = this.schema.backgroundColor ?? "white";
        this.hostElement.style.position = "relative";
        // this.hostElement.style.overflow = "hidden";
        const makeStatic = (div: HTMLDivElement) => {
            div.style.height = "0px";
            div.style.width = "0px";
            div.style.position = "static";
        };

        makeStatic(this.uiContainer);
        makeStatic(this.mediaContainer);
    }

    private nextPage() {
        const nextPage = this.player.getNextPage();
        // TODO CLEAN UP PAGE COMPONENTS this.page.CleanUp()
        this.uiContainer.innerHTML = "";
        if (!nextPage) {
            // TODO FIGURE OUT WHAQT TO DO AT END OF TEST!! Start over??
            this.player = new DPlayer(this.schema);
            if (this.schema.pages.length > 0) {
                this.nextPage();
            }
            return false;
        }

        const newPage = new DPage(nextPage, this.eventBus, this.commandBus, this.scale);
        newPage.appendYourself(this.uiContainer);

        this.mediaManager.setPage(nextPage);
        return true;
    }
}
