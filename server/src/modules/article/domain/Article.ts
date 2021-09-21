import {Link} from "./Link";

export class Article  {
    id: string;
    handle: string;
    pageId: number;
    title: string;
    raw: string;
    cleanedHTML: string;
    links: Link[];

    constructor(id?: string, handle?: string, pageId?: number, title?: string, raw?: string, cleanedHTML?: string, links?: Link[]) {
        this.id = id;
        this.handle = handle;
        this.pageId = pageId;
        this.title = title;
        this.raw = raw;
        this.cleanedHTML = cleanedHTML;
        this.links = links;
    }
}