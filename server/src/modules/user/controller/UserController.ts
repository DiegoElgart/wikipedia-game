import {Request, Response, NextFunction, Express} from "express";
import "../../configuration/PassportConfiguration";
import {Controller} from "../../common/controller/Controller";
import * as DtoValidator from "../../common/dto/DtoValidator";
import {LoginDto} from "../dto/LoginDto";
import {UserService} from "../service/UserService";

export class UserController extends Controller {
    initializeEndpoints = (app: Express) => {
        /**
         * Sign in using email and password.
         * @route POST /login
         */
        app.post("/login", this.validateLoginDto, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            UserService.loginUser(req, res, next);
        });

        /**
         * Log out.
         * @route GET /logout
         */
        app.get("/logout", (req: Request, res: Response): void => {
            req.logout();
            res.status(200).send();
        });
    }

    validateLoginDto = (req: Request, res: Response, next: NextFunction) => {
        DtoValidator.validateDto(LoginDto, req, res, next);
    }
}