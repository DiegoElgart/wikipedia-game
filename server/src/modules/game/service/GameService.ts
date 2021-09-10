import {StartGameDto} from "../dto/StartGameDto";
import {GameDao} from "../dao/GameDao";
import {User} from "../../user/domain/User";
import {Game} from "../domain/Game";
import {GameResult} from "../domain/GameResult";
import {GameType} from "../domain/GameType";
import {ArticleService} from "../../article/service/ArticleService";
import {NextArticleDto} from "../dto/NextArticleDto";
import {Article} from "../../article/domain/Article";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";

export class GameService {
    gameDao : GameDao;
    articleService: ArticleService;

    constructor() {
        this.gameDao = new GameDao();
        this.articleService = new ArticleService();
    }

    startGame = async (startGameDto: StartGameDto) => {
        await this.checkIfUsersUnfinishedGames(startGameDto.user, startGameDto.finishPreviousGames);

        const game = startGameDto.getGame();

        // define initial and end article according to game type
        await this.setInitialAndFinalArticle(game);

        await this.gameDao.addGame(game);
    }

    nextArticle = async (nextGameDto: NextArticleDto) => {
        const game = await this.gameDao.findUserOpenGame(nextGameDto.user);

        const currentArticle = this.getCurrentArticle(game);
        const link = this.getLink(currentArticle, nextGameDto.id);
        if(!link) {
            Logger.log(LogLevels.error, `A non-existent link was requested. Articleid: ${currentArticle.id}, Link id: ${nextGameDto.id}, User: ${nextGameDto.user}`);
            throw new Error("Internal eror.");
        }

        const article = await this.articleService.getArticleByHandle(link.handle);

        game.articles.push(article);
        await this.gameDao.updateGame(game, game.articles);
        console.log(article);
    }

    private checkIfUsersUnfinishedGames = async(user: User, finishPreviousGames: boolean) => {
        const userGames = await this.gameDao.findGamesByUser(user);

        const unfinishedGames = this.getUnfinishedGames(userGames);

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

    private getUnfinishedGames(userGames: Game[]) {
        const openGames: Game[] = [];

        userGames.forEach(game => {
            if(!game.endedAt) {
                openGames.push(game);
            }
        });

        return openGames;
    }

    private async setInitialAndFinalArticle(game : Game) {
        switch (GameType[game.gameType].toString()) {
            case GameType.Random.toString(): {
                const initialArticle = await this.articleService.getTodaysFeatureArticle();
                game.initialArticle = initialArticle;
                break;
            }

            // case GameType.DailyChallenge: {
            //
            //     break;
            // }
            //
            // case GameType.PlayerChallenge: {
            //     //
            //     break
            // }
            default:
                throw new Error("GameType not implemented yet");

        }
    }

    private getCurrentArticle(game: Game) {
        if(game.articles && game.articles.length > 0) {
            return game.articles[game.articles.length - 1];
        } else {
            return game.initialArticle;
        }
    }

    private getLink(article: Article, linkId: number) {
        const linksList = article.links;
        return linksList.find((link) => link.id == linkId);
    }
}