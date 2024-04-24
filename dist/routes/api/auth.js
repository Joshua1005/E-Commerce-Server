// Dependencies
import passport from "passport";
import { Router } from "express";
// Controllers
import { oAuthCallback, refreshAccess, signIn, signOut, signUp, } from "../../controllers/auth/index.js";
const router = Router();
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/refresh", refreshAccess);
router.post("/signout", signOut);
router.get("/google", passport.authenticate("google", {
    session: false,
    scope: ["profile", "email", "openid"],
}));
router.get("/google/callback", passport.authenticate("google", { session: false }), oAuthCallback);
export default router;
