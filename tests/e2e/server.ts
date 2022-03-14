import http from "http";
import fs from "fs/promises";
import { extname } from "path";

const getContentType = (ext: string) => {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".js":
      return "text/javascript";
    default:
      return "application/octet-stream";
  }
};

export const server = http.createServer(async (req, res) => {
  const filePath = `./${req.url}`;
  const ext = extname(filePath).toLowerCase();
  let contentType = getContentType(ext);

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  } catch (err) {
    res.writeHead(404);
    res.end(JSON.stringify(err));
  }
});
