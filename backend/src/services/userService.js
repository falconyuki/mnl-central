import { randomUUID } from "node:crypto";
import { hashPassword } from "../security/passwordService.js";
import {
  findUserByUsername,
  findUserForManagementById,
  listUsers as listUsersRepository,
  createUser as createUserRepository,
  updateUser as updateUserRepository,
  updateUserStatus as updateUserStatusRepository,
  updateUserRole as updateUserRoleRepository,
  updateUserPassword as updateUserPasswordRepository,
  countActiveAdministrators,
} from "../repositories/userRepository.js";
import { findRoleById } from "../repositories/roleRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

function normalizeNullableString(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

export async function getUserById(id) {
  return findUserForManagementById(id);
}

export async function listUsers({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  roleId = null,
  currentUserId = null,
} = {}) {
  const normalizedSearch = normalizeNullableString(search);

  return listUsersRepository({
    page,
    pageSize,
    search: normalizedSearch,
    status,
    roleId,
    currentUserId,
  });
}

export async function createUser({ username, displayName, password, roleId }) {
  const normalizedUsername = username.trim();
  const normalizedDisplayName = displayName.trim();

  const existingUser = await findUserByUsername(normalizedUsername);

  if (existingUser) {
    throw new AppError("Username already exists.", ERROR_CODES.CONFLICT);
  }

  const passwordHash = await hashPassword(password);

  const now = new Date().toISOString();
  const id = randomUUID();

  await createUserRepository({
    id,
    username: normalizedUsername,
    displayName: normalizedDisplayName,
    passwordHash,
    roleId,
    status: "Active",
    mustChangePassword: true,
    createdAt: now,
    updatedAt: now,
  });

  return findUserForManagementById(id);
}

export async function updateUser({ id, displayName }) {
  const user = await findUserForManagementById(id);

  if (!user) {
    throw new AppError("User not found.", ERROR_CODES.NOT_FOUND);
  }

  const normalizedDisplayName = displayName.trim();

  const updatedAt = new Date().toISOString();

  await updateUserRepository({
    id,
    displayName: normalizedDisplayName,
    updatedAt,
  });

  return findUserForManagementById(id);
}

export async function updateUserStatus({ id, status, currentUserId }) {
  const user = await findUserForManagementById(id);

  if (!user) {
    throw new AppError("User not found.", ERROR_CODES.NOT_FOUND);
  }

  if (user.status === status) {
    return user;
  }

  if (user.roleName === "Administrator" && status === "Disabled") {
    if (id === currentUserId) {
      throw new AppError(
        "You cannot disable your own Administrator account.",
        ERROR_CODES.BUSINESS_RULE_VIOLATION,
      );
    }

    const activeAdministratorCount = await countActiveAdministrators();

    if (activeAdministratorCount <= 1) {
      throw new AppError(
        "The last active Administrator cannot be disabled.",
        ERROR_CODES.BUSINESS_RULE_VIOLATION,
      );
    }
  }

  const updatedAt = new Date().toISOString();

  await updateUserStatusRepository({ id, status, updatedAt });

  return findUserForManagementById(id);
}

export async function updateUserRole({ id, roleId, currentUserId }) {
  const user = await findUserForManagementById(id);

  if (!user) {
    throw new AppError("User not found.", ERROR_CODES.NOT_FOUND);
  }

  if (user.roleId === roleId) {
    return user;
  }

  const role = await findRoleById(roleId);

  if (!role) {
    throw new AppError("Role not found.", ERROR_CODES.NOT_FOUND);
  }

  if (user.roleName === "Administrator" && role.name !== "Administrator") {
    if (id === currentUserId) {
      throw new AppError(
        "You cannot remove your own Administrator role.",
        ERROR_CODES.BUSINESS_RULE_VIOLATION,
      );
    }

    const activeAdministratorCount = await countActiveAdministrators();

    if (activeAdministratorCount <= 1) {
      throw new AppError(
        "The last active Administrator cannot lose the Administrator role.",
        ERROR_CODES.BUSINESS_RULE_VIOLATION,
      );
    }
  }

  const updatedAt = new Date().toISOString();

  await updateUserRoleRepository({
    id,
    roleId,
    updatedAt,
  });

  return findUserForManagementById(id);
}

export async function resetUserPassword({ id, password }) {
  const user = await findUserForManagementById(id);

  if (!user) {
    throw new AppError("User not found.", ERROR_CODES.NOT_FOUND);
  }

  const passwordHash = await hashPassword(password);
  const updatedAt = new Date().toISOString();

  await updateUserPasswordRepository({
    id,
    passwordHash,
    mustChangePassword: true,
    updatedAt,
  });

  return findUserForManagementById(id);
}
