import loadMP4Module, { MP4Encoder, MP4EncoderOptions } from "mp4-wasm";
import { Recorder } from "@/recorders/base";
import { getFilename } from "@/utils";

export type Mp4RecorderOptions = {
  mp4EncoderOptions?: Partial<MP4EncoderOptions>;
};

const defaultOptions: Required<Mp4RecorderOptions> = {
  mp4EncoderOptions: {
    fps: 30,
  },
};

export class Mp4Recorder extends Recorder<Mp4RecorderOptions> {
  protected encoder: MP4Encoder | null = null;
  protected margedOptions: Required<Mp4RecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: Mp4RecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  async initialize() {
    const MP4 = await loadMP4Module();
    this.encoder = MP4.createWebCodecsEncoder({
      width: this.canvas.width,
      height: this.canvas.height,
      encoderOptions: {
        framerate: 30,
      },
      fps: 30,
    });
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
          const bitmap = await createImageBitmap(this.canvas);
          await this.encoder?.addFrame(bitmap);
          super.postDraw();
          break;
        case "encoding":
          this.state = "idle";
          const buf = await this.encoder?.end();
          this.reset();
          if (buf) {
            const blob = new Blob([buf], { type: "video/mp4" });
            const filename = getFilename(new Date(), "mp4");
            this.emit("finished", blob, filename);
          }
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.emit("error", error);
      }
    }
  }
}