import { CaptureState } from "@/recorders/base";
import styleStr from "@/style.css";

const getFrameCountStr = (count: number) => {
  return `${count}`.padStart(7, "0");
};

const getElapsedTimeStr = (count: number, framerate: number) => {
  const elapsedTime = Math.floor((count * 1000) / framerate);
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = Math.floor((elapsedTime % 1000) / 100);

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");
  return `${hours}:${minutesStr}:${secondsStr}.${milliseconds}`;
};

const getEncodingProgressStr = (progress?: number) => {
  if (progress == null) {
    return "encoding...";
  }
  const percentage = Math.round(progress * 100);
  return `encoding... ${percentage}%`;
};

const createStyle = (parent: HTMLElement) => {
  const style = document.createElement("style");
  style.innerHTML = styleStr;
  parent.appendChild(style);
};

const createContainer = (parent: HTMLElement) => {
  const container = document.createElement("div");
  container.classList.add("p5capture-container", "idle");
  parent.appendChild(container);
  return container;
};

const createButtonContainer = (parent: HTMLElement) => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("p5capture-btn-container");
  parent.appendChild(buttonContainer);
  return buttonContainer;
};

const createLabel = (parent: HTMLElement) => {
  const label = document.createElement("label");
  label.classList.add("p5capture-label");
  parent.appendChild(label);
  return label;
};

const createCheckbox = (parent: HTMLElement) => {
  const checkbox = document.createElement("input");
  checkbox.classList.add("p5capture-btn");
  checkbox.type = "checkbox";
  parent.appendChild(checkbox);
  return checkbox;
};

const createCounter = (parent: HTMLElement) => {
  const counter = document.createElement("span");
  counter.classList.add("p5capture-counter");
  parent.appendChild(counter);
  return counter;
};

export const createUi = (parent: HTMLElement) => {
  createStyle(document.head);
  const container = createContainer(parent);
  const buttonContainer = createButtonContainer(container);
  const label = createLabel(buttonContainer);
  const checkbox = createCheckbox(label);
  const counter = createCounter(container);

  const updateUi = (
    state: CaptureState,
    count: number,
    framerate?: number,
    encodingProgress?: number
  ) => {
    const status: CaptureState[] = ["idle", "capturing", "encoding"];

    status.forEach((s) => {
      container.classList.toggle(s, state === s);
    });
    checkbox.disabled = state === "encoding";

    if (state === "encoding") {
      counter.innerText = getEncodingProgressStr(encodingProgress);
      return;
    }
    if (state === "idle") {
      counter.innerText = "";
      return;
    }
    if (!framerate) {
      counter.innerText = getFrameCountStr(count);
      return;
    }
    counter.innerText = getElapsedTimeStr(count, framerate);
  };

  return {
    container,
    buttonContainer,
    label,
    checkbox,
    counter,
    updateUi,
  };
};
