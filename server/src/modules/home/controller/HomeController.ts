import {Express, Request, Response} from "express";
import {Controller} from "../../common/controller/Controller";
import {LogLevels} from "../../common/util/LogLevels";
import {Logger} from "../../common/util/Logger";


export class HomeController extends Controller{
    initializeEndpoints = (app: Express) => {
        /**
         * Home page.
         * @route GET /
         */
        app.get("/", (req: Request, res: Response) => {
            Logger.log(LogLevels.info, "homecontroller index: A request reached this endpoint");
            res.status(200).send("You're app is up and running! This will be the home site.");
        });
    };
}