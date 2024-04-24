// Dependencies
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// Helper
import { google, jwt } from "./keys.js";
import User from "../models/user.js";
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt.accessTokenSecret,
};
const verifyJWT = async (payload, done) => {
    try {
        const foundUser = await User.findOne({ _id: payload._id });
        if (!foundUser) {
            return done(null, false);
        }
        return done(null, foundUser);
    }
    catch (error) {
        return done(error, false);
    }
};
const googleOptions = {
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL,
};
const verifyGoogle = async (_, __, profile, done) => {
    try {
        const { emails, name, photos } = profile;
        const email = emails?.at(0)?.value;
        const avatar = photos?.at(0)?.value;
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            const user = await User.create({
                firstName: name?.givenName,
                middleName: name?.middleName,
                lastName: name?.familyName,
                email,
                provider: profile.provider,
                avatar,
                googleID: profile.id,
            });
            return done(null, user);
        }
        return done(null, foundUser);
    }
    catch (error) {
        done(error);
    }
};
const setupPassword = (app) => {
    passport.use(new Strategy(jwtOptions, verifyJWT));
    passport.use(new GoogleStrategy(googleOptions, verifyGoogle));
    passport.serializeUser((user, done) => done(user._id));
    passport.deserializeUser((_id, done) => {
        User.findById({ _id })
            .then((user) => {
            user && (user.refreshToken = "");
            return done(null, user);
        })
            .catch((error) => done(error, false));
    });
    app.use(passport.initialize());
};
export default setupPassword;
