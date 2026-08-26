import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";

const {
  secret: JWT_SECRET,
  accessTokenExpiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
} = appConfig.jwt;

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    issuer: "MNL Central",
    audience: "MNL Central API",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: "MNL Central",
    audience: "MNL Central API",
  });
}
