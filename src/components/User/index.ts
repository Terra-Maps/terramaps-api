import UserService from './service';
import { HttpError } from '../../config/error';
import { ITerraMapsMetaData, IUserModel } from './model';
import { NextFunction, Request, Response } from 'express';
import JWTTokenService from '../Session/service';
const { request, gql } = require('graphql-request')

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users: IUserModel[] = await UserService.findAll();

        res.status(200).json(users);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);

        console.log(argoDecodedHeaderToken);

        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);

        console.log('Deserialized Token: ', deserializedToken);

        console.log(deserializedToken.session_id);
        const user: IUserModel = await UserService.findOne(deserializedToken.session_id);
        res.status(200).json({ user });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await UserService.insert(req.body);

        res.status(201).json(user);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await UserService.remove(req.params.id);

        res.status(200).json(user);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const terraMapsDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(terraMapsDecodedHeaderToken);
        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function addMetadata(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const metadata: ITerraMapsMetaData = {
            geo_hash: req.body.geo_hash,
            salt: req.body.salt,
            user_address: req.body.user_address
        }
        await UserService.addMetadata(metadata);
        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
export async function findSalt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const geoHash = req.query.geo_hash.toString();
        const userAddress = req.query.user_address.toString();


        const metadata = await UserService.findSalt(geoHash, userAddress);
        res.status(200).json({
            success: true,
            data: metadata
        });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function updateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        await UserService.updateWalletAddress(deserializedToken.session_id, req.body);
        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

