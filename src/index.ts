import { createUi } from "@/ui";
import { Recorder } from "@/recorders/types";
import { WebmRecorder } from "@/recorders/WebmRecorder";

let recorder: Recorder | null = null;
let updateUi: (() => void) | null = null;

const captureState = () => {
  if (!recorder) return "uninitialized";
  return recorder.captureState;
};

const startCapturing = () => {
  if (!recorder) {
    const canvas = (window as any).canvas;
    recorder = new WebmRecorder(canvas);
  }
  recorder.start();
  updateUi?.();
};

const stopCapturing = () => {
  if (!recorder) return;
  recorder.stop();
  updateUi?.();
};

const initialize = () => {
  const ui = createUi(document.body);
  updateUi = () => {
    if (!recorder) return;
    ui.updateUi(recorder.captureState, recorder.capturedCount);
  };
  ui.button.addEventListener("click", (e) => {
    e.stopPropagation();
    switch (captureState()) {
      case "uninitialized":
      case "idle":
        startCapturing();
        break;
      case "capturing":
        stopCapturing();
        break;
    }
  });
};

const postDraw = () => {
  recorder?.postDraw();
  updateUi?.();
};

p5.prototype.registerMethod("init", initialize);
p5.prototype.registerMethod("post", postDraw);
p5.prototype.startCapturing = startCapturing;
p5.prototype.stopCapturing = stopCapturing;
p5.prototype.captureState = captureState;
