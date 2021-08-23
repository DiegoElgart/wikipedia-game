import { Request, Response } from "express";

/**
 * Game Controller.
 * @route POST /start/game
 */
export const startGame = (req: Request, res: Response) => {
    console.log("gamecontroller startGame: A request reached this endpoint");
    const body = req.body;
    const gameLanguage = body? body.language : null;
    if (gameLanguage) {
        res.status(200).send("start game endpoint successfully reached with language: " + gameLanguage);
    } else {
        res.status(500).send("start game endpoint reached, without language =/");
    }
};
