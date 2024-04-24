// Types
import type { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "strict",
  secure: true,
  domain: "https://e-commerce-server-1-r3of.onrender.com",
};

export { cookieOptions };
