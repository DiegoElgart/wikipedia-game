import {StartGameDto} from "../dto/StartGameDto";
import {GameDao} from "../dao/GameDao";
import {User} from "../../user/domain/User";
import {Game} from "../domain/Game";
import {GameResult} from "../domain/GameResult";

export class GameService {
    gameDao : GameDao;

    constructor() {
        this.gameDao = new GameDao();
    }

    startGame = async (startGameDto: StartGameDto) => {
        await this.checkIfUsersUnfinishedGames(startGameDto.user, startGameDto.finishPreviousGames);

        const game = startGameDto.getGame();
        await this.gameDao.addGame(game);
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
}