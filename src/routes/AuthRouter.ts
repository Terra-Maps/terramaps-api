import { Router } from 'express';
import * as passport from 'passport';
import AuthService from '../components/Auth/service';
import { ITerraMapsSessionDto } from '../components/Session/interface';
import JWTTokenService from '../components/Session/service';
import { IUserModel } from '../components/User/model';
import * as config from '../config/env/index';
import console = require('console');
import { Types } from 'mongoose';
const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const axios = require('axios').default;

// const fullPath = path.join(__dirname, "argoappgit.pem");

// const readAsAsync = fs.readFileSync(fullPath, 'utf8');
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




export default router;
