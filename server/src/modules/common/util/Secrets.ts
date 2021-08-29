import logger from "./logger";
import dotenv from "dotenv";
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
        // set mongo_db password in mongo_db_url
        // we keep them in different files, because .env.secret contains keeps we don't want to push to the repo.
        const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
        let MONGO_DB_URL;
        if (MONGO_DB_PASSWORD) {
            MONGO_DB_URL = env.parsed.mongo.url.replace("<password>", MONGO_DB_PASSWORD);
        } else {
            logger.error("No database password set. You need to create file: .env.secret with property: MONGO_DB_PASSWORD");
            process.exit(1);
        }
        this.MONGODB_URI = MONGO_DB_URL;

        // check we have SESSION_SECRET
        this.SESSION_SECRET = process.env["SESSION_SECRET"];
        if (!this.SESSION_SECRET) {
            logger.error("No client secret. Set SESSION_SECRET environment variable.");
            process.exit(1);
        }
    }
}
