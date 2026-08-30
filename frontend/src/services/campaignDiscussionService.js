import { apiRequest } from "./apiClient.js";

export async function listCampaignDiscussions({
  token,
  page = 1,
  pageSize = 100,
  callAttemptId = "",
  campaignParticipationId = "",
  discussionStatus = "",
} = {}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (callAttemptId) {
    params.set("callAttemptId", callAttemptId);
  }

  if (campaignParticipationId) {
    params.set("campaignParticipationId", campaignParticipationId);
  }

  if (discussionStatus) {
    params.set("discussionStatus", discussionStatus);
  }

  return apiRequest(`/campaign-discussions?${params.toString()}`, {
    token,
  });
}
