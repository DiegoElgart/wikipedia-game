import mongoose from "mongoose";
import {GameType} from "../../domain/GameType";
import {GameResult} from "../../domain/GameResult";
import {User} from "../../../user/domain/User";
import {MongoUser} from "../../../user/dao/schemas/MongoUser";
import {Game} from "../../domain/Game";
import {MongoArticle} from "../../../article/dao/schema/MongoArticle";
import {Article} from "../../../article/domain/Article";
import {GameLanguage} from "../../domain/GameLanguage";

export namespace MongoGame {
    export interface Document extends mongoose.Document {
        _id: mongoose.Types.ObjectId
        user: MongoUser.Document
        gameResult: GameResult
        gameType: GameType
        initialArticle: MongoArticle.Document
        finalArticle: MongoArticle.Document
        articles: MongoArticle.Document[]
        createdAt: Date
        endedAt: Date
        language: GameLanguage
    }

    export const schema = new mongoose.Schema<Document>(
        {
            user: {type: mongoose.Types.ObjectId, ref: "User"},
            gameType: { type: Number },
            gameResult: { type: Number },
            endedAt: { type: Date },
            initialArticle: {type: mongoose.Types.ObjectId, ref: "Article"},
            finalArticle: {type: mongoose.Types.ObjectId, ref: "Article"},
            articles: [{type: mongoose.Types.ObjectId, ref: "Article"}],
            language: { type: Number }
        },
        { timestamps: true }
    );

    export const model = mongoose.model<Document>("Game", schema);

    export const getGame = async (gameDocument: Document) => {
        const gameDocumentObject = gameDocument.toObject();
        const id = gameDocument._id.toString();
        const user = MongoUser.getUser(gameDocument.user);
        const gameType = gameDocumentObject.gameType;
        const gameResult = gameDocumentObject.gameResult;
        const createdAt = gameDocumentObject.createdAt;
        const endedAt = gameDocumentObject.endedAt;
        const initialArticle = gameDocument.initialArticle? await MongoArticle.getArticle(gameDocument.initialArticle): undefined;
        const finalArticle = gameDocument.finalArticle? await MongoArticle.getArticle(gameDocument.finalArticle): undefined;
        const articles = await MongoArticle.getArticles(gameDocument.articles);
        const language = gameDocumentObject.language;
        return new Game(id, user, gameType, initialArticle, finalArticle, articles, gameResult, createdAt, endedAt, language);
    };
}