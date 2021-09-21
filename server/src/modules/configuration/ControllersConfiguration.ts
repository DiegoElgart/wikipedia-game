import {Express} from "express";
import {HomeController} from "../home/controller/HomeController";
import {UserController} from "../user/controller/UserController";
import {GameController} from "../game/controller/GameController";
import {useExpressServer} from "routing-controllers";

export class Controllers {
    static initializeEndpoints(app: Express) {
        useExpressServer(app, {
            controllers: [GameController, HomeController, UserController],
            classTransformer: true,
            validation: true
        });
    }
}