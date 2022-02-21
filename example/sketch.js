function setup() {
  createCanvas(400, 400, WEBGL);
}

function draw() {
  background(0);
  normalMaterial();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.015);
  torus(width * 0.2, width * 0.1, 64, 64);
}
