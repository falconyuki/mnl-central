import { randomUUID } from "node:crypto";
import { hashPassword } from "../security/passwordService.js";
import {
  findUserByUsername,
  findUserForManagementById,
  listUsers as listUsersRepository,
  createUser as createUserRepository,
} from "../repositories/userRepository.js";

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
} = {}) {
  const normalizedSearch = normalizeNullableString(search);

  return listUsersRepository({
    page,
    pageSize,
    search: normalizedSearch,
    status,
    roleId,
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
