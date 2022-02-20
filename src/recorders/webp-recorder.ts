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
