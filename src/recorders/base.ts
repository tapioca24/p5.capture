import { omitUndefinedProperty } from "@/utils";
import { EventEmitter } from "events";
import { StrictEventEmitter } from "strict-event-emitter-types";

export type RecorderOptions = {
  width?: number;
  height?: number;
  baseFilename?: (date: Date) => string;
};

export type RecorderDefaultOptions = Required<
  Pick<RecorderOptions, "baseFilename">
>;

export const defaultOptions: RecorderDefaultOptions = {
  baseFilename(date) {
    const zeroPadding = (n: number) => n.toString().padStart(2, "0");
    const years = date.getFullYear();
    const months = zeroPadding(date.getMonth() + 1);
    const days = zeroPadding(date.getDate());
    const hours = zeroPadding(date.getHours());
    const minutes = zeroPadding(date.getMinutes());
    const seconds = zeroPadding(date.getSeconds());
    return `${years}${months}${days}-${hours}${minutes}${seconds}`;
  },
};

type RecorderEmitter = StrictEventEmitter<
  EventEmitter,
  {
    start: void;
    stop: void;
    added: void;
    progress: (progress: number) => void;
    finished: (blob: Blob, filename: string) => void;
    segmented: (blob: Blob, filename: string) => void;
    error: (error: Error) => void;
  }
>;

export type CaptureState = "idle" | "capturing" | "encoding";

export abstract class Recorder extends (EventEmitter as unknown as {
  new (): RecorderEmitter;
}) {
  protected state: CaptureState = "idle";
  protected count = 0;
  protected canvas: HTMLCanvasElement;
  private mergedOptions: RecorderOptions & RecorderDefaultOptions;
  private originalCanvas: HTMLCanvasElement | null = null;
  private shouldResize: boolean = false;

  constructor(canvas: HTMLCanvasElement, options: RecorderOptions = {}) {
    super();

    this.mergedOptions = {
      ...defaultOptions,
      ...omitUndefinedProperty(options),
    };

    this.shouldResize = !!(options.width || options.height);
    if (!this.shouldResize) {
      this.canvas = canvas;
      return;
    }
    this.originalCanvas = canvas;
    const { width, height } = this.calcResizeSize(canvas, options);
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
  }

  get capturedCount() {
    return this.count;
  }

  get captureState() {
    return this.state;
  }

  abstract start(): void;
  abstract stop(): void;
  abstract postDraw(): void;

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

  protected getBaseFilename(date: Date) {
    return this.mergedOptions.baseFilename(date);
  }

  protected copyCanvas() {
    if (this.state !== "capturing") return;
    if (!this.shouldResize) return;

    if (!this.originalCanvas) {
      throw new Error("original canvas is not found");
    }

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("canvas context is not found");
    }
    ctx.drawImage(
      this.originalCanvas,
      0,
      0,
      this.originalCanvas.width,
      this.originalCanvas.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
  }

  protected increment() {
    if (this.state !== "capturing") return;

    this.count++;
    this.emit("added");
  }

  private calcResizeSize(
    original: HTMLCanvasElement,
    options: RecorderOptions,
  ) {
    const { width, height } = options;
    const { width: originalWidth, height: originalHeight } = original;

    if (width && height) {
      return { width, height };
    }

    if (width) {
      return {
        width,
        height: Math.floor(originalHeight * (width / originalWidth)),
      };
    }

    if (height) {
      return {
        width: Math.floor(originalWidth * (height / originalHeight)),
        height,
      };
    }

    return {
      width: originalWidth,
      height: originalHeight,
    };
  }
}
