import {Logger} from "./Logger";
import dotenv from "dotenv";
import {LogLevels} from "./LogLevels";
dotenv.config({path: ".env.secret"});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require("env-yaml").config();

export class Secrets {
    MONGODB_URI: string;
    SESSION_SECRET: string;

    static instance: Secrets;

    static getInstance = () => {
        if(!Secrets.instance) {
            Secrets.instance = new Secrets();
        }

        return Secrets.instance;
    }


    constructor() {
        // SETTING DATABASE URL => MONGO_DB_URL
        // set mongo_db password in mongo_db_url
        // we keep them in different files, because .env.secret contains keeps we don't want to push to the repo.
        const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
        let MONGO_DB_URL;
        if (MONGO_DB_PASSWORD) {
            MONGO_DB_URL = env.parsed.mongo.url.replace("<password>", MONGO_DB_PASSWORD);
        } else {
            Logger.log(LogLevels.error, "No database password set. You need to create file: .env.secret with property: MONGO_DB_PASSWORD");
            process.exit(1);
        }
        this.MONGODB_URI = MONGO_DB_URL;

        // SETTING SESSION_SECRET
        // check we have SESSION_SECRET
        this.SESSION_SECRET = process.env["SESSION_SECRET"];
        if (!this.SESSION_SECRET) {
            Logger.log(LogLevels.error, "No client secret. Set SESSION_SECRET environment variable.");
            process.exit(1);
        }
    }
}
