import { Injectable } from "@angular/core";
import { UserProfile } from "../models/profile";

@Injectable()
export class CurrentUserService{
    private currentUser: UserProfile;

    constructor(){
        //todo remove
        this.currentUser = new UserProfile();
        this.currentUser.id = 1;
        this.currentUser.name = "vimbo";
        this.currentUser.score = 0;
        this.currentUser.picture = "data:image/png;base64,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";
    }

    getCurrentUser(): UserProfile {
        return this.currentUser;
    }
} 