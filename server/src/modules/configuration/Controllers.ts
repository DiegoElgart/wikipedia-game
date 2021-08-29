import {Express} from "express";
import {Controller} from "../common/controller/Controller";
import {HomeController} from "../home/controller/HomeController";
import {UserController} from "../user/controller/UserController";
import {GameController} from "../game/controller/GameController";

export class Controllers extends Controller {
    static initializeEndpoints(app: Express) {
        new HomeController().initializeEndpoints(app);
        new UserController().initializeEndpoints(app);
        new GameController().initializeEndpoints(app);
    }
}