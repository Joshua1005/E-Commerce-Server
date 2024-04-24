import dotenv from "dotenv";

dotenv.config();

const keys = {
  server: {
    name: "Mern ECommerce Backend",
    port: process.env.PORT! || "3000",
  },
  stripeKey: {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  client: {
    name: "Mern ECommerce Frontend",
    url: process.env.CLIENT_URL!,
  },
  database: {
    mongoDB: process.env.MONGODB_URI!,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    tokenLife: "7d",
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `https://e-commerce-server-1-r3of.onrender.com/auth/google/callback`,
  },
};

export const { server, stripeKey, client, database, jwt, google } = keys;
