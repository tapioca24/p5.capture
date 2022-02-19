import { ImageRecorder } from "@/recorders/image-recorder";

export type PngRecorderOptions = {};

const defaultOptions: Required<PngRecorderOptions> = {};

export class PngRecorder extends ImageRecorder<PngRecorderOptions> {
  protected margedOptions: Required<PngRecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: PngRecorderOptions = {}) {
    super(canvas, "png", options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };
  }
}
