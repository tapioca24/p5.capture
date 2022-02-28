import GIF from "gif.js";
import { Recorder } from "@/recorders/base";
import { getFilename, getWorkerUrl, mathClamp, mathMap } from "@/utils";

const GIF_WORKER_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js";

const calcGifQuality = (quality: number) => {
  return mathClamp(mathMap(quality, 0, 1, 30, 1), 1, 30);
};

export type GifRecorderOptions = {
  framerate?: number;
  quality?: number;
};

const defaultOptions: Required<GifRecorderOptions> = {
  framerate: 30,
  quality: 0.7,
};

export class GifRecorder extends Recorder<GifRecorderOptions> {
  protected recorder: GIF;
  protected margedOptions: Required<GifRecorderOptions>;

  constructor(canvas: HTMLCanvasElement, options: GifRecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      ...defaultOptions,
      ...options,
    };

    const gifOptions: GIF.Options = {
      quality: calcGifQuality(this.margedOptions.quality),
      workers: 4,
      workerScript: getWorkerUrl(GIF_WORKER_SCRIPT_URL),
    };

    const recorder = new GIF(gifOptions);
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
        delay: 1000 / this.margedOptions.framerate,
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
