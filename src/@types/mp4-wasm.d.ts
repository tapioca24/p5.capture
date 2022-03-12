declare module "https://unpkg.com/mp4-wasm@1.0.6" {
  type VideoEncoderOptions = {
    codec?: string;
    width?: number;
    height?: number;
    displayWidth?: number;
    displayHeight?: number;
    hardwareAccelaration?:
      | "no-preference"
      | "prefer-hardware"
      | "prefer-software";
    bitrate?: number;
    framerate?: number;
    alpha?: "discard" | "keep";
    scalabilityMode?: string;
    bitrateMode?: "constant" | "variable";
    latencyMode?: "quality" | "realtime";
  };

  type MP4Encoder = {
    end(): Promise<Uint8Array>;
    addFrame(bitmap: ImageBitmap): Promise<void>;
    flush(): Promise<void>;
  };

  type MP4EncoderOptions = {
    width: VideoEncoderOptions["width"];
    height: VideoEncoderOptions["height"];
    groupOfPictures?: number;
    fps?: number;
    fragmentation?: boolean;
    sequential?: boolean;
    hevc?: boolean;
    format?: string;
    codec?: VideoEncoderOptions["codec"];
    accelaration?: VideoEncoderOptions["hardwareAccelaration"];
    bitrate?: VideoEncoderOptions["bitrate"];
    error?: (error: Error) => void;
    encoderOptions?: VideoEncoderOptions;
    flushFrequency?: number | null;
  };

  export function createFile(initialCapacity?: number): {
    contents(): Uint8Array;
    seek(offset: number): void;
    write(data: Uint8Array): number;
  };

  export function createWebCodecsEncoderWithModule(
    MP4: MP4Module,
    opts: MP4EncoderOptions,
  ): MP4Encoder;

  export function isWebCodecsSupported(): boolean;

  type MP4Module = {
    createFile: typeof createFile;
    isWebCodecsSupported: typeof isWebCodecsSupported;
    createWebCodecsEncoder(opts: MP4EncoderOptions): MP4Encoder;
  };

  export default function loadMP4Module(): Promise<MP4Module>;
}
