import jwt from "jsonwebtoken";

const revokedTokens = new Map();

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, expiresAt] of revokedTokens.entries()) {
    if (expiresAt <= now) {
      revokedTokens.delete(token);
    }
  }
}

export function revokeToken(token) {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded.exp !== "number") {
    return;
  }

  cleanupExpiredTokens();

  revokedTokens.set(token, decoded.exp * 1000);
}

export function isTokenRevoked(token) {
  cleanupExpiredTokens();
  return revokedTokens.has(token);
}

export function clearRevokedTokens() {
  revokedTokens.clear();
}
