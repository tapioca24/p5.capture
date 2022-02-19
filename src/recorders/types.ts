import { EventEmitter } from "events";
import { StrictEventEmitter } from "strict-event-emitter-types";

type RecorderEmitter = StrictEventEmitter<
  EventEmitter,
  {
    start: void;
    stop: void;
    added: void;
    progress: (parcent: number) => void;
    finished: (blob: Blob, filename: string) => void;
    error: (error: Error) => void;
  }
>;

export type CaptureState = "idle" | "capturing" | "captured";

export abstract class Recorder<
  RecorderOptions extends Record<string, any> = {}
> extends (EventEmitter as unknown as { new (): RecorderEmitter }) {
  constructor(
    protected canvas: HTMLCanvasElement,
    protected options?: RecorderOptions
  ) {
    super();
  }
  abstract get capturedCount(): number;
  abstract get captureState(): CaptureState;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract postDraw(): void;
}
