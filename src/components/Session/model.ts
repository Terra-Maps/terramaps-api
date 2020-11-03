
import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface ITerraMapsSessionModel extends Document {
    session_id: string;
    access_token: string;
    is_active: boolean;
}

const TerraMapsSessionSchema: Schema = new Schema({
    session_id: String,
    access_token: String,
    is_active: Boolean,
}, {
    collection: 'terramapssession',
    versionKey: false
});

export default connections.db.model<ITerraMapsSessionModel>('TerraMapsSession', TerraMapsSessionSchema);
