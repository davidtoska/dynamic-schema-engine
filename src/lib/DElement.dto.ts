import { DStyle } from "./Delement/DStyle";
import { DEventHandler, QueryChangedHandler } from "./event-handlers/DEventHandler";
import { ID } from "./ID";
import { DCommand } from "./commands/DCommand";

export type DElementDto = DTextDto | DImgDto | DDivDto;
export interface DElementBaseDto {
    readonly id: ID.ElementId;
    readonly style: Partial<DStyle>;
    readonly eventHandlers?: ReadonlyArray<DEventHandler>;
    readonly onClick?: ReadonlyArray<DCommand>;
    readonly stateQueryChange?: ReadonlyArray<QueryChangedHandler>;
}

export interface DTextDto extends DElementBaseDto {
    readonly _tag: "p";
    readonly text: string;
}

export interface DDivDto extends DElementBaseDto {
    readonly _tag: "div";
    readonly children: Array<DTextDto | DImgDto>;
}

export interface DImgDto extends DElementBaseDto {
    readonly _tag: "img";
    readonly url: string;
}

export interface DVideoDto extends DElementBaseDto {
    readonly _tag: "video";
    readonly url: string;
    // readonly mode: "gif" | "autoplay" | "on-demand";
    // readonly isMediaBlocking: boolean;
}

export interface DAudioDto {
    readonly id: string;
    readonly _tag: "audio";
    readonly url: string;
    // readonly isMediaBlocking: boolean;
}
