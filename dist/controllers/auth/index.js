// Dependencies
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
// Model
import User from "../../models/user.js";
// Helper
import { EMAIL_PROVIDER } from "../../constants/index.js";
import { client, jwt } from "../../config/keys.js";
import { cookieOptions } from "./support.js";
const signUp = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "First name, last name, email and password are required to create an account.",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return existingUser.provider !== EMAIL_PROVIDER.EMAIL
                ? res.status(405).json({
                    message: `This email is already registered and it's using ${existingUser.provider} as log in method.`,
                })
                : res
                    .status(409)
                    .json({ message: "The email provided is already registered." });
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);
        await User.create({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
        });
        return res
            .status(201)
            .json({ message: "Successfully created an account." });
    }
    catch (error) {
        return res.status(500).json({ message: error?.message });
    }
};
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required to login an account.",
            });
        }
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res
                .status(404)
                .json({ message: "The email provided is not yet registered." });
        }
        if (foundUser.provider !== EMAIL_PROVIDER.EMAIL) {
            return res.status(405).json({
                message: `This email is already using ${foundUser.provider} as logged in method. Try logging it using the provider mentioned.`,
            });
        }
        const matchedPassword = await bcrypt.compare(password, foundUser.password);
        if (!matchedPassword) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const payload = { _id: foundUser._id };
        const options = { expiresIn: "7d" };
        const accessToken = jsonwebtoken.sign(payload, jwt.accessTokenSecret, options);
        const refreshToken = jsonwebtoken.sign(payload, jwt.refreshTokenSecret);
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        const { password: _, refreshToken: __, ...user } = foundUser.toObject();
        return res
            .cookie("refreshToken", refreshToken, cookieOptions)
            .status(200)
            .json({ accessToken, user });
    }
    catch (error) {
        return res.status(500).json({ message: error?.message });
    }
};
const refreshAccess = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies) {
            return res
                .status(400)
                .json({ message: "The request is missing a required cookie." });
        }
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token defined." });
        }
        const decoded = jsonwebtoken.verify(refreshToken, jwt.refreshTokenSecret);
        const foundUser = await User.findById({ _id: decoded._id });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }
        const matchedRefreshToken = refreshToken === foundUser.refreshToken;
        if (!matchedRefreshToken) {
            return res.status(403).json({ message: "Forbidden." });
        }
        const payload = { _id: foundUser._id };
        const options = { expiresIn: "7d" };
        const accessToken = jsonwebtoken.sign(payload, jwt.accessTokenSecret, options);
        const { password: _, refreshToken: __, ...user } = foundUser.toObject();
        return res.status(200).json({ accessToken, user });
    }
    catch (error) {
        return res.status(500).json({ message: error?.message });
    }
};
const signOut = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies) {
            return res
                .status(400)
                .json({ message: "The request is missing a required cookie." });
        }
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token defined." });
        }
        const decoded = jsonwebtoken.verify(refreshToken, jwt.refreshTokenSecret);
        await User.findOneAndUpdate({ _id: decoded._id }, { $unset: { refreshToken: "" } });
        return res
            .clearCookie("refreshToken", cookieOptions)
            .status(200)
            .json({ message: "Logged out successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: error?.message });
    }
};
const oAuthCallback = async (req, res) => {
    const user = req.user;
    const payload = { _id: user._id };
    const refreshToken = jsonwebtoken.sign(payload, jwt.refreshTokenSecret);
    await User.findOneAndUpdate({ _id: user._id }, { $set: { refreshToken } });
    return res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect(client.url);
};
export { signUp, signIn, refreshAccess, signOut, oAuthCallback };
