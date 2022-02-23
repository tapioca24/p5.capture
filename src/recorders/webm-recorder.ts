import { CaptureState, Recorder } from "@/recorders/base";
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
  protected state: CaptureState = "idle";
  protected count: number = 0;
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

  get capturedCount() {
    return this.count;
  }

  get captureState() {
    return this.state;
  }

  async start() {
    if (!this.canStart) {
      throw new Error("capturing is already started");
    }
    this.recorder.start();
  }

  async stop() {
    if (!this.canStop) {
      throw new Error("capturing is not started");
    }
    this.recorder.stop();
  }

  postDraw() {
    if (this.captureState === "capturing") {
      this.count++;
      this.emit("added");
    }
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
    this.count = 0;
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
