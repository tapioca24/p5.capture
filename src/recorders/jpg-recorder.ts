import { ImageRecorder } from "@/recorders/image-recorder";

export type JpgRecorderOptions = {
  quality?: number;
};

const defaultOptions: Required<JpgRecorderOptions> = {
  quality: 0.92,
};

export class JpgRecorder extends ImageRecorder<JpgRecorderOptions> {
  protected margedOptions: Required<JpgRecorderOptions>;

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
