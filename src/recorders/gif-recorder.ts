import GIF from "gif.js";
import { Recorder } from "@/recorders/base";
import { getFilename, getWorkerUrl } from "@/utils";

const GIF_WORKER_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js";

export type GifRecorderOptions = {
  frameRate?: number;
  gifOptions?: GIF.Options;
};

const defaultOptions: Required<GifRecorderOptions> = {
  frameRate: 60,
  gifOptions: {
    workerScript: getWorkerUrl(GIF_WORKER_SCRIPT_URL),
    workers: 4,
  },
};

export class GifRecorder extends Recorder<GifRecorderOptions> {
  protected recorder: GIF;
  protected margedOptions: Required<GifRecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: GifRecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      frameRate: options.frameRate ?? defaultOptions.frameRate,
      gifOptions: {
        ...defaultOptions.gifOptions,
        ...options.gifOptions,
      },
    };

    const recorder = new GIF(this.margedOptions.gifOptions);
    recorder.on("finished", this.onFinished.bind(this));
    recorder.on("progress", this.onProgress.bind(this));
    this.recorder = recorder;
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
    this.recorder.render();
  }

  postDraw() {
    if (this.captureState === "capturing") {
      this.recorder.addFrame(this.canvas, {
        delay: 1000 / this.margedOptions.frameRate,
        copy: true,
      });
    }
    super.postDraw();
  }

  protected onFinished(blob: Blob) {
    this.state = "idle";
    this.reset();
    const filename = getFilename(new Date(), "gif");
    this.emit("finished", blob, filename);
  }

  protected onProgress(percent: number) {
    this.emit("progress", percent);
  }
}
