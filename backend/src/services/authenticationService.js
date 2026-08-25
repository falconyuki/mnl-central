import {
  findUserByUsername,
  findUserById,
  updateLastLogin,
  updatePassword,
} from "../repositories/userRepository.js";
import { verifyPassword, hashPassword } from "../security/passwordService.js";
import { signAccessToken } from "../security/jwtService.js";

export async function authenticate(username, password) {
  const user = await findUserByUsername(username);
  if (!user) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  if (user.status !== "Active") {
    return {
      success: false,
      reason: "ACCOUNT_DISABLED",
    };
  }

  const passwordValid = await verifyPassword(password, user.password_hash);
  if (!passwordValid) {
    return {
      success: false,
      reason: "INVALID_CREDENTIALS",
    };
  }

  const lastLoginAt = new Date().toISOString();
  await updateLastLogin(user.id, lastLoginAt);

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
    roleId: user.role_id,
  });

  return {
    success: true,
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      roleId: user.role_id,
      roleName: user.role_name,
      status: user.status,
      mustChangePassword: Boolean(user.must_change_password),
      lastLoginAt,
    },
  };
}

export async function getAuthenticatedUser(userId) {
  const user = await findUserById(userId);
  if (!user) {
    return null;
  }

  if (user.status !== "Active") {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    roleId: user.role_id,
    roleName: user.role_name,
    status: user.status,
    mustChangePassword: Boolean(user.must_change_password),
    lastLoginAt: user.last_login_at,
  };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await findUserById(userId);
  if (!user) {
    return {
      success: false,
      reason: "USER_NOT_FOUND",
    };
  }

  if (user.status !== "Active") {
    return {
      success: false,
      reason: "ACCOUNT_DISABLED",
    };
  }

  const currentPasswordValid = await verifyPassword(
    currentPassword,
    user.password_hash,
  );
  if (!currentPasswordValid) {
    return {
      success: false,
      reason: "INVALID_CURRENT_PASSWORD",
    };
  }

  const samePassword = await verifyPassword(newPassword, user.password_hash);
  if (samePassword) {
    return {
      success: false,
      reason: "PASSWORD_UNCHANGED",
    };
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updatePassword(userId, newPasswordHash, false);

  return {
    success: true,
  };
}
