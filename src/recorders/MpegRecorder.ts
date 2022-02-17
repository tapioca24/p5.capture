import { CaptureState, Recorder } from "@/recorders/types";

export type MpegRecorderOptions = {
  mediaRecorderOptions?: MediaRecorderOptions;
};

const defaultOptions: MpegRecorderOptions = {};

export class MpegRecorder extends Recorder<MpegRecorderOptions> {
  protected state: CaptureState = "idle";
  protected chunks: BlobPart[] = [];
  protected recorder: MediaRecorder;
  protected margedOptions: MpegRecorderOptions;

  constructor(canvas: HTMLCanvasElement, options: MpegRecorderOptions = {}) {
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

  get captureState() {
    return this.state;
  }

  protected get canStart() {
    return this.captureState === "idle" && this.recorder.state === "inactive";
  }

  protected get canStop() {
    return (
      this.captureState === "capturing" && this.recorder.state === "recording"
    );
  }

  onDataAvailable(e: BlobEvent) {
    this.chunks.push(e.data);
  }

  onStart(_e: Event) {
    this.state = "capturing";
    this.chunks = [];
  }

  onStop(_e: Event) {
    this.state = "idle";
    if (this.chunks.length === 0) return;
    const blob = new Blob(this.chunks, { type: "video/webm" });
    console.log(blob);
    this.chunks = [];
  }

  onError(e: MediaRecorderErrorEvent) {
    console.error(`MediaRecorder error: ${e.error.message}`);
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
}
