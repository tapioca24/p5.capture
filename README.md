![p5.capture](https://user-images.githubusercontent.com/67893738/155303598-97d0c558-27bb-4e28-8e0a-5ae810573696.gif)

Super easy capturing for [p5.js](https://p5js.org/) animations 📸

Assuming you would like to capture p5.js animations easily, this package is the right choice for you.

# Why p5.capture?

## Stable recording 🎩

Recording p5.js animations with a screen recording tool often causes performance issues.
This is because the recording timing is out of sync with the rendering timing.
p5.capture hooks into the `draw` function of p5.js to perform the recording task, so it works like magic.

## Keep your sketches clean ✨

Adding recording functionality to a sketch can be very tedious.
A sketch messed up with recording code becomes less visible and harder to change.
p5.capture provides a minimalistic GUI by default, designed to add recording functionality without messing up your sketch.
Let's focus on your creative coding.
Of course, you can also use the API to integrate it into your code.

## Wide variety of export formats 🤹

Tired of having to use different libraries for different formats?
p5.capture supports a wide variety of export formats: WebM, GIF, PNG, JPEG, and WebP.
Say goodbye to having to use multiple libraries for recording.

# Installation

Add a link *after* p5.js in your html file:

```html
<script src="https://cdn.jsdelivr.net/npm/p5"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.capture"></script>
```

Or install with npm:

```sh
npm install p5.capture
```

# Usage

Basically, the capture is controlled by the GUI.

![usage](https://user-images.githubusercontent.com/12683107/154848445-327433f6-3d4f-431f-8e97-98495f36e3f5.gif)

That's all 🎉  
This is useful for capturing interactively.

## Export formats

p5.capture supports multiple export formats:

- WebM (default): export WebM video using [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- GIF: export animated GIF using [gif.js](http://jnordberg.github.io/gif.js/)
- PNG: export PNG images in a ZIP file
- JPEG: export JPEG images in a ZIP file
- WebP: export WebP images in a ZIP file

## API

You can also use functions to control the capture programmatically.

| Functions                 | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `startCapturing(options)` | Start capturing                                                                     |
| `stopCapturing()`         | Stop capturing                                                                      |
| `captureState()`          | Returns the capture status as a string of `"idle"`, `"capturing"`, or `"captured"`. |

The following example captures the first 100 frames:

```js
function setup() {
  createCanvas(400, 400, WEBGL);
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
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.015);
  torus(width * 0.2, width * 0.1, 64, 64);
}
```

# Options

| Name            | Default  | Description                                                                           |
| --------------- | -------- | ------------------------------------------------------------------------------------- |
| format          | `"webm"` | export format. `"webm"`, `"gif"`, `"png"`, `"jpg"`, and `"webp"`                      |
| recorderOptions | `{}`     | [Recorder options](#recorder-options)                                                 |
| duration        | `null`   | maximum capture duration in number of frames                                          |
| verbose         | `false`  | dumps info on the console                                                             |
| disableUi       | `false`  | (only global variable options) hides the UI                                           |
| disableScaling  | `false`  | (only global variable options) disables pixel scaling for high pixel density displays |

There are two ways to pass the options object.

- the global variable `P5_CAPTURE_OPTIONS`
- the argument of `startCapturing(options)`

```js
// global variable
P5_CAPTURE_OPTIONS = {
  format: "png",
  verbose: true,
}

// or argument of startCapturing()
startCapturing({
  format: "png",
  verbose: true,
})
```

## Recorder options

Depends on the format.

### WebM

| Name                 | Default | Description                                                                                                      |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| mediaRecorderOptions | `{}`    | [MediaRecorder options](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#parameters) |

Example of using the vp9 codec:

```js
P5_CAPTURE_OPTIONS = {
  format: "webm",
  recorderOptions: {
    mediaRecorderOptions: {
      mimeType: "video/webm;codecs=vp9",
    },
  },
};
```

### GIF

| Name       | Default | Description                                                   |
| ---------- | ------- | ------------------------------------------------------------- |
| frameRate  | `60`    | target framerate for the capture                              |
| gifOptions | [Default gifOptions](#default-gifoptions) | [gif.js options](https://github.com/jnordberg/gif.js#options) |

Example of setting quality:

```js
P5_CAPTURE_OPTIONS = {
  format: "gif",
  recorderOptions: {
    gifOptions: {
      quality: 5,
    },
  },
};
```

#### Default gifOptions

- `workers`: `4`
- `workerScript`: Import `gif.worker.js` from [CDN](https://www.jsdelivr.com/package/npm/gif.js?path=dist)

`gifOptions` properties will be merged appropriately.

### PNG

No options available.

### JPEG

| Name    | Default | Description                                  |
| ------- | ------- | -------------------------------------------- |
| quality | `0.92`  | image quality (a number between `0` and `1`) |

Example of setting quality:

```js
P5_CAPTURE_OPTIONS = {
  format: "jpg",
  recorderOptions: {
    quality: 0.95
  },
};
```

### WebP

| Name    | Default | Description                                  |
| ------- | ------- | -------------------------------------------- |
| quality | `0.8`   | image quality (a number between `0` and `1`) |

Example of setting quality:

```js
P5_CAPTURE_OPTIONS = {
  format: "webp",
  recorderOptions: {
    quality: 0.85
  },
};
```

# Limitations

p5.capture currently only supports [p5.js global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode).
