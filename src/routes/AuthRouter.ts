import { Router } from 'express';
import * as passport from 'passport';
import AuthService from '../components/Auth/service';
import { ITerraMapsSessionDto } from '../components/Session/interface';
import JWTTokenService from '../components/Session/service';
import { IProfile, IProvider, IProviderModel, IUser, IUserModel, IWallet } from '../components/User/model';
import * as config from '../config/env/index';
import console = require('console');
import { Types } from 'mongoose';
import UserService from '../components/User/service';
const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const axios = require('axios').default;

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * GET method route
 * @example http://localhost:PORT/auth/github
 * @swagger
 * /auth/github/:
 *  get:
 *    description: sign up user to application with github
 *    tags: ["auth"]
 *    requestBody:
 *      description: sign up body
 *    responses:
 *      301:
 *        description: user successfuly signed in
 *        content:
 *          appication/json:
 *            example:
 *              status: 301
 */
router.get('/github', passport.authenticate('github'));

router.get('/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${config.default.argoReact.BASE_ADDRESS}/signup`,
    }),
    async (req, res) => {
        console.log(req.user.profile)
        const userProfileModel: IUserModel = await AuthService.findProfileOrCreate({
            provider_profile: {
                ...req.user.profile._json,
                username: req.user.profile.username,
                email: req.user.profile.emails?.filter((email: any) => email.primary || email.primary === undefined)[0].value
            },
            provider: { name: req.user.profile.provider }
        });

        const argoSessionDto: ITerraMapsSessionDto = {
            session_id: userProfileModel.id,
            access_token: req.user.accessToken,
            is_active: true,
        };

        const dtos: ITerraMapsSessionDto = await JWTTokenService.findSessionOrCreate(
            argoSessionDto
        );
        const token: string = await JWTTokenService.generateToken(dtos);

        res.redirect(`${config.default.argoReact.BASE_ADDRESS}/callback/github?token=${token}`);
    }
);

router.delete('/logout', async (req, res) => {
    const token: any = await JWTTokenService.DecodeToken(req);
    const verifiedToken: any = await JWTTokenService.VerifyToken(token);

    await JWTTokenService.FindAndRemove(verifiedToken.session_id);
    await req.logOut();
    req.session = null;
    res.status(200).json({ success: true });
});

router.get('/google/callback', async (req, res) => {
    console.log(req);
    const instanceAxios = axios.create({
        baseURL: 'https://oauth2.googleapis.com/token',
        timeout: 5000,
        params: {
            'client_id': config.default.google.CLIENT_ID,
            'client_secret': config.default.google.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': config.default.google.CALLBACK_URL,
            'code': `${req.query.code}`
        }
    });
    const response = await instanceAxios.post();

    let resGet = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.data.id_token}`);

    const provider: IProvider = {
        name: 'google'
    }

    const providerProfile: IProfile = {
        email: resGet.data.email,
        username: resGet.data.email,
        avatar_url: resGet.data.picture,
        name: resGet.data.name
    }

    const wallet: IWallet = {
        address: "",
        passphrase: ""
    }
    const userModel: IUser = {
        provider: provider,
        provider_profile: providerProfile,
        wallet: wallet
    };
    const storeData = await UserService.storeGoogleMetada(userModel);

    const terraMapsSessionDto: ITerraMapsSessionDto = {
        session_id: storeData.id,
        access_token: "temporary_token",
        is_active: true,
    };

    const dtos: ITerraMapsSessionDto = await JWTTokenService.findSessionOrCreate(
        terraMapsSessionDto
    );
    const token: string = await JWTTokenService.generateToken(dtos);
    res.redirect(`${config.default.argoReact.BASE_ADDRESS}/callback/github?token=${token}`);

});




export default router;
