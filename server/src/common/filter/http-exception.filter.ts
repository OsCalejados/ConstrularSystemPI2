import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | object | undefined = undefined;

    try {
      if (exception == null) {
        message = 'An unexpected error occurred';
      } else if (exception instanceof HttpException) {
        message = exception.getResponse();
      } else if (exception.message) {
        message = exception.message;
      } else {
        message = 'An unexpected error occurred';
      }
    } catch (e) {
      message = 'Internal server error during exception handling';
    }

    const errorResponse = {
      statusCode: httpStatus,
      error: message,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };
    httpAdapter.reply(response, errorResponse, httpStatus);
  }
}
