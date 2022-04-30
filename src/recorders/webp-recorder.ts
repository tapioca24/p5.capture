import {
  ImageRecorder,
  ImageRecorderOptions,
} from "@/recorders/image-recorder";

export type WebpRecorderOptions = ImageRecorderOptions & {
  quality?: number;
};

const defaultOptions: WebpRecorderOptions = {
  quality: 0.8,
};

export class WebpRecorder extends ImageRecorder {
  protected mergedOptions: WebpRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: WebpRecorderOptions = {}) {
    super(canvas, "webp", options);
    this.mergedOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  protected get qualityOption() {
    return this.mergedOptions.quality;
  }
}
