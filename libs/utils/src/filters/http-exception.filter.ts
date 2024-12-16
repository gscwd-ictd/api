import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        let functionName = null;

        // Extract function name from stack trace if available
        if (exception.stack) {
            const stackLines = exception.stack.split('\n');
            if (stackLines.length > 1) {
                // Usually, the second line of the stack trace points to the function causing the error
                const match = stackLines[1].match(/at (.+?) \(/);
                if (match && match[1]) {
                    functionName = match[1];
                }
            }
        }
        Logger.log(
            {
                functionName,
                statusCode: status,
                host: host.getType(),
                method: ctx.getRequest().method,
                timestamp: new Date().toISOString(),
                path: request.url,
                exception: exception.getResponse(),
                cause: exception.cause
            }
        )
        response
            .status(status)
            .json({
                functionName,
                statusCode: status,
                host: host.getType(),
                method: ctx.getRequest().method,
                timestamp: new Date().toISOString(),
                path: request.url,
                exception: exception.getResponse(),
                cause: exception.cause
            });
    }
}