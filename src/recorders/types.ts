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
  abstract start(): void;
  abstract stop(): void;
  abstract postDraw(): void;
}
