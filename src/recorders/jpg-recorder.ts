import {
  ImageRecorder,
  ImageRecorderOptions,
} from "@/recorders/image-recorder";
import { omitUndefinedProperty } from "@/utils";

type JpgRecorderOriginalOptions = {
  quality?: number;
};

export type JpgRecorderOptions = ImageRecorderOptions &
  JpgRecorderOriginalOptions;

type JpgRecorderDefaultOptions = Required<
  Pick<JpgRecorderOriginalOptions, "quality">
>;

const defaultOptions: JpgRecorderDefaultOptions = {
  quality: 0.92,
};

export class JpgRecorder extends ImageRecorder {
  private mergedJpgOptions: JpgRecorderOriginalOptions &
    JpgRecorderDefaultOptions;

  constructor(canvas: HTMLCanvasElement, options: JpgRecorderOptions = {}) {
    super(canvas, "jpg", options);
    this.mergedJpgOptions = {
      ...defaultOptions,
      ...omitUndefinedProperty(options),
    };
  }

  protected get qualityOption() {
    return this.mergedJpgOptions.quality;
  }
}
