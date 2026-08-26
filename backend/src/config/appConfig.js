import { validateEnvironment } from "./env.js";

validateEnvironment();

const appConfig = {
  app: {
    name: process.env.APP_NAME || "MNL Central",
    environment: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN || null,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
  },
};

export default appConfig;
