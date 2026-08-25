import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

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
