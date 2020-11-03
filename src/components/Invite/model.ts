import * as connections from '../../config/connection/connection';
import { Document, Schema, Model } from 'mongoose';

/**
 * @export
 * @interface IUserInvite
 * @extends { Document }
 */
export interface IUserInvite extends Document {
    userEmail: String;
    status: String;
}

const UserInviteSchema: Schema = new Schema({
    userEmail: String,
    status: String,
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
    }
});

export const UserInviteModel: Model<IUserInvite> = connections.db.model<IUserInvite>('UserInvite', UserInviteSchema);
