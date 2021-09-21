import mongoose from "mongoose";
import {Article} from "../../domain/Article";
import * as zlib from "zlib";
export namespace MongoArticle {

    export interface Document extends mongoose.Document {
        _id: mongoose.Types.ObjectId
        handle: string
        pageId: number
        title: string
        raw: string
        compressedHTML: mongoose.Types.Buffer
        links: []
    }

    export const schema = new mongoose.Schema<Document>(
        {
            handle: {type: String, unique: true },
            pageId: { type: Number },
            title: { type: String },
            raw: { type: String },
            compressedHTML: { type: Buffer },
            links: { type: Array }
        },
        { timestamps: true }
    );

    export const model = mongoose.model<Document>("Article", schema);

    export const getArticles = async (articleDocuments: Document[]) => {
        return Promise.all(articleDocuments.map(async (articleDocument) => await getArticle(articleDocument)));
    };

    // TODO move this Mongo.get_____ methods to dao
    export const getArticle = async (articleDocument: Document) => {
        const articleDocumentObject = articleDocument.toObject? articleDocument.toObject(): articleDocument;
        const id = articleDocument._id.toString();
        const handle = articleDocumentObject.handle;
        const pageId = articleDocumentObject.pageId;
        const title = articleDocumentObject.title;
        const raw = articleDocumentObject.raw;
        const cleanedHTML = articleDocumentObject.compressedHTML? await zlib.gunzipSync(articleDocumentObject.compressedHTML.buffer).toString() : undefined;
        const links = articleDocumentObject.links;
        return new Article(id, handle, pageId, title, raw, cleanedHTML, links);
    };
}