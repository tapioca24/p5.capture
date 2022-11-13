/// <reference types="p5/global" />
/// <reference path="../../../index.d.ts" />

const s = ( sketch ) => {

    sketch.setup = () => {
        sketch.createCanvas(480, 480, sketch.WEBGL);
        sketch.frameRate(30);
        P5Capture.setDefaultOptions({p5 : sketch});
    };

    sketch.draw = () => {
        sketch.background(0);
        sketch.normalMaterial();
        sketch.rotateX(sketch.frameCount * 0.02);
        sketch.rotateY(sketch.frameCount * 0.03);
        sketch.torus(sketch.width * 0.2, sketch.width * 0.1, 64, 64);
    };
};
  
new p5(s);
