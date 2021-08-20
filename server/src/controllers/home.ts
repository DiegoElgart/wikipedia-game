import { Request, Response } from "express";

/**
 * Home page.
 * @route GET /
 */
export const index = (req: Request, res: Response) => {
    // TODO: add logging library to avoid writing the context.
    console.log("homecontroller index: A request reached this endpoint");
    res.status(200).send("You're app is up and running! This will be the home site.");

};
