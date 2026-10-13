import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class MsExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
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

        return throwError(() => {
            console.log({
                error: exception.getError(),
                host: host.getType(),
                timestamp: new Date().toISOString(),
                functionName
            })
            return {
                error: exception.getError(),
                host: host.getType(),
                timestamp: new Date().toISOString(),
                functionName
            }
        });
    }
}