import {Request, Response} from "express";
import path from "path";
import {Get, JsonController, Req, Res, UseBefore} from "routing-controllers";
import * as fs from "fs";

@JsonController()
export class HomeController {

    @Get("/")
    async getHome(@Req() req: Request, @Res() res: Response) {
        return this.getHTMLFile("main");
    }

    @Get("/login")
    async getLoginPage(@Req() req: Request, @Res() res: Response) {
        if (req.isAuthenticated()) {
            res.redirect("/");
            return res;
        } else {
            return this.getHTMLFile("login");
        }
    }

    private getHTMLFile(htmlFileName: string) {
        return fs.createReadStream(path.resolve(__dirname + `../../../../client/${htmlFileName}.html`));
    }
}