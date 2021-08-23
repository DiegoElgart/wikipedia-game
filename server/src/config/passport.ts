import passport from "passport";
import passportLocal from "passport-local";
import {User} from "../domain/User";
import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    const user = id as User;
    //TODO this should go to get the User from the DB
    if(user.id === 1) {
        done(undefined, new User("Matias",1));
    } else if(user.id === 2) {
        done(undefined, new User("Diego", 2));
    } else {
        return done("user not identified");
    }
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //TODO this should look for the user and matching password in the db
    if(email.toLowerCase() === "msemrik@gmail.com" && password === "msemrik") {
        return done(undefined, new User("Matias", 1));
    } else if(email.toLowerCase() === "diego@gmail.com" && password === "diego") {
        return done(undefined, new User("Diego", 2));
    } else {
        return done(undefined, false, { message: `Email ${email} not found.` });
    }
}));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(403).send();
};