import * as winston from "winston";
import {LogLevels} from "./LogLevels";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getNamespace = require("continuation-local-storage").getNamespace;

export class Logger {
    private static instance: winston.Logger;

    static log = (logLevel: LogLevels, msg: string) => {
        if(!Logger.instance) {
            Logger.initilizeLogger();
        }
        const requestId = getNamespace("my request")?.get("requestId");
        Logger.instance[logLevel]({message: msg, meta: {requestId: requestId}});
    };

    static initilizeLogger = () => {
        const myFormat = winston.format.printf(({ level, message, timestamp, meta }) => {
            const requestId = meta?.requestId ? ` - {requestId:${meta.requestId}}` : "";
            return `${timestamp} - ${level}${requestId}: ${message}`;
        });

        const options: winston.LoggerOptions = {
            format: winston.format.combine(
                winston.format.timestamp(),
                myFormat
            ),
            transports: [
                new winston.transports.Console({
                    level: process.env.NODE_ENV === "production" ? "error" : "debug"
                }),
                new winston.transports.File({ filename: "application.log", level: "debug" })
            ]
        };

        Logger.instance = winston.createLogger(options);

        if (process.env.NODE_ENV !== "production") {
            Logger.instance.debug("Logging initialized at debug level");
        }
    }
}
