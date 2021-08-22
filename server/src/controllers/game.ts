import { Request, Response } from "express";

/**
 * Game Controller.
 * @route POST /startGame
 */
export const startGame = (req: Request, res: Response) => {
    console.log("gamecontroller startGame: A request reached this endpoint");
    // playing around a little bit with body fields
    console.log(req);
    const body = req.body;
    const gameLanguage = body? body.language : null;
    if (gameLanguage) {
        res.status(200).send("start game endpoint successfully reached");
    } else {
        res.status(500).send("start game endpoint reached, without language =/");
    }
};
