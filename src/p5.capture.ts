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
  verbose?: boolean;
};

export type P5CaptureGlobalOptions = P5CaptureOptions & {
  disableUi?: boolean;
  disableScaling?: boolean;
};

const defaultOptions: P5CaptureGlobalOptions = {
  format: "webm",
  duration: null,
  framerate: 30,
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
  protected margedOptions: P5CaptureGlobalOptions | null = null;

  captureState() {
    if (!this.recorder) return "idle";
    return this.recorder.captureState;
  }

  async startCapturing(options: P5CaptureOptions = {}) {
    try {
      this.margeOptions(options);
      this.recorder = await this.createRecorder();
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
    this.margeOptions();
    if (!this.margedOptions) {
      throw new Error("options are not set");
    }

    if (!this.margedOptions.disableUi) {
      this.uiState = {
        format: this.margedOptions.format,
        framerate: this.margedOptions.framerate,
      };

      const onClickRecordButton = (e: MouseEvent) => {
        e.stopPropagation();
        switch (this.captureState()) {
          case "idle":
            this.startCapturing();
            break;
          case "capturing":
            this.stopCapturing();
            break;
        }
      };

      const onChangeFormat = (e: Event) => {
        e.stopPropagation();
        const format = (e.target as HTMLSelectElement).value as OutputFormat;
        this.uiState.format = format;
      };

      const onChangeFramerate = (e: Event) => {
        e.stopPropagation();
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
          encodingProgress
        );
      };
    }

    if (this.margedOptions.disableScaling) {
      const originalSetup = (window as any).setup as () => void;
      const newSetup = () => {
        pixelDensity(1);
        originalSetup();
      };
      Object.assign(window, { setup: newSetup });
    }
  }

  postDraw() {
    if (this.captureState() === "capturing") {
      const duration = this.margedOptions?.duration;
      const count = this.recorder?.capturedCount;
      if (duration && count && count >= duration) {
        this.stopCapturing();
      }
    }
    this.recorder?.postDraw();
  }

  protected async createRecorder() {
    if (!this.margedOptions) {
      throw new Error("options are not set");
    }

    const canvas = (window as any).canvas;
    const { format, framerate, bitrate, quality, width, height } =
      this.margedOptions;
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
          width,
          height,
          mp4EncoderOptions: {
            fps: framerate,
            bitrate,
          },
        };
        recorder = new Mp4Recorder(canvas, mp4RecorderOptions);
        await recorder.initialize();
        break;

      case "png":
        const pngRecorderOptions: PngRecorderOptions = {
          width,
          height,
        };
        recorder = new PngRecorder(canvas, pngRecorderOptions);
        break;

      case "jpg":
        const jpgRecorderOptions: JpgRecorderOptions = {
          quality,
          width,
          height,
        };
        recorder = new JpgRecorder(canvas, jpgRecorderOptions);
        break;

      case "webp":
        const webpRecorderOptions: WebpRecorderOptions = {
          quality,
          width,
          height,
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
    recorder.on("error", (error) => {
      console.error(error.message);
    });

    return recorder;
  }

  protected margeOptions(options: P5CaptureOptions = {}) {
    const globalOptions = (window as any).P5_CAPTURE_OPTIONS as
      | P5CaptureGlobalOptions
      | undefined;

    this.margedOptions = {
      ...defaultOptions,
      ...globalOptions,
      ...this.uiState,
      ...options,
    };
  }

  protected log(message: string) {
    if (this.margedOptions?.verbose) {
      console.log(message);
    }
  }
}
