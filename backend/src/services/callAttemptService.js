import { randomUUID } from "node:crypto";
import {
  findCallAttemptById,
  listCallAttempts as listCallAttemptsRepository,
  createCallAttempt as createCallAttemptRepository,
} from "../repositories/callAttemptRepository.js";
import { findCustomerById } from "../repositories/customerRepository.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const CALL_STATUSES = new Set([
  "NO_ANSWER",
  "ANSWERED",
  "DROP_CALL",
  "INTERESTED",
  "NOT_INTERESTED",
  "CALL_BACK",
  "WRONG_NUMBER",
  "INVALID_NUMBER",
]);

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

export async function getCallAttemptById(id) {
  return findCallAttemptById(id);
}

export async function listCallAttempts({
  page = 1,
  pageSize = 20,
  callStatus = null,
  customerId = null,
  userId = null,
  websiteIds = null,
}) {
  const normalizedCustomerId =
    customerId === null || customerId === undefined
      ? null
      : normalizeRequiredString(customerId);

  const normalizedUserId =
    userId === null || userId === undefined
      ? null
      : normalizeRequiredString(userId);

  return listCallAttemptsRepository({
    page,
    pageSize,
    callStatus,
    customerId: normalizedCustomerId || null,
    userId: normalizedUserId || null,
    websiteIds,
  });
}

export async function createCallAttempt({
  customerId,
  userId,
  callStatus,
  remarks = null,
}) {
  const normalizedCustomerId = normalizeRequiredString(customerId);
  const normalizedUserId = normalizeRequiredString(userId);
  const normalizedRemarks = normalizeNullableString(remarks);

  if (!CALL_STATUSES.has(callStatus)) {
    throw new AppError("Invalid call status.", {
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      details: {
        field: "callStatus",
        allowedValues: [...CALL_STATUSES],
      },
    });
  }

  const customer = await findCustomerById(normalizedCustomerId);

  if (!customer) {
    throw new AppError("Customer not found.", {
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
      details: {
        resource: "Customer",
        id: normalizedCustomerId,
      },
    });
  }

  const id = randomUUID();
  const calledAt = new Date().toISOString();

  await createCallAttemptRepository({
    id,
    customerId: normalizedCustomerId,
    userId: normalizedUserId,
    calledAt,
    callStatus,
    remarks: normalizedRemarks,
  });

  return findCallAttemptById(id);
}
