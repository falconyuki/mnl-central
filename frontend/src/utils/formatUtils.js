export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getStatusBadgeClass(status) {
  if (status === "Active") {
    return "text-bg-success";
  }

  if (status === "Disabled") {
    return "text-bg-secondary";
  }

  return "text-bg-light";
}
