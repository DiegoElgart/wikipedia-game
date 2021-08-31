import {UserDocument} from "../dao/schemas/UserSchema";

export class User {
    id: string;
    email: string;

    profile: {
        name: string;
        gender: string;
        location: string;
    }

    constructor(userDocument: UserDocument) {
        const userDocumentObject = userDocument.toObject();
        this.id = userDocumentObject._id;
        this.email = userDocumentObject.email;
        this.profile = userDocumentObject.profile;
    }
}