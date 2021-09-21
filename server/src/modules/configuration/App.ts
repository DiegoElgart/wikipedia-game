import "reflect-metadata";
import bodyParser from "body-parser";
import compression from "compression";  // compresses requests
import express, {Express} from "express";
import session from "express-session";
import {Secrets} from "../common/util/Secrets";
import MongoStore from "connect-mongo";
import {ControllersConfiguration} from "./ControllersConfiguration";
import {PassportConfiguration} from "./PassportConfiguration";
import {Mongo} from "./Mongo";
import errorHandler from "errorhandler";
import * as uuid from "node-uuid";
import * as continuationLocalStorage from "continuation-local-storage" ;

const createNamespace = continuationLocalStorage.createNamespace;
const myRequest = createNamespace("my request");

import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install();

export class App {
    app: Express;

    constructor() {
        // Create Express server
        this.app = express();

        // initialize mongo
        const mongo = new Mongo();

        // configure express:
        this.configureExpress(mongo.mongoUrl);

        // Configure Passport
        new PassportConfiguration(this.app);

        // Applications controllers
        new ControllersConfiguration(this.app);

        this.initializeServer();
    }

    // Configure:
    // port, serialization/deserialization, handle session, set request id to every call,
    private configureExpress = (mongoUrl: string) => {
        this.app.set("port", process.env.port || 3000);
        this.app.use(compression());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: Secrets.getInstance().SESSION_SECRET,
            store: new MongoStore({
                mongoUrl: mongoUrl,
                mongoOptions: {
                    useUnifiedTopology: true
                }
            })
        }));

        // Configure to set requestId on every call
        this.app.use((req, res, next) => {
            myRequest.run(function () {
                myRequest.set("requestId", uuid.v1());
                next();
            });
        });

        // Configure stacktrace
        if (process.env.NODE_ENV === "development") {
            this.app.use(errorHandler());
        }
    }

    private initializeServer = () => {
        // Initialize server
        this.app.listen(this.app.get("port"), () => {
            console.log(
                "  App is running at http://localhost:%d in %s mode",
                this.app.get("port"),
                this.app.get("env")
            );
            console.log("  Press CTRL-C to stop\n");
        });
    }
}