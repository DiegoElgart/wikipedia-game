import {Express} from "express";

export abstract class Controller {
    initializeEndpoints: (app: Express) => void;
}