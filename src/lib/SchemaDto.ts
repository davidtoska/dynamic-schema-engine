import { DAutoPlaySequence } from "./Delement/DAuto-play";
import { DAudioDto, DElementDto, DVideoDto } from "./DElement.dto";
import { Rule } from "./rules/rule";
import { ID } from "./ID";
import { Fact } from "./rules/fact";

export interface PageDto {
    readonly id: ID.PageId;
    readonly elements: Array<DElementDto>;
    readonly tags?: string[];
    mainVideo?: DVideoDto;
    readonly audio?: Array<DAudioDto>;
    readonly images?: Array<DAudioDto>;
    readonly autoPlaySequence?: DAutoPlaySequence | null;
}

export interface PageSequenceDto {
    readonly id: string;
    readonly rules: Array<Rule>;
    readonly pages: Array<PageDto>;
}

export interface SchemaDto {
    readonly id: string;
    readonly prefix: string;
    readonly baseHeight: number;
    readonly baseWidth: number;
    readonly pages: PageDto[];
    readonly rules: Array<Rule>;
    readonly pageSequences?: Array<PageSequenceDto>;
    readonly predefinedFacts?: ReadonlyArray<Fact>;
}
