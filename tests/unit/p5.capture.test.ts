import { it, expect } from "vitest";
import { P5Capture } from "@/p5.capture";

it("throws an exception when instantiated twice", () => {
  const instance = new P5Capture();
  expect(instance).toBeInstanceOf(P5Capture);
  expect(() => {
    new P5Capture();
  }).toThrowError(
    "P5Capture is already instantiated. Consider using P5Capture.getInstance().",
  );
});
