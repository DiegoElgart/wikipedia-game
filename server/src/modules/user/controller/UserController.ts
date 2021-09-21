import {Request, Response, NextFunction, Express} from "express";
import "../../configuration/PassportConfiguration";
import {LoginDto} from "../dto/LoginDto";
import {UserService} from "../service/UserService";
import {PassportConfiguration} from "../../configuration/PassportConfiguration";
import {Body, Get, JsonController, OnUndefined, Post, Redirect, Req, Res, UseBefore} from "routing-controllers";

@JsonController()
export class UserController {

    @Get("/user")
    @UseBefore(PassportConfiguration.isAuthenticated)
    async getUser(@Req() req: Request, @Res() res: Response) {
        return req.user;
    }

    // The login is being directly done in the annotation @UserBefore method UserService.loginUser()
    @Post("/login")
    @UseBefore(UserService.loginUser)
    async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    }

    @Get("/logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        req.logout();

        res.redirect("/login");

        return res;
    }
}