// Dependencies
import mongoose from "mongoose";
// Helper
import { EMAIL_PROVIDER } from "../constants/index.js";
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    provider: { type: String, required: true, default: EMAIL_PROVIDER.EMAIL },
    password: { type: String },
    refreshToken: { type: String },
    avatar: { type: String },
    googleID: { type: String },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
