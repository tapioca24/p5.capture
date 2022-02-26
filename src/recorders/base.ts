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

export type CaptureState = "idle" | "capturing" | "encoding";

export abstract class Recorder<
  RecorderOptions extends Record<string, any> = {}
> extends (EventEmitter as unknown as { new (): RecorderEmitter }) {
  protected state: CaptureState = "idle";
  protected count = 0;

  constructor(
    protected canvas: HTMLCanvasElement,
    protected options?: RecorderOptions
  ) {
    super();
  }

  get capturedCount() {
    return this.count;
  }

  get captureState() {
    return this.state;
  }

  protected get canStart() {
    return this.captureState === "idle";
  }

  protected get canStop() {
    return this.captureState === "capturing";
  }

  protected checkStartable() {
    if (!this.canStart) {
      throw new Error("capturing is already started");
    }
  }

  protected checkStoppable() {
    if (!this.canStop) {
      throw new Error("capturing is already started");
    }
  }

  protected reset() {
    this.count = 0;
  }

  abstract start(): void;
  abstract stop(): void;

  postDraw() {
    if (this.state === "capturing") {
      this.count++;
      this.emit("added");
    }
  }
}
