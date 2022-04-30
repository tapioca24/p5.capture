import GIF from "gif.js";
import { Recorder, RecorderOptions } from "@/recorders/base";
import { getFilename, getWorkerUrl, mathClamp, mathMap } from "@/utils";

const GIF_WORKER_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js";

export type GifRecorderOptions = RecorderOptions & {
  framerate?: number;
  quality?: number;
};

const defaultOptions = {
  framerate: 30,
  quality: 0.7,
};

export const calcGifQuality = (quality?: number) => {
  const q = quality ?? defaultOptions.quality;
  return mathClamp(mathMap(q, 0, 1, 30, 1), 1, 30);
};

export class GifRecorder extends Recorder {
  protected recorder: GIF;
  protected mergedOptions: GifRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: GifRecorderOptions = {}) {
    super(canvas, options);
    this.mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    const gifOptions: GIF.Options = {
      quality: calcGifQuality(this.mergedOptions.quality),
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
    if (this.captureState !== "capturing") return;

    try {
      this.copyCanvas();
      const fps = this.mergedOptions.framerate ?? defaultOptions.framerate;
      this.recorder.addFrame(this.canvas, {
        delay: 1000 / fps,
        copy: true,
      });
      this.increment();
    } catch (error) {
      if (error instanceof Error) {
        this.emit("error", error);
      }
    }
  }

  protected onFinished(blob: Blob) {
    this.state = "idle";
    this.reset();
    const filename = getFilename(new Date(), "gif");
    this.emit("finished", blob, filename);
  }

  protected onProgress(progress: number) {
    this.emit("progress", progress);
  }
}
