import {Express, Request, Response} from "express";
import {Controller} from "../../common/controller/Controller";


export class HomeController extends Controller{
    initializeEndpoints = (app: Express) => {
        /**
         * Home page.
         * @route GET /
         */
        app.get("/", (req: Request, res: Response) => {
            // TODO: add logging library to avoid writing the context.
            console.log("homecontroller index: A request reached this endpoint");
            res.status(200).send("You're app is up and running! This will be the home site.");
        });
    };
}