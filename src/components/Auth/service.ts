import { Types } from 'mongoose';
import { IUserModel, IUser, UserModel } from '../User/model';
import { IAuthService } from './interface';

/**
 * @export
 * @implements {IAuthService}
 */
const AuthService: IAuthService = {

    /**
     * @param {IUserModel} body
     * @returns {Promise <IUserModel>}
     * @memberof AuthService
     */
    async findProfileOrCreate(body: IUser): Promise<IUserModel> {
        try {
            const user: IUserModel = new UserModel({
                provider_profile: body.provider_profile,
                provider: body.provider

            });
            const query: IUserModel = await UserModel.findOne({
                'provider_profile.id': body.provider_profile.id
            });

            if (query) {
                console.log('User already present');

                return query;
            }
            const saved: IUserModel = await user.save();
            return saved;
        } catch (error) {
            throw new Error(error);
        }
    },
};

export default AuthService;
