import { HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  public readonly status: number;
  public readonly originalException?: Error;
  public readonly validationErrorProperties: string[]; // Propriedade para erros de validação
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    originalException?: Error,
    validationErrorProperties?: string[], // Adiciona a propriedade validationErrors para erros de validação
    stack?: string, // Adiciona a propriedade stack para preservar o stack trace
  ) {
    super(message);
    this.name = this.constructor.name; // Define o nome da exceção
    this.status = status; // Código de status associado à exceção
    this.originalException = originalException; // Exceção original, se houver
    this.validationErrorProperties = validationErrorProperties || []; // Propriedade para erros de validação, se houver

    // Preserva o stack trace original (apenas em ambientes que suportam Error.captureStackTrace)
    if (Error.captureStackTrace) {
      this.stack = stack || new Error().stack;
    }
  }
}
