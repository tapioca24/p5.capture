import { CaptureState } from "@/recorders/base";
import styleStr from "@/style.css";
import { OutputFormat } from "@/p5.capture";

export const getFrameCountStr = (count: number) => {
  return `${count}`.padStart(7, "0");
};

export const getElapsedTimeStr = (count: number, framerate: number) => {
  const elapsedTime = Math.floor((count * 1000) / framerate);
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = Math.floor((elapsedTime % 1000) / 100);

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");
  return `${hours}:${minutesStr}:${secondsStr}.${milliseconds}`;
};

export const getEncodingProgressStr = (progress?: number) => {
  if (progress == null) {
    return "encoding";
  }
  const percentage = Math.round(progress * 100);
  return `encoding ${percentage}%`;
};

const setDraggable = (container: HTMLDivElement) => {
  let mousePos = { x: 0, y: 0 };
  let containerPos = { x: 0, y: 0 };
  let isDragging = false;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    mousePos = { x: e.pageX, y: e.pageY };
    containerPos = { x: container.offsetLeft, y: container.offsetTop };
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const diff = { x: e.pageX - mousePos.x, y: e.pageY - mousePos.y };
    container.style.left = `${containerPos.x + diff.x}px`;
    container.style.top = `${containerPos.y + diff.y}px`;
  });
};

const createStyle = (parent: HTMLElement) => {
  const style = document.createElement("style");
  style.innerHTML = styleStr;
  parent.appendChild(style);
};

const createContainer = (parent: HTMLElement) => {
  const container = document.createElement("div");
  container.classList.add("p5c-container", "idle");
  setDraggable(container);
  parent.appendChild(container);
  return { container };
};

const createButtonAndCounter = (parent: HTMLElement) => {
  const main = document.createElement("div");
  main.classList.add("p5c-main");
  parent.appendChild(main);

  const button = document.createElement("button");
  button.classList.add("p5c-btn");
  main.appendChild(button);

  const counter = document.createElement("span");
  counter.classList.add("p5c-counter");
  main.appendChild(counter);

  return { main, button, counter };
};

const createFormatSelector = (parent: HTMLElement) => {
  const label = document.createElement("label");
  label.htmlFor = "p5c-format";
  label.textContent = "format";
  parent.appendChild(label);

  const select = document.createElement("select");
  select.id = "p5c-format";
  select.classList.add("p5c-format");
  parent.appendChild(select);

  [
    { value: "webm", label: "WebM" },
    { value: "gif", label: "GIF" },
    { value: "mp4", label: "MP4" },
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG" },
    { value: "webp", label: "WebP" },
  ].forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  return { label, select };
};

const createFramerateInput = (parent: HTMLElement) => {
  const label = document.createElement("label");
  label.htmlFor = "p5c-framerate";
  label.textContent = "framerate";
  parent.appendChild(label);

  const input = document.createElement("input");
  input.id = "p5c-framerate";
  input.classList.add("p5c-framerate");
  input.type = "number";
  input.min = "1";
  parent.appendChild(input);

  return { label, input };
};

const createOptions = (parent: HTMLElement) => {
  const options = document.createElement("div");
  options.classList.add("p5c-options");
  parent.appendChild(options);

  const { label: formatLabel, select: formatSelect } =
    createFormatSelector(options);
  const { label: framerateLabel, input: framerateInput } =
    createFramerateInput(options);

  return {
    options,
    formatLabel,
    formatSelect,
    framerateLabel,
    framerateInput,
  };
};

export type UiState = {
  format?: OutputFormat;
  framerate?: number;
};

export type UiEventHandlers = {
  onClickRecordButton?: (e: MouseEvent) => void;
  onChangeFormat?: (e: Event) => void;
  onChangeFramerate?: (e: Event) => void;
};

export const createUi = (
  parent: HTMLElement,
  initialState: UiState,
  eventHandlers: UiEventHandlers = {},
) => {
  createStyle(document.head);
  const { container } = createContainer(parent);
  const { formatSelect, framerateInput } = createOptions(container);
  const { button: recordButton, counter } = createButtonAndCounter(container);

  if (initialState.format) {
    formatSelect.value = initialState.format;
  }
  if (initialState.framerate) {
    framerateInput.value = `${initialState.framerate}`;
  }

  if (eventHandlers.onClickRecordButton) {
    recordButton.addEventListener("click", eventHandlers.onClickRecordButton);
  }
  if (eventHandlers.onChangeFormat) {
    formatSelect.addEventListener("change", eventHandlers.onChangeFormat);
  }
  if (eventHandlers.onChangeFramerate) {
    framerateInput.addEventListener("change", eventHandlers.onChangeFramerate);
  }

  const updateUi = (
    state: CaptureState,
    count: number,
    framerate?: number,
    encodingProgress?: number,
  ) => {
    const status: CaptureState[] = ["idle", "capturing", "encoding"];

    status.forEach((s) => {
      container.classList.toggle(s, state === s);
    });
    recordButton.disabled = state === "encoding";
    formatSelect.disabled = state !== "idle";
    framerateInput.disabled = state !== "idle";

    if (state === "encoding") {
      counter.textContent = getEncodingProgressStr(encodingProgress);
      return;
    }

    if (!framerate) {
      counter.textContent = getFrameCountStr(count);
      return;
    }
    counter.textContent = getElapsedTimeStr(count, framerate);
  };

  return {
    updateUi,
  };
};
