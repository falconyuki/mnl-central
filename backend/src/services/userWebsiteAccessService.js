import { randomUUID } from "node:crypto";

import {
  listUserWebsiteAccess as listUserWebsiteAccessRepository,
  createUserWebsiteAccess as createUserWebsiteAccessRepository,
  deleteUserWebsiteAccess as deleteUserWebsiteAccessRepository,
} from "../repositories/userWebsiteAccessRepository.js";

import { findUserForManagementById } from "../repositories/userRepository.js";
import { findWebsiteById } from "../repositories/websiteRepository.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

function normalizeRequiredString(value) {
  return value.trim();
}

export async function listUserWebsiteAccess(userId) {
  const normalizedUserId = normalizeRequiredString(userId);

  const user = await findUserForManagementById(normalizedUserId);

  if (!user) {
    throw new AppError("User not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "User",
        id: normalizedUserId,
      },
    });
  }

  return listUserWebsiteAccessRepository(normalizedUserId);
}

export async function grantUserWebsiteAccess({ userId, websiteId }) {
  const normalizedUserId = normalizeRequiredString(userId);
  const normalizedWebsiteId = normalizeRequiredString(websiteId);

  const user = await findUserForManagementById(normalizedUserId);

  if (!user) {
    throw new AppError("User not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "User",
        id: normalizedUserId,
      },
    });
  }

  const website = await findWebsiteById(normalizedWebsiteId);

  if (!website) {
    throw new AppError("Website not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Website",
        id: normalizedWebsiteId,
      },
    });
  }

  if (website.status !== "Active") {
    throw new AppError("Website is disabled.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "Website",
        id: normalizedWebsiteId,
        status: website.status,
      },
    });
  }

  const existingAccess =
    await listUserWebsiteAccessRepository(normalizedUserId);

  if (
    existingAccess.some((access) => access.websiteId === normalizedWebsiteId)
  ) {
    throw new AppError("User already has access to this website.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "UserWebsiteAccess",
        userId: normalizedUserId,
        websiteId: normalizedWebsiteId,
      },
    });
  }

  await createUserWebsiteAccessRepository({
    id: randomUUID(),
    userId: normalizedUserId,
    websiteId: normalizedWebsiteId,
    createdAt: new Date().toISOString(),
  });

  return listUserWebsiteAccessRepository(normalizedUserId);
}

export async function revokeUserWebsiteAccess({ userId, websiteId }) {
  const normalizedUserId = normalizeRequiredString(userId);
  const normalizedWebsiteId = normalizeRequiredString(websiteId);

  const user = await findUserForManagementById(normalizedUserId);

  if (!user) {
    throw new AppError("User not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "User",
        id: normalizedUserId,
      },
    });
  }

  const website = await findWebsiteById(normalizedWebsiteId);

  if (!website) {
    throw new AppError("Website not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Website",
        id: normalizedWebsiteId,
      },
    });
  }

  const changes = await deleteUserWebsiteAccessRepository({
    userId: normalizedUserId,
    websiteId: normalizedWebsiteId,
  });

  if (changes === 0) {
    throw new AppError("User does not have access to this website.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "UserWebsiteAccess",
        userId: normalizedUserId,
        websiteId: normalizedWebsiteId,
      },
    });
  }

  return listUserWebsiteAccessRepository(normalizedUserId);
}
