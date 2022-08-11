import { describe, it, expect } from "vitest";
import { defaultOptions } from "@/recorders/base";

describe("defaultOptions#baseFilename", () => {
  it("returns a string in the format yyyyMMMdd-HHmmss", () => {
    const date = new Date(2020, 0, 2, 3, 4, 5);
    const result = defaultOptions.baseFilename(date);
    expect(result).toBe("20200102-030405");
  });
});
