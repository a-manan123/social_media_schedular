export const POST_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  FAILED: "failed",
};

export const PLATFORMS = {
  TWITTER: "Twitter",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};

export const PLATFORM_OPTIONS = [
  { value: "Twitter", label: "Twitter" },
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
];

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: POST_STATUS.DRAFT, label: "Draft" },
  { value: POST_STATUS.SCHEDULED, label: "Scheduled" },
  { value: POST_STATUS.PUBLISHED, label: "Published" },
  { value: POST_STATUS.FAILED, label: "Failed" },
];

export const STATUS_COLORS = {
  [POST_STATUS.DRAFT]: "bg-gray-500",
  [POST_STATUS.SCHEDULED]: "bg-blue-500",
  [POST_STATUS.PUBLISHED]: "bg-green-500",
  [POST_STATUS.FAILED]: "bg-red-500",
};

export const PLATFORM_COLORS = {
  Twitter: "bg-blue-400",
  Facebook: "bg-blue-600",
  Instagram: "bg-pink-500",
};
