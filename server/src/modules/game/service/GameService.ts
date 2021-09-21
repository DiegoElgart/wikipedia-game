import {StartGameDto} from "../dto/StartGameDto";
import {GameDao} from "../dao/GameDao";
import {User} from "../../user/domain/User";
import {Game} from "../domain/Game";
import {GameResult} from "../domain/GameResult";
import {GameType} from "../domain/GameType";
import {ArticleService} from "../../article/service/ArticleService";
import {NextArticleDto} from "../dto/NextArticleDto";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";
import {GameStatus} from "../domain/GameStatus";
import * as _ from "lodash";
import {Article} from "../../article/domain/Article";

export class GameService {
    gameDao : GameDao;
    articleService: ArticleService;

    constructor() {
        this.gameDao = new GameDao();
        this.articleService = new ArticleService();
    }

    // Starts a new game
    async startGame(startGameDto: StartGameDto) {
        // finalize previous games if possible
        await this.validatePreviousGames(startGameDto.user, startGameDto.finishPreviousGames);

        const game = startGameDto.getGame();

        // According to game type, define initial and final article
        await this.setInitialAndFinalArticle(game);

        // Store  created game to database
        return this.gameDao.add(game);
    }

    // Player clicked a link, update article
    async next(nextGameDto: NextArticleDto) {
        // Get Current Game and Article
        const game = await this.gameDao.getOpenGamesByUser(nextGameDto.user);
        const article = this.getCurrentArticle(game);

        // Get clicked Link
        const link = await this.getLink(article, nextGameDto.id);

        // Check if user already won
        if (link.handle == game.finalArticle.handle) {
            const finishedGame = await this.gameDao.finishGame(game, GameResult.Succeeded);
            return finishedGame;
        }

        // Get the clicked article
        const nextArticle = await this.articleService.getArticleByHandle(link.handle);

        // Update game
        const updatedGame = await this.gameDao.addArticleToGame(game, nextArticle);

        return updatedGame;
    }

    // Get the status of a game
    async getGameStatus(game: Game) {
        let gameDuration;
        let cleanedHTML;

        // If unfinished game:  Get currentArticle and calculate game duration
        // If finished game: Calculate only game duration
        if (!game.isFinished()) {
            const currentArticle = game.articles.length > 0 ? game.articles[game.articles.length-1] : game.initialArticle;
            cleanedHTML = await this.articleService.getCleanedHTML(currentArticle);

            gameDuration = this.milisecondsToHumanReadable(new Date().getTime() - game.createdAt.getTime());
        } else {
            gameDuration = this.milisecondsToHumanReadable(game.endedAt.getTime() - game.createdAt.getTime());
        }

        return new GameStatus(game.id, GameType[game.gameType], GameResult[game.gameResult], game.initialArticle.title, game.finalArticle.title, cleanedHTML, game.articles.length, gameDuration);
    }

    // Get the current player's game
    async getCurrentGame(user: User) {
        // Get All users game
        const userGames = await this.gameDao.getGamesByUser(user);

        // TODO here we should throw an exception and try to fix if more than one current game
        // Now if more than one unfinished game return random
        const unfinishedGames = userGames.filter(game => !game.isFinished());
        if (unfinishedGames.length > 0) {
            return unfinishedGames[0];
        }

        // Order Lastly finished to First finished
        const games  =_.sortBy(userGames, game => game.endedAt);

        return games[games.length - 1];
    }

    // If previous games are unfinished, check if possible to finish, and finish them.
    private async validatePreviousGames(user: User, finishPreviousGames: boolean) {
        const userGames = await this.gameDao.getGamesByUser(user);

        const unfinishedGames = userGames.filter(game => !game.isFinished());

        if(unfinishedGames && unfinishedGames.length > 0) {
            if(!finishPreviousGames ) {
                throw new Error("Trying to start a game, when at least one game is ongoing");
            } else {
                for (const unfinishedGame of unfinishedGames) {
                    await this.gameDao.finishGame(unfinishedGame, GameResult.Abandoned);
                }
            }
        }
    }

    private async setInitialAndFinalArticle(game : Game) {
        let initialArticle;
        let finalArticle;

        switch (GameType[game.gameType].toString()) {

            case GameType.Random.toString(): {
                initialArticle = await this.articleService.getTodaysFeatureArticle();

                // Get a random article, until it's different from the initial one
                do {
                    finalArticle = await this.articleService.getRandomArticleFromDownloaded();
                } while (finalArticle.title == initialArticle.title);

                break;
            }

            case GameType.Easy.toString(): {
                initialArticle = await this.articleService.getEasyArticle();

                // Get a random article, until it's different from the initial one
                do {
                    finalArticle = await this.articleService.getEasyArticle();
                } while (finalArticle.title == initialArticle.title);

                break;
            }

            default:
                throw new Error("GameType not implemented yet");

        }

        game.initialArticle = initialArticle;
        game.finalArticle = finalArticle;
    }

    // Get link from db and adecuate it to wikipedia
    private async getLink(article: Article, linkId : number) {
        const link = await this.articleService.getLink(article, linkId);

        // The article did not have such link.
        if(!link) {
            Logger.log(LogLevels.error, `A non-existent link was requested. Articleid: ${article.id}, Link id: ${linkId}`);
            throw new Error("Validation Error.");
        }

        // cleaning the link's handle. To make it faster to download we don't process all the wikipedia HTML
        // TODO move to wikipedia module
        link.handle = link.handle.replace("/wiki/", "");

        return link;
    }

    private milisecondsToHumanReadable(miliseconds: number) {
        const ms = miliseconds % 1000;
        miliseconds = (miliseconds - ms) / 1000;
        const secs = miliseconds % 60;
        miliseconds = (miliseconds - secs) / 60;
        const mins = miliseconds % 60;
        const hrs = (miliseconds - mins) / 60;

        return hrs + ":" + mins + ":" + secs + "." + ms;
    }

    private getCurrentArticle(game : Game) {
        let article;
        if (game.articles && game.articles.length > 0) {
            article = game.articles[game.articles.length - 1];
        } else {
            article = game.initialArticle;
        }

        return article;
    }
}