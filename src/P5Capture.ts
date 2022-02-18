import { WebmRecorder } from "@/recorders/WebmRecorder";
import { Recorder } from "@/recorders/types";
import { createUi } from "@/ui";

export class P5Capture {
  protected recorder: Recorder | null = null;
  protected updateUi: (() => void) | null = null;

  captureState() {
    if (!this.recorder) return "idle";
    return this.recorder.captureState;
  }

  async startCapturing() {
    if (!this.recorder) {
      const canvas = (window as any).canvas;
      this.recorder = new WebmRecorder(canvas);
    }
    try {
      this.recorder.start();
      this.updateUi?.();
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      }
    }
  }

  async stopCapturing() {
    if (!this.recorder) return;
    try {
      await this.recorder.stop();
      this.updateUi?.();
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      }
    }
  }

  initialize() {
    const ui = createUi(document.body);
    this.updateUi = () => {
      if (!this.recorder) return;
      ui.updateUi(this.recorder.captureState, this.recorder.capturedCount);
    };
    ui.button.addEventListener("click", (e) => {
      e.stopPropagation();
      switch (this.captureState()) {
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
