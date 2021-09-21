import {GameType} from "./GameType";
import {User} from "../../user/domain/User";
import {GameResult} from "./GameResult";
import {Article} from "../../article/domain/Article";

export class Game {
    id: string;
    user: User
    gameType: GameType
    gameResult: GameResult
    createdAt: Date
    endedAt: Date
    initialArticle: Article
    finalArticle: Article
    articles: Article[]

    constructor(gameType: GameType, user: User);
    constructor(id: string, user: User, gameType: GameType, initialArticle: Article, finalArticle: Article, articles: Article[], gameResult: GameResult, createdAt: Date, endedAt: Date);
    constructor(... array: any[]) {
        if (array.length == 2) {
            this.gameType = array[0];
            this.user = array[1];
        } else if (array.length == 9) {
            this.id = array[0];
            this.user = array[1];
            this.gameType = array[2];
            this.initialArticle = array[3];
            this.finalArticle = array[4];
            this.articles = array[5];
            this.gameResult = array[6];
            this.createdAt = array[7];
            this.endedAt = array[8];
        }
    }
}