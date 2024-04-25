const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: true,
    partitioned: true,
    priority: "high",
};
export { cookieOptions };
