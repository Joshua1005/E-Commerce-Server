// Types
import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "strict",
  secure: true,
};

export { cookieOptions };
