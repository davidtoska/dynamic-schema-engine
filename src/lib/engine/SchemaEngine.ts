import { SchemaDto } from "../SchemaDto";
import { DMediaManager } from "../services/DMedia-manager";
import { DCommandBus } from "../events-and-actions/DCommandBus";
import { EventBus } from "../events-and-actions/event-bus";
import { DPlayer } from "../player/dplayer";
import { AnsweredQuestion } from "../player/history-que";
import { DTimestamp } from "../common/DTimestamp";
import { DPage } from "./DPage";
import { Scale, ScaleService } from "./scale";

export class SchemaEngine {
    private readonly commandBus = new DCommandBus();
    private readonly eventBus: EventBus;
    private readonly mediaManager: DMediaManager;
    private readonly scale: ScaleService;
    private readonly hostElement: HTMLDivElement;
    private readonly uiContainer: HTMLDivElement = document.createElement("div");
    private readonly mediaContainer: HTMLDivElement = document.createElement("div");
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
        this.eventBus = new EventBus();
        this.scale = new ScaleService({
            baseHeight: schema.baseHeight,
            baseWidth: schema.baseWidth,
            containerWidth: width,
            containerHeight: height,
        });
        this.mediaManager = new DMediaManager(this.mediaContainer, this.commandBus, this.eventBus, this.scale);
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
        const commandSubscription = this.commandBus.subscribe((command) => {
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
    }
    private styleSelf() {
        this.hostElement.style.height = this.scale.pageHeight + "px";
        this.hostElement.style.width = this.scale.pageWidth + "px";
        this.hostElement.style.backgroundColor = "gray";
        this.hostElement.style.position = "relative";
        this.hostElement.style.overflow = "hidden";
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
