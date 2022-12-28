import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

type User = {
  userId: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        // loop through each data result and remove the password field, if data is an array. Just remove password otherwise
        Array.isArray(data) ? data.map((user) => delete user['password']) : delete data['password'];

        // return data
        return data;
      })
    );
  }
}
