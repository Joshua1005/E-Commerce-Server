// Dependencies
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Helper
import { google, jwt } from "./keys.js";
import User from "../models/user.js";

// Types
import type { Express } from "express";
import type { StrategyOptions, VerifyCallback } from "passport-jwt";
import type {
  StrategyOptions as GoogleStrategyOptions,
  VerifyCallback as GoogleVerifyCallback,
  Profile,
} from "passport-google-oauth20";

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwt.accessTokenSecret,
};

const verifyJWT: VerifyCallback = async (payload, done) => {
  try {
    const foundUser = await User.findOne({ _id: payload._id });

    if (!foundUser) {
      return done(null, false);
    }

    return done(null, foundUser);
  } catch (error) {
    return done(error, false);
  }
};

const googleOptions: GoogleStrategyOptions = {
  clientID: google.clientID,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackURL,
};

const verifyGoogle = async (
  _: string,
  __: string,
  profile: Profile,
  done: GoogleVerifyCallback
) => {
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
  } catch (error: any) {
    done(error);
  }
};

const setupPassword = (app: Express) => {
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
