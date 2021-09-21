import {Express} from "express";
import {WebpageController} from "../webpage/controller/WebpageController";
import {UserController} from "../user/controller/UserController";
import {GameController} from "../game/controller/GameController";
import {useExpressServer} from "routing-controllers";

// TODO configure exceptions, have exceptions
export class ControllersConfiguration {
    constructor(app: Express) {
        useExpressServer(app, {
            controllers: [GameController, WebpageController, UserController],
            classTransformer: true,
            validation: true
        });
    }
}