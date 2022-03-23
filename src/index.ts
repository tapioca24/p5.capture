import { P5Capture } from "@/p5.capture";

const p5Capture = new P5Capture();

p5.prototype.registerMethod("init", p5Capture.initialize.bind(p5Capture));
p5.prototype.registerMethod("post", p5Capture.postDraw.bind(p5Capture));

Object.assign(window, { P5Capture });
