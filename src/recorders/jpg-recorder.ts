import {
  ImageRecorder,
  ImageRecorderOptions,
} from "@/recorders/image-recorder";

export type JpgRecorderOptions = ImageRecorderOptions & {
  quality?: number;
};

const defaultOptions: JpgRecorderOptions = {
  quality: 0.92,
};

export class JpgRecorder extends ImageRecorder {
  protected mergedOptions: JpgRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: JpgRecorderOptions = {}) {
    super(canvas, "jpg", options);
    this.mergedOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  protected get qualityOption() {
    return this.mergedOptions.quality;
  }
}
