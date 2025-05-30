<!-- Do not edit this file directly because it was generated -->

![p5.capture](https://user-images.githubusercontent.com/67893738/155303598-97d0c558-27bb-4e28-8e0a-5ae810573696.gif)

<p align="center">
  <a aria-label="npm" href="https://badge.fury.io/js/p5.capture">
    <img src="https://img.shields.io/npm/v/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="build" href="https://github.com/tapioca24/p5.capture/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/tapioca24/p5.capture/check.yml?branch=main&style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="jsDelivr hits (npm)" href="https://www.jsdelivr.com/package/npm/p5.capture">
    <img src="https://img.shields.io/jsdelivr/npm/hm/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
  <a aria-label="license" href="https://github.com/tapioca24/p5.capture/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/p5.capture?style=for-the-badge&labelColor=223843">
  </a>
</p>

<p align="center">
  <a href="#about">About</a> • <a href="#why-p5capture">Why p5.capture?</a> • <a href="#getting-started">Getting started</a> • <a href="#api">API</a>
  <br />
  <a href="#options">Options</a> • <a href="#browser-compatibility">Browser compatibility</a> • <a href="#limitations">Limitations</a> • <a href="#donation">Donation</a>
</p>

## About

<p align="center">
  <img src="https://user-images.githubusercontent.com/12683107/161574420-6ff4141c-affa-410e-877b-f1ff36d7cc0d.png" width="300">
</p>

Assuming you would like to record [p5.js](https://p5js.org/) animations super easily, this package is the right choice for you.

👇 Check out the demo:

- [Demo on p5.js Web Editor](https://editor.p5js.org/tapioca24/sketches/gozcYyq4F)
- [Demo on OpenProcessing](https://openprocessing.org/sketch/1494568)
- [Demo on CodePen](https://codepen.io/tapioca24/pen/JjMdQMz)

## Why p5.capture?

### 🎩 Stable recording

Recording p5.js animations with screen recording tools can cause jerky recordings.
Complex animations can slow down the framerate and make recording unstable.
p5.capture hooks into the p5.js draw function and records the rendered frame, so it works like magic.

### ✨ Keep your sketch clean

Adding recording functionality to a sketch can be very tedious.
p5.capture provides a minimal GUI and is designed to add recording functionality without adding any code to your sketch.
Let's focus on your creative coding.
Of course, you can also use the API to integrate it into your code.

### 🤹 Any format • One API

Tired of having to use different libraries for different formats?
p5.capture supports many export formats including WebM, GIF, MP4, PNG, JPG, and WebP.
There is sure to be something you want.

## Getting started

### Installation

Insert a link to the p5.capture _after_ p5.js in your html file:

```html
<script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.min.js"></script>
<!-- insert after p5.js -->
<script src="https://cdn.jsdelivr.net/npm/p5.capture@1.6.0/dist/p5.capture.umd.min.js"></script>
```

You can find all versions in the [jsDelivr](https://www.jsdelivr.com/package/npm/p5.capture).

### Usage

Basically, the GUI provided by p5.capture starts and stops recording.

![usage](https://user-images.githubusercontent.com/12683107/157575470-f78c0ae2-ad6f-4656-95b3-7ad6469ed255.gif)

That's all 🎉

#### Export formats

Supported formats include:

- WebM (default): export WebM video using [webm-writer-js](https://github.com/thenickdude/webm-writer-js)
- GIF: export animated GIF using [gif.js](https://github.com/jnordberg/gif.js)
- MP4: export MP4 video using [h264-mp4-encoder](https://github.com/TrevorSundberg/h264-mp4-encoder)
- PNG: export PNG images in a ZIP file
- JPG: export JPG images in a ZIP file
- WebP: export WebP images in a ZIP file

## API

The `P5Capture` class can be used to programmatically control recording.

### Static methods

#### `P5Capture.getInstance()`

Returns a P5Capture instance.  
Used to access the P5Capture instance automatically created when p5.capture is initialized.

#### `P5Capture.setDefaultOptions(options)`

Change default options. These options affect both GUI and API recording.  
Must be used _before_ p5.js initialization.

```js
P5Capture.setDefaultOptions({
  format: "gif",
  framerate: 10,
  quality: 0.5,
  width: 320,
});

function setup() {
  // do something...
}
```

### Instance methods

#### `start(options?)`

Start recording with the specified options.  
`options` can be omitted.

#### `stop()`

Stop recording and start encoding.  
Download files after encoding is complete.

### Instance properties

#### `state` (Read only)

Returns the current recording state (`"idle"`, `"capturing"`, or `"encoding"`).

### Examples

The following example shows how to record the first 100 frames and create a GIF video:

```js
function draw() {
  if (frameCount === 1) {
    const capture = P5Capture.getInstance();
    capture.start({
      format: "gif",
      duration: 100,
    });
  }

  // do something...
}
```

The following example shows how to add an event handler that starts and stops recording with a keystroke:

```js
function keyPressed() {
  if (key === "c") {
    const capture = P5Capture.getInstance();
    if (capture.state === "idle") {
      capture.start();
    } else {
      capture.stop();
    }
  }
}
```

## Options

| Name             | Default                                             | Description                                                                                                              |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| format           | `"webm"`                                            | export format. `"webm"`, `"gif"`, `"mp4"`, `"png"`, `"jpg"`, and `"webp"`                                                |
| framerate        | `30`                                                | recording framerate                                                                                                      |
| bitrate          | `5000`                                              | recording bitrate in kbps (only available for MP4)                                                                       |
| quality          | see [Quality option](#quality-option)               | recording quality from `0` (worst) to `1` (best). (only available for WebM/GIF/JPG/WebP)                                 |
| width            | canvas width                                        | output image width                                                                                                       |
| height           | canvas height                                       | output image height                                                                                                      |
| duration         | `null`                                              | maximum recording duration in number of frames                                                                           |
| autoSaveDuration | `null`                                              | automatically downloads every n frames. convenient for long captures (only available for PNG/JPG/WebP)                   |
| baseFilename     | see [Base filename option](#base-filename-option)   | function to customize the filename of a video or zip file. see [Base filename option](#base-filename-option) for details |
| imageFilename    | see [Image filename option](#image-filename-option) | function to customize the filename of a image file. see [Image filename option](#image-filename-option) for details      |
| beforeDownload   | `undefined`                                         | function called before file download. see [Before download option](#before-download-option) for details                  |
| verbose          | `false`                                             | dumps info on the console                                                                                                |
| disableUi        | `false`                                             | (only `P5Capture.setDefaultOptions()`) hides the UI                                                                      |
| disableScaling   | `false`                                             | (only `P5Capture.setDefaultOptions()`) disables pixel scaling for high pixel density displays                            |

### Quality option

The default value of the `quality` option is different for each format.

| Format | Default |
| ------ | ------- |
| WebM   | `0.95`  |
| GIF    | `0.7`   |
| JPG    | `0.92`  |
| WebP   | `0.8`   |

### Base filename option

You can customize the filename of **a video or zip file** by specifying a function that returns a filename string.
A [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) object is passed as the first argument.
This object indicates the time the encoding was completed and is useful for making the filename unique.

By default, the following function is used to determine the filename.

```js
function baseFilename(date) {
  const zeroPadding = (n) => n.toString().padStart(2, "0");
  const years = date.getFullYear();
  const months = zeroPadding(date.getMonth() + 1);
  const days = zeroPadding(date.getDate());
  const hours = zeroPadding(date.getHours());
  const minutes = zeroPadding(date.getMinutes());
  const seconds = zeroPadding(date.getSeconds());
  return `${years}${months}${days}-${hours}${minutes}${seconds}`;
}
```

Note that the extension is automatically assigned and is not included in the return value of the function.

### Image filename option

You can customize the filename of **a image file** by specifying a function that returns a filename string.
The index of the recording frame is passed as the first argument.
This is useful for making the filename unique.

By default, the following function is used to determine the filename.

```js
function imageFilename(index) {
  return index.toString().padStart(7, "0");
}
```

Note that the extension is automatically assigned and is not included in the return value of the function.

### Before download option

You can interrupt and add your own code before the file download.

```js
P5Capture.setDefaultOptions({
  beforeDownload(blob, context, next) {
    // call your own code to do before file download.
    console.log(blob.size, context);

    // calling `next` callback will start the file download.
    // this can be omitted if not needed.
    next();
  },
});
```

The following arguments are passed:

- `blob`: the generated [Blob](https://developer.mozilla.org/docs/Web/API/Blob) object
- `context`: provides the context object
  - `filename`: the filename expected when downloading
  - `format`: output format
- `next`: callback function to start the download

## Browser compatibility

It may not work depending on your environment.  
Tested in the following environments:

|      | Chrome | Edge | Firefox | Safari |
| ---- | ------ | ---- | ------- | ------ |
| WebM | ✅     | ✅   | ✅      | ❌     |
| GIF  | ✅     | ✅   | ✅      | ✅     |
| MP4  | ✅     | ✅   | ✅      | ✅     |
| PNG  | ✅     | ✅   | ✅      | ✅     |
| JPG  | ✅     | ✅   | ✅      | ✅     |
| WebP | ✅     | ✅   | ✅      | ✅     |

The browser versions used for testing are

- Chrome 98.0.4758.109
- Edge 98.0.1108.62
- Firefox 97.0.2
- Safari 15.3

## Limitations

- Multiple instances is not supported
  - In [p5.js instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode), only one instance can be used
- Module bundlers is not supported

## Donation

This project is open source and always will be, even if I don't get donations. That said, I know there are people out there that may still want to donate just to show their appreciation so this is for you guys. All donations will be used for sustainable software development. Thanks in advance!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J3E5YAN)  
[Tezos Profile](https://tzprofiles.com/view/mainnet/tz2PAo222y74mShW4wRon24BKaR5HcKhFqY8)
