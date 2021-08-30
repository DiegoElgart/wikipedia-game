import bodyParser from "body-parser";
import compression from "compression";  // compresses requests
import express, {Express} from "express";
import session from "express-session";
import {Secrets} from "../common/util/Secrets";
import MongoStore from "connect-mongo";
import {Controllers} from "./Controllers";
import {PassportConfiguration} from "./PassportConfiguration";
import {Mongo} from "./Mongo";
import errorHandler from "errorhandler";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require("node-uuid");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createNamespace = require("continuation-local-storage").createNamespace;
const myRequest = createNamespace("my request");

export class App {
    app: Express;

    constructor() {
        // Create Express server
        this.app = express();

        // initialize mongo
        const mongo = new Mongo();

        // configure express
        this.configureExpress(mongo.mongoUrl);

        // Configure Passport
        new PassportConfiguration(this.app);

        // Applications controllers
        Controllers.initializeEndpoints(this.app);

        this.initializeServer();
    }


    private configureExpress = (mongoUrl: string) => {
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
                mongoUrl: mongoUrl,
                mongoOptions: {
                    useUnifiedTopology: true
                }
            })
        }));

        // Configure to set requestId
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