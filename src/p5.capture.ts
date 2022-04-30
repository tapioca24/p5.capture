import { createUi, UiState } from "@/ui";
import { Recorder } from "@/recorders/base";
import { Mp4Recorder, Mp4RecorderOptions } from "@/recorders/mp4-recorder";
import { WebmRecorder, WebmRecorderOptions } from "@/recorders/webm-recorder";
import { GifRecorder, GifRecorderOptions } from "@/recorders/gif-recorder";
import { PngRecorder, PngRecorderOptions } from "@/recorders/png-recorder";
import { JpgRecorder, JpgRecorderOptions } from "@/recorders/jpg-recorder";
import { WebpRecorder, WebpRecorderOptions } from "@/recorders/webp-recorder";
import { ImageFormat } from "@/recorders/image-recorder";
import { downloadBlob } from "@/utils";

export type MovieFormat = "webm" | "gif" | "mp4";
export type OutputFormat = MovieFormat | ImageFormat;

export type P5CaptureOptions = {
  format?: OutputFormat;
  framerate?: number;
  bitrate?: number;
  quality?: number;
  width?: number;
  height?: number;
  duration?: number | null;
  autoSaveDuration?: number | null;
  verbose?: boolean;
};

export type P5CaptureGlobalOptions = P5CaptureOptions & {
  disableUi?: boolean;
  disableScaling?: boolean;
};

const defaultOptions: P5CaptureGlobalOptions = {
  format: "webm",
  framerate: 30,
  bitrate: 5000,
  duration: null,
  autoSaveDuration: null,
  verbose: false,
  disableUi: false,
  disableScaling: false,
};

export class P5Capture {
  protected recorder: Recorder | null = null;
  protected uiState: UiState = {};
  protected updateUi:
    | ((framerate?: number, encodingProgress?: number) => void)
    | null = null;
  protected mergedOptions: P5CaptureGlobalOptions | null = null;

  protected static globalOptions: P5CaptureGlobalOptions = {};
  protected static instance: P5Capture | null = null;

  static setDefaultOptions(options: P5CaptureGlobalOptions) {
    this.globalOptions = options;
  }

  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (P5Capture.instance) {
      throw new Error(
        "P5Capture is already instantiated. Consider using P5Capture.getInstance().",
      );
    }
    P5Capture.instance = this;
  }

  get state() {
    if (!this.recorder) return "idle";
    return this.recorder.captureState;
  }

  async start(options: P5CaptureOptions = {}) {
    try {
      this.mergeOptions(options);
      this.recorder = await this.createRecorder();
      this.recorder.start();
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      }
    }
  }

  async stop() {
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
    this.mergeOptions();
    if (!this.mergedOptions) {
      throw new Error("options are not set");
    }

    if (!this.mergedOptions.disableUi) {
      this.uiState = {
        format: this.mergedOptions.format,
        framerate: this.mergedOptions.framerate,
      };

      const onClickRecordButton = (_: MouseEvent) => {
        switch (this.state) {
          case "idle":
            this.start();
            break;
          case "capturing":
            this.stop();
            break;
        }
      };

      const onChangeFormat = (e: Event) => {
        const format = (e.target as HTMLSelectElement).value as OutputFormat;
        this.uiState.format = format;
      };

      const onChangeFramerate = (e: Event) => {
        const framerate = (e.target as HTMLInputElement).valueAsNumber;
        if (framerate > 0) {
          this.uiState.framerate = framerate;
        }
      };

      const { updateUi } = createUi(document.body, this.uiState, {
        onClickRecordButton: onClickRecordButton.bind(this),
        onChangeFormat: onChangeFormat.bind(this),
        onChangeFramerate: onChangeFramerate.bind(this),
      });

      this.updateUi = (framerate?: number, encodingProgress?: number) => {
        if (!this.recorder) return;
        updateUi(
          this.recorder.captureState,
          this.recorder.capturedCount,
          framerate,
          encodingProgress,
        );
      };
    }

    if (this.mergedOptions.disableScaling) {
      const originalSetup = (window as any).setup as () => void;
      const newSetup = () => {
        pixelDensity(1);
        originalSetup();
      };
      Object.assign(window, { setup: newSetup });
    }
  }

  postDraw() {
    if (this.state === "capturing") {
      const duration = this.mergedOptions?.duration;
      const count = this.recorder?.capturedCount;
      if (duration && count && count >= duration) {
        this.stop();
      }
    }
    this.recorder?.postDraw();
  }

  protected async createRecorder() {
    if (!this.mergedOptions) {
      throw new Error("options are not set");
    }

    const canvas = (window as any).canvas;
    const {
      format,
      framerate,
      bitrate,
      quality,
      width,
      height,
      autoSaveDuration,
    } = this.mergedOptions;
    let recorder;

    switch (format) {
      case "webm":
        const webmRecorderOptions: WebmRecorderOptions = {
          width,
          height,
          webmWriterOptions: {
            frameRate: framerate,
            quality,
          },
        };
        recorder = new WebmRecorder(canvas, webmRecorderOptions);
        break;

      case "gif":
        const gifRecorderOptions: GifRecorderOptions = {
          framerate,
          quality,
          width,
          height,
        };
        recorder = new GifRecorder(canvas, gifRecorderOptions);
        break;

      case "mp4":
        const mp4RecorderOptions: Mp4RecorderOptions = {
          framerate,
          bitrate,
          width,
          height,
        };
        recorder = new Mp4Recorder(canvas, mp4RecorderOptions);
        await recorder.initialize();
        break;

      case "png":
        const pngRecorderOptions: PngRecorderOptions = {
          width,
          height,
          autoSaveDuration,
        };
        recorder = new PngRecorder(canvas, pngRecorderOptions);
        break;

      case "jpg":
        const jpgRecorderOptions: JpgRecorderOptions = {
          quality,
          width,
          height,
          autoSaveDuration,
        };
        recorder = new JpgRecorder(canvas, jpgRecorderOptions);
        break;

      case "webp":
        const webpRecorderOptions: WebpRecorderOptions = {
          quality,
          width,
          height,
          autoSaveDuration,
        };
        recorder = new WebpRecorder(canvas, webpRecorderOptions);
        break;

      default:
        throw new Error(`invalid format: ${format}`);
    }

    recorder.on("start", () => {
      this.log("🎥 start capturing");
      this.updateUi?.(framerate);
    });
    recorder.on("stop", () => {
      this.log("🎥 stop capturing");
      this.updateUi?.(framerate);
    });
    recorder.on("added", () => this.updateUi?.(framerate));
    recorder.on("progress", (progress) => {
      const p = Math.round(progress * 100);
      this.log(`⏳ encoding ${p}%`);
      this.updateUi?.(framerate, progress);
    });
    recorder.on("finished", (blob, filename) => {
      this.log("✅ done");
      downloadBlob(blob, filename);
      this.updateUi?.(framerate);
    });
    recorder.on("segmented", (blob, filename) => {
      this.log(`💾 save segmented file: ${filename}`);
      downloadBlob(blob, filename);
    });
    recorder.on("error", (error) => {
      console.error(error.message);
    });

    return recorder;
  }

  protected mergeOptions(options: P5CaptureOptions = {}) {
    this.mergedOptions = {
      ...defaultOptions,
      ...P5Capture.globalOptions,
      ...this.uiState,
      ...options,
    };
  }

  protected log(message: string) {
    if (this.mergedOptions?.verbose) {
      console.log(message);
    }
  }
}
