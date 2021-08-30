import {User} from "../../user/domain/User";

declare module "express-serve-static-core" {
    interface Request {
        dtoType: Dto
        session: {id: any, cookie: any, regenerate: any, destroy: any, reload: any, resetMaxAge: any, save: any, touch: any, passport?: {user?: User}}
    }
}

export abstract class Dto {
    prototype: any;
    user?: User;
}
