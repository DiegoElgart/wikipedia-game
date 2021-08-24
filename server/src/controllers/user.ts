import passport from "passport";
import {UserDocument} from "../domain/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { body, check, validationResult } from "express-validator";
import "../config/passport";

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(500).send(errors);
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            if(info != null) {
                res.status(500).send(info.message);
            } else {
                res.status(404).send();
            }

        } else {
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                res.status(200).send(user);
            });
        }
    })(req, res, next);
};

/**
 * Log out.
 * @route GET /logout
 */
export const logout = (req: Request, res: Response): void => {
    req.logout();
    res.status(200).send();
};
