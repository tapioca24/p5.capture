![p5.capture](https://user-images.githubusercontent.com/67893738/155303598-97d0c558-27bb-4e28-8e0a-5ae810573696.gif)

<p align="center">
  <a aria-label="npm" href="https://badge.fury.io/js/p5.capture">
    <img src="https://img.shields.io/npm/v/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="build" href="https://github.com/tapioca24/p5.capture/actions">
    <img src="https://img.shields.io/github/workflow/status/tapioca24/p5.capture/Check?style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="jsDelivr hits (npm)" href="https://www.jsdelivr.com/package/npm/p5.capture">
    <img src="https://img.shields.io/jsdelivr/npm/hm/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="license" href="https://github.com/tapioca24/p5.capture/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
</p>

Assuming you would like to capture [p5.js](https://p5js.org/) animations super easily, this package is the right choice for you.

Check out the demo:

👉 [Demo on OpenProcessing](https://openprocessing.org/sketch/1494568)

## Why p5.capture?

### Stable recording 🎩

Recording p5.js animations with a screen recording tool often causes performance issues.
This is because the recording timing is out of sync with the rendering timing.
p5.capture hooks into the `draw` function of p5.js to perform the recording task, so it works like magic.

### Keep your sketch clean ✨

Adding recording functionality to a sketch can be very tedious.
p5.capture provides a minimal GUI and is designed to add recording functionality without adding any code to your sketch.
Let's focus on your creative coding.
Of course, you can also use the API to integrate it into your code.

### Many export formats 🤹

Tired of having to use different libraries for different formats?
p5.capture supports many export formats: WebM, GIF, MP4, PNG, JPG, and WebP.
There is sure to be something you want.

## Installation

### ES Modules (recommended)

Add a link _after_ p5.js in your html file:

```html
<script src="https://cdn.jsdelivr.net/npm/p5"></script>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/p5.capture@{{ version }}"
></script>
```

⚠️ Note that `type="module"` must be specified.

### UMD

If ES Modules are not available, UMD can be used.  
Use `p5.cautpre.umd.js` instead.

```html
<script src="https://cdn.jsdelivr.net/npm/p5"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.capture@{{ version }}/dist/p5.capture.umd.js"></script>
```

The MP4 format is not available with UMD.

## Usage

Basically, the capture is controlled by the GUI.

![usage](https://user-images.githubusercontent.com/12683107/157575470-f78c0ae2-ad6f-4656-95b3-7ad6469ed255.gif)

That's all 🎉

### Export formats

p5.capture supports multiple export formats:

- WebM (default): export WebM video using [webm-writer-js](https://github.com/thenickdude/webm-writer-js)
- GIF: export animated GIF using [gif.js](https://github.com/jnordberg/gif.js)
- MP4: export MP4 video using [mp4-wasm](https://github.com/mattdesl/mp4-wasm) (🧪 Experimental)
- PNG: export PNG images in a ZIP file
- JPG: export JPG images in a ZIP file
- WebP: export WebP images in a ZIP file

### API

You can also use functions to control the capture programmatically.

| Functions                 | Description                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `startCapturing(options)` | Start capturing                                                                    |
| `stopCapturing()`         | Stop capturing                                                                     |
| `captureState()`          | Returns the capture status as a string of `"idle"`, `"capturing"`, or `"encoding"` |

The following example captures the first 100 frames:

```js
function setup() {
  createCanvas(480, 480, WEBGL);
  frameRate(30);
}

function draw() {
  if (frameCount === 1) {
    startCapturing({
      format: "gif",
      duration: 100,
      verbose: true,
    });
  }
  background(0);
  normalMaterial();
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.03);
  torus(width * 0.2, width * 0.1, 64, 64);
}
```

## Options

| Name           | Default                               | Description                                                                           |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| format         | `"webm"`                              | export format. `"webm"`, `"gif"`, `"mp4"`, `"png"`, `"jpg"`, and `"webp"`             |
| framerate      | `30`                                  | recording framerate                                                                   |
| bitrate        | `2621440` (2.5Mbps)                   | recording bitrate, only valid for MP4                                                 |
| quality        | see [Quality option](#quality-option) | recording quality from `0` (worst) to `1` (best), valid for WebM, GIF, JPG, WebP      |
| width          | canvas width                          | output image width                                                                    |
| height         | canvas height                         | output image height                                                                   |
| duration       | `null`                                | maximum capture duration in number of frames                                          |
| verbose        | `false`                               | dumps info on the console                                                             |
| disableUi      | `false`                               | (only global variable options) hides the UI                                           |
| disableScaling | `false`                               | (only global variable options) disables pixel scaling for high pixel density displays |

There are two ways to pass the options object.

- the global variable `P5_CAPTURE_OPTIONS`
- the argument of `startCapturing(options)`

```js
// global variable
P5_CAPTURE_OPTIONS = {
  format: "png",
  verbose: true,
};

// or argument of startCapturing()
startCapturing({
  format: "png",
  verbose: true,
});
```

### Quality option

The default value of the `quality` option is different for each format.

| Format | Default |
| ------ | ------- |
| WebM   | `0.95`  |
| GIF    | `0.7`   |
| JPG    | `0.92`  |
| WebP   | `0.8`   |

## Browser compatibility

It may not work depending on your environment.  
Tested in the following environments:

|      | Chrome | Edge | Firefox | Safari |
| ---- | ------ | ---- | ------- | ------ |
| WebM | ✅     | ✅   | ✅      | ❌     |
| GIF  | ✅     | ✅   | ✅      | ✅     |
| MP4  | ✅     | ✅   | ❌      | ❌     |
| PNG  | ✅     | ✅   | ✅      | ✅     |
| JPG  | ✅     | ✅   | ✅      | ✅     |
| WebP | ✅     | ✅   | ✅      | ✅     |

The browser versions used for testing are

- Chrome 98.0.4758.109
- Edge 98.0.1108.62
- Firefox 97.0.2
- Safari 15.3

## Limitations

- p5.capture currently only supports [p5.js global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
- Currently there are some limitations with mp4 export
  - Does not work on Windows (see [Issue #6 · mattdesl/mp4-wasm](https://github.com/mattdesl/mp4-wasm/issues/6))
  - Maximum framerate is 30
  - Minimum output height is 480
