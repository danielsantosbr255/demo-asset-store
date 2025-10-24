export class CustomError extends Error {
  constructor(
    public override message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
