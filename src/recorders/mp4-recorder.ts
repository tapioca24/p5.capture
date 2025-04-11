import { createH264MP4Encoder, H264MP4Encoder } from "h264-mp4-encoder";
import { Recorder, RecorderOptions } from "@/recorders/base";
import { omitUndefinedProperty } from "@/utils";

type Mp4RecorderOriginalOptions = {
  framerate?: number;
  bitrate?: number;
};

export type Mp4RecorderOptions = RecorderOptions & Mp4RecorderOriginalOptions;

type Mp4RecorderDefaultOptions = {};

const defaultOptions: Mp4RecorderDefaultOptions = {};

export class Mp4Recorder extends Recorder {
  protected encoder: H264MP4Encoder | null = null;
  private mergedMp4Options: Mp4RecorderOriginalOptions &
    Mp4RecorderDefaultOptions;

  constructor(canvas: HTMLCanvasElement, options: Mp4RecorderOptions = {}) {
    super(canvas, options);
    this.mergedMp4Options = {
      ...defaultOptions,
      ...omitUndefinedProperty(options),
    };
  }

  async initialize() {
    const encoder = await createH264MP4Encoder();
    encoder.width = this.canvas.width;
    encoder.height = this.canvas.height;
    encoder.outputFilename = "video.mp4";

    const { framerate, bitrate } = this.mergedMp4Options;
    if (framerate != null) {
      encoder.frameRate = framerate;
      encoder.groupOfPictures = Math.floor(framerate / 2);
    }
    if (bitrate != null) {
      encoder.kbps = bitrate;
    }

    encoder.initialize();
    this.encoder = encoder;
  }

  async start() {
    this.checkStartable();
    this.state = "capturing";
    this.reset();
    this.emit("start");
  }

  async stop() {
    this.checkStoppable();
    this.state = "encoding";
    this.emit("stop");
  }

  async postDraw() {
    try {
      switch (this.captureState) {
        case "capturing":
          if (!this.encoder) {
            throw new Error("encoder is not found");
          }
          this.copyCanvas();
          const imageData = this.getImageData();
          this.encoder.addFrameRgba(imageData);
          this.increment();
          break;
        case "encoding":
          this.state = "idle";
          if (!this.encoder) {
            throw new Error("encoder is not found");
          }
          this.encoder.finalize();
          const uint8Array = this.encoder.FS.readFile(
            this.encoder.outputFilename,
          );
          const blob = new Blob([uint8Array], { type: "video/mp4" });
          const filename = `${this.getBaseFilename(new Date())}.mp4`;
          this.emit("finished", blob, filename);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.emit("error", error);
      }
    }
  }

  protected getImageData() {
    const { width, height } = this.canvas;

    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, width, height);
      return imageData.data;
    }

    const gl =
      this.canvas.getContext("webgl2") ?? this.canvas.getContext("webgl");
    if (gl) {
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      return pixels;
    }

    throw new Error("unsupported context");
  }
}
