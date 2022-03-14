import { spawn } from "child_process";

const build = () => {
  return new Promise((resolve) => {
    const build = spawn("yarn", ["build"]);

    build.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    build.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    build.on("exit", (code) => resolve(code));
  });
};

const globalSetup = async () => {
  process.env.PLAYWRIGHT = "true";
  if (process.env.SKIP_BUILD === "true") {
    console.log("skipping build as SKIP_BUILD is set");
  } else {
    await build();
  }
};

export default globalSetup;
