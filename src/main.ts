import "./style.css";
import { SchemaEngine } from "./lib/engine/SchemaEngine";
import { schema1 } from "./dummy-data/schema1";
import { SchemaDto } from "./lib/SchemaDto";
import { PageHistory } from "./lib/player/history-que";
const a =
    "https://firebasestorage.googleapis.com/v0/b/ispe-dev.appspot.com/o/organizations%2ForgId-ispe2%2FmoduleId-8DGaHo8KbnbGQtG9cpn2%2Fvideo-files%2FbqavCovPfxvtvbQgvPcpDDHYugFDSZxbNGXrQsznLmoJSqsbJT?alt=media&token=a75c49cb-707c-4742-a897-ce5792a5f7cc";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div id="builder"></div>
<!--    <div id="ex2"></div>-->
    

<!--    <video height="300px" controls="true" src="https://firebasestorage.googleapis.com/v0/b/ispe-dev.appspot.com/o/organizations%2ForgId-ispe2%2FmoduleId-8DGaHo8KbnbGQtG9cpn2%2Fvideo-files%2FbqavCovPfxvtvbQgvPcpDDHYugFDSZxbNGXrQsznLmoJSqsbJT?alt=media&token=a75c49cb-707c-4742-a897-ce5792a5f7cc"></video>-->
  <div id="schema-host">
  </div>
`;

const host = document.getElementById("schema-host") as HTMLDivElement;
const builderElement = document.getElementById("builder") as HTMLDivElement;
// builderElement.appendChild()
// exRoot.style.height = "40px";
// exRoot.style.width = "40px";
// exRoot.style.backgroundColor = "red";
// exRoot.style.position = "";
// exRoot.style.display = "block";
// exRoot.draggable = true;

// const ex1 = document.createElement("div");
// exRoot.append(ex1);
// ex1.style.height = "40%";
// ex1.style.top = "25%";
// ex1.style.backgroundColor = "yellow";
// ex1.style.width = "100%";
// ex1.style.position = "absolute";
// ex1.style.display = "flex";
//
// ex1.style.justifyContent = "space-around";
// ex1.style.alignItems = "center";
//
// const btn = () => {
//     const el = document.createElement("div");
//     el.style.height = "80%";
//     el.style.width = "17%";
//     el.style.backgroundColor = "blue";
//     return el;
// };
//
// ex1.append(btn(), btn(), btn(), btn());

declare const IEngine: {
    /**
     * Will open a fullscreen "modal", and maximize the size of the schema in center:
     * @param config
     */
    userFullscreenMode(config: { overLayColor: string; iconUrl: string; zIndex: number; schemaPadding: number }): void;
    reset(): void;
    setSchema(schema: SchemaDto): void;
    onFatalError(handler: (error: { message: string }) => void): number;
    onComplete(handler: (results: { answers: number; eventLog: number[] }) => void): number;
    onPageComplete(handler: (result: PageHistory) => void): number;
};

const engine = new SchemaEngine(host, 1350, 400, schema1);
// engine
// IEngine.onComplete(() => {});
