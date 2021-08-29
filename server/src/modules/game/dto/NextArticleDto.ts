import {IsDefined, Matches} from "class-validator";
import {Expose} from "class-transformer";
import {Dto} from "../../common/dto/Dto";

// TODO this is temporary to test different dtos
export class NextArticleDto extends Dto {
    @IsDefined()
    @Expose()
    language: string;
    @IsDefined()
    @Expose()
    articleId: number;
}