import passport from "passport";
import {UserDocument} from "../domain/User";
import {Request, Response, NextFunction, Express} from "express";
import { IVerifyOptions } from "passport-local";
import "../../configuration/PassportConfiguration";
import {Controller} from "../../common/controller/Controller";
import * as DtoValidator from "../../common/dto/DtoValidator";
import {LoginDto} from "../dto/LoginDto";

export class UserController extends Controller {
    initializeEndpoints = (app: Express) => {
        /**
         * Sign in using email and password.
         * @route POST /login
         */
        app.post("/login", this.validateLoginDto, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // TODO move this logic to UserService (calling securityService or convert this module into security)
            passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    if (info != null) {
                        res.status(500).send(info.message);
                    } else {
                        res.status(404).send();
                    }

                } else {
                    req.logIn(user, (err) => {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(user);
                    });
                }
            })(req, res, next);
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