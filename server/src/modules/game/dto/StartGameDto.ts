import {IsBoolean, IsDefined, IsEnum, isString, Matches} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {GameType} from "../domain/GameType";
import {Dto} from "../../common/dto/Dto";
import { Game } from "../domain/Game";
import {GameLanguage} from "../domain/GameLanguage";

export class StartGameDto extends Dto {
    @Transform(gameType => GameType[gameType.value])
    @IsDefined()
    @Expose()
    gameType: GameType;
    @IsDefined()
    @Expose()
    language: GameLanguage;
    @IsBoolean()
    finishPreviousGames: boolean;

    getGame = () => {
        return new Game(this.gameType, this.language, this.user);
    }
}