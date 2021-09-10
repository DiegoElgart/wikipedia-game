import {GameType} from "./GameType";
import {User} from "../../user/domain/User";
import {GameResult} from "./GameResult";

export class Game {
    id: string;
    user: User
    gameType: GameType
    gameResult: GameResult
    createdAt: Date
    endedAt: Date

    constructor(gameType: GameType, user: User);
    constructor(id: string, user: User, gameType: GameType, gameResult: GameResult, createdAt: Date, endedAt: Date);
    constructor(... array: any[]) {
        if (array.length == 2) {
            this.gameType = array[0];
            this.user = array[1];
        } else if (array.length == 6) {
            this.id = array[0];
            this.user = array[1];
            this.gameType = array[2];
            this.gameResult = array[3];
            this.createdAt = array[4];
            this.endedAt = array[5];
        }
    }
}