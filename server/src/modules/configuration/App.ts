import bodyParser from "body-parser";
import compression from "compression";  // compresses requests
import express, {Express} from "express";
import session from "express-session";
import {Secrets} from "../common/util/Secrets";
import MongoStore from "connect-mongo";
import {Controllers} from "./Controllers";
import {PassportConfiguration} from "./PassportConfiguration";
import {Mongo} from "./Mongo";

export class App {
    app: Express;

    constructor() {
        // Create Express server
        this.app = express();

        const mongo = new Mongo();

        // TODO move express configuration to configuration module
        // Express configuration
        this.app.set("port", process.env.port || 3000);
        this.app.use(compression());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: Secrets.getInstance().SESSION_SECRET,
            store: new MongoStore({
                mongoUrl: mongo.mongoUrl,
                mongoOptions: {
                    useUnifiedTopology: true
                }
            })
        }));

        // Configure Passport
        new PassportConfiguration(this.app);

        // TODO is all this required? Move to configuration module
        this.app.use((req, res, next) => {
            res.locals.user = req.user;
            next();
        });
        this.app.use((req, res, next) => {
            // After successful login, redirect back to the intended page
            if (!req.user &&
                req.path !== "/login" &&
                req.path !== "/signup" &&
                !req.path.match(/^\/auth/) &&
                !req.path.match(/\./)) {
                // req.session.returnTo = req.path;
            } else if (req.user &&
                req.path == "/account") {
                // req.session.returnTo = req.path;
            }
            next();
        });

        // Applications controllers
        Controllers.initializeEndpoints(this.app);
    }
}