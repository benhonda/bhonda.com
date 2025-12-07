import chalk from "chalk";

function consoleLog(msg: any[], options: { level: "" | "debug" | "info" | "warn" | "error" }) {
  // Stringify any objects before printing
  // const formattedMsg = msg.map((item) => (typeof item === "object" ? JSON.stringify(item, null, 2) : item)).join(" "); // Join array into a single string

  if (options.level === "") {
    return console.log(msg);
  }

  if (options.level === "debug") {
    return console.debug(chalk.gray(`[debug]`), msg);
  }

  if (options.level === "info") {
    return console.log(chalk.blue(`[info]`), msg);
  }

  if (options.level === "warn") {
    return console.warn(chalk.yellow(`[warn]`), msg);
  }

  if (options.level === "error") {
    return console.error(chalk.red(`[error]`), msg);
  }

  console.warn(chalk.yellow(`Unknown log level: ${options.level}`));
  return console.log(msg);
}

/**
 * Helpers
 */
// log default
export function log(...msg: any[]) {
  // return consoleLog({ msg, options: { level: "" } });
  return consoleLog(msg, { level: "" });
}

// log debug
export function logDebug(...msg: any[]) {
  // return consoleLog({ msg, options: { level: "" } });
  if (import.meta.env.DEV) return consoleLog(msg, { level: "debug" });
}

// log info
export function logInfo(...msg: any[]) {
  // return consoleLog({ msg, options: { level: "info" } });
  return consoleLog(msg, { level: "info" });
}

// log warn
export function logWarn(...msg: any[]) {
  // return consoleLog({ msg, options: { level: "warn" } });
  return consoleLog(msg, { level: "warn" });
}

// log error
export function logError(...msg: any[]) {
  // return consoleLog({ msg, options: { level: "error" } });
  return consoleLog(msg, { level: "error" });
}
