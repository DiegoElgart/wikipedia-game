import * as winston from "winston";

// TODO convert into class
// Add context (class, request?) to every log
const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new winston.transports.File({ filename: "application.log", level: "debug" })
    ]
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
