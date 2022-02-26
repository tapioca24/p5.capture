import WebMWriter, { WebMWriterOptions } from "webm-writer";
import { Recorder } from "@/recorders/base";
import { getFilename } from "@/utils";

export type WebmRecorderOptions = {
  webmWriterOptions?: WebMWriterOptions;
};

const defaultOptions: Required<WebmRecorderOptions> = {
  webmWriterOptions: {
    frameRate: 60,
  },
};

export class WebmRecorder extends Recorder<WebmRecorderOptions> {
  protected webmWriter: WebMWriter;
  protected margedOptions: Required<WebmRecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: WebmRecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      webmWriterOptions: {
        ...defaultOptions.webmWriterOptions,
        ...options.webmWriterOptions,
      },
    };

    this.webmWriter = new WebMWriter(this.margedOptions.webmWriterOptions);
  }

  start() {
    this.checkStartable();
    this.state = "capturing";
    this.reset();
    this.emit("start");
  }

  stop() {
    this.checkStoppable();
    this.state = "encoding";
    this.emit("stop");
  }

  async postDraw() {
    try {
      switch (this.captureState) {
        case "capturing":
          this.webmWriter.addFrame(this.canvas);
          super.postDraw();
          break;
        case "encoding":
          this.state = "idle";
          const blob = await this.webmWriter.complete();
          this.reset();
          if (blob) {
            const filename = getFilename(new Date(), "webm");
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
