import mongoose from "mongoose";
import {Article} from "../../domain/Article";

export namespace MongoArticle {

    export interface Document extends mongoose.Document {
        _id: mongoose.Types.ObjectId
        handle: string
        pageId: number
        title: string
        raw: string
        cleanedHTML: string
        links: []
    }

    export const schema = new mongoose.Schema<Document>(
        {
            handle: {type: String, unique: true },
            pageId: { type: Number },
            title: { type: String },
            raw: { type: String },
            cleanedHTML: { type: String },
            links: { type: Array }
        },
        { timestamps: true }
    );

    export const model = mongoose.model<Document>("Article", schema);

    export const getArticles = (articleDocuments: Document[]) => {
        return articleDocuments.map((articleDocument => getArticle(articleDocument)));
    };

    export const getArticle = (articleDocument: Document) => {
        const articleDocumentObject = articleDocument.toObject? articleDocument.toObject(): articleDocument;
        const id = articleDocument._id.toString();
        const handle = articleDocumentObject.handle;
        const pageId = articleDocumentObject.pageId;
        const title = articleDocumentObject.title;
        const raw = articleDocumentObject.raw;
        const cleanedHTML = articleDocumentObject.cleanedHTML;
        const links = articleDocumentObject.links;
        return new Article(id, handle, pageId, title, raw, cleanedHTML, links);
    };
}