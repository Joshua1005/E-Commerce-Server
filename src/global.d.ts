import type { Model } from "mongoose";
import type { UserSchema } from "./models/user.ts";

declare global {
  namespace Express {
    interface User extends InstanceType<Model<UserSchema>> {}
  }
}
