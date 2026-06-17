/**
 * Extend the Error class to create a custom error so we can parse the error message and return a safe message
 */
export class ReadableError extends Error {
  detail: string;

  constructor(detail: string) {
    super(detail);
    this.name = "ReadableError";
    Object.setPrototypeOf(this, ReadableError.prototype);
    this.detail = detail;
  }
}

export function isReadableError(error: any): error is ReadableError {
  return error instanceof ReadableError;
}
