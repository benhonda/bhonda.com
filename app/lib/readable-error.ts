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
