// Dependencies
import mongoose from "mongoose";

// Types
import { InferSchemaType, Model } from "mongoose";

// Helper
import { EMAIL_PROVIDER } from "../constants/index.js";

type UserSchema = InferSchemaType<typeof userSchema>;

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    provider: { type: String, required: true, default: EMAIL_PROVIDER.EMAIL },
    password: { type: String },
    refreshToken: { type: String },
    avatar: { type: String },
    googleID: { type: String },
  },
  { timestamps: true }
);

const User: Model<UserSchema> =
  mongoose.models.User || mongoose.model("User", userSchema);

export type { UserSchema };
export default User;
