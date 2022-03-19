export type P5CaptureState = "idle" | "capturing" | "encoding";
export type P5CaptureFormat = "webm" | "gif" | "mp4" | "png" | "jpg" | "webp";

export type P5CaptureOptions = {
  format?: P5CaptureFormat;
  framerate?: number;
  bitrate?: number;
  quality?: number;
  width?: number;
  height?: number;
  duration?: number | null;
  verbose?: boolean;
};

export type P5CaptureGlobalOptions = P5CaptureOptions & {
  disableUi?: boolean;
  disableScaling?: boolean;
};

declare global {
  function startCapturing(options?: P5CaptureOptions): void;
  function stopCapturing(): void;
  function captureState(): P5CaptureState;
  class P5Capture {
    static setDefaultOptions(options: P5CaptureGlobalOptions): void;
  }
}
