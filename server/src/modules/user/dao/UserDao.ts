import {MongoUser} from "./schemas/MongoUser";

export class UserDao {
    getUserById = async (id: string) => {
        const userDocument : MongoUser.Document = await MongoUser.model.findById(id);
        if(userDocument) {
            return MongoUser.getUser(userDocument);
        }
    }

    getUserByEmail = async (email: string) => {
        return MongoUser.model.findOne({email: email.toLowerCase()});
    }
}