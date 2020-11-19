import * as Joi from 'joi';
import { UserModel, IUserModel, TerraMapsMetadata, ITerraMapsMetaData, IUser, IWallet } from './model';
import UserValidation from './validation';
import { IUserService } from './interface';
import { Types } from 'mongoose';

/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
    /**
     * @returns {Promise < IUserModel[] >}
     * @memberof UserService
     */
    async findAll(): Promise<IUserModel[]> {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOne(id: string): Promise<IUserModel> {
        try {
            return await UserModel.findOne({
                _id: Types.ObjectId(id)
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOneByGithubId(id: string): Promise<IUserModel> {
        try {
            return await UserModel.findOne({
                profile: { id: Types.ObjectId(id) }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {IUserModel} user
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async insert(body: IUserModel): Promise<IUserModel> {
        try {
            const validate: Joi.ValidationResult<IUserModel> = UserValidation.createUser(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.create(body);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async remove(id: string): Promise<IUserModel> {
        try {
            const filter = {
                'profile.id': id
            }
            const user: IUserModel = await UserModel.findOneAndRemove(filter);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async addMetadata(metaData: ITerraMapsMetaData): Promise<boolean> {
        try {
            await TerraMapsMetadata.create(metaData);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async findSalt(geoHash: string, userAddress: string): Promise<ITerraMapsMetaData> {
        try {
            const filter = {
                geo_hash: geoHash,
                user_address: userAddress
            }
            return await TerraMapsMetadata.findOne(filter);
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async storeGoogleMetada(body: IUser): Promise<IUserModel> {
        try {

            const filter = {
                'provider_profile.username': body.provider_profile.email

            }
            const verify = await UserModel.findOne(filter);
            if (verify) {
                const filterById = {
                    '_id': Types.ObjectId(verify._id)
                }
                await UserModel.findOneAndUpdate(filterById, body);
                return verify;
            }
            const val = await UserModel.create(body);
            return val;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async updateWalletAddress(id: string, wallet: IWallet): Promise<any> {
        try {

            const filter = {
                _id: Types.ObjectId(id)
            };

            let userModel = await UserModel.findOne(filter);
            const update = {
                $set: {
                    'wallet.wallet_address': wallet.address,
                    'wallet.passphrase': wallet.passphrase
                }
            };
            await UserModel.findOneAndUpdate(filter, update);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default UserService;
