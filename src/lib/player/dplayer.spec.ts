import { DPlayer, DPlayerData } from "./dplayer";
import { PageDto, PageSequenceDto } from "../SchemaDto";
import { Rule } from "../rules/rule";
import { PageHistory } from "./history-que";
import { DTimestamp } from "../common/DTimestamp";
import { ID } from "../ID";
import PageId = ID.PageId;
import { PageQueCommand } from "../commands/DCommand";

const page = (id: number): PageDto => {
    return { id: ("" + id) as PageId, elements: [] };
};
const p1 = page(1);
const p2 = page(2);
const p3 = page(3);
const p4 = page(4);
const p5 = page(5);
const p6 = page(6);
const all = [p1, p2, p3, p4, p5, p6];
const Seq1 = {
    p10: page(10),
    p11: page(11),
    p12: page(12),
};

const seq1: PageSequenceDto = {
    id: "s1",
    pages: [Seq1.p10, Seq1.p11, Seq1.p12],
    rules: [],
};
const data = (
    pages: PageDto[],
    pageSequences: PageSequenceDto[] = [],
    rules: Rule<PageQueCommand, never>[] = []
): DPlayerData => ({ pages, pageSequences, rules });
// const seq = (pages: PageDto[], rules: Rule[]) => {};
beforeEach(() => {
    // data = { pages: [], rules: [], pageSequences: [] };
});

describe("DPlayer", () => {
    it("should create an instance", () => {
        const player = new DPlayer(data([p1, p1]));
        expect(player).toBeTruthy();
    });

    it("can app pages, and get next", () => {
        const player = new DPlayer(data([p1, p2]));

        expect(player.getNextPage()).toBe(p1);
        expect(player.getNextPage()).toBe(p2);
        expect(player.getNextPage()).toBe(false);
    });

    it("Can insert a sequence", () => {
        const player = new DPlayer(data(all, [seq1]));

        expect(player.getNextPage()).toBe(p1);
        expect(player.getNextPage()).toBe(p2);
        player.handleNavigationCommand({
            kind: "PAGE_QUE_GO_TO_SEQUENCE_COMMAND",
            target: "PAGE_QUE",
            targetId: "PAGE_QUE",
            payload: {
                sequenceId: seq1.id,
            },
        });
        expect(player.getNextPage()).toBe(Seq1.p10);
        expect(player.getNextPage()).toBe(Seq1.p11);
        expect(player.getNextPage()).toBe(Seq1.p12);
        expect(player.getNextPage()).toBe(p3);
    });

    it("Can jump forward to a pageId", () => {
        const player = new DPlayer(data(all));

        expect(player.getNextPage()).toBe(p1);
        player.handleNavigationCommand({
            kind: "PAGE_QUE_GO_TO_PAGE_COMMAND",
            target: "PAGE_QUE",
            targetId: "PAGE_QUE",
            payload: { pageId: p4.id },
        });
        expect(player.getNextPage()).toBe(p4);
    });

    it("Save history", () => {
        const player = new DPlayer(data(all));
        const curr = player.getNextPage() as PageDto;

        const history: PageHistory = {
            pageId: curr.id,
            answeredQuestions: [
                {
                    timestamp: DTimestamp.now(),
                    fact: {
                        referenceId: "as",
                        referenceLabel: "as-label",
                        kind: "numeric-fact",
                        label: "litt",
                        value: 2,
                    },
                },
            ],
        };
        player.saveHistory(history);
        expect(player.getNextPage()).toBe(p2);
        expect(player.getResults().length).toBe(1);
    });
});
