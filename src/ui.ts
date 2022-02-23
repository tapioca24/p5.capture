import { CaptureState } from "@/recorders/base";

const START_CAPTURING_TEXT = "Start capturing";
const STOP_CAPTURING_TEXT = "Stop capturing";

const getIndicator = (count: number) => {
  return `${count}`.padStart(7, "0");
};

const createContainer = (parent: HTMLElement) => {
  const container = document.createElement("div");
  container.style.margin = "12px";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.display = "flex";
  container.style.gap = "8px";
  parent.appendChild(container);
  return container;
};

const createButton = (parent: HTMLElement) => {
  const button = document.createElement("button");
  button.innerText = START_CAPTURING_TEXT;
  parent.appendChild(button);
  return button;
};

const createSpan = (parent: HTMLElement) => {
  const span = document.createElement("span");
  span.style.color = "white";
  span.style.textShadow = "0 0 4px black";
  span.innerText = getIndicator(0);
  parent.appendChild(span);
  return span;
};

export const createUi = (parent: HTMLElement) => {
  const container = createContainer(parent);
  const button = createButton(container);
  const span = createSpan(container);

  const updateUi = (state: CaptureState, count: number) => {
    switch (state) {
      case "idle":
        button.innerText = START_CAPTURING_TEXT;
        button.disabled = false;
        span.innerText = getIndicator(0);
        break;
      case "capturing":
        button.innerText = STOP_CAPTURING_TEXT;
        button.disabled = false;
        span.innerText = getIndicator(count);
        break;
      case "encoding":
        button.innerText = STOP_CAPTURING_TEXT;
        button.disabled = true;
        span.innerText = getIndicator(count);
        break;
    }
  };

  return { container, button, span, updateUi };
};
