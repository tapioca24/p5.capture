import { describe, it, expect } from "vitest";
import { defaultOptions } from "@/recorders/image-recorder";

describe("defaultOptions#imageFilename", () => {
  it("returns a 7-digit zero-padded string", () => {
    const result = defaultOptions.imageFilename(1234);
    expect(result).toBe("0001234");
  });
});
