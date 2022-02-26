import { ImageRecorder } from "@/recorders/image-recorder";

export type WebpRecorderOptions = {
  quality?: number;
};

const defaultOptions: Required<WebpRecorderOptions> = {
  quality: 0.8,
};

export class WebpRecorder extends ImageRecorder<WebpRecorderOptions> {
  protected margedOptions: Required<WebpRecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: WebpRecorderOptions = {}) {
    super(canvas, "webp", options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  protected get qualityOption() {
    return this.margedOptions.quality;
  }
}
