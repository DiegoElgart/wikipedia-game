import {Game} from "../domain/Game";
import {GameType} from "../domain/GameType";
import {Types} from "mongoose";
import {User} from "../../user/domain/User";
import {GameResult} from "../domain/GameResult";
import {MongoGame} from "./schemas/MongoGame";

export class GameDao {
    addGame = async (game: Game) => {
        const gameModel = new MongoGame.model({
            user: Types.ObjectId(game.user.id),
            gameType: GameType[game.gameType]
        });
        const savedGame = await gameModel.save();
        return MongoGame.getGame(savedGame);
    }

    findGamesByUser = async (user: User) => {
        const games = await MongoGame.model.find().where("user").equals(Types.ObjectId(user.id)).populate("user").exec();
        return games.map(game => MongoGame.getGame(game));
    }

    finishGame = async (game: Game, gameResult: GameResult) => {
        await MongoGame.model.findOneAndUpdate({_id: Types.ObjectId(game.id)},{gameResult: gameResult, endedAt: new Date()}).exec();
    }
}