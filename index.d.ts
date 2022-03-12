export type P5CaptureState = "idle" | "capturing" | "encoding";

export type P5CaptureOptions = {
  format?: "webm" | "gif" | "mp4" | "png" | "jpg" | "webp";
  framerate?: number;
  bitrate?: number;
  quality?: number;
  width?: number;
  height?: number;
  duration?: number | null;
  verbose?: boolean;
};

declare global {
  function startCapturing(options?: P5CaptureOptions): void;
  function stopCapturing(): void;
  function captureState(): P5CaptureState;
}
