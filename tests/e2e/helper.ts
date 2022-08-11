export const VIDEO_FORMATS = ["webm", "gif", "mp4"] as const;
export const IMAGE_FORMATS = ["png", "jpg", "webp"] as const;
export const ALL_FORMATS = [...VIDEO_FORMATS, ...IMAGE_FORMATS] as const;
