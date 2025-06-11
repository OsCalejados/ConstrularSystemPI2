import { HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  public readonly status: number;
  public readonly originalException?: Error;
  public readonly validationErrorProperties: string[];
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    originalException?: Error,
    validationErrorProperties?: string[],
    stack?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.originalException = originalException;
    this.validationErrorProperties = validationErrorProperties || [];

    if (Error.captureStackTrace) {
      this.stack = stack || new Error().stack;
    }
  }
}
