export const REACTION_TYPES = [
  "thumbs_up",
  "thumbs_down",
  "laugh",
  "hooray",
  "confused",
  "heart",
  "rocket",
  "eyes",
] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_EMOJI_MAP: Record<ReactionType, string> = {
  thumbs_up: "👍",
  thumbs_down: "👎",
  laugh: "😄",
  hooray: "🎉",
  confused: "😕",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};
