import {UserDocument, UserModel} from "./schemas/UserSchema";
import {User} from "../domain/User";

export class UserDao {
    getUserById = async (id: string) => {
        const userDocument : UserDocument = await UserModel.findById(id);
        if(userDocument) {
            return new User(userDocument);
        }
    }

    getUserByEmail = async (email: string) => {
        return UserModel.findOne({email: email.toLowerCase()});
    }
}