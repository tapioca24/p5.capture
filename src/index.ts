import { P5Capture } from "@/P5Capture";

const p5Capture = new P5Capture();

p5.prototype.registerMethod("init", p5Capture.initialize.bind(p5Capture));
p5.prototype.registerMethod("post", p5Capture.postDraw.bind(p5Capture));
p5.prototype.startCapturing = p5Capture.startCapturing.bind(p5Capture);
p5.prototype.stopCapturing = p5Capture.stopCapturing.bind(p5Capture);
p5.prototype.captureState = p5Capture.captureState.bind(p5Capture);
