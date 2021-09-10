import {Express, Request, Response} from "express";
import {Controller} from "../../common/controller/Controller";
import path from "path";


export class HomeController extends Controller{
    initializeEndpoints = (app: Express) => {
        /**
         * Home page.
         * @route GET /
         */
        app.get("/", (req: Request, res: Response) => {
            res.sendFile(path.resolve(__dirname+ "../../../../client/main.html"));
        });

        /**
         * Login page.
         * @route GET /login
         */
        app.get("/login", (req: Request, res: Response) => {
            if (req.isAuthenticated()) {
                res.redirect("/");
            } else {
                res.sendFile(path.resolve(__dirname+ "../../../../client/login.html"));
            }
        });
    };
}