import mongoose, {ObjectId, Types} from "mongoose";
import {GameType} from "../../domain/GameType";
import {GameResult} from "../../domain/GameResult";
import {User} from "../../../user/domain/User";
import {MongoUser} from "../../../user/dao/schemas/MongoUser";
import {Game} from "../../domain/Game";

export namespace MongoGame {
    export interface Document extends mongoose.Document {
        _id: mongoose.Types.ObjectId
        user: MongoUser.Document
        gameResult: GameResult
        gameType: GameType
        createdAt: Date
        endedAt: Date
    }

    export const schema = new mongoose.Schema<Document>(
        {
            user: {type: mongoose.Types.ObjectId, ref: "User"},
            gameType: { type: Number },
            gameResult: { type: Number },
            endedAt: { type: Date }
        },
        { timestamps: true }
    );

    export const model = mongoose.model<Document>("Game", schema);

    export const getGame = (gameDocument: Document) => {
        const gameDocumentObject = gameDocument.toObject();
        const id = gameDocument._id.toString();
        const user = MongoUser.getUser(gameDocument.user);
        const gameType = gameDocumentObject.gameType;
        const gameResult = gameDocumentObject.gameResult;
        const createdAt = gameDocumentObject.createdAt;
        const endedAt = gameDocumentObject.endedAt;
        return new Game(id, user, gameType, gameResult, createdAt, endedAt);
    };
}