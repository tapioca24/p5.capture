import { ImageRecorder } from "@/recorders/image-recorder";
import { RecorderOptions } from "@/recorders/base";

export type PngRecorderOptions = RecorderOptions & {};

const defaultOptions: PngRecorderOptions = {};

export class PngRecorder extends ImageRecorder {
  protected margedOptions: PngRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: PngRecorderOptions = {}) {
    super(canvas, "png", options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };
  }
}
