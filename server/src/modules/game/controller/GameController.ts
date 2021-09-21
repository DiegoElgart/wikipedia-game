import {Request, Response} from "express";
import {StartGameDto} from "../dto/StartGameDto";
import {PassportConfiguration} from "../../configuration/PassportConfiguration";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";
import {GameService} from "../service/GameService";
import {
    Body,
    Get,
    HttpError,
    JsonController,
    Post, QueryParam,
    Req,
    Res,
    UseBefore
} from "routing-controllers";
import {NextArticleDto} from "../dto/NextArticleDto";
import {validateDto} from "../../common/dto/DtoValidator";

@JsonController()
export class GameController {
    gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    @Post("/game/start")
    @UseBefore(PassportConfiguration.isAuthenticated)
    async gameStart(@Body() startGameDto: StartGameDto, @Req() req: Request, @Res() res: Response) {
        try {
            const newGame = await this.gameService.startGame(startGameDto);

            return this.gameService.getGameStatus(newGame);
        } catch (err) {
            Logger.log(LogLevels.error, err.stack);
            res.status(500);
            return new HttpError(500, "error while game start: " + err);
        }
    }

    // TODO limit to concurrently run only one time per user
    @Post("/game/next")
    @UseBefore(PassportConfiguration.isAuthenticated)
    async gameNext(@QueryParam("id") id: number, @Req() req: Request, @Res() res: Response) {
        try {
            const nextArticleDto = new NextArticleDto(id, req.body.user);
            await validateDto(nextArticleDto);

            const updatedGame = await this.gameService.next(nextArticleDto);

            return this.gameService.getGameStatus(updatedGame);
        } catch (err) {
            Logger.log(LogLevels.error, err.stack);
            res.status(500);
            return new HttpError(500, "error while game Next: " + err);
        }
    }
    @Get("/game/status")
    @UseBefore(PassportConfiguration.isAuthenticated)
    async gameStatus(@Req() req: Request, @Res() res: Response) {
        const user = req.body.user;

        try {
            const currentGame = await this.gameService.getCurrentGame(user);

            return this.gameService.getGameStatus(currentGame);
        } catch (err) {
            Logger.log(LogLevels.error, err.stack);
            res.status(500);
            return new HttpError(500, "error while getting current game: " + err);
        }
    }
}