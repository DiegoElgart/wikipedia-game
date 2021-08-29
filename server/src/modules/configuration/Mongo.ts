import {Secrets} from "../common/util/Secrets";
import mongoose from "mongoose";
import bluebird from "bluebird";

export class Mongo {
    mongoUrl: string;
    constructor() {
        this.mongoUrl = Secrets.getInstance().MONGODB_URI;
        mongoose.Promise = bluebird;
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    }
}