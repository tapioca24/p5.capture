/// <reference types="p5/global" />

type Lifecycles = Record<
  "presetup" | "postsetup" | "predraw" | "postdraw" | "remove",
  () => void
>;

type Addon = (p5: any, fn: any, lifecycles: Lifecycles) => void;

declare module p5 {
  function registerAddon(addon: Addon): void;
}
