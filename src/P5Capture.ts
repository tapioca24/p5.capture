import { WebmRecorder } from "@/recorders/WebmRecorder";
import { Recorder } from "@/recorders/types";
import { createUi } from "@/ui";

export class P5Capture {
  recorder: Recorder | null = null;
  updateUi: (() => void) | null = null;
  captureState() {
    if (!this.recorder) return "uninitialized";
    return this.recorder.captureState;
  }

  startCapturing = () => {
    if (!this.recorder) {
      const canvas = (window as any).canvas;
      this.recorder = new WebmRecorder(canvas);
    }
    this.recorder.start();
    this.updateUi?.();
  };

  stopCapturing = () => {
    if (!this.recorder) return;
    this.recorder.stop();
    this.updateUi?.();
  };

  initialize() {
    const ui = createUi(document.body);
    this.updateUi = () => {
      if (!this.recorder) return;
      ui.updateUi(this.recorder.captureState, this.recorder.capturedCount);
    };

    ui.button.addEventListener("click", (e) => {
      e.stopPropagation();
      switch (this.captureState()) {
        case "uninitialized":
        case "idle":
          this.startCapturing();
          break;
        case "capturing":
          this.stopCapturing();
          break;
      }
    });
  }

  postDraw() {
    this.recorder?.postDraw();
    if (this.captureState() === "capturing") {
      this.updateUi?.();
    }
  }
}
