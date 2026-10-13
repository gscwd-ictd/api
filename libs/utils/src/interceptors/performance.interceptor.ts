import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = performance.now();

    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        const ms = (performance.now() - now).toFixed(2);
        console.log(`[PERF] ${className}.${methodName} took ${ms} ms`);
      })
    );
  }
}
