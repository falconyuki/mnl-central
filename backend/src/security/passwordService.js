import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

function validatePasswordInput(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string.");
  }
}

export async function hashPassword(password) {
  validatePasswordInput(password);
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, passwordHash) {
  validatePasswordInput(password);

  if (typeof passwordHash !== "string" || passwordHash.length === 0) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}
