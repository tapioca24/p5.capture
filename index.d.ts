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
  autoSaveDuration?: number | null;
  verbose?: boolean;
};

export type P5CaptureGlobalOptions = P5CaptureOptions & {
  disableUi?: boolean;
  disableScaling?: boolean;
};

declare global {
  class P5Capture {
    static setDefaultOptions(options: P5CaptureGlobalOptions): void;
    static getInstance(): P5Capture;
    get state(): P5CaptureState;
    start(options?: P5CaptureOptions): Promise<void>;
    stop(): Promise<void>;
  }
}
