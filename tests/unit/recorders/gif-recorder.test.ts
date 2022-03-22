import { describe, it, expect } from "vitest";
import { calcGifQuality } from "@/recorders/gif-recorder";

describe("#calcGifQuarity", () => {
  it("returns default quality with no arguments", () => {
    expect(calcGifQuality()).toBeCloseTo(9.7);
  });

  it("returns highest quality with argument 1", () => {
    expect(calcGifQuality(1)).toBeCloseTo(1);
  });

  it("returns lowest quality with argument 0", () => {
    expect(calcGifQuality(0)).toBeCloseTo(30);
  });

  it("returns value in the range 1 to 30", () => {
    expect(calcGifQuality(-0.1)).toBeCloseTo(30);
    expect(calcGifQuality(1.1)).toBeCloseTo(1);
  });
});
