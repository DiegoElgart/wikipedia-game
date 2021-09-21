import {validateSync} from "class-validator";
import {Dto} from "./Dto";
import {Logger} from "../util/Logger";
import {LogLevels} from "../util/LogLevels";

export const validateDto = async (dto:Dto) => {
    // validate that dto matches annotations
    const errors = await validateSync(dto, {skipMissingProperties: true});

    if (errors.length > 0) {
        // Try to return as much information as we have for the error
        let errorTexts: any[] = [];
        for (const errorItem of errors) {
            errorTexts = errorTexts.concat(errorItem.constraints);
        }

        Logger.log(LogLevels.error, "Error validating dto: " + JSON.stringify(errorTexts));
        throw new Error("Invalid dto");
    }
};