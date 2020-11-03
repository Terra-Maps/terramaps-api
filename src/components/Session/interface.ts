/**
 * @export
 * @interface IArgoSerssionService
 */

import { ITerraMapsSessionModel } from "./model";

export interface IArgoJwtTokenService {
    /**
    * @param {number} id
    * @returns {Promise<ITerraMapsSessionModel>}
    * @memberof ITerraMapsSessionModel
    */
    findSessionOrCreate(argoSessionDto: ITerraMapsSessionDto): Promise<ITerraMapsSessionDto>;

    generateToken(argoSessionDto: ITerraMapsSessionDto): Promise<string>;

    findOneByUserId(argo_username: string): Promise<ITerraMapsSessionModel>;

    VerifyToken(token: string): Promise<string>;
    DecodeToken(req: any): Promise<any>;

    FindAndRemove(session_id: string): Promise<any>;

    FindOneBySessionId(session_id: string): Promise<ITerraMapsSessionModel>;
}

export interface ITerraMapsSessionDto {
    session_id: string;
    access_token: string;
    is_active: boolean;
}

