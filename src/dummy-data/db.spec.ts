import { DB } from "./DB";

describe("In memory db works", () => {
    test("Can create question.", () => {
        const db = DB.createDB();

        const q1 = db.createQuestion("hva tenker du", [
            { value: 1, theme: "normal" },
            { value: 0, theme: "normal" },
            { value: 0, theme: "normal" },
        ]);

        const textToken = new DB.TextToken("hello-world");
        expect(textToken.get());
    });
});
