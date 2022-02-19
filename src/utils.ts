import { format } from "date-fns";

const DATETIME_FORMAT = "yyyyMMdd-HHmmss";

export const getDirname = (date: Date) => {
  return format(date, DATETIME_FORMAT);
};

export const getFilename = (date: Date, ext: string) => {
  const datetime = format(date, DATETIME_FORMAT);
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
