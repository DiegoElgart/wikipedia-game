import {Game} from "../domain/Game";
import {GameType} from "../domain/GameType";
import {Types} from "mongoose";
import {User} from "../../user/domain/User";
import {GameResult} from "../domain/GameResult";
import {MongoGame} from "./schemas/MongoGame";
import {Article} from "../../article/domain/Article";
import {MongoArticle} from "../../article/dao/schema/MongoArticle";
import {Metrics} from "../../common/util/Metrics";

const meteredMethod = Metrics.meteredMethod;

export class GameDao {

    @meteredMethod()
    async add(game: Game) {
        const gameModel = new MongoGame.model({
            user: Types.ObjectId(game.user.id),
            gameType: GameType[game.gameType],
            initialArticle: game.initialArticle ? Types.ObjectId(game.initialArticle.id) : undefined,
            finalArticle: game.finalArticle ? Types.ObjectId(game.finalArticle.id) : undefined,
            articles: game.articles
        });
        const savedGame = await gameModel.save();
        return MongoGame.getGame(savedGame);
    }

    @meteredMethod()
    async getGame(id: string) {
        const game = await MongoGame.model.findById(id)
            .populate("initialArticle", "title")
            .populate("finalArticle", "title")
            .exec();
        return MongoGame.getGame(game);
    }

    @meteredMethod()
    async addArticleToGame(game: Game, article: Article) {
        await MongoGame.model.findOneAndUpdate(
            {_id: game.id},
            {$push: {articles: new MongoArticle.model({_id: Types.ObjectId(article.id)})}});
        game.articles.push(article);
        return game;
    }

    @meteredMethod()
    async getGamesByUser(user: User) {
        const games = await MongoGame.model.find()
            .where("user").equals(Types.ObjectId(user.id))
            .populate("initialArticle", "title")
            .populate("finalArticle", "title")
            .exec();
        // TODO improve this estetically
        return Promise.all(games.map(game => MongoGame.getGame(game)));
    }

    @meteredMethod()
    async getOpenGamesByUser(user: User) {
        const game = await MongoGame.model.findOne()
            .where("user").equals(Types.ObjectId(user.id))
            .where("endedAt").equals(undefined)
            .populate("initialArticle", ["handle", "title"])
            .populate("finalArticle", ["handle", "title"])
            .exec();
        return MongoGame.getGame(game);
    }

    // TODO This should be moved to an updateGame method (should also have a getbyid at the end)
    @meteredMethod()
    async finishGame(game: Game, gameResult: GameResult) {
        const endDate = new Date();

        await MongoGame.model.findOneAndUpdate(
            {_id: Types.ObjectId(game.id)},
            {
                gameResult: gameResult,
                endedAt: endDate
            })
            .exec();

        game.gameResult = gameResult;
        game.endedAt = endDate;

        return game;
    }

    // @measure()
    // async updateGame(game: Game, articles: Article[]) {
    //     const articleIds = articles.map((article) => new MongoArticle.model({
    //         _id: Types.ObjectId(article.id),
    //     }));
    //     await MongoGame.model.findOneAndUpdate({_id: Types.ObjectId(game.id)}, {articles: articleIds}).exec();
    //     const updatedGame = await this.findGameById(game.id);
    //     return game;
    // }
}