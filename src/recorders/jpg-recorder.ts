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

  protected async makeBlob() {
    return new Promise<Blob>((resolve, reject) => {
      const mimeType = this.makeMimeType(this.format);
      this.canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("failed to make blob"));
            return;
          }
          resolve(blob);
        },
        mimeType,
        this.margedOptions.quality
      );
    });
  }
}
