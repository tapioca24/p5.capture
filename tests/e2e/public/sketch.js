/// <reference types="p5/global" />
/// <reference path="../../../index.d.ts" />

function setup() {
  createCanvas(480, 480, WEBGL);
  frameRate(30);
}

function draw() {
  background(0);
  normalMaterial();
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.03);
  torus(width * 0.2, width * 0.1, 64, 64);
}
