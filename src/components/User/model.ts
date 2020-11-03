import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

/**
 * @export
 * @interface IProfile
 */
export interface IProfile {
    id: number;
    username: string;
    avatar_url: string;
    name: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    email: string;
}

/**
 * @export
 * @interface IProvider
 */
export interface IProvider {
    name: string;
}


/**
 * @export
 * @interface IUser
 */
export interface IUser {
    provider_profile: IProfile;
    provider: IProvider;
    dateOfEntry?: Date;
    lastUpdated?: Date;
    organizations?: [string[]];
}


/**
 * @export
 * @interface IProfileModel
 * @extends {Document}
 */
export interface IProfileModel extends Document {
    id: number;
    username: string;
    avatar_url: string;
    name: string;
    email: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
}

/**
 * @export
 * @interface IProviderModel
 * @extends {Document}
 */
export interface IProviderModel extends Document {
    name: string;
}

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
    provider_profile: IProfileModel;
    provider: IProviderModel;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}

const ProviderSchema: Schema = new Schema({
    name: String
});

/**
 * @swagger
 * components:
 *  schemas:
 *    UserSchema:
 *      required:
 *        - email
 *        - name
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        passwordResetToken:
 *          type: string
 *        passwordResetExpires:
 *          type: string
 *          format: date
 *        tokens:
 *          type: array
 *    Users:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/UserSchema'
 */
const UserSchema: Schema = new Schema({
    provider_profile: {
        id: { type: Number, unique: true },
        username: String,
        avatar_url: String,
        name: String,
        email: String,
        url: String,
        html_url: String,
        followers_url: String,
        following_url: String,
        gists_url: String,
        starred_url: String,
        subscriptions_url: String,
        organizations_url: String,
        repos_url: String,
        events_url: String,
        received_events_url: String,
        public_repos: Number,
        public_gists: Number,
        followers: Number,
        following: Number
    },
    provider: ProviderSchema,
    dateOfEntry: {
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    }
}, {
    collection: 'users',
    versionKey: false
});




export default connections.db.model<IUserModel>('UserModel', UserSchema);

