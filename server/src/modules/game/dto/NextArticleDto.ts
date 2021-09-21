import {IsDefined, IsNumber} from "class-validator";
import {Expose} from "class-transformer";
import {Dto} from "../../common/dto/Dto";
import {User} from "../../user/domain/User";

export class NextArticleDto extends Dto {
    constructor(id: number, user:User) {
        super();
        this.id = id;
        this.user = user;
    }
    @IsDefined()
    @Expose()
    @IsNumber()
    id: number;
}