import { createUi } from "@/ui";
import { Recorder } from "@/recorders/base";
import { WebmRecorder, WebmRecorderOptions } from "@/recorders/webm-recorder";
import { GifRecorder, GifRecorderOptions } from "@/recorders/gif-recorder";
import { PngRecorder, PngRecorderOptions } from "@/recorders/png-recorder";
import { JpgRecorder, JpgRecorderOptions } from "@/recorders/jpg-recorder";
import { ImageFormat } from "@/recorders/image-recorder";
import { downloadBlob } from "@/utils";

export type P5CaptureOptions = {
  format?: "webm" | "gif" | ImageFormat;
  recorderOptions?:
    | WebmRecorderOptions
    | GifRecorderOptions
    | PngRecorderOptions
    | JpgRecorderOptions;
  verbose?: boolean;
};

export type P5CaptureGlobalOptions = P5CaptureOptions & {
  disableUi?: boolean;
};

const defaultOptions: Required<P5CaptureGlobalOptions> = {
  format: "webm",
  recorderOptions: {},
  verbose: false,
  disableUi: false,
};

export class P5Capture {
  protected recorder: Recorder | null = null;
  protected updateUi: (() => void) | null = null;
  protected margedOptions: Required<P5CaptureGlobalOptions> | null = null;

  captureState() {
    if (!this.recorder) return "idle";
    return this.recorder.captureState;
  }

  async startCapturing(options: P5CaptureOptions = {}) {
    try {
      this.margeOptions(options);
      this.recorder = this.createRecorder();
      this.recorder.start();
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      }
    }
  }

  async stopCapturing() {
    try {
      if (!this.recorder) {
        throw new Error("capturing is not started");
      }
      this.recorder.stop();
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      }
    }
  }

  initialize() {
    this.margeOptions({});
    if (!this.margedOptions) {
      throw new Error("options are not set");
    }

    if (!this.margedOptions.disableUi) {
      const ui = createUi(document.body);
      this.updateUi = () => {
        if (!this.recorder) return;
        ui.updateUi(this.recorder.captureState, this.recorder.capturedCount);
      };
      ui.button.addEventListener("click", (e) => {
        e.stopPropagation();
        switch (this.captureState()) {
          case "idle":
            this.startCapturing();
            break;
          case "capturing":
            this.stopCapturing();
            break;
        }
      });
    }
  }

  postDraw() {
    this.recorder?.postDraw();
  }

  protected createRecorder() {
    if (!this.margedOptions) {
      throw new Error("options are not set");
    }

    const canvas = (window as any).canvas;
    const { format, recorderOptions } = this.margedOptions;

    let recorder;
    switch (format) {
      case "webm":
        recorder = new WebmRecorder(
          canvas,
          recorderOptions as WebmRecorderOptions
        );
        break;
      case "gif":
        recorder = new GifRecorder(
          canvas,
          recorderOptions as GifRecorderOptions
        );
        break;
      case "png":
        recorder = new PngRecorder(canvas, {
          ...(recorderOptions as PngRecorderOptions),
        });
        break;
      case "jpg":
        recorder = new JpgRecorder(canvas, {
          ...(recorderOptions as JpgRecorderOptions),
        });
        break;
    }

    recorder.on("start", () => {
      this.log("🎥 start capturing");
      this.updateUi?.();
    });
    recorder.on("stop", () => {
      this.log("🎥 stop capturing");
      this.updateUi?.();
    });
    recorder.on("added", () => this.updateUi?.());
    recorder.on("progress", (parcent) => {
      const p = Math.round(parcent * 1000) / 10;
      this.log(`⏳ encoding ${p}%`);
    });
    recorder.on("finished", (blob, filename) => {
      this.log("✅ done");
      downloadBlob(blob, filename);
      this.updateUi?.();
    });
    recorder.on("error", (error) => {
      console.error(error.message);
    });

    return recorder;
  }

  protected margeOptions(options: P5CaptureOptions) {
    const globalOptions = (window as any).P5_CAPTURE_OPTIONS as
      | P5CaptureGlobalOptions
      | undefined;

    this.margedOptions = {
      format: options.format ?? globalOptions?.format ?? defaultOptions.format,
      recorderOptions: {
        ...defaultOptions.recorderOptions,
        ...globalOptions?.recorderOptions,
        ...options.recorderOptions,
      },
      verbose:
        options.verbose ?? globalOptions?.verbose ?? defaultOptions.verbose,
      disableUi: globalOptions?.disableUi ?? defaultOptions.disableUi,
    };
  }

  protected log(message: string) {
    if (this.margedOptions?.verbose) {
      console.log(message);
    }
  }
}
