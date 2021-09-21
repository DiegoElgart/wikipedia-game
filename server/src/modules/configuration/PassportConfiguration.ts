import passportLocal from "passport-local";
import {Request, Response, NextFunction, Express} from "express";
import bcrypt from "bcrypt-nodejs";
import passport from "passport";
import {UserDao} from "../user/dao/UserDao";
import {User} from "../user/domain/User";
import {MongoUser} from "../user/dao/schemas/MongoUser";

// Passport configuration, for handling: User login/logout/session status
export class PassportConfiguration {
    userDao: UserDao;

    // method called by endpoints to check if user is logged-in
    static isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            req.body.user = req?.session?.passport?.user;
            return next();
        }

        res.status(403).send();
    };

    constructor(app: Express) {
        this.userDao = new UserDao();

        const LocalStrategy = passportLocal.Strategy;

        // Login method
        // Looks for user in the db by email
        // If email found, validates password
        passport.use(new LocalStrategy({usernameField: "email"}, async (email, password, done) => {
            const user = await this.userDao.getByEmail(email);

            // User not found
            if(!user) {
                // HARDCODED CODE FOR CREATING NEW USERS if (email.toLowerCase() === "diego@gmail.com") {//     const user = new User({//         email: "diego@gmail.com",//         password: "diego"//     });//     user.save((err) => {//         if (err) {//             console.log("error");//         }//     });               // }// }
                done(undefined, false, {message: `Email ${email} not found.`});
                return;
            } else {
                // Validate password match
                const isMatch = await this.validatePassword(user, password);
                if (isMatch) {
                    return done(undefined, MongoUser.getUser(user));
                } else {
                    return done(undefined, false, {message: "Invalid email or password."});
                }
            }
        }));

        // This method is called when hashing user
        passport.serializeUser<any, any>((req, user : MongoUser.Document , done) => {
            done(undefined, user);
        });

        // This method is called in the login process
        passport.deserializeUser(async (id: User, done) => {
            const user = await this.userDao.getById(<string>id.id);
            done(null, user);
        });


        app.use(passport.initialize());
        app.use(passport.session());
    }

    private async validatePassword(user: MongoUser.Document, password: string) {
        return bcrypt.compareSync(password, user.password);
    }
}