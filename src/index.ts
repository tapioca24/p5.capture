import { createUi } from "@/ui";
import { Recorder } from "@/recorders/types";

let recorder: Recorder | null = null;

const captureState = () => {
  if (!recorder) return "uninitialized";
  return recorder.captureState;
};

const startCapturing = () => {};

const stopCapturing = () => {};

const initialize = () => {
  const ui = createUi(document.body);
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

const postDraw = () => {};

p5.prototype.registerMethod("init", initialize);
p5.prototype.registerMethod("post", postDraw);
p5.prototype.startCapturing = startCapturing;
p5.prototype.stopCapturing = stopCapturing;
p5.prototype.captureState = captureState;
