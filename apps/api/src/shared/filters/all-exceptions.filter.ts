import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    this.logger.error(
      `Http Status: ${status} Address: ${request.ip} Method: ${request.method} Url: ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const rawResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    const extra =
      rawResponse &&
      typeof rawResponse === 'object' &&
      !Array.isArray(rawResponse)
        ? (rawResponse as Record<string, unknown>)
        : {};

    response.status(status).json({
      ...extra,
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
