import {IsDefined, IsEmail, IsEnum, isString, Matches, MinLength} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {Dto} from "../../common/dto/Dto";

export class LoginDto extends Dto {
    @IsDefined()
    @Expose()
    @IsEmail()
    email: string;
    @IsDefined()
    @Expose()
    @MinLength(1)
    password: string;
}