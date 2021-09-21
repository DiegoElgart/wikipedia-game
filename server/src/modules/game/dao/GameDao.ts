import {Game} from "../domain/Game";
import {GameType} from "../domain/GameType";
import {Types} from "mongoose";
import {User} from "../../user/domain/User";
import {GameResult} from "../domain/GameResult";
import {MongoGame} from "./schemas/MongoGame";
import {Article} from "../../article/domain/Article";

export class GameDao {
    addGame = async (game: Game) => {
        const gameModel = new MongoGame.model({
            user: Types.ObjectId(game.user.id),
            gameType: GameType[game.gameType],
            initialArticle: game.initialArticle? Types.ObjectId(game.initialArticle.id) : undefined,
            finalArticle: game.finalArticle? Types.ObjectId(game.finalArticle.id) : undefined,
            articles : game.articles
        });
        const savedGame = await gameModel.save();
        return MongoGame.getGame(savedGame);
    }

    findGamesByUser = async (user: User) => {
        const games = await MongoGame.model.find().where("user").equals(Types.ObjectId(user.id)).populate("user").exec();
        return games.map(game => MongoGame.getGame(game));
    }

    findUserOpenGame = async (user: User) => {
        const game = await MongoGame.model.findOne().where("user").equals(Types.ObjectId(user.id))
            .where("endedAt").equals(undefined)
            .populate("user")
            .populate("initialArticle")
            .populate("finalArticle")
            .populate("articles")
        .exec();
        return MongoGame.getGame(game);
    }

    finishGame = async (game: Game, gameResult: GameResult) => {
        await MongoGame.model.findOneAndUpdate({_id: Types.ObjectId(game.id)},{gameResult: gameResult, endedAt: new Date()}).exec();
    }

    updateGame = async (game: Game, articles: Article[]) => {
        const articleIds = articles.map((article) => Types.ObjectId(article.id));
        // await MongoGame.model.findOneAndUpdate({_id: Types.ObjectId(game.id)}, {articles: articleIds}).exec();
    }
}