import { CaptureState } from "@/recorders/base";
import styleStr from "@/style.css";

const getIndicator = (count: number) => {
  return `${count}`.padStart(7, "0");
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
  counter.innerText = getIndicator(0);
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

  const updateUi = (state: CaptureState, count: number) => {
    const status: CaptureState[] = ["idle", "capturing", "encoding"];

    status.forEach((s) => {
      container.classList.toggle(s, state === s);
    });
    checkbox.disabled = state === "encoding";
    counter.innerText =
      state === "encoding" ? "encoding..." : getIndicator(count);
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
