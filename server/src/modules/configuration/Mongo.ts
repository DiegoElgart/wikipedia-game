import {Secrets} from "../common/util/Secrets";
import mongoose from "mongoose";
import bluebird from "bluebird";
import {Logger} from "../common/util/Logger";
import {LogLevels} from "../common/util/LogLevels";

// Mongo Configuration
export class Mongo {
    mongoUrl: string;
    constructor() {
        this.mongoUrl = Secrets.getInstance().MONGODB_URI;
        mongoose.Promise = bluebird;
        // mongoose.set("debug", true);
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
            .then(() => Logger.log(LogLevels.info, "Database connected!"))
            .catch(err => Logger.log(LogLevels.error, err));
    }
}