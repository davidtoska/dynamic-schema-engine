import { AnsweredQuestion, HistoryQue, PageHistory } from "./history-que";
import { DTimestamp } from "../common/DTimestamp";
import { PageDto } from "../dto/SchemaDto";
import { ID } from "../Delement/ID";
import PageId = ID.PageId;

const p = (id: number): PageDto => {
    return { id: ("" + id) as PageId, elements: [] };
};

const answer = (id: number, value: number): AnsweredQuestion => ({
    timestamp: DTimestamp.now(),
    fact: {
        referenceId: "" + id,
        referenceLabel: "label-for-" + id,
        value,
        label: "value-label " + value,
        kind: "numeric-fact",
    },
});
const h = (page: PageDto, answeredQuestions: AnsweredQuestion[]): PageHistory => ({
    pageId: page.id,
    answeredQuestions,
});
const p1 = p(1);
const p2 = p(2);
const p3 = p(3);
const p4 = p(4);
const p5 = p(5);
const p6 = p(6);
const all = [p1, p2, p3, p4, p5, p6];

let history = new HistoryQue();
beforeEach(() => {
    history = new HistoryQue();
});

describe("HistoryQue", () => {
    it("should create an instance", () => {
        expect(history).toBeTruthy();
    });

    it("Can add history, and get facts back", () => {
        history.addToHistory(h(p1, [answer(1, 2)]));
        expect(history.getFacts().length).toBe(1);
    });
});
