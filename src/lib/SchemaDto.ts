import { DAutoPlaySequence } from "./Delement/DAuto-play";
import { DAudioDto, DElementDto, DImgDto, DVideoDto } from "./DElement.dto";
import { Rule } from "./rules/rule";
import { ID } from "./ID";
import { Fact } from "./rules/fact";
import { PageQueCommand } from "./commands/DCommand";
import { DState } from "./state/Dstate";

export type PageQueRules = Rule<PageQueCommand, never>;
export interface PageDto {
    readonly id: ID.PageId;
    readonly elements: Array<DElementDto>;
    readonly tags?: string[];
    mainVideoId?: string;
    readonly backgroundColor?: string;
    readonly video?: Array<DVideoDto>;
    readonly audio?: Array<DAudioDto>;
    readonly autoPlaySequence?: DAutoPlaySequence;
}

export interface PageSequenceDto {
    readonly id: string;
    readonly rules: Array<PageQueRules>;
    readonly pages: Array<PageDto>;
}

export interface SchemaDto {
    readonly id: string;
    readonly prefix: string;
    readonly baseHeight: number;
    readonly baseWidth: number;
    readonly backgroundColor: string;
    readonly pages: PageDto[];
    readonly rules: Array<PageQueRules>;
    readonly stateVariables?: ReadonlyArray<DState.Prop>;
    readonly stateQueries?: ReadonlyArray<DState.StateQuery>;
    readonly pageSequences?: Array<PageSequenceDto>;
    readonly predefinedFacts?: ReadonlyArray<Fact>;
}

export namespace SchemaDto {
    export const getResources = (
        schema: SchemaDto
    ): {
        videoList: ReadonlyArray<DVideoDto>;
        audioList: ReadonlyArray<DAudioDto>;
        imageList: ReadonlyArray<DImgDto>;
    } => {
        const { pages } = schema;
        const videoList = pages.reduce<Array<DVideoDto>>((acc, curr) => {
            if (Array.isArray(curr.video)) {
                acc.push(...curr.video);
            }
            return acc;
        }, []);
        const audioList: Array<DAudioDto> = pages.reduce<Array<DAudioDto>>((acc, curr) => {
            if (Array.isArray(curr.audio)) {
                acc.push(...curr.audio);
            }
            return acc;
        }, []);

        return { videoList, audioList, imageList: [] };
    };
}
