import passport from "passport";
import {IVerifyOptions} from "passport-local";
import {NextFunction, Request, Response} from "express";
import {MongoUser} from "../dao/schemas/MongoUser";
import UserDocument = MongoUser.Document;
import {HttpError} from "routing-controllers";

export class UserService {

    static loginUser = async (req: Request, res: Response, next: NextFunction) => {
        // This function kicks the login
        return passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
            // If an error was found at this point, the process finishes
            if (err) {
                return next(err);
            }

            // User not found
            if (!user) {
                // Trying to show as much information as passport returns.
                if (info != null) {
                    res.status(500).send(info.message);
                } else {
                    res.status(404).send();
                }

            } else {
                // Finlizes the login process
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }

                    // If the log-in was successful the user is redirected to home page
                    res.redirect("/");
                });
            }
        })(req, res, next);
    }

}