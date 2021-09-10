import passport from "passport";
import {IVerifyOptions} from "passport-local";
import {NextFunction, Request, Response} from "express";
import {MongoUser} from "../dao/schemas/MongoUser";
import UserDocument = MongoUser.Document;

export class UserService {
    static loginUser = (req: Request, res: Response, next: NextFunction) => {
        return passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
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
    }
}