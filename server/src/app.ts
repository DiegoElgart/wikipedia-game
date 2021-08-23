import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import {SESSION_SECRET} from "./util/secrets";
import bodyParser from "body-parser";
import passport from "passport";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.port || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
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
import * as homeController from "./controllers/home";
import * as gameController from "./controllers/game";
import * as userController from "./controllers/user";

// home page
app.get("/", homeController.index);

// login endpoints
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);

// game endpoints
app.post("/game/start", passportConfig.isAuthenticated, gameController.startGame);




export default app;