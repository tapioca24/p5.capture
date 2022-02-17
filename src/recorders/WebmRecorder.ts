import { CaptureState, Recorder } from "@/recorders/types";
import { downloadBlob } from "@/download";

export type WebmRecorderOptions = {
  mediaRecorderOptions?: MediaRecorderOptions;
};

const defaultOptions: WebmRecorderOptions = {};

export class WebmRecorder extends Recorder<WebmRecorderOptions> {
  protected state: CaptureState = "idle";
  protected count: number = 0;
  protected chunks: BlobPart[] = [];
  protected recorder: MediaRecorder;
  protected margedOptions: WebmRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: WebmRecorderOptions = {}) {
    super(canvas, options);
    this.margedOptions = { ...defaultOptions, ...options };

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

  start() {
    if (!this.canStart) {
      console.warn("capturing is already started");
      return;
    }
    this.recorder.start();
  }

  stop() {
    if (!this.canStop) {
      console.warn("capturing is already stopped");
      return;
    }
    this.recorder.stop();
  }

  postDraw() {
    if (this.captureState === "capturing") {
      this.count++;
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
  }

  protected onStop(_e: Event) {
    this.state = "idle";
    if (this.chunks.length === 0) return;
    const blob = new Blob(this.chunks, { type: "video/webm" });
    downloadBlob(blob, "video.webm");
    this.reset();
  }

  protected onError(e: MediaRecorderErrorEvent) {
    console.error(`MediaRecorder error: ${e.error.message}`);
  }
}
