import { ITerraMapsMetaData, IUserModel } from './model';

/**
 * @export
 * @interface IUserService
 */
export interface IUserService {

    /**
     * @returns {Promise<IUserModel[]>}
     * @memberof IUserService
     */
    findAll(): Promise<IUserModel[]>;

    /**
     * @param {string} code
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    findOne(code: string): Promise<IUserModel>;

    /**
     * @param {string} code
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    findOneByGithubId(id: string): Promise<IUserModel>;

    /**
     * @param {IUserModel} IUserModel
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    insert(IUserModel: IUserModel): Promise<IUserModel>;

    /**
     * @param {string} id
     * @returns {Promise<IUserModel>}
     * @memberof IUserService
     */
    remove(id: string): Promise<IUserModel>;

    addMetadata(metaData: ITerraMapsMetaData): Promise<boolean>;
    findSalt(geoHash: string, userAddress: string): Promise<ITerraMapsMetaData>;

}
