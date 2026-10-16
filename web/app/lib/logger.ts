import chalk from "chalk";

type Level = "log" | "debug" | "info" | "warn" | "error";

/**
 * One call = one log line. Non-string parts are JSON-encoded with no depth limit, so a
 * nested payload never collapses to `[Object]` (Node's console stops at 2 levels) and
 * a whole entry — stack included — stays on one greppable line in Vercel's log search.
 */
export function formatLogParts(parts: readonly unknown[]): string {
  return parts.map((part) => (typeof part === "string" ? part : JSON.stringify(toJsonSafe(part)))).join(" ");
}

/** Credential-bearing headers never reach a log line, even when a whole `Headers` is logged. */
const REDACTED_HEADERS = new Set(["authorization", "cookie", "proxy-authorization", "set-cookie"]);

/**
 * A JSON-safe copy that loses as little as possible: Errors keep name/message/stack/cause,
 * anything with `toJSON` (Date, URL) uses it, Headers/Map/Set/bigint survive. `ancestors`
 * is the path from the root — not everything seen — so only a true cycle becomes
 * "[Circular]"; the same object referenced twice prints twice.
 */
function toJsonSafe(value: unknown, ancestors: readonly object[] = []): unknown {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
  if (typeof value === "symbol") return value.toString();
  if (value === null || typeof value !== "object") return value;
  if (ancestors.includes(value)) return "[Circular]";

  const path = [...ancestors, value];
  const recurse = (v: unknown) => toJsonSafe(v, path);

  if (value instanceof Error) {
    return {
      ...Object.fromEntries(Object.entries(value).map(([k, v]) => [k, recurse(v)])),
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(value.cause === undefined ? {} : { cause: recurse(value.cause) }),
      ...(value instanceof AggregateError ? { errors: recurse(value.errors) } : {}),
    };
  }
  // Before `toJSON`: Bun's Headers has one, and it would skip the redaction.
  if (value instanceof Headers) {
    return Object.fromEntries([...value].map(([k, v]) => [k, REDACTED_HEADERS.has(k) ? "[redacted]" : v]));
  }
  if (value instanceof Request) return { method: value.method, url: value.url, headers: recurse(value.headers) };
  if (value instanceof Response) return { status: value.status, url: value.url, headers: recurse(value.headers) };
  if ("toJSON" in value && typeof value.toJSON === "function") return recurse(value.toJSON());
  if (value instanceof Map) return Object.fromEntries([...value].map(([k, v]) => [String(k), recurse(v)]));
  if (value instanceof Set) return [...value].map(recurse);
  if (Array.isArray(value)) return value.map(recurse);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, recurse(v)]));
}

const TAG: Record<Exclude<Level, "log">, (s: string) => string> = {
  debug: chalk.gray,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
};

function write(level: Level, parts: readonly unknown[]) {
  const text = formatLogParts(parts);
  if (level === "log") return console.log(text);
  // chalk only colours on a TTY, so deployed logs stay plain `[level] …` text.
  console[level](`${TAG[level](`[${level}]`)} ${text}`);
}

export function log(...msg: unknown[]) {
  write("log", msg);
}

export function logDebug(...msg: unknown[]) {
  if (import.meta.env.DEV) write("debug", msg);
}

export function logInfo(...msg: unknown[]) {
  write("info", msg);
}

export function logWarn(...msg: unknown[]) {
  write("warn", msg);
}

export function logError(...msg: unknown[]) {
  write("error", msg);
}
