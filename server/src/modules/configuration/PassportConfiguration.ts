import passportLocal from "passport-local";
import {User, UserDocument} from "../user/domain/User";
import {Request, Response, NextFunction, Express} from "express";
import {NativeError} from "mongoose";
import passport from "passport";

export class PassportConfiguration {
    constructor(app: Express) {
        const LocalStrategy = passportLocal.Strategy;

        passport.serializeUser<any, any>((req, user, done) => {
            done(undefined, user);
        });

        passport.deserializeUser((id, done) => {
            User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
        });

        /**
         * Sign in using Email and Password.
         */
        passport.use(new LocalStrategy({usernameField: "email"}, (email, password, done) => {
            // TODO move this to a service
            User.findOne({email: email.toLowerCase()}, (err: NativeError, user: UserDocument) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    // HARDCODED CODE FOR CREATING NEW USERS
                    // if (email.toLowerCase() === "diego@gmail.com") {
                    //     const user = new User({
                    //         email: "diego@gmail.com",
                    //         password: "diego"
                    //     });
                    //     user.save((err) => {
                    //         if (err) {
                    //             console.log("error");
                    //         }
                    //     });
                    // } else {
                    return done(undefined, false, {message: `Email ${email} not found.`});
                    // }
                } else {
                    user.comparePassword(password, (err: Error, isMatch: boolean) => {
                        if (err) {
                            return done(err);
                        }
                        if (isMatch) {
                            return done(undefined, user);
                        }
                        return done(undefined, false, {message: "Invalid email or password."});
                    });
                }
            });
        }));

        app.use(passport.initialize());
        app.use(passport.session());
    }

    static isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(403).send();
    };
}