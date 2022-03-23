import { describe, it, expect, beforeEach, vi } from "vitest";
import prettier from "prettier";
import { CaptureState } from "@/recorders/base";
import * as ui from "@/ui";

describe("#getFrameCountStr", () => {
  it("returns a zero-padded string", () => {
    expect(ui.getFrameCountStr(1234)).toBe("0001234");
  });
});

describe("#getElapsedTimeStr", () => {
  it("returns a string of elapsed time", () => {
    expect(ui.getElapsedTimeStr(150768, 30)).toBe("1:23:45.6");
    expect(ui.getElapsedTimeStr(100512, 20)).toBe("1:23:45.6");
    expect(ui.getElapsedTimeStr(50256, 10)).toBe("1:23:45.6");
  });
});

describe("#getEncodingProgressStr", () => {
  it("returns 'encoding' with no arguments", () => {
    expect(ui.getEncodingProgressStr()).toBe("encoding");
  });

  it("returns a string with percentages, if progress is specified", () => {
    expect(ui.getEncodingProgressStr(0.5)).toBe("encoding 50%");
    expect(ui.getEncodingProgressStr(0.25)).toBe("encoding 25%");
    expect(ui.getEncodingProgressStr(0.75)).toBe("encoding 75%");
  });
});

describe("#createUi", () => {
  it("inserts the UI into the parent element", () => {
    const parent = document.createElement("div");
    ui.createUi(parent, { format: "webm", framerate: 30 });
    const html = prettier.format(parent.innerHTML, { parser: "html" });
    expect(html).toMatchSnapshot();
  });

  describe("event handlers", () => {
    it("calls the onClickRecordButton event handler", () => {
      const onClickRecordButton = vi.fn();
      const parent = document.createElement("div");
      ui.createUi(
        parent,
        { format: "webm", framerate: 30 },
        { onClickRecordButton },
      );
      const button = parent.querySelector<HTMLInputElement>(".p5c-btn");
      button?.dispatchEvent(new Event("click"));
      expect(onClickRecordButton).toHaveBeenCalledTimes(1);
    });

    it("calls the onChangeFormat event handler", () => {
      const onChangeFormat = vi.fn();
      const parent = document.createElement("div");
      ui.createUi(
        parent,
        { format: "webm", framerate: 30 },
        { onChangeFormat },
      );
      const formatSelect =
        parent.querySelector<HTMLSelectElement>(".p5c-format");
      formatSelect?.dispatchEvent(new Event("change"));
      expect(onChangeFormat).toHaveBeenCalledTimes(1);
    });

    it("calls the onChangeFramerate event handler", () => {
      const onChangeFramerate = vi.fn();
      const parent = document.createElement("div");
      ui.createUi(
        parent,
        { format: "webm", framerate: 30 },
        { onChangeFramerate },
      );
      const framerateInput =
        parent.querySelector<HTMLInputElement>(".p5c-framerate");
      framerateInput?.dispatchEvent(new Event("change"));
      expect(onChangeFramerate).toHaveBeenCalledTimes(1);
    });
  });

  describe("#updateUi", () => {
    let parent: HTMLDivElement;
    let updateUi: ReturnType<typeof ui.createUi>["updateUi"];

    beforeEach(() => {
      parent = document.createElement("div");
      updateUi = ui.createUi(parent, {
        format: "webm",
        framerate: 30,
      }).updateUi;
    });

    describe("container", () => {
      let container: HTMLDivElement | null;

      beforeEach(() => {
        container = parent.querySelector<HTMLDivElement>(".p5c-container");
      });

      it("has a container with the idle class in the initial state", () => {
        expect(container!.classList.contains("idle")).toBe(true);
        expect(container!.classList.contains("capturing")).toBe(false);
        expect(container!.classList.contains("encoding")).toBe(false);
      });

      it.each<{ state: CaptureState; expected: CaptureState }>([
        { state: "idle", expected: "idle" },
        { state: "capturing", expected: "capturing" },
        { state: "encoding", expected: "encoding" },
      ])(
        "has a container with a $expected class in $state state",
        ({ state, expected }) => {
          const unexpected = ["idle", "capturing", "encoding"].filter(
            (state) => state !== expected,
          );

          updateUi(state, 0, 30);
          expect(container!.classList.contains(expected)).toBe(true);
          unexpected.forEach((state) => {
            expect(container!.classList.contains(state)).toBe(false);
          });
        },
      );
    });

    describe("record button", () => {
      let recordButton: HTMLButtonElement | null;

      beforeEach(() => {
        recordButton = parent.querySelector<HTMLButtonElement>(".p5c-btn");
      });

      it("has a enabled button in the initial state", () => {
        expect(recordButton!.disabled).toBeFalsy();
      });

      it.each<{ state: CaptureState; expected: boolean }>([
        { state: "idle", expected: false },
        { state: "capturing", expected: false },
        { state: "encoding", expected: true },
      ])(
        "hasn a disabled button only in encoding state",
        ({ state, expected }) => {
          updateUi(state, 0, 30);
          expect(recordButton!.disabled).toBe(expected);
        },
      );
    });

    describe("counter", () => {
      let counter: HTMLSpanElement | null;

      beforeEach(() => {
        counter = parent.querySelector<HTMLSpanElement>(".p5c-counter");
      });

      it("has a empty counter in the initial state", () => {
        expect(counter!.textContent).toBe("");
      });

      it.each<{
        state: CaptureState;
        count: number;
        framerate?: number;
        progress?: number;
        expected: string;
      }>([
        { state: "idle", count: 123, expected: "0000123" },
        { state: "idle", count: 123, framerate: 30, expected: "0:00:04.1" },
        { state: "idle", count: 123, progress: 0.5, expected: "0000123" },
        {
          state: "idle",
          count: 123,
          framerate: 30,
          progress: 0.5,
          expected: "0:00:04.1",
        },
        { state: "capturing", count: 123, expected: "0000123" },
        {
          state: "capturing",
          count: 123,
          framerate: 30,
          expected: "0:00:04.1",
        },
        {
          state: "capturing",
          count: 123,
          progress: 0.5,
          expected: "0000123",
        },
        {
          state: "capturing",
          count: 123,
          framerate: 30,
          progress: 0.5,
          expected: "0:00:04.1",
        },
        { state: "encoding", count: 123, expected: "encoding" },
        {
          state: "encoding",
          count: 123,
          framerate: 30,
          expected: "encoding",
        },
        {
          state: "encoding",
          count: 123,
          progress: 0.5,
          expected: "encoding 50%",
        },
        {
          state: "encoding",
          count: 123,
          framerate: 30,
          progress: 0.5,
          expected: "encoding 50%",
        },
      ])(
        "has a count that has a text content corresponding to arguments",
        ({ state, count, framerate, progress, expected }) => {
          updateUi(state, count, framerate, progress);
          expect(counter!.textContent).toBe(expected);
        },
      );
    });

    describe("format select", () => {
      let formatSelect: HTMLSelectElement | null;

      beforeEach(() => {
        formatSelect = parent.querySelector<HTMLSelectElement>(".p5c-format");
      });

      it("has a format select with webm as value in the initial state", () => {
        expect(formatSelect!.value).toBe("webm");
      });

      it.each<{ state: CaptureState; expected: boolean }>([
        { state: "idle", expected: false },
        { state: "capturing", expected: true },
        { state: "encoding", expected: true },
      ])(
        "has a enable format select only in idle state",
        ({ state, expected }) => {
          updateUi(state, 0, 30);
          expect(formatSelect!.disabled).toBe(expected);
        },
      );
    });

    describe("framerate input", () => {
      let framerateInput: HTMLInputElement | null;

      beforeEach(() => {
        framerateInput =
          parent.querySelector<HTMLInputElement>(".p5c-framerate");
      });

      it("has a framerate input with 30 as value in the initial state", () => {
        expect(framerateInput!.valueAsNumber).toBe(30);
      });

      it.each<{ state: CaptureState; expected: boolean }>([
        { state: "idle", expected: false },
        { state: "capturing", expected: true },
        { state: "encoding", expected: true },
      ])(
        "has a enable framerate input only in idle state",
        ({ state, expected }) => {
          updateUi(state, 0, 30);
          expect(framerateInput!.disabled).toBe(expected);
        },
      );
    });
  });
});
