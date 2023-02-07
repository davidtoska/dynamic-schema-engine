import { NextQue } from "./next-que";
import { PageDto } from "../dto/SchemaDto";
import { ID } from "../Delement/ID";
import PageId = ID.PageId;

const tag1 = "tag1";
const tag2 = "tag2";
const tag3 = "tag3";

let que = new NextQue();
const createPage = () => {};
const p1: PageDto = { id: "1" as PageId, elements: [], tags: [tag1] };
const p2: PageDto = { id: "2" as PageId, elements: [], tags: [] };
const p3: PageDto = { id: "3" as PageId, elements: [], tags: [tag2] };
const p4: PageDto = { id: "4" as PageId, elements: [], tags: [] };
const p5: PageDto = { id: "5" as PageId, elements: [], tags: [tag3, tag2] };
const p6: PageDto = { id: "6" as PageId, elements: [], tags: [tag3] };
const all = [p1, p2, p3, p4, p5, p6];

beforeEach(() => {
    que = new NextQue();
});

describe("NextQue testing", () => {
    it("Can pop", () => {
        que.resetQue(all);
        expect(que.pop()).toBe(p1);
        expect(que.pop()).toBe(p2);
        expect(que.size).toBe(all.length - 2);
    });

    it("Can remove by tag", () => {
        que.resetQue(all);
        expect(que.size).toBe(6);
        que.removeByTag(tag3);
        expect(que.size).toBe(4);
        expect(que.peek()).toBe(p1);
        que.pop();
        expect(que.peek()).toBe(p2);
        expect(que.size).toBe(3);
    });

    it("Can remove by tags[]", () => {
        que.resetQue(all);
        que.removeByTag([tag3, tag2, tag1]);
        expect(que.size).toBe(2);
    });

    it("Can remove by pageIds[]", () => {
        que.resetQue(all);
        que.removeByPageId([p1.id, p2.id, p3.id]);
        expect(que.pop()).toBe(p4);
        expect(que.size).toBe(2);
    });

    it("Can remove by pageId", () => {
        que.resetQue(all);
        que.removeByPageId(p1.id);
        expect(que.peek()).toBe(p2);
        que.pop();
        expect(que.peek()).toBe(p3);
        expect(que.size).toBe(4);
        que.removeByPageId(p3.id);
        expect(que.size).toBe(3);
    });

    it("Can set pages in constuctor", () => {
        que = new NextQue(all);
        expect(que.size).toBe(all.length);
    });

    it("Can set pages in constuctor", () => {
        que = new NextQue(all);
        expect(que.size).toBe(all.length);
    });

    it("Can reset que to start over.", () => {
        que = new NextQue(all);
        expect(que.size).toBe(all.length);
    });

    it("Can insert new pages in the middle of the test.", () => {
        que = new NextQue(all);
        que.pop();
        que.pop();
        que.pop();
        expect(que.peek()).toBe(p4);
        que.insertAsNextByForce([p1, p2]);
        expect(que.peek()).toBe(p1);
        expect(que.size).toBe(5);
        expect(que.pop()).toBe(p1);
        expect(que.pop()).toBe(p2);
        expect(que.pop()).toBe(p4);
    });

    it("Can jump to page by id", () => {
        que = new NextQue(all);
        que.pop();
        que.jumpToPageById(p5.id);
        // expect(que.size).toBe(5);
        expect(que.peek()).toBe(p5);
        que.jumpToPageById("noncence");
        expect(que.peek()).toBe(p5);
        // CAn not jump back
        que.jumpToPageById(p2.id);
        expect(que.peek()).toBe(p5);
        que.jumpToPageById(p6.id);
        expect(que.peek()).toBe(p6);
    });
});
