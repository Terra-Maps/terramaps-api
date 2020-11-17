import * as http from 'http';
import * as passport from 'passport';
import * as passportGithub from 'passport-github';
import * as passportGoogle from 'passport-google-oauth2';
import config from '../env/index';
import HttpError from '../error';
import { NextFunction, Request, Response } from 'express';

import { verify } from 'jsonwebtoken';


type GithubStrategyType = typeof passportGithub.Strategy;
const GithubStrategy: GithubStrategyType = passportGithub.Strategy;

type GoogleStrategyType = typeof passportGoogle.Strategy
const GoogleStrategy: GoogleStrategyType = passportGoogle.Strategy


passport.use(new GoogleStrategy(
    {
        clientID: config.google.CLIENT_ID,
        clientSecret: config.google.CLIENT_SECRET,
        callbackURL: config.google.CALLBACK_URL,
        passReqToCallback: true
    },
    function (request: any, accessToken: any, refreshToken: any, profile: any, done: any): Promise<void> {
        console.log(profile);
        return request;
    }
));


/**
 * @description
 * determines, which data of the user object should be stored in the session.
 * The result of the serializeUser method is attached to the session 
 * as req.session.passport.user = {}
 */
passport.serializeUser((user: any, done: Function) => {
    done(undefined, user);
});

/**
 * @description
 * checks if user exists in database
 * if everything ok, proceed to route
 */
passport.deserializeUser((obj: any, done: Function) => {
    done(null, obj);
});

/**
 * @description
 * configuring new github strategy
 * and use it in passport
 */
passport.use(new GithubStrategy(
    {
        clientID: config.github.CLIENT_ID,
        clientSecret: config.github.CLIENT_SECRET,
        callbackURL: config.github.CALLBACK_URL,
        scope: 'user:email'
    },
    (accessToken: any, refreshToken: any, profile: any, cb: any): Promise<void> => {

        return cb(null, { accessToken, refreshToken, profile });
    }
));


/**
 * @description Login Required middleware.
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    console.log('i am in middleware');
    let jwtToken: any = '';

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwtToken = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        jwtToken = req.query.token;
    }
    console.log(jwtToken);
    let decoded: any = null;

    try {
        console.log('i am decoded', decoded);
        decoded = verify(jwtToken, config.secret);
    } catch (err) {
        // err
        console.log(err);


        // this part need to be handled carefully

        // ArgoSessionModel.find({
        //     'argo_username': req.body.argo_username
        // }).remove().exec();
        // console.log("i am from isAuthenticated");
    }
    // if (req.isAuthenticated()) {
    //     return next();
    // }
    if (decoded) {
        return next();
    }
    next(new HttpError(401, http.STATUS_CODES[401]));
}




