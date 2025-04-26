import { P5Capture } from "@/p5.capture";

const p5Capture = new P5Capture();

if (p5.registerAddon) {
  // p5.js v2
  const myAddon: Addon = function (_, __, lifecycles) {
    lifecycles.postsetup = function () {
      const p5 = this;
      p5Capture.initialize.call(p5Capture, p5);
    };
    lifecycles.postdraw = p5Capture.postDraw.bind(p5Capture);
  };
  p5.registerAddon(myAddon);
} else {
  // p5.js v1
  p5.prototype.registerMethod("init", function (this: any) {
    const p5 = this;
    p5Capture.initialize.call(p5Capture, p5);
  });
  p5.prototype.registerMethod("post", p5Capture.postDraw.bind(p5Capture));
}

Object.assign(window, { P5Capture });
