import fs from "fs/promises";
import { extname } from "path";
import { AddressInfo } from "net";
import { createServer, Server, RequestListener } from "http";
import { test as base } from "@playwright/test";

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

const listener: RequestListener = async (req, res) => {
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
};

export const test = base.extend<{
  port: string;
}>({
  port: [
    async ({}, use) => {
      const server = await new Promise<Server>((resolve) => {
        const server = createServer(listener);
        server.listen((error?: Error) => {
          if (error) throw error;
          resolve(server);
        });
      });
      const port = String((server.address() as AddressInfo).port);
      await use(port);
    },
    {
      // @ts-ignore
      scope: "worker",
    },
  ],
});
