import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {Dto} from "./Dto";

export const validateDto = (dtoType: Dto, req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(dtoType.prototype.constructor, req.body);
    validate(dto, { skipMissingProperties: true }).then(errors => {
        if (errors.length > 0) {
            let errorTexts: any[] = [];
            for (const errorItem of errors) {
                errorTexts = errorTexts.concat(errorItem.constraints);
            }
            res.status(400).send(errorTexts);
            return;
        } else {
            req.body = dto;
            req.body.user = req?.session?.passport?.user;
            next();
        }
    });
};