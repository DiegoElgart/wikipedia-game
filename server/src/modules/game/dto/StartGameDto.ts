import {IsDefined, IsEnum, isString, Matches} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {GameType} from "../domain/GameType";
import {Dto} from "../../common/dto/Dto";

export class StartGameDto extends Dto {
    @Transform(gameType => GameType[gameType.value])
    @IsDefined()
    @Expose()
    gameType: GameType;
    @IsDefined()
    @Expose()
    language: string;
}