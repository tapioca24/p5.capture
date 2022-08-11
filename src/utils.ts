export const omitUndefinedProperty = (obj: Record<string, unknown>) => {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  }
  return newObj;
};

export const getWorkerUrl = (url: string) => {
  const content = `importScripts("${url}")`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const mathClamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(min, value), max);
};

export const mathMap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
