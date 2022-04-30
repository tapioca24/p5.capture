import WebMWriter, { WebMWriterOptions } from "webm-writer";
import { Recorder, RecorderOptions } from "@/recorders/base";
import { getFilename } from "@/utils";

export type WebmRecorderOptions = RecorderOptions & {
  webmWriterOptions?: WebMWriterOptions;
};

const defaultOptions: WebmRecorderOptions = {
  webmWriterOptions: {
    frameRate: 30,
    quality: 0.95,
  },
};

export class WebmRecorder extends Recorder {
  protected webmWriter: WebMWriter;
  protected mergedOptions: WebmRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: WebmRecorderOptions = {}) {
    super(canvas, options);
    this.mergedOptions = {
      ...defaultOptions,
      ...options,
      webmWriterOptions: {
        ...defaultOptions.webmWriterOptions,
        ...options.webmWriterOptions,
      },
    };

    this.webmWriter = new WebMWriter(this.mergedOptions.webmWriterOptions);
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
          this.copyCanvas();
          this.webmWriter.addFrame(this.canvas);
          this.increment();
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
