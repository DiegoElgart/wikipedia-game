import {Express, NextFunction, Request, Response} from "express";
import {StartGameDto} from "../dto/StartGameDto";
import {NextArticleDto} from "../dto/NextArticleDto";
import {Controller} from "../../common/controller/Controller";
import * as DtoValidator from "../../common/dto/DtoValidator";
import {PassportConfiguration} from "../../configuration/PassportConfiguration";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";


export class GameController extends Controller{
    initializeEndpoints = (app: Express) => {
        /**
         * Game Controller.
         * @route POST /game/start
         */
        app.post("/game/start", [PassportConfiguration.isAuthenticated, this.validateStartGameDto], async (req: Request, res: Response) => {
            const startGameDto : StartGameDto = req.body;
            Logger.log(LogLevels.info, "start game endpoint successfully reached with dto: " + JSON.stringify(startGameDto));
            res.status(200).send("start game endpoint successfully reached with dto: " + JSON.stringify(startGameDto));
        });

        /**
         * Game Controller.
         * @route POST /game/next
         */
        app.post("/game/next", [PassportConfiguration.isAuthenticated, this.validateNextArticleDto], async (req: Request, res: Response) => {
            const nextArticleDto: NextArticleDto = req.body;
            Logger.log(LogLevels.info, "next article endpoint reached: " + nextArticleDto.articleId);
            res.status(200).send("next article endpoint reached: " + nextArticleDto.articleId);
        });
    };

    validateStartGameDto = (req: Request, res: Response, next: NextFunction) => {
        DtoValidator.validateDto(StartGameDto, req, res, next);
    }

    validateNextArticleDto = (req: Request, res: Response, next: NextFunction) => {
        DtoValidator.validateDto(NextArticleDto, req, res, next);
    }
}