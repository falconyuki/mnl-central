import { apiRequest } from "./apiClient.js";

export function listPromotionReceipts({
  token,
  page,
  pageSize,
  status,
  promotionId,
  campaignParticipationId,
  staffUserId,
} = {}) {
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.set("page", String(page));
  }

  if (pageSize !== undefined) {
    params.set("pageSize", String(pageSize));
  }

  if (status !== undefined && status !== "") {
    params.set("status", status);
  }

  if (promotionId !== undefined && promotionId !== "") {
    params.set("promotionId", promotionId);
  }

  if (campaignParticipationId !== undefined && campaignParticipationId !== "") {
    params.set("campaignParticipationId", campaignParticipationId);
  }

  if (staffUserId !== undefined && staffUserId !== "") {
    params.set("staffUserId", staffUserId);
  }

  const queryString = params.toString();

  return apiRequest(
    `/promotion-receipts${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      token,
    },
  );
}

export function createPromotionReceipt({
  token,
  promotionId,
  campaignParticipationId,
  remarks,
} = {}) {
  return apiRequest("/promotion-receipts", {
    method: "POST",
    token,
    body: {
      promotionId,
      campaignParticipationId,
      remarks: remarks || null,
    },
  });
}
