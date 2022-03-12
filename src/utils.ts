export const formatDateTime = (date: Date) => {
  const years = date.getFullYear();
  const months = (date.getMonth() + 1).toString().padStart(2, "0");
  const days = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${years}${months}${days}-${hours}${minutes}${seconds}`;
};

export const getDirname = (date: Date) => {
  return formatDateTime(date);
};

export const getFilename = (date: Date, ext: string) => {
  const datetime = formatDateTime(date);
  return `${datetime}.${ext}`;
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
