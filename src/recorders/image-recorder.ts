import { ZippableFile, zipSync } from "fflate";
import { Recorder, RecorderOptions } from "@/recorders/base";
import { omitUndefinedProperty } from "@/utils";

export type ImageFormat = "png" | "jpg" | "webp";

type ImageRecorderOriginalOptions = {
  autoSaveDuration?: number | null;
  imageFilename?: (index: number) => string;
};

export type ImageRecorderOptions = RecorderOptions &
  ImageRecorderOriginalOptions;

type ImageRecorderDefaultOptions = Required<
  Pick<ImageRecorderOriginalOptions, "imageFilename">
>;

export const defaultOptions: ImageRecorderDefaultOptions = {
  imageFilename(index) {
    return index.toString().padStart(7, "0");
  },
};

type Chunk = {
  index: number;
  filename: string;
  uint8array: Uint8Array;
};

export class ImageRecorder extends Recorder {
  protected tasks: Promise<Chunk>[] = [];
  private mergedImageOptions: ImageRecorderOriginalOptions &
    ImageRecorderDefaultOptions;

  constructor(
    canvas: HTMLCanvasElement,
    protected format: ImageFormat,
    options: RecorderOptions = {},
  ) {
    super(canvas, options);
    this.mergedImageOptions = {
      ...defaultOptions,
      ...omitUndefinedProperty(options),
    };
  }

  start() {
    this.checkStartable();
    this.state = "capturing";
    this.reset();
    this.emit("start");
  }

  stop() {
    this.checkStoppable();
    this.state = "encoding";
    this.emit("stop");
  }

  async postDraw() {
    try {
      switch (this.captureState) {
        case "capturing":
          const { autoSaveDuration } = this.mergedImageOptions;
          if (
            autoSaveDuration &&
            this.count > 0 &&
            this.count % autoSaveDuration === 0
          ) {
            this.createSegmentedZip();
          }

          this.copyCanvas();
          const task = this.makeChunk(this.count);
          this.tasks.push(task);

          this.increment();
          break;
        case "encoding":
          this.state = "idle";
          const chunks = await Promise.all(this.tasks);
          const { blob, filename } = this.createZip(chunks);
          this.reset();
          this.emit("finished", blob, filename);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.emit("error", error);
      }
    }
  }

  protected reset() {
    super.reset();
    this.tasks = [];
  }

  protected getImageFilename(index: number) {
    return this.mergedImageOptions.imageFilename(index);
  }

  protected makeMimeType(format: ImageFormat) {
    switch (format) {
      case "png":
        return "image/png";
      case "jpg":
        return "image/jpeg";
      case "webp":
        return "image/webp";
      default:
        throw new Error("unknown format");
    }
  }

  protected get qualityOption(): number | undefined {
    return undefined;
  }

  protected async makeBlob() {
    return new Promise<Blob>((resolve, reject) => {
      const mimeType = this.makeMimeType(this.format);
      this.canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("failed to make blob"));
            return;
          }
          resolve(blob);
        },
        mimeType,
        this.qualityOption,
      );
    });
  }

  protected async makeChunk(index: number) {
    const filename = `${this.getImageFilename(index)}.${this.format}`;
    const blob = await this.makeBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8array = new Uint8Array(arrayBuffer);
    return { index, filename, uint8array };
  }

  protected createZip(chunks: Chunk[]) {
    if (!chunks.length) {
      throw new Error("no chunks");
    }

    const images: Record<string, ZippableFile> = {};
    chunks
      .sort((a, b) => a.index - b.index)
      .forEach((chunk) => {
        images[chunk.filename] = [chunk.uint8array, { level: 0 }];
      });

    const dirname = this.getBaseFilename(new Date());
    const zip = zipSync({ [dirname]: images });
    const blob = new Blob([zip], { type: "application/zip" });
    const filename = `${dirname}.zip`;
    return { blob, filename };
  }

  protected async createSegmentedZip() {
    if (!this.tasks.length) {
      throw new Error("no tasks");
    }

    const tasks = [...this.tasks];
    this.tasks = [];

    const chunks = await Promise.all(tasks);
    const { blob, filename } = this.createZip(chunks);
    this.emit("segmented", blob, filename);
  }
}
