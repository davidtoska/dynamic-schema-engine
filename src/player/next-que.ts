import { PageDto } from "../dto/SchemaDto";

export class NextQue {
    private originalOrder: ReadonlyArray<string> = [];
    private allPages: PageDto[] = [];
    private excludedTags = new Set<string>();
    private excludedByPageId = new Set<string>();
    private remaining: PageDto[] = [];
    constructor(pages: PageDto[] = []) {
        this.resetQue(pages);
    }

    /**
     * Will reset que with the new pages.
     * @param pages
     */
    resetQue(pages: PageDto[]) {
        this.allPages = [...pages];
        this.remaining = [...pages];
        this.excludedTags = new Set();
        this.excludedByPageId = new Set();
        this.originalOrder = this.allPages.map((p) => p.id);
    }

    pop(): PageDto | false {
        const next = this.remaining.shift();
        // TODO CLONE??
        return next ?? false;
    }

    peek(): PageDto | false {
        const next = this.remaining[0];
        return next ?? false;
    }

    jumpToPageById(pageId: string): boolean {
        const index = this.remaining.findIndex((p) => p.id === pageId);
        if (index < 0) {
            return false;
        }
        this.remaining = this.remaining.slice(index);
        return true;
    }

    removeByTag(tag: string | string[]) {
        if (Array.isArray(tag)) {
            tag.forEach((tag) => {
                this.excludedTags.add(tag);
            });
        } else {
            this.excludedTags.add(tag);
        }
        this.filterRemaining();
    }

    /**
     * Will not be included
     * @param pages
     */
    insertAsNextByForce(pages: PageDto[]) {
        this.remaining.unshift(...pages);
    }

    removeByPageId(pageId: string | string[]) {
        if (Array.isArray(pageId)) {
            pageId.forEach((id) => {
                this.excludedByPageId.add(id);
            });
        } else {
            this.excludedByPageId.add(pageId);
        }
        this.filterRemaining();
        // this.excludedByPageId.add(pageId);
    }

    private filterRemaining() {
        this.remaining = this.remaining.filter((p) => {
            const tags = p.tags ?? [];
            const isIncluededByTag = !tags.some((tag) => this.excludedTags.has(tag));
            const isIncludedByPageId = !this.excludedByPageId.has(p.id);
            return isIncludedByPageId && isIncluededByTag;
        });
    }
    get isEmpty(): boolean {
        return this.remaining.length === 0;
    }
    get size(): number {
        return this.remaining.length;
    }
    get pageCount(): number {
        return this.originalOrder.length;
    }
}
