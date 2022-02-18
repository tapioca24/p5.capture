export type CaptureState = "idle" | "capturing" | "captured";

export abstract class Recorder<
  RecorderOptions extends Record<string, any> = {}
> {
  constructor(
    protected canvas: HTMLCanvasElement,
    protected options?: RecorderOptions
  ) {}
  abstract get capturedCount(): number;
  abstract get captureState(): CaptureState;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract postDraw(): void;
}
