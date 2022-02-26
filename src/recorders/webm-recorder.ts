import { Recorder } from "@/recorders/base";
import { getFilename } from "@/utils";

export type WebmRecorderOptions = {
  mediaRecorderOptions?: MediaRecorderOptions;
};

const defaultOptions: Required<WebmRecorderOptions> = {
  mediaRecorderOptions: {
    videoBitsPerSecond: 1024 * 1024 * 20, // 20Mbps
  },
};

export class WebmRecorder extends Recorder<WebmRecorderOptions> {
  protected chunks: BlobPart[] = [];
  protected recorder: MediaRecorder;
  protected margedOptions: WebmRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: WebmRecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = {
      mediaRecorderOptions: {
        ...defaultOptions.mediaRecorderOptions,
        ...options.mediaRecorderOptions,
      },
    };

    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(
      stream,
      this.margedOptions.mediaRecorderOptions
    );
    recorder.ondataavailable = this.onDataAvailable.bind(this);
    recorder.onstart = this.onStart.bind(this);
    recorder.onstop = this.onStop.bind(this);
    recorder.onerror = this.onError.bind(this);
    this.recorder = recorder;
  }

  start() {
    this.checkStartable();
    this.recorder.start();
  }

  stop() {
    this.checkStoppable();
    this.recorder.stop();
  }

  protected get canStart() {
    return this.captureState === "idle" && this.recorder.state === "inactive";
  }

  protected get canStop() {
    return (
      this.captureState === "capturing" && this.recorder.state === "recording"
    );
  }

  protected reset() {
    super.reset();
    this.chunks = [];
  }

  protected onDataAvailable(e: BlobEvent) {
    this.chunks.push(e.data);
  }

  protected onStart(_e: Event) {
    this.state = "capturing";
    this.reset();
    this.emit("start");
  }

  protected onStop(_e: Event) {
    this.emit("stop");
    const blob = new Blob(this.chunks, { type: "video/webm" });
    this.state = "idle";
    this.reset();
    const filename = getFilename(new Date(), "webm");
    this.emit("finished", blob, filename);
  }

  protected onError(e: MediaRecorderErrorEvent) {
    this.emit("error", e.error);
  }
}
