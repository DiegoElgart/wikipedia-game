import {IsDefined, IsNumber, isNumber, IsString, Matches} from "class-validator";
import {Expose} from "class-transformer";
import {Dto} from "../../common/dto/Dto";

export class NextArticleDto extends Dto {
    @IsDefined()
    @Expose()
    id: number;
}