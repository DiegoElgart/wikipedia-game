import mongoose, {ObjectId} from "mongoose";
import bcrypt from "bcrypt-nodejs";
import {User} from "../../domain/User";

export namespace MongoUser {
    export interface Document extends mongoose.Document {
        _id: ObjectId;
        email: string;
        password: string;

        profile: {
            name: string;
            gender: string;
            location: string;
        };
    }

    export const schema = new mongoose.Schema<Document>(
        {
            email: {type: String, unique: true},
            password: String,

            profile: {
                name: String,
                gender: String,
                location: String,
            }
        },
        {timestamps: true}
    );

    schema.pre("save", function save(next) {
        const user = this as Document;
        if (!user.isModified("password")) {
            return next();
        }
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    });

    export const model = mongoose.model<Document>("User", schema);

    export const getUser = (userDocument: Document) => {
        const userDocumentObject = userDocument.toObject ? userDocument.toObject() : userDocument;
        const id = userDocumentObject._id.toString();
        const email = userDocumentObject.email;
        const profile = userDocumentObject.profile;
        return new User(id, email, profile);
    };
}
