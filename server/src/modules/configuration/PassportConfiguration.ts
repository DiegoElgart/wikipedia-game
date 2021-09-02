import passportLocal from "passport-local";
import {Request, Response, NextFunction, Express} from "express";
import bcrypt from "bcrypt-nodejs";
import passport from "passport";
import {UserDao} from "../user/dao/UserDao";
import {User} from "../user/domain/User";
import {MongoUser} from "../user/dao/schemas/MongoUser";

export class PassportConfiguration {
    userDao: UserDao;

    constructor(app: Express) {
        this.userDao = new UserDao();

        const LocalStrategy = passportLocal.Strategy;

        passport.serializeUser<any, any>((req, user : MongoUser.Document , done) => {
            done(undefined, user);
        });

        passport.deserializeUser(async (id: User, done) => {
            const user = await this.userDao.getUserById(<string>id.id);
            done(null, user);
        });

        /**
         * Sign in using Email and Password.
         */
        passport.use(new LocalStrategy({usernameField: "email"}, async (email, password, done) => {
            const user = await this.userDao.getUserByEmail(email);
            if(!user) {
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
                // }
                // }
                done(undefined, false, {message: `Email ${email} not found.`});
                return;
            } else {
                const isMatch = await this.validatePassword(user, password);
                if (isMatch) {
                    return done(undefined, MongoUser.getUser(user));
                } else {
                    return done(undefined, false, {message: "Invalid email or password."});
                }
            }
        }));

        app.use(passport.initialize());
        app.use(passport.session());
    }

    private validatePassword = async (user: MongoUser.Document, password: string) => {
        return bcrypt.compareSync(password, user.password);
    }

    static isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(403).send();
    };
}