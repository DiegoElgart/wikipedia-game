import {Express, NextFunction, Request, Response} from "express";
import {StartGameDto} from "../dto/StartGameDto";
import {NextArticleDto} from "../dto/NextArticleDto";
import {Controller} from "../../common/controller/Controller";
import * as DtoValidator from "../../common/dto/DtoValidator";
import {PassportConfiguration} from "../../configuration/PassportConfiguration";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";
import {GameService} from "../service/GameService";


export class GameController extends Controller{
    gameService: GameService;

    initializeEndpoints = (app: Express) => {
        this.gameService = new GameService();

        /**
         * Game Controller.
         * @route POST /game/start
         */
        app.post("/game/start", [PassportConfiguration.isAuthenticated, this.validateStartGameDto], async (req: Request, res: Response) => {
            const startGameDto : StartGameDto = req.body;
            try {
                const newGame = await this.gameService.startGame(startGameDto);
                res.status(200).send("game successfully started. Game: " + newGame);
            } catch (err) {
                Logger.log(LogLevels.error, err.stack);
                res.status(500).send("error while creating new game: " + err);
            }
        });

        /**
         * Game Controller.
         * @route POST /game/next
         */
        app.post("/game/next", [PassportConfiguration.isAuthenticated, this.validateNextArticleDto], async (req: Request, res: Response) => {
            const nextArticleDto: NextArticleDto = req.body;
            try {
                const newGame = await this.gameService.nextArticle(nextArticleDto);
                res.status(200).send("game successfully started. Game: " + newGame);
            } catch (err) {
                res.status(500).send("error while creating new game: " + err);
            }
        });
    };

    validateStartGameDto = (req: Request, res: Response, next: NextFunction) => {
        DtoValidator.validateDto(StartGameDto, req, res, next);
    }

    validateNextArticleDto = (req: Request, res: Response, next: NextFunction) => {
        req.body.id = req.query.id;
        DtoValidator.validateDto(NextArticleDto, req, res, next);
    }
}