import * as assertions from "./assertions";
import { ExecException } from "child_process";

const fs = require("fs").promises;
const util = require("util");
const childProcess = require("child_process");
const performance = require("perf_hooks").performance;

export const assertLag = async function assertLag(
  callback: (...args: any) => any,
  timeout = 4000,
  message = "Test failed: algorithm too fast"
) {
  const userSolution = await fs.readFile("/home/codewarrior/solution.txt");
  const patchedSolution = `${userSolution};
    (${callback.toString()})();
    `;
  let fileIdentifier = 0;
  let fileName;
  while (true) {
    try {
      fileName = `/home/codewarrior/_lagtest${fileIdentifier}.js`;
      await fs.writeFile(fileName, patchedSolution);
    } catch (e) {
      fileIdentifier++;
      continue;
    }
    break;
  }

  const startTime = performance.now();
  const lagTester = childProcess.exec(
    `node ${fileName}`,
    (error: ExecException | null) => {
      if (error === null) {
        lagTester.emit("passed");
      } else {
        lagTester.emit("failed");
      }
    }
  );

  const lagResult = await new Promise((resolve) => {
    let interval = setInterval(() => {
      const endTime = performance.now();
      if (endTime - startTime >= timeout) {
        clearInterval(interval);
        lagTester.kill();
      }
    }, 200);

    lagTester.on("passed", () => {
      clearInterval(interval);
      resolve(false);
    });

    lagTester.on("failed", () => {
      clearInterval(interval);
      resolve(true);
    });
  });

  assertions.expect(lagResult, message);
};
