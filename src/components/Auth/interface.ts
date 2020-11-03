import { IUserModel, IUser } from '../User/model';

/**
 * @export
 * @interface IAuthService
 */
export interface IAuthService {
    /**
     * @param {IUser} user
     * @returns {Promise<IUserModel>}
     * @memberof AuthService
     */
    findProfileOrCreate(user: IUser): Promise<IUserModel>;
}
