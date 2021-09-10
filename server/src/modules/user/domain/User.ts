interface profile {
    name: string;
    gender: string;
    location: string;
}

export class User {
    id: string;
    email: string;

    profile: profile

    constructor(id: string, email: string, profile: profile) {
        this.id = id;
        this.email = email;
        this.profile = profile;
    }
}