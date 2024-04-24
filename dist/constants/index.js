/**
 * Enum representing email provider types.
 * @readonly
 * @enum {string}
 */
const EMAIL_PROVIDER = {
    /**
     * Regular email provider.
     * This email required to have a password.
     */
    EMAIL: "email",
    /**
     * Google email provider.
     * Unlike email provider, this one do not need a password, and only needed to be signed up using oauth.
     */
    GOOGLE: "google",
};
export { EMAIL_PROVIDER };
