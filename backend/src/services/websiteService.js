import { randomUUID } from "node:crypto";
import {
  findWebsiteById,
  findWebsiteByCode,
  listWebsites as listWebsitesRepository,
  createWebsite as createWebsiteRepository,
  updateWebsite as updateWebsiteRepository,
  updateWebsiteStatus,
} from "../repositories/websiteRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const WEBSITE_STATUS = {
  ACTIVE: "Active",
  DISABLED: "Disabled",
};

function normalizeRequiredString(value) {
  return value.trim();
}

function normalizeNullableString(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

export async function getWebsiteById(id) {
  return findWebsiteById(id);
}

export async function getWebsiteByCode(code) {
  const normalizedCode = normalizeRequiredString(code);
  return findWebsiteByCode(normalizedCode);
}

export async function listWebsites({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  websiteIds = null,
} = {}) {
  const normalizedSearch =
    search === null || search === undefined
      ? null
      : normalizeRequiredString(search);

  return listWebsitesRepository({
    page,
    pageSize,
    search: normalizedSearch || null,
    status,
    websiteIds,
  });
}

export async function createWebsite({
  name,
  code,
  description = null,
  status = WEBSITE_STATUS.ACTIVE,
}) {
  const normalizedName = normalizeRequiredString(name);
  const normalizedCode = normalizeRequiredString(code);
  const normalizedDescription = normalizeNullableString(description);

  const existingWebsite = await findWebsiteByCode(normalizedCode);
  if (existingWebsite) {
    throw new AppError("Website code already exists.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "Website",
        field: "code",
        value: normalizedCode,
      },
    });
  }

  const id = randomUUID();
  await createWebsiteRepository({
    id,
    name: normalizedName,
    code: normalizedCode,
    description: normalizedDescription,
    status,
  });

  return findWebsiteById(id);
}

export async function updateWebsite(id, { name, code, description = null }) {
  const existingWebsite = await findWebsiteById(id);
  if (!existingWebsite) {
    throw new AppError("Website not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Website",
        id,
      },
    });
  }

  const normalizedName = normalizeRequiredString(name);
  const normalizedCode = normalizeRequiredString(code);
  const normalizedDescription = normalizeNullableString(description);

  if (normalizedCode !== existingWebsite.code) {
    const websiteWithCode = await findWebsiteByCode(normalizedCode);
    if (websiteWithCode && websiteWithCode.id !== existingWebsite.id) {
      throw new AppError("Website code already exists.", {
        code: ERROR_CODES.CONFLICT,
        statusCode: 409,
        details: {
          resource: "Website",
          field: "code",
          value: normalizedCode,
        },
      });
    }
  }

  await updateWebsiteRepository({
    id,
    name: normalizedName,
    code: normalizedCode,
    description: normalizedDescription,
  });

  return findWebsiteById(id);
}

export async function disableWebsite(id) {
  const existingWebsite = await findWebsiteById(id);
  if (!existingWebsite) {
    throw new AppError("Website not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Website",
        id,
      },
    });
  }

  if (existingWebsite.status === WEBSITE_STATUS.DISABLED) {
    return existingWebsite;
  }

  await updateWebsiteStatus(id, WEBSITE_STATUS.DISABLED);
  return findWebsiteById(id);
}
