import {
  ImageRecorder,
  ImageRecorderOptions,
} from "@/recorders/image-recorder";
import { omitUndefinedProperty } from "@/utils";

type WebpRecorderOriginalOptions = {
  quality?: number;
};

export type WebpRecorderOptions = ImageRecorderOptions &
  WebpRecorderOriginalOptions;

type WebpRecorderDefaultOptions = Required<
  Pick<WebpRecorderOriginalOptions, "quality">
>;

const defaultOptions: WebpRecorderDefaultOptions = {
  quality: 0.8,
};

export class WebpRecorder extends ImageRecorder {
  private mergedWebpOptions: WebpRecorderOriginalOptions &
    WebpRecorderDefaultOptions;

  constructor(canvas: HTMLCanvasElement, options: WebpRecorderOptions = {}) {
    super(canvas, "webp", options);
    this.mergedWebpOptions = {
      ...defaultOptions,
      ...omitUndefinedProperty(options),
    };
  }

  protected get qualityOption() {
    return this.mergedWebpOptions.quality;
  }
}
