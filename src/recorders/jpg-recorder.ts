import { ImageRecorder } from "@/recorders/image-recorder";
import { RecorderOptions } from "@/recorders/base";

export type JpgRecorderOptions = RecorderOptions & {
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
