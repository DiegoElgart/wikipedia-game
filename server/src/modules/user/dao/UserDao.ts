import {MongoUser} from "./schemas/MongoUser";
import {Metrics} from "../../common/util/Metrics";

const meteredMethod = Metrics.meteredMethod;

export class UserDao {
    @meteredMethod()
    async getById(id: string) {
        const userDocument = await MongoUser.model.findById(id);
        if(userDocument) {
            return MongoUser.getUser(userDocument);
        }
    }

    @meteredMethod()
    async getByEmail(email: string) {
        return MongoUser.model.findOne({email: email.toLowerCase()});
    }
}