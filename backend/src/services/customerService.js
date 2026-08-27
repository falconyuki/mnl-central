import { randomUUID } from "node:crypto";
import {
  findCustomerById,
  findCustomerByWebsiteAndUsername,
  listCustomers as listCustomersRepository,
  createCustomer as createCustomerRepository,
  updateCustomer as updateCustomerRepository,
  updateCustomerStatus as updateCustomerStatusRepository,
} from "../repositories/customerRepository.js";
import { findWebsiteById } from "../repositories/websiteRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const CUSTOMER_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
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

export async function getCustomerById(id) {
  return findCustomerById(id);
}

export async function getCustomerByWebsiteAndUsername(websiteId, username) {
  const normalizedUsername = normalizeRequiredString(username);
  return findCustomerByWebsiteAndUsername(websiteId, normalizedUsername);
}

export async function listCustomers({
  page = 1,
  pageSize = 20,
  search = null,
  status = null,
  websiteIds = null,
}) {
  const normalizedSearch =
    search === null || search === undefined
      ? null
      : normalizeRequiredString(search);

  return listCustomersRepository({
    page,
    pageSize,
    search: normalizedSearch || null,
    status,
    websiteIds,
  });
}

export async function createCustomer({
  websiteId,
  username,
  name,
  phone,
  status = CUSTOMER_STATUS.ACTIVE,
}) {
  const normalizedWebsiteId = normalizeRequiredString(websiteId);
  const normalizedUsername = normalizeRequiredString(username);
  const normalizedName = normalizeRequiredString(name);
  const normalizedPhone = normalizeRequiredString(phone);

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

  const existingCustomer = await findCustomerByWebsiteAndUsername(
    normalizedWebsiteId,
    normalizedUsername,
  );
  if (existingCustomer) {
    throw new AppError("Customer already exists.", {
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
      details: {
        resource: "Customer",
        field: "username",
        websiteId: normalizedWebsiteId,
        value: normalizedUsername,
      },
    });
  }

  const id = randomUUID();
  await createCustomerRepository({
    id,
    websiteId: normalizedWebsiteId,
    username: normalizedUsername,
    name: normalizedName,
    phone: normalizedPhone,
    status,
  });

  return findCustomerById(id);
}

export async function updateCustomer(id, { name, phone }) {
  const existingCustomer = await findCustomerById(id);
  if (!existingCustomer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id,
      },
    });
  }

  const normalizedName = normalizeRequiredString(name);
  const normalizedPhone = normalizeRequiredString(phone);

  await updateCustomerRepository({
    id,
    name: normalizedName,
    phone: normalizedPhone,
  });

  return findCustomerById(id);
}

export async function updateCustomerStatus(id, status) {
  const existingCustomer = await findCustomerById(id);
  if (!existingCustomer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id,
      },
    });
  }

  if (
    status !== CUSTOMER_STATUS.ACTIVE &&
    status !== CUSTOMER_STATUS.INACTIVE
  ) {
    throw new AppError("Invalid status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        resource: "Customer",
        field: "status",
        value: status,
      },
    });
  }

  if (existingCustomer.status === status) {
    return existingCustomer;
  }

  await updateCustomerStatusRepository(id, status);
  return findCustomerById(id);
}
