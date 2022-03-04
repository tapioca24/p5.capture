import { ImageRecorder } from "@/recorders/image-recorder";
import { RecorderOptions } from "@/recorders/base";

export type JpgRecorderOptions = RecorderOptions & {
  quality?: number;
};

const defaultOptions: JpgRecorderOptions = {
  quality: 0.92,
};

export class JpgRecorder extends ImageRecorder {
  protected margedOptions: JpgRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: JpgRecorderOptions = {}) {
    super(canvas, "jpg", options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  protected get qualityOption() {
    return this.margedOptions.quality;
  }
}
