declare module "webm-writer" {
  export type WebMWriterOptions = {
    quality?: number;
    fileWriter?: any;
    fd?: any;
    frameDuration?: number | null;
    frameRate?: number | null;
    transparent?: boolean;
    alphaQuality?: number;
  };

  export default class WebMWriter {
    constructor(options?: WebMWriterOptions);
    addFrame(
      frame: HTMLCanvasElement | string,
      alpha?: HTMLCanvasElement | string,
      overrideFrameDuration?: number,
    ): void;
    addFrame(
      frame: HTMLCanvasElement | string,
      overrideFrameDuration?: number,
    ): void;
    complete(): Promise<Blob | null>;
  }
}
