import loadMP4Module, {
  MP4Encoder,
  MP4EncoderOptions,
} from "https://unpkg.com/mp4-wasm@1.0.6";
import { Recorder, RecorderOptions } from "@/recorders/base";
import { getFilename } from "@/utils";

export type Mp4RecorderOptions = RecorderOptions & {
  mp4EncoderOptions?: Partial<MP4EncoderOptions>;
};

const defaultOptions: Mp4RecorderOptions = {
  mp4EncoderOptions: {
    fps: 30,
    bitrate: 1024 * 1024 * 2.5, // 2.5Mbps
  },
};

export class Mp4Recorder extends Recorder {
  protected encoder: MP4Encoder | null = null;
  protected margedOptions: Mp4RecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: Mp4RecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
      mp4EncoderOptions: {
        ...defaultOptions.mp4EncoderOptions,
        ...options.mp4EncoderOptions,
      },
    };
  }

  async initialize() {
    const MP4 = await loadMP4Module();
    this.encoder = MP4.createWebCodecsEncoder({
      width: this.canvas.width,
      height: this.canvas.height,
      ...this.margedOptions.mp4EncoderOptions,
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
          this.copyCanvas();
          const bitmap = await createImageBitmap(this.canvas);
          await this.encoder?.addFrame(bitmap);
          this.increment();
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
