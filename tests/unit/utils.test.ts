import { describe, it, expect } from "vitest";
import * as utils from "@/utils";

describe("#omitUndefinedProperty", () => {
  it("returns a object without undefined properties", () => {
    const obj = {
      name: "James Bond",
      age: undefined,
    };
    const result = utils.omitUndefinedProperty(obj);
    expect(result).toStrictEqual({ name: "James Bond" });
  });

  it("does not change the object passed", () => {
    const obj = {
      name: "James Bond",
      age: undefined,
    };
    utils.omitUndefinedProperty(obj);
    expect(obj).toStrictEqual({ name: "James Bond", age: undefined });
  });
});

describe("#mathClamp", () => {
  it("returns the value in the range as is", () => {
    const result = utils.mathClamp(0, -100, 100);
    expect(result).toBe(0);
  });

  it("returns the minimum value when the value is less than the minimum", () => {
    const result = utils.mathClamp(-200, -100, 100);
    expect(result).toBe(-100);
  });

  it("returns the maximum value when the value is greater than the maximum", () => {
    const result = utils.mathClamp(200, -100, 100);
    expect(result).toBe(100);
  });
});

describe("#mathMap", () => {
  it("returns a value mapped to the specified output range", () => {
    const result = utils.mathMap(0.3, 0, 1, 100, 200);
    expect(result).toBe(130);
  });

  it("returns a value mapped outside the output range, if a value outside the input range is specified", () => {
    const result = utils.mathMap(1.3, 0, 1, 100, 200);
    expect(result).toBe(230);
  });

  it("returns the inverted value, if the output range is inverted", () => {
    const result = utils.mathMap(0.3, 0, 1, 200, 100);
    expect(result).toBe(170);
  });

  it("returns the inverted value, if the input range is inverted", () => {
    const result = utils.mathMap(0.3, 1, 0, 100, 200);
    expect(result).toBe(170);
  });
});
