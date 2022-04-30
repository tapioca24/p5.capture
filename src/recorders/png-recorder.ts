import {
  ImageRecorder,
  ImageRecorderOptions,
} from "@/recorders/image-recorder";

export type PngRecorderOptions = ImageRecorderOptions & {};

const defaultOptions: PngRecorderOptions = {};

export class PngRecorder extends ImageRecorder {
  protected mergedOptions: PngRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: PngRecorderOptions = {}) {
    super(canvas, "png", options);
    this.mergedOptions = {
      ...defaultOptions,
      ...options,
    };
  }
}
